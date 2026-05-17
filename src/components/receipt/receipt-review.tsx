"use client"

import { useState } from "react"
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

import type {
  ConfirmedReceipt,
  ReceiptItem,
  ReceiptScanResult,
} from "@/types/receipt"

type ReceiptReviewProps = {
  initialData: ReceiptScanResult
  onConfirm: (data: ConfirmedReceipt) => void
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export function ReceiptReview({ initialData, onConfirm }: ReceiptReviewProps) {
  const [merchantName, setMerchantName] = useState(
    initialData.merchant_name || ""
  )
  const [items, setItems] = useState<ReceiptItem[]>(initialData.items || [])
  const [tax, setTax] = useState(initialData.tax || 0)
  const [serviceCharge, setServiceCharge] = useState(
    initialData.service_charge || 0
  )
  const [discount, setDiscount] = useState(initialData.discount || 0)

  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.subtotal || 0)
  }, 0)

  const grandTotal = subtotal + Number(tax) + Number(serviceCharge) - Number(discount)

  function updateItem(index: number, field: keyof ReceiptItem, value: string) {
    setItems((currentItems) => {
      const updatedItems = [...currentItems]
      const currentItem = { ...updatedItems[index] }

      if (field === "name") {
        currentItem.name = value
      } else {
        const numericValue = Number(value || 0)
        currentItem[field] = numericValue as never

        if (field === "quantity" || field === "unit_price") {
          currentItem.subtotal =
            Number(currentItem.quantity || 0) * Number(currentItem.unit_price || 0)
        }
      }

      updatedItems[index] = currentItem
      return updatedItems
    })
  }

  function addItem() {
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

  function removeItem(index: number) {
    setItems((currentItems) => currentItems.filter((_, i) => i !== index))
  }

    function handleConfirm() {
    const confirmedReceipt: ConfirmedReceipt = {
        merchant_name: merchantName,
        items,
        subtotal,
        tax,
        service_charge: serviceCharge,
        discount,
        grand_total: grandTotal,
    }

    onConfirm(confirmedReceipt)
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Konfirmasi Hasil Scan</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Nama Merchant / Restoran</Label>
          <Input
            value={merchantName}
            onChange={(event) => setMerchantName(event.target.value)}
            placeholder="Contoh: Ayam Geprek Bang Jago"
          />
        </div>

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
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={item.name}
                      onChange={(event) =>
                        updateItem(index, "name", event.target.value)
                      }
                      placeholder="Nama item"
                    />
                  </TableCell>

                  <TableCell>
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

        <Button type="button" variant="outline" onClick={addItem}>
          Tambah Item
        </Button>

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

        <Button type="button" className="w-full" onClick={handleConfirm}>
          Konfirmasi Hasil Scan
        </Button>
      </CardContent>
    </Card>
  )
}