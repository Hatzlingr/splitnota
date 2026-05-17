import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "SplitNota - Split Bill Otomatis dari Foto Nota",
    template: "%s | SplitNota",
  },
  description:
    "SplitNota membantu membagi tagihan makan bersama dari foto nota. Upload nota, cek hasil scan, atur peserta, lalu salin atau kirim hasil split bill ke WhatsApp.",
  keywords: [
    "split bill",
    "split nota",
    "bagi tagihan",
    "patungan makan",
    "scan nota",
    "nota AI",
    "hitung bill",
  ],
  authors: [{ name: "SplitNota" }],
  creator: "SplitNota",
  openGraph: {
    title: "SplitNota - Split Bill Otomatis dari Foto Nota",
    description:
      "Upload nota, cek hasil scan, atur peserta, lalu kirim hasil split bill ke WhatsApp.",
    url: "https://splitnota.vercel.app",
    siteName: "SplitNota",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SplitNota - Split Bill Otomatis dari Foto Nota",
    description:
      "Upload nota, cek hasil scan, atur peserta, lalu kirim hasil split bill ke WhatsApp.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}