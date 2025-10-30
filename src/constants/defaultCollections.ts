import type { Collection } from "@/types/wordCollection"

export const defaultCollections: Collection[] = [
  {
    id: "1",
    name: "Collection 1",
    words: [
      { id: "1", value: "Item 1" },
      { id: "2", value: "Item 2" },
    ],
  },
  {
    id: "2",
    name: "Collection 2",
    words: [
      { id: "3", value: "Item 3" },
      { id: "4", value: "Item 4" },
    ],
  },
]
