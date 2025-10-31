import { Palette } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useRef } from "react"

function ColorPicker({
  value,
  onChange,
}: {
  value?: string
  onChange: (color?: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => inputRef.current?.click()}
      onContextMenu={e => {
        e.preventDefault()
        onChange(undefined) // Clear color
      }}
      className={cn(
        "relative",
        value &&
          "text-current-500 bg-current/10 hover:text-current-700 hover:bg-current/25",
        !value && "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
      )}
      style={value ? { color: value } : {}}
    >
      <input
        ref={inputRef}
        value={value}
        onInput={e => onChange((e.target as HTMLInputElement).value)}
        type='color'
        className='absolute opacity-0 top-full left-0 size-0'
      />

      <Palette className='size-4' />
    </Button>
  )
}

export default ColorPicker
