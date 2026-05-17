import type { ReceiptItem } from "@/types/receipt"
import { ItemAssignmentCard } from "./item-assignment-card"
import type { AssignmentMap, Participant } from "./types"

type ItemAssignmentListProps = {
  items: ReceiptItem[]
  participants: Participant[]
  assignments: AssignmentMap
  onUpdateAssignmentQuantity: (
    itemIndex: number,
    participantId: string,
    value: string
  ) => void
}

function getTotalAssignedQuantity(assignments: AssignmentMap, itemIndex: number) {
  const itemAssignments = assignments[itemIndex] || {}

  return Object.values(itemAssignments).reduce(
    (sum, quantity) => sum + Number(quantity || 0),
    0
  )
}

function getAssignedQuantity(
  assignments: AssignmentMap,
  itemIndex: number,
  participantId: string
) {
  return assignments[itemIndex]?.[participantId] || 0
}

export function ItemAssignmentList({
  items,
  participants,
  assignments,
  onUpdateAssignmentQuantity,
}: ItemAssignmentListProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Atur jumlah item per peserta</h3>

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