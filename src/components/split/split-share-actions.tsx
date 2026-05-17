import { Button } from "@/components/ui/button"

type SplitShareActionsProps = {
  resultText: string
  disabled: boolean
}

export function SplitShareActions({
  resultText,
  disabled,
}: SplitShareActionsProps) {
  async function copyResult() {
    await navigator.clipboard.writeText(resultText)
    alert("Hasil split bill berhasil disalin.")
  }

  function shareToWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(resultText)}`
    window.open(url, "_blank")
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Button
        type="button"
        variant="outline"
        onClick={copyResult}
        disabled={disabled}
      >
        Salin Hasil
      </Button>

      <Button type="button" onClick={shareToWhatsApp} disabled={disabled}>
        Share WhatsApp
      </Button>
    </div>
  )
}