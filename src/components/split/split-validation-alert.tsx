import type { SplitValidation } from "./types"

type SplitValidationAlertProps = {
  validation: SplitValidation
}

export function SplitValidationAlert({ validation }: SplitValidationAlertProps) {
  if (validation.isComplete) {
    return null
  }

  return (
    <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
      {validation.unassignedItems.length > 0 && (
        <p>
          Masih ada item yang belum dibagi:{" "}
          {validation.unassignedItems.join(", ")}
        </p>
      )}

      {validation.overAssignedItems.length > 0 && (
        <p>
          Ada item yang jumlah pembagiannya melebihi qty:{" "}
          {validation.overAssignedItems.join(", ")}
        </p>
      )}
    </div>
  )
}