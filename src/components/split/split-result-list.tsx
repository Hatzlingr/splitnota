// Tipe hasil split
import type { SplitResult } from "./types"
// Helper format mata uang
import { formatRupiah } from "./utils"

// Props untuk daftar hasil split
type SplitResultListProps = {
  // Daftar hasil per peserta
  results: SplitResult[]
}

// Komponen untuk menampilkan hasil split per peserta
export function SplitResultList({ results }: SplitResultListProps) {
  // Tampilan daftar hasil
  return (
    <div className="space-y-3">
      {/* Judul bagian */}
      <h3 className="font-semibold">Hasil Perhitungan</h3>

      {/* Jika belum ada peserta */}
      {results.length === 0 ? (
        <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-500">
          Belum ada peserta.
        </p>
      ) : (
        <div className="space-y-3">
          {/* Loop hasil per peserta */}
          {results.map((result) => (
            <div
              key={result.participant.id}
              className="rounded-lg border bg-white p-4"
            >
              <div className="mb-2 flex justify-between">
                <p className="font-medium">{result.participant.name}</p>
                <p className="font-bold">{formatRupiah(result.total)}</p>
              </div>

              {/* Rincian biaya */}
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