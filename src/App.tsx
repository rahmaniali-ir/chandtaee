import "./App.css"
import Navbar from "./components/layout/navbar"
import { WordCollectionProvider } from "./contexts/wordCollection"
import AppRoutes from "./routes"

function App() {
  return (
    <>
      <WordCollectionProvider>
        <Navbar />

        <AppRoutes />
      </WordCollectionProvider>
    </>
  )
}

export default App
