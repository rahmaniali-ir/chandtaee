import { useState } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import type { Collection } from "@/types/wordCollection"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { useWordCollection } from "@/contexts/wordCollection"
import UpdateCollectionDialog from "./updateCollectionDialog"
import { ConfirmDialog } from "./confirmDialog"

export function CollectionContextMenu({
  collection,
  children,
}: {
  collection: Collection
  children?: React.ReactNode
}) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { deleteCollection } = useWordCollection()

  const handleDelete = () => {
    deleteCollection(collection.id)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>

        <ContextMenuContent className='w-52'>
          <ContextMenuItem inset onClick={() => setIsUpdateDialogOpen(true)}>
            <PencilIcon className='size-4' />
            <span>ویرایش</span>
          </ContextMenuItem>

          <ContextMenuItem
            inset
            onClick={() => setIsDeleteDialogOpen(true)}
            className='text-red-500 focus:text-red-600'
          >
            <Trash2Icon className='size-4' />
            <span>حذف</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <UpdateCollectionDialog
        collection={collection}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
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
