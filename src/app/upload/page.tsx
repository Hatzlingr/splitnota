"use client"

import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ReceiptReview } from "@/components/receipt/receipt-review"
import { SplitBill } from "@/components/split/split-bill"
import type {
  ConfirmedReceipt,
  ReceiptScanResult,
} from "@/types/receipt"

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]

const maxSize = 5 * 1024 * 1024

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReceiptScanResult | null>(null)
  const [confirmedReceipt, setConfirmedReceipt] =
    useState<ConfirmedReceipt | null>(null)
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!file) {
      setError("Pilih file nota dulu.")
      return
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Format file harus JPG, PNG, WEBP, atau PDF.")
      return
    }

    if (file.size > maxSize) {
      setError("Ukuran file maksimal 5 MB.")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)
    setConfirmedReceipt(null)

    const formData = new FormData()
    formData.append("receipt", file)

    try {
      const response = await fetch("/api/ai/scan-receipt", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.message || "Gagal scan nota.")
        setResult(null)
        setConfirmedReceipt(null)
        return
      }

      setResult(data.data)
    } catch (err) {
      setError("Terjadi error saat mengirim file.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Nota</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="receipt">File nota</Label>

                <Input
                  id="receipt"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0] ?? null
                    setFile(selectedFile)
                    setError("")
                    setResult(null)
                    setConfirmedReceipt(null)
                  }}
                />

                <p className="text-sm text-slate-500">
                  Format: JPG, PNG, WEBP, atau PDF. Maksimal 5 MB.
                </p>

                {file && (
                  <p className="text-sm text-slate-600">
                    File dipilih: {file.name}
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sedang scan nota..." : "Scan Nota"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result !== null && confirmedReceipt === null && (
          <ReceiptReview
            initialData={result}
            onConfirm={(data) => setConfirmedReceipt(data)}
          />
        )}

        {confirmedReceipt !== null && (
          <SplitBill receipt={confirmedReceipt} />
        )}
      </div>
    </main>
  )
}