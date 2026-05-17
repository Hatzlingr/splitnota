"use client"

import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ConfirmedReceipt } from "@/types/receipt"
import { ItemAssignmentList } from "./item-assignment-list"
import { ParticipantManager } from "./participant-manager"
import { SplitResultList } from "./split-result-list"
import { SplitShareActions } from "./split-share-actions"
import { SplitValidationAlert } from "./split-validation-alert"
import type { AssignmentMap, Participant } from "./types"
import { formatRupiah } from "./utils"

type SplitBillProps = {
  receipt: ConfirmedReceipt
}

export function SplitBill({ receipt }: SplitBillProps) {
  const [participantName, setParticipantName] = useState("")
  const [participants, setParticipants] = useState<Participant[]>([])
  const [assignments, setAssignments] = useState<AssignmentMap>({})

  function addParticipant() {
    const name = participantName.trim()

    if (!name) return

    setParticipants((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
      },
    ])

    setParticipantName("")
  }

  function removeParticipant(participantId: string) {
    setParticipants((current) =>
      current.filter((participant) => participant.id !== participantId)
    )

    setAssignments((current) => {
      const updated: AssignmentMap = { ...current }

      Object.keys(updated).forEach((itemIndex) => {
        const index = Number(itemIndex)
        const itemAssignments = { ...updated[index] }

        delete itemAssignments[participantId]

        if (Object.keys(itemAssignments).length === 0) {
          delete updated[index]
        } else {
          updated[index] = itemAssignments
        }
      })

      return updated
    })
  }

  function updateAssignmentQuantity(
    itemIndex: number,
    participantId: string,
    value: string
  ) {
    const parsedValue = Number(value)
    const quantity =
      Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0

    setAssignments((current) => {
      const updated: AssignmentMap = { ...current }
      const itemAssignments = { ...(updated[itemIndex] || {}) }

      if (quantity <= 0) {
        delete itemAssignments[participantId]
      } else {
        itemAssignments[participantId] = quantity
      }

      if (Object.keys(itemAssignments).length === 0) {
        delete updated[itemIndex]
      } else {
        updated[itemIndex] = itemAssignments
      }

      return updated
    })
  }

  const splitResults = useMemo(() => {
    const itemTotals: Record<string, number> = {}

    participants.forEach((participant) => {
      itemTotals[participant.id] = 0
    })

    receipt.items.forEach((item, itemIndex) => {
      const itemQuantity = Math.max(Number(item.quantity || 1), 1)
      const itemSubtotal = Number(item.subtotal || 0)
      const pricePerUnit = itemSubtotal / itemQuantity
      const itemAssignments = assignments[itemIndex] || {}

      Object.entries(itemAssignments).forEach(([participantId, quantity]) => {
        itemTotals[participantId] =
          (itemTotals[participantId] || 0) +
          pricePerUnit * Number(quantity || 0)
      })
    })

    const totalAssignedItem = Object.values(itemTotals).reduce(
      (sum, value) => sum + value,
      0
    )

    return participants.map((participant) => {
      const itemTotal = itemTotals[participant.id] || 0
      const proportion =
        totalAssignedItem > 0 ? itemTotal / totalAssignedItem : 0

      const taxShare = receipt.tax * proportion
      const serviceShare = receipt.service_charge * proportion
      const discountShare = receipt.discount * proportion
      const total = itemTotal + taxShare + serviceShare - discountShare

      return {
        participant,
        itemTotal,
        taxShare,
        serviceShare,
        discountShare,
        total,
      }
    })
  }, [participants, assignments, receipt])

  const splitValidation = useMemo(() => {
    const unassignedItems: string[] = []
    const overAssignedItems: string[] = []

    receipt.items.forEach((item, itemIndex) => {
      const itemQuantity = Math.max(Number(item.quantity || 1), 1)
      const itemAssignments = assignments[itemIndex] || {}

      const assignedQuantity = Object.values(itemAssignments).reduce(
        (sum, quantity) => sum + Number(quantity || 0),
        0
      )

      if (assignedQuantity < itemQuantity) {
        unassignedItems.push(item.name)
      }

      if (assignedQuantity > itemQuantity) {
        overAssignedItems.push(item.name)
      }
    })

    return {
      unassignedItems,
      overAssignedItems,
      isComplete:
        unassignedItems.length === 0 && overAssignedItems.length === 0,
    }
  }, [receipt.items, assignments])

  const resultText = useMemo(() => {
    const lines = [
      "Hasil Split Bill",
      receipt.merchant_name ? `Merchant: ${receipt.merchant_name}` : "",
      `Total Nota: ${formatRupiah(receipt.grand_total)}`,
      "",
      ...splitResults.map((result) => {
        return `${result.participant.name}: ${formatRupiah(result.total)}`
      }),
      "",
      "Detail:",
      ...splitResults.map((result) => {
        return [
          `${result.participant.name}`,
          `- Total item: ${formatRupiah(result.itemTotal)}`,
          `- Pajak: ${formatRupiah(result.taxShare)}`,
          `- Service: ${formatRupiah(result.serviceShare)}`,
          `- Diskon: -${formatRupiah(result.discountShare)}`,
        ].join("\n")
      }),
    ]

    return lines.filter(Boolean).join("\n")
  }, [receipt, splitResults])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Split Bill</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg bg-slate-100 p-4 text-sm">
          <p className="font-medium">
            {receipt.merchant_name || "Nota tanpa nama merchant"}
          </p>
          <p className="text-slate-600">
            Total nota: {formatRupiah(receipt.grand_total)}
          </p>
        </div>

        <ParticipantManager
          participantName={participantName}
          participants={participants}
          onParticipantNameChange={setParticipantName}
          onAddParticipant={addParticipant}
          onRemoveParticipant={removeParticipant}
        />

        <ItemAssignmentList
          items={receipt.items}
          participants={participants}
          assignments={assignments}
          onUpdateAssignmentQuantity={updateAssignmentQuantity}
        />

        <SplitResultList results={splitResults} />

        {splitResults.length > 0 && (
          <div className="space-y-3">
            <SplitValidationAlert validation={splitValidation} />

            <SplitShareActions
              resultText={resultText}
              disabled={!splitValidation.isComplete}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}