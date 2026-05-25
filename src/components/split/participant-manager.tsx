// Komponen UI
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Tipe peserta
import type { Participant } from "./types"

// Props untuk form peserta
type ParticipantManagerProps = {
  // Nilai input nama peserta
  participantName: string
  // Daftar peserta
  participants: Participant[]
  // Handler untuk perubahan input
  onParticipantNameChange: (value: string) => void
  // Handler untuk menambah peserta
  onAddParticipant: () => void
  // Handler untuk menghapus peserta
  onRemoveParticipant: (participantId: string) => void
}

// Komponen untuk menambah dan menghapus peserta
export function ParticipantManager({
  participantName,
  participants,
  onParticipantNameChange,
  onAddParticipant,
  onRemoveParticipant,
}: ParticipantManagerProps) {
  // Tampilan form peserta
  return (
    <div className="space-y-3">
      {/* Judul form */}
      <Label>Tambah Peserta</Label>

      <div className="flex gap-2">
        {/* Input nama peserta */}
        <Input
          value={participantName}
          onChange={(event) => onParticipantNameChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              onAddParticipant()
            }
          }}
          placeholder="Contoh: Andi"
        />

        {/* Tombol tambah peserta */}
        <Button type="button" onClick={onAddParticipant}>
          Tambah
        </Button>
      </div>

      {/* Daftar peserta */}
      {participants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm"
            >
              <span>{participant.name}</span>

              {/* Tombol hapus peserta */}
              <button
                type="button"
                className="text-red-500"
                onClick={() => onRemoveParticipant(participant.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}