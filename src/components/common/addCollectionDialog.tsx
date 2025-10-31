import { useWordCollection } from "@/contexts/wordCollection"
import type { Word } from "@/types/wordCollection"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ArrowUpDown,
  GripVertical,
  ListPlus,
  Palette,
  Trash2,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field"
import { Input } from "../ui/input"
import ColorPicker from "./colorPicker"
import EmojiPicker from "./emojiPicker"

interface SortableItemProps {
  index: number
  word: Word
  onUpdate: (id: string, name: string) => void
  onDelete: (id: string) => void
  onColorChange: (id: string, color?: string) => void
  onIconChange: (id: string, icon?: string) => void
}

function SortableItem({
  index,
  word,
  onUpdate,
  onDelete,
  onColorChange,
  onIconChange,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: word.id,
    disabled: word.value.trim() === "",
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isEmpty = word.value.trim() === ""

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 ${isDragging ? "opacity-50" : ""}`}
    >
      {!isEmpty && (
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded'
        >
          <GripVertical className='size-4 text-gray-400' />
        </div>
      )}

      {isEmpty && (
        <div className='p-1 w-6'>
          <GripVertical className='size-4 text-gray-200' />
        </div>
      )}

      <EmojiPicker
        disabled={isEmpty}
        onEmojiSelect={e => onIconChange(word.id, e)}
      />

      <Input
        placeholder={(index + 1).toString()}
        className='flex-1'
        value={word.value}
        onChange={e => onUpdate(word.id, e.target.value)}
        style={word.color ? { borderColor: word.color } : {}}
      />

      <ColorPicker
        disabled={isEmpty}
        value={word.color}
        onChange={color => onColorChange(word.id, color)}
      />

      <Button
        variant='ghost'
        size='icon'
        className='text-red-500 hover:text-red-700 hover:bg-red-50'
        disabled={isEmpty}
        onClick={() => onDelete(word.id)}
      >
        <Trash2 className='size-4' />
      </Button>
    </div>
  )
}

function AddCollectionDialog({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [collectionName, setCollectionName] = useState<string>("")
  const [collectionDescription, setCollectionDescription] = useState<string>("")
  const [collectionColor, setCollectionColor] = useState<string>()
  const [words, setWords] = useState<Word[]>([{ id: uuidv4(), value: "" }])
  const [collectionIcon, setCollectionIcon] = useState<string>()

  const { addCollection } = useWordCollection()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id && over?.id) {
      setWords(words => {
        const activeWord = words.find(word => word.id === active.id)
        const overWord = words.find(word => word.id === over?.id)

        // Don't allow dragging if active item is empty or over item is empty
        if (
          !activeWord ||
          !overWord ||
          activeWord.value.trim() === "" ||
          overWord.value.trim() === ""
        ) {
          return words
        }

        const oldIndex = words.findIndex(word => word.id === active.id)
        const newIndex = words.findIndex(word => word.id === over?.id)

        return arrayMove(words, oldIndex, newIndex)
      })
    }
  }

  const handleWordUpdate = useCallback((id: string, name: string) => {
    setWords(prevWords => {
      const updatedWords = prevWords.map(word =>
        word.id === id ? { ...word, value: name } : word
      )

      // If the last item has content and we're updating it, add a new empty item
      const lastWord = updatedWords[updatedWords.length - 1]
      if (lastWord && lastWord.value.trim() !== "" && lastWord.id === id) {
        const newId = (
          Math.max(...updatedWords.map(word => parseInt(word.id))) + 1
        ).toString()
        return [...updatedWords, { id: newId, value: "" }]
      }

      return updatedWords
    })
  }, [])

  const handleWordDelete = useCallback((id: string) => {
    setWords(prevWords => {
      const filteredWords = prevWords.filter(word => word.id !== id)

      // If no items left, add one empty item
      if (filteredWords.length === 0) {
        return [{ id: uuidv4(), value: "" }]
      }

      return filteredWords
    })
  }, [])

  const handleWordColorChange = useCallback((id: string, color?: string) => {
    setWords(prevWords =>
      prevWords.map(word => (word.id === id ? { ...word, color } : word))
    )
  }, [])

  const handleWordIconChange = useCallback((id: string, icon?: string) => {
    setWords(prevWords =>
      prevWords.map(word => (word.id === id ? { ...word, icon } : word))
    )
  }, [])

  const handleReverseWords = () => {
    setWords(prevWords => {
      prevWords.reverse()
      return prevWords
    })
  }

  const resetForm = () => {
    setCollectionName("")
    setCollectionDescription("")
    setCollectionColor("")
    setCollectionIcon(undefined)
    setWords([{ id: uuidv4(), value: "" }])
  }

  const handleCreate = () => {
    addCollection({
      id: uuidv4(),
      name: collectionName,
      description: collectionDescription,
      words: words.filter(word => word.value.trim() !== ""), // Only include non-empty words
      icon: collectionIcon,
      color: collectionColor,
    })

    setIsOpen(false)
    resetForm()
  }

  useEffect(() => {
    setWords([{ id: uuidv4(), value: "" }])
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant='outline'>
            <ListPlus className='size-4' />
            <span>چندتایی</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد چندتایی جدید</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <div className='flex items-center gap-4 -mx-2'>
                <EmojiPicker
                  onEmojiSelect={e => setCollectionIcon(e)}
                  className='flex items-center justify-center size-14 bg-neutral-50 text-xl'
                />

                <div className='flex flex-col'>
                  <Input
                    placeholder='عنوان چندتایی'
                    value={collectionName}
                    onChange={e => setCollectionName(e.target.value)}
                    className='flex-1'
                    variant='plain'
                  />

                  <div className='flex items-center gap-2'>
                    <ColorPicker
                      value={collectionColor}
                      onChange={color => setCollectionColor(color)}
                    />

                    {/* description */}
                    <Input
                      placeholder='توضیحات'
                      variant='plain'
                      className='!text-xs !py-0'
                      value={collectionDescription}
                      onChange={e => setCollectionDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* items */}
              <Field>
                <div className='flex items-center gap-2'>
                  <strong className='font-normal text-sm'>گزینه ها</strong>

                  <Button
                    onClick={handleReverseWords}
                    variant='ghost'
                    size='icon'
                    className='ms-auto'
                  >
                    <ArrowUpDown className='size-4' />
                  </Button>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={words
                      .filter(word => word.value.trim() !== "")
                      .map(word => word.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className='flex flex-col gap-2'>
                      {words.map((word, index) => (
                        <SortableItem
                          key={word.id}
                          index={index}
                          word={word}
                          onUpdate={handleWordUpdate}
                          onDelete={handleWordDelete}
                          onColorChange={handleWordColorChange}
                          onIconChange={handleWordIconChange}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>

        <DialogFooter>
          <div className='flex justify-center gap-2 w-full'>
            <Button onClick={handleCreate}>ایجاد</Button>
            <Button variant='secondary' onClick={() => setIsOpen(false)}>
              انصراف
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddCollectionDialog
