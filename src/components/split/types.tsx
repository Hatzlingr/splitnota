export type Participant = {
  id: string
  name: string
}

export type AssignmentMap = Record<number, Record<string, number>>

export type SplitResult = {
  participant: Participant
  itemTotal: number
  taxShare: number
  serviceShare: number
  discountShare: number
  total: number
}

export type SplitValidation = {
  unassignedItems: string[]
  overAssignedItems: string[]
  isComplete: boolean
}