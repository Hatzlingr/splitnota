// Impor NextResponse dari Next.js untuk mengirimkan respons HTTP
import { NextResponse } from "next/server"
// Impor fungsi gemini dari library lokal untuk berinteraksi dengan Gemini API
import { gemini } from "@/lib/gemini"

// Fungsi GET yang akan dipanggil saat ada permintaan GET ke endpoint ini
export async function GET() {
// Coba untuk menghasilkan konten menggunakan Gemini API
  try {
    // Panggil metode generateContent dari objek gemini untuk menghasilkan respons berdasarkan model yang ditentukan
    const response = await gemini.models.generateContent({
    // Tentukan model yang akan digunakan untuk menghasilkan respons
      model: "gemini-2.5-flash",
    // Berikan prompt atau instruksi untuk model agar menghasilkan respons yang diinginkan
      contents:
        "Balas singkat dalam bahasa Jawa Ngoko: Gemini API berhasil terhubung untuk aplikasi SplitNota.",
    })

    // Kembalikan respons JSON yang berisi hasil dari Gemini API
    return NextResponse.json({
      success: true,
      message: response.text,
    })
    // Tangani kesalahan yang mungkin terjadi saat berinteraksi dengan Gemini API
  } catch (error) {
    // Cetak kesalahan ke konsol untuk debugging
    console.error(error)

    // Kembalikan respons JSON yang menunjukkan bahwa terjadi kesalahan saat menghubungi Gemini API
    return NextResponse.json(
      {
        // Indikator bahwa permintaan tidak berhasil
        success: false,
        message: "Gagal menghubungi Gemini API",
      },
    //   Set status HTTP menjadi 500 untuk menunjukkan bahwa terjadi kesalahan server
      { status: 500 }
    )
  }
}