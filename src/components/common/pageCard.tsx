import { Card, CardHeader, CardTitle } from "../ui/card"
import type { Page } from "@/types/wordCollection"

function PageCard({ page }: { page: Page }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{page.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default PageCard
