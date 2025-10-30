import { DirectionProvider } from "@radix-ui/react-direction"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import App from "./App.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DirectionProvider dir='rtl'>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DirectionProvider>
  </StrictMode>
)
