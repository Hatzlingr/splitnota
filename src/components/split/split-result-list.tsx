import type { SplitResult } from "./types"
import { formatRupiah } from "./utils"

type SplitResultListProps = {
  results: SplitResult[]
}

export function SplitResultList({ results }: SplitResultListProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Hasil Perhitungan</h3>

      {results.length === 0 ? (
        <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-500">
          Belum ada peserta.
        </p>
      ) : (
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.participant.id}
              className="rounded-lg border bg-white p-4"
            >
              <div className="mb-2 flex justify-between">
                <p className="font-medium">{result.participant.name}</p>
                <p className="font-bold">{formatRupiah(result.total)}</p>
              </div>

              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Total item</span>
                  <span>{formatRupiah(result.itemTotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Pajak</span>
                  <span>{formatRupiah(result.taxShare)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Service</span>
                  <span>{formatRupiah(result.serviceShare)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Diskon</span>
                  <span>- {formatRupiah(result.discountShare)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}