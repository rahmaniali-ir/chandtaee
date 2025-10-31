import { useWordCollection } from "@/contexts/wordCollection"
import { FilePlus, ListPlus } from "lucide-react"
import { Link } from "react-router"
import AddCollectionDialog from "../common/addCollectionDialog"
import CollectionCard from "../common/collectionCard"
import PageCard from "../common/pageCard"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import AddPageDialog from "../common/addPageDialog"

const MAX_LIST_LENGTH = 6

function Home() {
  const { pages, collections } = useWordCollection()

  return (
    <>
      <div className='flex flex-col items-start gap-2'>
        <div className='flex items-center gap-2'>
          <h2 className='font-light text-neutral-700'>
            صفحات ({pages.length})
          </h2>

          {pages.length > MAX_LIST_LENGTH && (
            <Link to='/pages'>
              <Button
                variant='link'
                size='sm'
                className='text-xs text-neutral-500 font-light'
              >
                مشاهده همه
              </Button>
            </Link>
          )}
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-6 gap-4 w-full'>
          <AddPageDialog>
            <Card className='relative py-2 h-58 border-2 border-dashed cursor-pointer'>
              <CardContent className='flex-1 flex flex-col gap-2 items-center justify-center'>
                <FilePlus className='size-6 text-neutral-400' />
                <span className='text-xs text-neutral-400'>صفحه جدید</span>
              </CardContent>
            </Card>
          </AddPageDialog>

          {pages.map(page => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      </div>

      <div className='flex flex-col items-start gap-2 mt-8'>
        <div className='flex items-center gap-2'>
          <h2 className='font-light text-neutral-700'>
            چندتایی ها ({collections.length})
          </h2>

          {collections.length > MAX_LIST_LENGTH && (
            <Link to='/collections'>
              <Button
                variant='link'
                size='sm'
                className='text-xs text-neutral-500 font-light'
              >
                مشاهده همه
              </Button>
            </Link>
          )}
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-6 gap-4 w-full'>
          <AddCollectionDialog>
            <Card className='relative py-2 h-32 border-2 border-dashed cursor-pointer'>
              <CardContent className='flex-1 flex flex-col gap-2 items-center justify-center'>
                <ListPlus className='size-6 text-neutral-400' />
                <span className='text-xs text-neutral-400'>چندتایی جدید</span>
              </CardContent>
            </Card>
          </AddCollectionDialog>

          {collections.map(collection => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Home
