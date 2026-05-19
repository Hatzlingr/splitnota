# SplitNota

SplitNota adalah aplikasi web untuk scan nota makanan/minuman dan membagi tagihan berdasarkan item. Kamu bisa upload nota untuk discan AI atau input manual, lalu assign item ke peserta dan langsung dapat hasil split bill.

## Fitur Utama

- Scan nota dari gambar/PDF (JPG, PNG, WEBP, PDF; max 5 MB).
- Review dan edit hasil scan sebelum dihitung.
- Input nota manual jika tidak ingin scan.
- Assign item ke peserta dan hitung pajak, service, diskon otomatis.
- Validasi pembagian item agar tidak kurang atau lebih dari qty.
- Salin hasil split bill atau share ke WhatsApp.

## Alur Penggunaan

1. Buka /upload untuk scan nota atau pilih Input Manual.
2. Periksa hasil dan konfirmasi.
3. Tambahkan peserta dan alokasikan item.
4. Salin hasil split bill atau share ke WhatsApp.

## Routes

- `/` landing page.
- `/upload` upload dan scan nota.
- `/manual` input nota manual.
- `POST /api/ai/scan-receipt` endpoint scan AI.

## Konfigurasi

Buat file `.env.local` dan isi API key Gemini:

```bash
GEMINI_API_KEY=your_api_key
```

## Menjalankan Project

```bash
npm install
npm run dev
```

Lalu buka http://localhost:3000

## NPM Scripts

- `npm run dev` - jalankan dev server.
- `npm run build` - build untuk production.
- `npm run start` - jalankan server production.
- `npm run lint` - linting.

## Tech Stack

- Next.js App Router
- React 19
- Tailwind CSS
- shadcn/ui (Radix UI primitives)
- Gemini API (Google GenAI SDK)

## Developer

- Amirul Nur Cahyo (mahasiswa teknik informatika UNSRI angkatan 2024)
