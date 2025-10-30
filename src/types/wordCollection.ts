export interface Word {
  id: string
  value: string
  description?: string
  color?: string
  icon?: string
}

export interface Collection {
  id: string
  name: string
  words: Word[]
  description?: string
}

export interface Page {
  id: string
  name: string
  collections: Collection[]
  description?: string
  color?: string
  icon?: string
}
