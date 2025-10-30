import { useWordCollection } from "@/contexts/wordCollection"
import CollectionCard from "../common/collectionCard"
import PageCard from "../common/pageCard"

function Home() {
  const { pages, collections } = useWordCollection()

  return (
    <>
      <div className='flex flex-col items-start gap-2'>
        <h2 className='font-light text-neutral-700'>صفحات</h2>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
          {pages.map(page => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      </div>

      <div className='flex flex-col items-start gap-2'>
        <h2 className='font-light text-neutral-700'>چندتایی ها</h2>

        <div className='grid md:grid-cols-2 lg:grid-cols-6 gap-4 w-full'>
          {collections.map(collection => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Home
