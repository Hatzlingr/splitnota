// Tandai file ini sebagai client component
"use client"

// Hook React untuk state
import { useState } from "react"
// Komponen UI
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Tipe data nota
import type {
  ConfirmedReceipt,
  ReceiptItem,
  ReceiptScanResult,
} from "@/types/receipt"

// Props untuk komponen review nota
type ReceiptReviewProps = {
  // Data awal hasil scan
  initialData: ReceiptScanResult
  // Callback saat user konfirmasi
  onConfirm: (data: ConfirmedReceipt) => void
  // Judul opsional
  title?: string
  // Label tombol konfirmasi
  confirmLabel?: string
}

// Helper format rupiah
function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0)
}

// Komponen untuk review dan edit hasil scan nota
export function ReceiptReview({
  initialData,
  onConfirm,
  title = "Konfirmasi Hasil Scan",
  confirmLabel = "Konfirmasi Hasil Scan",
}: ReceiptReviewProps) {
  // State nama merchant
  const [merchantName, setMerchantName] = useState(
    initialData.merchant_name || ""
  )
  // State daftar item
  const [items, setItems] = useState<ReceiptItem[]>(initialData.items || [])
  // State pajak
  const [tax, setTax] = useState(initialData.tax || 0)
  // State service charge
  const [serviceCharge, setServiceCharge] = useState(
    initialData.service_charge || 0
  )
  // State diskon
  const [discount, setDiscount] = useState(initialData.discount || 0)

  // Hitung subtotal dari semua item
  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.subtotal || 0)
  }, 0)

  // Hitung total akhir
  const grandTotal =
    subtotal + Number(tax) + Number(serviceCharge) - Number(discount)

  // Update data item tertentu
  function updateItem(index: number, field: keyof ReceiptItem, value: string) {
    // Update array item secara immutable
    setItems((currentItems) => {
      // Salin array item
      const updatedItems = [...currentItems]
      // Salin item yang akan diubah
      const currentItem = { ...updatedItems[index] }

      // Jika field nama, simpan string
      if (field === "name") {
        currentItem.name = value
      } else {
        // Jika field angka, ubah ke number
        const numericValue = Number(value || 0)
        currentItem[field] = numericValue as never

        // Jika qty atau harga berubah, hitung ulang subtotal
        if (field === "quantity" || field === "unit_price") {
          currentItem.subtotal =
            Number(currentItem.quantity || 0) *
            Number(currentItem.unit_price || 0)
        }
      }

      // Simpan item yang sudah diubah
      updatedItems[index] = currentItem
      return updatedItems
    })
  }

  // Tambah item baru
  function addItem() {
    // Tambahkan item kosong ke list
    setItems((currentItems) => [
      ...currentItems,
      {
        name: "",
        quantity: 1,
        unit_price: 0,
        subtotal: 0,
        confidence: 1,
      },
    ])
  }

  // Hapus item berdasarkan index
  function removeItem(index: number) {
    setItems((currentItems) => currentItems.filter((_, i) => i !== index))
  }

  // Kirim data yang sudah dikonfirmasi
  function handleConfirm() {
    // Susun data final
    const confirmedReceipt: ConfirmedReceipt = {
      merchant_name: merchantName,
      items,
      subtotal,
      tax,
      service_charge: serviceCharge,
      discount,
      grand_total: grandTotal,
    }

    // Panggil callback parent
    onConfirm(confirmedReceipt)
  }

  // Tampilan UI
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input nama merchant */}
        <div className="space-y-2">
          <Label>Nama Merchant / Restoran</Label>
          <Input
            value={merchantName}
            onChange={(event) => setMerchantName(event.target.value)}
            placeholder="Contoh: Ayam Geprek Bang Jago"
          />
        </div>

        {/* Tabel daftar item */}
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="w-24">Qty</TableHead>
                <TableHead className="w-36">Harga</TableHead>
                <TableHead className="w-36">Subtotal</TableHead>
                <TableHead className="w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Loop item dari state */}
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {/* Input nama item */}
                    <Input
                      value={item.name}
                      onChange={(event) =>
                        updateItem(index, "name", event.target.value)
                      }
                      placeholder="Nama item"
                    />
                  </TableCell>

                  <TableCell>
                    {/* Input qty item */}
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) =>
                        updateItem(index, "quantity", event.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {/* Input harga satuan */}
                    <Input
                      type="number"
                      min="0"
                      value={item.unit_price}
                      onChange={(event) =>
                        updateItem(index, "unit_price", event.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {/* Input subtotal item */}
                    <Input
                      type="number"
                      min="0"
                      value={item.subtotal}
                      onChange={(event) =>
                        updateItem(index, "subtotal", event.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {/* Tombol hapus item */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {/* Tampilkan pesan jika kosong */}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500">
                    Belum ada item. Tambahkan item manual.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Tombol tambah item */}
        <Button type="button" variant="outline" onClick={addItem}>
          Tambah Item
        </Button>

        {/* Input pajak, service, diskon */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Pajak</Label>
            <Input
              type="number"
              min="0"
              value={tax}
              onChange={(event) => setTax(Number(event.target.value || 0))}
            />
          </div>

          <div className="space-y-2">
            <Label>Service Charge</Label>
            <Input
              type="number"
              min="0"
              value={serviceCharge}
              onChange={(event) =>
                setServiceCharge(Number(event.target.value || 0))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Diskon</Label>
            <Input
              type="number"
              min="0"
              value={discount}
              onChange={(event) => setDiscount(Number(event.target.value || 0))}
            />
          </div>
        </div>

        {/* Ringkasan perhitungan */}
        <div className="rounded-lg bg-slate-100 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal Item</span>
            <strong>{formatRupiah(subtotal)}</strong>
          </div>

          <div className="flex justify-between">
            <span>Pajak</span>
            <strong>{formatRupiah(tax)}</strong>
          </div>

          <div className="flex justify-between">
            <span>Service Charge</span>
            <strong>{formatRupiah(serviceCharge)}</strong>
          </div>

          <div className="flex justify-between">
            <span>Diskon</span>
            <strong>- {formatRupiah(discount)}</strong>
          </div>

          <div className="flex justify-between border-t pt-2 text-base">
            <span>Total Akhir</span>
            <strong>{formatRupiah(grandTotal)}</strong>
          </div>
        </div>

        {/* Tombol konfirmasi */}
        <Button type="button" className="w-full" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </CardContent>
    </Card>
  )
}