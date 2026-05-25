// Komponen tombol dari UI
import { Button } from "@/components/ui/button"

// Props untuk aksi berbagi hasil
type SplitShareActionsProps = {
  // Teks hasil yang akan dibagikan
  resultText: string
  // Status tombol disabled atau tidak
  disabled: boolean
}

// Komponen untuk tombol salin dan share
export function SplitShareActions({
  resultText,
  disabled,
}: SplitShareActionsProps) {
  // Salin teks ke clipboard
  async function copyResult() {
    await navigator.clipboard.writeText(resultText)
    alert("Hasil split bill berhasil disalin.")
  }

  // Buka WhatsApp Desktop dulu, lalu fallback ke WhatsApp Web
  function shareToWhatsApp() {
    
    const encodedText = encodeURIComponent(resultText)
    const desktopUrl = `whatsapp://send?text=${encodedText}`
    const webUrl = `https://wa.me/?text=${encodedText}`

    const fallbackTimer = window.setTimeout(() => {
      window.open(webUrl, "_blank")
    }, 800)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.clearTimeout(fallbackTimer)
        document.removeEventListener("visibilitychange", handleVisibilityChange)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.location.href = desktopUrl
  }

  // Tampilan tombol aksi
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {/* Tombol salin hasil */}
      <Button
        type="button"
        variant="outline"
        onClick={copyResult}
        disabled={disabled}
      >
        Salin Hasil
      </Button>

      {/* Tombol share ke WhatsApp */}
      <Button type="button" onClick={shareToWhatsApp} disabled={disabled}>
        Share WhatsApp
      </Button>
    </div>
  )
}