import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Participant } from "./types"

type ParticipantManagerProps = {
  participantName: string
  participants: Participant[]
  onParticipantNameChange: (value: string) => void
  onAddParticipant: () => void
  onRemoveParticipant: (participantId: string) => void
}

export function ParticipantManager({
  participantName,
  participants,
  onParticipantNameChange,
  onAddParticipant,
  onRemoveParticipant,
}: ParticipantManagerProps) {
  return (
    <div className="space-y-3">
      <Label>Tambah Peserta</Label>

      <div className="flex gap-2">
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

        <Button type="button" onClick={onAddParticipant}>
          Tambah
        </Button>
      </div>

      {participants.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm"
            >
              <span>{participant.name}</span>

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