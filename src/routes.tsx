import { Routes, Route } from "react-router"
import Home from "./components/pages/home"

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  )
}

export default AppRoutes
