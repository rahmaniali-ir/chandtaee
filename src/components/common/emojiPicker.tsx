import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { useState } from "react"
import { Smile } from "lucide-react"

function EmojiPicker({
  className,
  selected,
  disabled,
  onEmojiSelect,
}: {
  className?: string
  selected?: string
  disabled?: boolean
  onEmojiSelect: (emoji: string) => void
}) {
  const [value, setValue] = useState<string | undefined>(selected)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleEmojiSelect = (emoji: any) => {
    setValue(emoji.native)
    onEmojiSelect(emoji.native)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          disabled={disabled}
          className={className}
        >
          {value ? value : <Smile className='size-4 text-neutral-500' />}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-auto p-0'>
        <Picker
          data={data}
          onEmojiSelect={handleEmojiSelect}
          emojiButtonSize={24}
          emojiSize={16}
          theme='light'
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker
