import type { Collection } from "@/types/wordCollection"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

function CollectionCard({ collection }: { collection: Collection }) {
  const hasHeader = collection.name || collection.description

  return (
    <Card>
      {hasHeader && (
        <CardHeader>
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
              className='flex items-center gap-2 bg-neutral-50 p-2 rounded-md'
            >
              <span className='text-xs text-neutral-400'>{index + 1}.</span>
              <span>{word.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default CollectionCard
