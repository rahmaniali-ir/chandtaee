import "./App.css"
import Navbar from "./components/layout/navbar"
import { WordCollectionProvider } from "./contexts/wordCollection"
import AppRoutes from "./routes"

function App() {
  return (
    <>
      <WordCollectionProvider>
        <Navbar />

        <main className='flex flex-col px-2 pb-8'>
          <AppRoutes />
        </main>
      </WordCollectionProvider>
    </>
  )
}

export default App
