import { NextResponse } from "next/server"
import { gemini } from "@/lib/gemini"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("receipt")

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "File nota tidak ditemukan.",
        },
        { status: 400 }
      )
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format file harus JPG, PNG, WEBP, atau PDF.",
        },
        { status: 400 }
      )
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran file maksimal 5 MB.",
        },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64File = buffer.toString("base64")

    const prompt = `
Kamu adalah sistem validasi dan ekstraksi nota makanan/minuman untuk aplikasi split bill.

Tugas pertama:
Tentukan apakah file yang diberikan benar-benar berisi nota/struk pembayaran, invoice makanan/minuman, atau bukti transaksi yang memiliki item pembelian dan total pembayaran.

File dianggap TIDAK VALID jika berisi:
- foto orang
- selfie
- benda biasa
- pemandangan
- hewan
- screenshot chat
- gambar random
- dokumen yang bukan nota/transaksi
- gambar makanan tanpa nota
- foto restoran tanpa struk
- gambar yang terlalu blur sehingga isi nota tidak terbaca

Jika file BUKAN nota/struk pembayaran, jangan ekstrak item.
Kembalikan JSON dengan:
"is_receipt": false
"items": []
"rejection_reason": alasan singkat dalam bahasa Indonesia

Jika file adalah nota/struk pembayaran, ekstrak informasinya ke JSON.

Aturan:
- Jangan mengarang data jika tidak terbaca.
- Semua nominal gunakan angka integer tanpa titik/koma.
- Jika quantity tidak jelas, gunakan 1.
- Jika subtotal item tidak jelas, hitung dari quantity * unit_price jika memungkinkan.
- Output harus JSON valid saja, tanpa markdown, tanpa penjelasan tambahan.
- receipt_confidence bernilai 0.0 sampai 1.0.
- item confidence juga bernilai 0.0 sampai 1.0.

Format output:
{
  "is_receipt": true,
  "receipt_confidence": 0.0,
  "rejection_reason": "",
  "merchant_name": "",
  "transaction_date": "",
  "items": [
    {
      "name": "",
      "quantity": 1,
      "unit_price": 0,
      "subtotal": 0,
      "confidence": 0.0
    }
  ],
  "subtotal": 0,
  "tax": 0,
  "service_charge": 0,
  "discount": 0,
  "grand_total": 0,
  "notes": []
}
`

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          text: prompt,
        },
        {
          inlineData: {
            mimeType: file.type,
            data: base64File,
          },
        },
      ],
    })

    const text = response.text ?? ""

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    let parsedResult

    try {
      parsedResult = JSON.parse(cleanedText)
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Gemini berhasil membaca file, tapi output bukan JSON valid.",
          raw: cleanedText,
        },
        { status: 500 }
      )
    }

    const isReceipt = parsedResult?.is_receipt === true
    const receiptConfidence = Number(parsedResult?.receipt_confidence ?? 0)
    const items = Array.isArray(parsedResult?.items) ? parsedResult.items : []

    if (!isReceipt) {
      return NextResponse.json(
        {
          success: false,
          code: "INVALID_RECEIPT_IMAGE",
          message:
            parsedResult?.rejection_reason ||
            "Maaf, foto yang kamu kirim tidak valid. Pastikan file berisi nota atau struk pembayaran.",
          data: parsedResult,
        },
        { status: 422 }
      )
    }

    if (receiptConfidence < 0.5 || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          code: "LOW_CONFIDENCE_RECEIPT",
          message:
            "Maaf, nota tidak terbaca dengan jelas. Upload foto nota yang lebih terang dan tidak blur.",
          data: parsedResult,
        },
        { status: 422 }
      )
    }

    return NextResponse.json({
      success: true,
      data: parsedResult,
    })
  } catch (error) {
    console.error("SCAN RECEIPT ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Gagal scan nota.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}