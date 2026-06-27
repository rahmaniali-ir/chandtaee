import { useWordCollection } from "@/contexts/wordCollection"
import type { Collection } from "@/types/wordCollection"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { ConfirmDialog } from "./confirmDialog"
import UpdateCollectionDialog from "./updateCollectionDialog"

function CollectionCard({ collection }: { collection: Collection }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { deleteCollection } = useWordCollection()

  const hasHeader = collection.name || collection.description || collection.icon

  const handleDelete = () => {
    deleteCollection(collection.id)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Card className='relative gap-2 py-3'>
        <div className='absolute top-2 end-2 flex items-center gap-0.5'>
          <Button
            variant='ghost'
            size='icon-sm'
            className='text-neutral-400 hover:text-neutral-600'
            onClick={() => setIsEditDialogOpen(true)}
          >
            <PencilIcon />
          </Button>

          <Button
            variant='ghost'
            size='icon-sm'
            className='text-neutral-400 hover:text-red-600 hover:bg-red-50'
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2Icon />
          </Button>
        </div>

        {hasHeader && (
          <CardHeader
            style={{
              color: collection.color,
            }}
            className='flex items-center gap-2 px-3 pe-16'
          >
            {collection.icon && (
              <span className='text-xl'>{collection.icon}</span>
            )}

            {collection.name && <CardTitle>{collection.name}</CardTitle>}

            {collection.description && (
              <CardDescription>{collection.description}</CardDescription>
            )}
          </CardHeader>
        )}

        <CardContent className='px-4'>
          <div className='flex flex-col gap-2'>
            {collection.words.map((word, index) => (
              <div
                key={word.id}
                style={{
                  color: word.color,
                  border: collection.color
                    ? `1px solid ${collection.color}`
                    : undefined,
                }}
                className='flex text-sm items-center gap-2 bg-neutral-50 p-2 rounded-md'
              >
                <span className='text-xs text-neutral-400'>{index + 1}.</span>

                {word.icon && <span>{word.icon}</span>}

                <span>{word.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UpdateCollectionDialog
        collection={collection}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='حذف چندتایی'
        description='آیا از حذف این چندتایی اطمینان دارید؟ این عمل قابل بازگشت نیست.'
        confirmText='حذف'
        cancelText='انصراف'
        onConfirm={handleDelete}
        variant='destructive'
      />
    </>
  )
}

export default CollectionCard
