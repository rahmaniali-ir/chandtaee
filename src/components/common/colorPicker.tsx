import { Palette } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useRef } from "react"

function ColorPicker({
  value,
  disabled,
  onChange,
}: {
  value?: string
  disabled?: boolean
  onChange: (color?: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Button
      variant='ghost'
      size='icon'
      disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onContextMenu={e => {
        if (disabled) return

        e.preventDefault()
        onChange(undefined) // Clear color
      }}
      className={cn(
        "relative size-[1em] rounded-full border-2 border-background shadow-lg hover:scale-110",
        value && "!bg-current",
        !value && "!bg-neutral-400"
      )}
      style={value ? { color: value } : {}}
    >
      <input
        ref={inputRef}
        value={value}
        onInput={e => onChange((e.target as HTMLInputElement).value)}
        type='color'
        className='invisible absolute opacity-0 top-full left-0 size-0'
      />
    </Button>
  )
}

export default ColorPicker
