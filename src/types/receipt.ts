export type ReceiptItem = {
  name: string
  quantity: number
  unit_price: number
  subtotal: number
  confidence?: number
}

export type ReceiptScanResult = {
  is_receipt: boolean
  receipt_confidence: number
  rejection_reason?: string
  merchant_name?: string
  transaction_date?: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  service_charge: number
  discount: number
  grand_total: number
  notes?: string[]
}

export type ConfirmedReceipt = {
  merchant_name: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  service_charge: number
  discount: number
  grand_total: number
}