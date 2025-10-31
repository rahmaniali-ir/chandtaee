export interface Word {
  id: string
  value: string
  description?: string
  color?: string
  icon?: string
}

export interface Collection {
  id: string
  words: Word[]
  name?: string
  description?: string
  color?: string
  icon?: string
}

export interface Page {
  id: string
  name: string
  collections: Collection[]
  description?: string
  color?: string
  icon?: string
}
