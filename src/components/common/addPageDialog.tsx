import type { Word } from "@/types/wordCollection"
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
import { useState, useCallback } from "react"
import { Trash2, GripVertical, Palette, ListPlus, FilePlus } from "lucide-react"
import {
  DndContext,
  closestCenter,
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useWordCollection } from "@/contexts/wordCollection"
import { v4 as uuidv4 } from "uuid"

interface SortableItemProps {
  word: Word
  onUpdate: (id: string, name: string) => void
  onDelete: (id: string) => void
  onColorChange: (id: string, clear?: boolean) => void
}

function SortableItem({
  word,
  onUpdate,
  onDelete,
  onColorChange,
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

  const isColorful = !!word.color

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
          <div className='size-4' />
        </div>
      )}

      <Input
        placeholder='گزینه'
        value={word.value}
        onChange={e => onUpdate(word.id, e.target.value)}
        className='flex-1'
        style={word.color ? { borderColor: word.color } : {}}
      />

      {!isEmpty && (
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onColorChange(word.id)}
          onContextMenu={e => {
            e.preventDefault()
            onColorChange(word.id, true) // Clear color
          }}
          className={`${
            isColorful
              ? "text-current-500 hover:text-current-700 hover:bg-current-50"
              : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
          }`}
          style={word.color ? { color: word.color } : {}}
          title={
            isColorful
              ? "Click to change color, right-click to remove"
              : "Click to set color"
          }
        >
          <Palette className='size-4' />
        </Button>
      )}

      {isEmpty && <div className='w-10' />}

      {!isEmpty && (
        <Button
          variant='ghost'
          size='icon'
          onClick={() => onDelete(word.id)}
          className='text-red-500 hover:text-red-700 hover:bg-red-50'
        >
          <Trash2 className='size-4' />
        </Button>
      )}

      {isEmpty && <div className='w-10' />}
    </div>
  )
}

function AddPageDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [collectionName, setCollectionName] = useState<string>("")
  const [collectionDescription, setCollectionDescription] = useState<string>("")
  const [collectionColor, setCollectionColor] = useState<string>("")
  const [words, setWords] = useState<Word[]>([{ id: "1", value: "" }])

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

  const handleColorChange = useCallback((id: string, clear = false) => {
    if (clear) {
      setWords(prevWords =>
        prevWords.map(word =>
          word.id === id ? { ...word, color: undefined } : word
        )
      )
      return
    }

    // Create a temporary input element for color picking
    const colorInput = document.createElement("input")
    colorInput.type = "color"
    colorInput.value = "#3b82f6" // Default blue color

    colorInput.addEventListener("input", e => {
      const target = e.target as HTMLInputElement
      if (target.value) {
        setWords(prevWords =>
          prevWords.map(word =>
            word.id === id ? { ...word, color: target.value } : word
          )
        )
      }
    })

    colorInput.click()
  }, [])

  const resetForm = () => {
    setCollectionName("")
    setCollectionDescription("")
    setCollectionColor("")
    setWords([{ id: uuidv4(), value: "" }])
  }

  const handleCreate = () => {
    addCollection({
      id: uuidv4(),
      name: collectionName,
      description: collectionDescription,
      words: words.filter(word => word.value.trim() !== ""), // Only include non-empty words
    })

    setIsOpen(false)
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <FilePlus className='size-4' />
          <span>صفحه</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد صفحه جدید</DialogTitle>
        </DialogHeader>

        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              {/* name */}
              <Field>
                <FieldLabel>عنوان</FieldLabel>
                <Input
                  placeholder='عنوان چندتایی'
                  required
                  value={collectionName}
                  onChange={e => setCollectionName(e.target.value)}
                />
              </Field>

              <div className='flex gap-2'>
                {/* description */}
                <Field>
                  <FieldLabel>توضیحات</FieldLabel>
                  <Input
                    placeholder='توضیحات'
                    required
                    value={collectionDescription}
                    onChange={e => setCollectionDescription(e.target.value)}
                  />
                </Field>

                {/* color */}
                <Field>
                  <FieldLabel>رنگ</FieldLabel>
                  <Input
                    placeholder='رنگ'
                    required
                    value={collectionColor}
                    onChange={e => setCollectionColor(e.target.value)}
                    type='color'
                  />
                </Field>
              </div>

              {/* items */}
              <Field>
                <FieldLabel>گزینه ها</FieldLabel>

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
                      {words.map(word => (
                        <SortableItem
                          key={word.id}
                          word={word}
                          onUpdate={handleWordUpdate}
                          onDelete={handleWordDelete}
                          onColorChange={handleColorChange}
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

export default AddPageDialog
