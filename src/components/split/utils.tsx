// Fungsi untuk memformat angka menjadi Rupiah (IDR)
export function formatRupiah(value: number) {
  // Gunakan Intl.NumberFormat untuk format mata uang Indonesia
  // Bulatkan nilai (jaga-jaga jika value kosong atau 0)
  const roundedValue = Math.round(value || 0)
  // Buat formatter rupiah
  const formatter = new Intl.NumberFormat("id-ID", {
    // Tampilkan sebagai mata uang
    style: "currency",
    // Gunakan kode mata uang IDR
    currency: "IDR",
    // Hilangkan angka desimal
    maximumFractionDigits: 0,
  })
  // Format angka yang sudah dibulatkan
  return formatter.format(roundedValue)
}

// Fungsi untuk memformat kuantitas agar rapi
export function formatQuantity(value: number) {
  // Jika bilangan bulat, langsung ubah ke string
  if (Number.isInteger(value)) {
    // Kembalikan angka sebagai teks
    return String(value)
  }

  // Jika ada desimal, batasi 2 angka lalu hapus nol di belakang
  return value.toFixed(2).replace(/\.?0+$/, "")
}