import { useWordCollection } from "@/contexts/wordCollection"
import { CloudDownload, CloudUpload, NotebookTabs, Search } from "lucide-react"
import { useRef } from "react"
import { Link } from "react-router"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

function Navbar() {
  const { downloadDB, uploadDB } = useWordCollection()

  const uploadDBInputRef = useRef<HTMLInputElement>(null)

  const handleUploadDB = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) uploadDB(file)
  }

  return (
    <nav className='flex items-center gap-4 px-2 py-4'>
      <Link
        to='/'
        className='flex items-center gap-1 text-neutral-500 transition-colors hover:text-neutral-700'
      >
        <NotebookTabs className='size-4' />

        <strong className='font-light'>چندتایی</strong>
      </Link>

      <div className='flex'>
        <div className='relative'>
          <Search className='size-4 text-neutral-500 absolute right-2 top-1/2 -translate-y-1/2' />

          <Input placeholder='جستجو' className='w-full ps-8' />
        </div>
      </div>

      <div className='flex items-center gap-2 ms-auto'>
        <Button onClick={downloadDB} variant='ghost' size='icon'>
          <CloudDownload className='size-4' />
        </Button>

        <Button
          onClick={() => uploadDBInputRef.current?.click()}
          variant='ghost'
          size='icon'
          className='relative'
        >
          <CloudUpload className='size-4' />

          <input
            ref={uploadDBInputRef}
            type='file'
            className='absolute top-0 left-0 w-0 h-0 opacity-0'
            onChange={handleUploadDB}
          />
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
