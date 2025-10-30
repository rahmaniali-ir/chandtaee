import type { Collection, Page } from "@/types/wordCollection"
import { createContext, useContext, useState } from "react"

const WordCollectionContext = createContext<{
  downloadDB: () => void
  uploadDB: (file: File) => void

  pages: Page[]
  addPage: (page: Page) => void
  updatePage: (id: string, page: Page) => void
  deletePage: (id: string) => void

  collections: Collection[]
  addCollection: (collection: Collection) => void
  searchCollectionByName: (name: string) => Collection[]
  searchWord: (word: string) => Collection[]
}>({
  downloadDB: () => {},
  uploadDB: () => {},

  pages: [],
  addPage: () => {},
  updatePage: () => {},
  deletePage: () => {},

  collections: [],
  addCollection: () => {},
  searchCollectionByName: () => [],
  searchWord: () => [],
})

export const WordCollectionProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [pages, setPages] = useState<Page[]>([])
  const [collections, setCollections] = useState<Collection[]>([])

  const downloadDB = () => {
    const db = {
      pages,
      collections,
      timestamp: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(db)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "chandtaee.json"

    a.click()
    URL.revokeObjectURL(url)
  }

  const uploadDB = (file: File) => {
    const reader = new FileReader()

    reader.onload = e => {
      const db = JSON.parse(e.target?.result as string)
      setPages(db.pages)
      setCollections(db.collections)
    }

    reader.readAsText(file)
  }

  const addPage = (page: Page) => {
    setPages([...pages, page])
  }

  const updatePage = (id: string, page: Page) => {
    setPages(pages.map(p => (p.id === id ? page : p)))
  }

  const deletePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id))
  }

  const addCollection = (collection: Collection) => {
    setCollections([...collections, collection])
  }

  const searchCollectionByName = (name: string) => {
    return collections.filter(collection =>
      collection?.name?.toLowerCase().includes(name.toLowerCase())
    )
  }

  const searchWord = (wordValue: string) => {
    return collections.filter(collection =>
      collection.words.some(word =>
        word.value.toLowerCase().includes(wordValue.toLowerCase())
      )
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <WordCollectionContext.Provider
        value={{
          // Database
          downloadDB,
          uploadDB,

          // Pages
          pages,
          addPage,
          updatePage,
          deletePage,

          // Collections
          collections,
          addCollection,
          searchCollectionByName,
          searchWord,
        }}
      >
        {children}
      </WordCollectionContext.Provider>
    </div>
  )
}

export const useWordCollection = () => {
  return useContext(WordCollectionContext)
}
