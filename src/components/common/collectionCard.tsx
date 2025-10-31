import type { Collection } from "@/types/wordCollection"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

function CollectionCard({ collection }: { collection: Collection }) {
  const hasHeader = collection.name || collection.description || collection.icon

  return (
    <Card className='gap-2 py-3'>
      {hasHeader && (
        <CardHeader
          style={{
            color: collection.color,
          }}
          className='flex items-center gap-2 px-3'
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
  )
}

export default CollectionCard
