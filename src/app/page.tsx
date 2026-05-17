import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">SplitNota</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-slate-600">
            Upload nota, cek hasil scan, lalu bagi tagihan bareng teman.
          </p>

          <Button asChild>
            <Link href="/upload">Mulai Upload Nota</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}