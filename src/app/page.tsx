import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const steps = [
  {
    title: "Upload Foto Nota",
    description:
      "Kirim foto struk, nota makanan, atau file nota yang ingin dibagi bersama teman.",
  },
  {
    title: "Cek Hasil Scan",
    description:
      "Sistem membaca isi nota menggunakan AI, lalu kamu bisa mengecek dan memperbaiki hasil scan terlebih dahulu.",
  },
  {
    title: "Bagi Tagihan",
    description:
      "Tambahkan nama peserta, pilih jumlah item yang dibeli masing-masing orang, lalu sistem menghitung totalnya.",
  },
  {
    title: "Salin atau Kirim",
    description:
      "Hasil split bill bisa langsung disalin atau dikirim ke WhatsApp tanpa perlu login.",
  },
]

const features = [
  "Tanpa login",
  "Bisa scan nota dari gambar",
  "Hasil scan bisa diedit dulu",
  "Bisa atur jumlah item per orang",
  "Hitung pajak, service, dan diskon",
  "Bisa salin hasil split bill",
  "Bisa kirim hasil ke WhatsApp",
  "Cocok untuk makan bareng teman",
]

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 rounded-full border bg-white px-4 py-2 text-sm text-slate-600">
          Split bill cepat dari foto nota
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
          Bagi Tagihan Makan dari Foto Nota dengan Mudah
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
          SplitNota membantu kamu menghitung split bill secara otomatis.
          Cukup upload nota, cek hasil scan, tambahkan peserta, lalu salin
          atau kirim hasil pembagian tagihan ke WhatsApp.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/upload">Mulai Upload Nota</Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="#cara-kerja">Lihat Cara Kerja</Link>
          </Button>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Tidak perlu login. Cocok untuk makan bareng, nongkrong, atau patungan
          pesanan bersama.
        </p>
      </section>

      <section id="cara-kerja" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-950">
            Cara Kerja SplitNota
          </h2>
          <p className="mt-3 text-slate-600">
            Dari upload nota sampai hasil split bill siap dibagikan.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step.title}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">
              Cocok untuk Split Bill Tanpa Ribet
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Saat makan bareng, menghitung tagihan sering terasa ribet karena
              setiap orang bisa membeli item yang berbeda. SplitNota membantu
              membagi tagihan berdasarkan item, jumlah pembelian, pajak,
              service charge, dan diskon.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Kamu juga bisa mengecek hasil scan nota sebelum dihitung, jadi
              kalau ada item atau harga yang salah terbaca, hasilnya tetap bisa
              diperbaiki secara manual.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fitur Utama</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-lg border bg-white p-3 text-sm text-slate-700"
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Card className="bg-slate-950 text-white">
          <CardContent className="flex flex-col items-center justify-between gap-6 p-8 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-2xl font-bold">
                Siap menghitung split bill?
              </h2>
              <p className="mt-2 text-slate-300">
                Upload nota kamu, cek hasil scan, lalu bagikan hasil tagihan ke
                teman-teman.
              </p>
            </div>

            <Button asChild size="lg" variant="secondary">
              <Link href="/upload">Mulai Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t bg-white px-6 py-6 text-center text-sm text-slate-500">
        <p>
          SplitNota adalah aplikasi web untuk membantu menghitung split bill
          dari nota makanan secara cepat dan praktis.
        </p>
      </footer>
    </main>
  )
}