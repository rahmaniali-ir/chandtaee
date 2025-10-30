import type { Collection } from "@/types/wordCollection"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{collection.name}</CardTitle>
        <CardDescription>{collection.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col gap-2'>
          {collection.words.map(word => (
            <div key={word.id} className='flex items-center gap-2'>
              <span>{word.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default CollectionCard
