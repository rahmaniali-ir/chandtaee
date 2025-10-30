import { useWordCollection } from "@/contexts/wordCollection"
import CollectionCard from "../common/collectionCard"

function Home() {
  const { collections } = useWordCollection()

  return (
    <>
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {collections.map(collection => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  )
}

export default Home
