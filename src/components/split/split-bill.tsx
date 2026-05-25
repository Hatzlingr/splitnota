"use client"

// Hook React untuk state dan memo
import { useMemo, useState } from "react"
// Komponen kartu dari UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// Tipe data nota yang sudah dikonfirmasi
import type { ConfirmedReceipt } from "@/types/receipt"
// Daftar assignment per item
import { ItemAssignmentList } from "./item-assignment-list"
// Form dan daftar peserta
import { ParticipantManager } from "./participant-manager"
// Daftar hasil split
import { SplitResultList } from "./split-result-list"
// Tombol share hasil
import { SplitShareActions } from "./split-share-actions"
// Alert validasi
import { SplitValidationAlert } from "./split-validation-alert"
// Tipe assignment dan peserta
import type { AssignmentMap, Participant } from "./types"
// Helper format rupiah
import { formatRupiah } from "./utils"

// Props komponen split bill
type SplitBillProps = {
  // Data nota
  receipt: ConfirmedReceipt
}

// Komponen utama split bill
export function SplitBill({ receipt }: SplitBillProps) {
  // State untuk input nama peserta
  const [participantName, setParticipantName] = useState("")
  // State untuk daftar peserta
  const [participants, setParticipants] = useState<Participant[]>([])
  // State untuk pembagian item per peserta
  const [assignments, setAssignments] = useState<AssignmentMap>({})

  // Tambah peserta baru
  function addParticipant() {
    // Hapus spasi di depan dan belakang
    const name = participantName.trim()

    // Jika kosong, hentikan
    if (!name) return

    // Tambahkan peserta ke list
    setParticipants((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
      },
    ])

    // Reset input
    setParticipantName("")
  }

  // Hapus peserta dan assignment miliknya
  function removeParticipant(participantId: string) {
    // Hapus peserta dari list
    setParticipants((current) =>
      current.filter((participant) => participant.id !== participantId)
    )

    // Bersihkan assignment yang terkait
    setAssignments((current) => {
      const updated: AssignmentMap = { ...current }

      // Loop setiap item assignment
      Object.keys(updated).forEach((itemIndex) => {
        const index = Number(itemIndex)
        const itemAssignments = { ...updated[index] }

        // Hapus peserta dari assignment item
        delete itemAssignments[participantId]

        // Jika kosong, hapus itemnya
        if (Object.keys(itemAssignments).length === 0) {
          delete updated[index]
        } else {
          updated[index] = itemAssignments
        }
      })

      return updated
    })
  }

  // Update jumlah pembagian untuk item tertentu
  function updateAssignmentQuantity(
    itemIndex: number,
    participantId: string,
    value: string
  ) {
    // Ubah input string menjadi angka
    const parsedValue = Number(value)
    // Pastikan angka valid dan positif
    const quantity =
      Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0

    // Update state assignment
    setAssignments((current) => {
      const updated: AssignmentMap = { ...current }
      const itemAssignments = { ...(updated[itemIndex] || {}) }

      // Jika 0, hapus assignment peserta
      if (quantity <= 0) {
        delete itemAssignments[participantId]
      } else {
        itemAssignments[participantId] = quantity
      }

      // Jika item tidak punya assignment, hapus item
      if (Object.keys(itemAssignments).length === 0) {
        delete updated[itemIndex]
      } else {
        updated[itemIndex] = itemAssignments
      }

      return updated
    })
  }

  // Hitung hasil split setiap peserta
  const splitResults = useMemo(() => {
    // Simpan total item per peserta
    const itemTotals: Record<string, number> = {}

    // Inisialisasi total setiap peserta
    participants.forEach((participant) => {
      itemTotals[participant.id] = 0
    })

    // Hitung subtotal item sesuai assignment
    receipt.items.forEach((item, itemIndex) => {
      const itemQuantity = Math.max(Number(item.quantity || 1), 1)
      const itemSubtotal = Number(item.subtotal || 0)
      const pricePerUnit = itemSubtotal / itemQuantity
      const itemAssignments = assignments[itemIndex] || {}

      // Tambahkan biaya sesuai porsi peserta
      Object.entries(itemAssignments).forEach(([participantId, quantity]) => {
        itemTotals[participantId] =
          (itemTotals[participantId] || 0) +
          pricePerUnit * Number(quantity || 0)
      })
    })

    // Total seluruh item yang sudah dibagi
    const totalAssignedItem = Object.values(itemTotals).reduce(
      (sum, value) => sum + value,
      0
    )

    // Bangun hasil akhir per peserta
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

  // Validasi apakah semua item sudah dibagi dengan benar
  const splitValidation = useMemo(() => {
    const unassignedItems: string[] = []
    const overAssignedItems: string[] = []

    // Cek setiap item pada nota
    receipt.items.forEach((item, itemIndex) => {
      const itemQuantity = Math.max(Number(item.quantity || 1), 1)
      const itemAssignments = assignments[itemIndex] || {}

      // Hitung total qty yang sudah dibagi
      const assignedQuantity = Object.values(itemAssignments).reduce(
        (sum, quantity) => sum + Number(quantity || 0),
        0
      )

      // Jika kurang dari qty, catat sebagai belum dibagi
      if (assignedQuantity < itemQuantity) {
        unassignedItems.push(item.name)
      }

      // Jika lebih dari qty, catat sebagai over
      if (assignedQuantity > itemQuantity) {
        overAssignedItems.push(item.name)
      }
    })

    // Kembalikan ringkasan validasi
    return {
      unassignedItems,
      overAssignedItems,
      isComplete:
        unassignedItems.length === 0 && overAssignedItems.length === 0,
    }
  }, [receipt.items, assignments])

  // Siapkan teks untuk disalin atau dibagikan
  const resultText = useMemo(() => {
    // Susun baris teks
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

    // Gabungkan baris dan buang yang kosong
    return lines.filter(Boolean).join("\n")
  }, [receipt, splitResults])

  // Tampilan utama komponen
  return (
    <Card>
      <CardHeader>
        <CardTitle>Split Bill</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Ringkasan nota */}
        <div className="rounded-lg bg-slate-100 p-4 text-sm">
          <p className="font-medium">
            {receipt.merchant_name || "Nota tanpa nama merchant"}
          </p>
          <p className="text-slate-600">
            Total nota: {formatRupiah(receipt.grand_total)}
          </p>
        </div>

        {/* Form tambah peserta */}
        <ParticipantManager
          participantName={participantName}
          participants={participants}
          onParticipantNameChange={setParticipantName}
          onAddParticipant={addParticipant}
          onRemoveParticipant={removeParticipant}
        />

        {/* Form pembagian item */}
        <ItemAssignmentList
          items={receipt.items}
          participants={participants}
          assignments={assignments}
          onUpdateAssignmentQuantity={updateAssignmentQuantity}
        />

        {/* Daftar hasil split */}
        <SplitResultList results={splitResults} />

        {/* Tampilkan aksi jika ada hasil */}
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