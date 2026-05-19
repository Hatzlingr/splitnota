"use client"

import { useState } from "react"
import { ReceiptReview } from "@/components/receipt/receipt-review"
import { SplitBill } from "@/components/split/split-bill"
import type { ConfirmedReceipt, ReceiptScanResult } from "@/types/receipt"

const emptyReceipt: ReceiptScanResult = {
  is_receipt: true,
  receipt_confidence: 1,
  rejection_reason: "",
  merchant_name: "",
  transaction_date: "",
  items: [],
  subtotal: 0,
  tax: 0,
  service_charge: 0,
  discount: 0,
  grand_total: 0,
  notes: [],
}

export default function ManualReceiptPage() {
  const [confirmedReceipt, setConfirmedReceipt] =
    useState<ConfirmedReceipt | null>(null)

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {confirmedReceipt === null ? (
          <ReceiptReview
            initialData={emptyReceipt}
            onConfirm={(data) => setConfirmedReceipt(data)}
            title="Input Nota Manual"
            confirmLabel="Lanjut ke Split Bill"
          />
        ) : (
          <SplitBill receipt={confirmedReceipt} />
        )}
      </div>
    </main>
  )
}
