import "./App.css"
import AddCollectionDialog from "./components/common/addCollectionDialog"
import { WordCollectionProvider } from "./contexts/wordCollection"
import AppRoutes from "./routes"

function App() {
  return (
    <>
      <WordCollectionProvider>
        <div className='flex flex-col gap-4'>
          <nav className='flex items-center gap-4'>
            <strong>چندتایی</strong>

            <AddCollectionDialog />
          </nav>

          <AppRoutes />
        </div>
      </WordCollectionProvider>
    </>
  )
}

export default App
