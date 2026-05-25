// Tipe data untuk satu peserta
export type Participant = {
  // Id unik peserta
  id: string
  // Nama peserta
  name: string
}

// Peta pembagian item: index item -> id peserta -> jumlah
export type AssignmentMap = Record<number, Record<string, number>>

// Hasil perhitungan split untuk satu peserta
export type SplitResult = {
  // Data peserta
  participant: Participant
  // Total harga item peserta
  itemTotal: number
  // Bagian pajak peserta
  taxShare: number
  // Bagian service peserta
  serviceShare: number
  // Bagian diskon peserta
  discountShare: number
  // Total akhir peserta
  total: number
}

// Ringkasan validasi pembagian item
export type SplitValidation = {
  // Item yang belum terassign
  unassignedItems: string[]
  // Item yang kelebihan assign
  overAssignedItems: string[]
  // Status lengkap atau belum
  isComplete: boolean
}