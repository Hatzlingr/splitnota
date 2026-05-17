import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ReceiptItem } from "@/types/receipt"
import type { Participant } from "./types"
import { formatQuantity, formatRupiah } from "./utils"

type ItemAssignmentCardProps = {
  item: ReceiptItem
  itemIndex: number
  participants: Participant[]
  assignedQuantity: number
  remainingQuantity: number
  isOverAssigned: boolean
  getAssignedQuantity: (itemIndex: number, participantId: string) => number
  onUpdateAssignmentQuantity: (
    itemIndex: number,
    participantId: string,
    value: string
  ) => void
}

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
  const itemQuantity = Math.max(Number(item.quantity || 1), 1)

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

      {isOverAssigned && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Jumlah item yang dibagi melebihi qty di nota.
        </p>
      )}

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