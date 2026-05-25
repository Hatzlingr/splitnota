// Komponen UI
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Tipe item dari nota
import type { ReceiptItem } from "@/types/receipt"
// Tipe peserta
import type { Participant } from "./types"
// Helper format angka
import { formatQuantity, formatRupiah } from "./utils"

// Props untuk kartu item
type ItemAssignmentCardProps = {
  // Data item nota
  item: ReceiptItem
  // Index item pada list
  itemIndex: number
  // Daftar peserta
  participants: Participant[]
  // Total qty yang sudah dibagi
  assignedQuantity: number
  // Sisa qty yang belum dibagi
  remainingQuantity: number
  // Status apakah qty berlebih
  isOverAssigned: boolean
  // Helper ambil qty peserta per item
  getAssignedQuantity: (itemIndex: number, participantId: string) => number
  // Handler update qty assignment
  onUpdateAssignmentQuantity: (
    itemIndex: number,
    participantId: string,
    value: string
  ) => void
}

// Komponen kartu untuk satu item
export function ItemAssignmentCard({
  item,
  itemIndex,
  participants,
  assignedQuantity,
  remainingQuantity,
  isOverAssigned,
  getAssignedQuantity,
  onUpdateAssignmentQuantity,
}: ItemAssignmentCardProps) {
  // Pastikan qty minimal 1
  const itemQuantity = Math.max(Number(item.quantity || 1), 1)

  // Tampilan kartu item
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-slate-500">
            Qty nota {formatQuantity(itemQuantity)} ×{" "}
            {formatRupiah(item.unit_price)}
          </p>
        </div>

        <p className="font-semibold">{formatRupiah(item.subtotal)}</p>
      </div>

      {/* Ringkasan qty */}
      <div className="mb-4 rounded-md bg-slate-50 p-3 text-sm">
        <div className="flex justify-between">
          <span>Total qty</span>
          <strong>{formatQuantity(itemQuantity)}</strong>
        </div>

        <div className="flex justify-between">
          <span>Sudah dibagi</span>
          <strong>{formatQuantity(assignedQuantity)}</strong>
        </div>

        <div className="flex justify-between">
          <span>Sisa</span>
          <strong className={isOverAssigned ? "text-red-600" : "text-slate-900"}>
            {formatQuantity(remainingQuantity)}
          </strong>
        </div>
      </div>

      {/* Peringatan jika over assigned */}
      {isOverAssigned && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Jumlah item yang dibagi melebihi qty di nota.
        </p>
      )}

      {/* Jika belum ada peserta */}
      {participants.length === 0 ? (
        <p className="text-sm text-slate-500">Tambahkan peserta dulu.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {participants.map((participant) => {
            const quantity = getAssignedQuantity(itemIndex, participant.id)

            return (
              <div
                key={participant.id}
                className="space-y-2 rounded-md border p-3"
              >
                <Label className="text-sm">{participant.name}</Label>

                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="0"
                  value={quantity === 0 ? "" : quantity}
                  onChange={(event) =>
                    onUpdateAssignmentQuantity(
                      itemIndex,
                      participant.id,
                      event.target.value
                    )
                  }
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}