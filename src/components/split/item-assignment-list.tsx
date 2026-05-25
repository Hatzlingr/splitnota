// Tipe item dari nota
import type { ReceiptItem } from "@/types/receipt"
// Komponen kartu per item
import { ItemAssignmentCard } from "./item-assignment-card"
// Tipe assignment dan peserta
import type { AssignmentMap, Participant } from "./types"

// Props untuk daftar assignment item
type ItemAssignmentListProps = {
  // Daftar item dari nota
  items: ReceiptItem[]
  // Daftar peserta
  participants: Participant[]
  // Data assignment per item
  assignments: AssignmentMap
  // Handler update jumlah assignment
  onUpdateAssignmentQuantity: (
    itemIndex: number,
    participantId: string,
    value: string
  ) => void
}

// Hitung total quantity yang sudah dibagi untuk item tertentu
function getTotalAssignedQuantity(assignments: AssignmentMap, itemIndex: number) {
  // Ambil assignment item atau objek kosong
  const itemAssignments = assignments[itemIndex] || {}

  // Jumlahkan semua quantity
  return Object.values(itemAssignments).reduce(
    (sum, quantity) => sum + Number(quantity || 0),
    0
  )
}

// Ambil quantity peserta untuk item tertentu
function getAssignedQuantity(
  assignments: AssignmentMap,
  itemIndex: number,
  participantId: string
) {
  return assignments[itemIndex]?.[participantId] || 0
}

// Komponen daftar assignment untuk semua item
export function ItemAssignmentList({
  items,
  participants,
  assignments,
  onUpdateAssignmentQuantity,
}: ItemAssignmentListProps) {
  // Tampilan daftar item
  return (
    <div className="space-y-4">
      {/* Judul bagian */}
      <h3 className="font-semibold">Atur jumlah item per peserta</h3>

      {/* Loop setiap item */}
      {items.map((item, itemIndex) => {
        const itemQuantity = Math.max(Number(item.quantity || 1), 1)
        const assignedQuantity = getTotalAssignedQuantity(assignments, itemIndex)
        const remainingQuantity = itemQuantity - assignedQuantity
        const isOverAssigned = assignedQuantity > itemQuantity

        return (
          <ItemAssignmentCard
            key={itemIndex}
            item={item}
            itemIndex={itemIndex}
            participants={participants}
            assignedQuantity={assignedQuantity}
            remainingQuantity={remainingQuantity}
            isOverAssigned={isOverAssigned}
            getAssignedQuantity={(targetItemIndex, participantId) =>
              getAssignedQuantity(assignments, targetItemIndex, participantId)
            }
            onUpdateAssignmentQuantity={onUpdateAssignmentQuantity}
          />
        )
      })}
    </div>
  )
}