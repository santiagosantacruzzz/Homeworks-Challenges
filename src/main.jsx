import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/courier-prime/400.css'
import '@fontsource/courier-prime/700.css'
import './styles/app.css'
import './styles/books.css'
import './styles/atm.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider'
import { StructuresProvider } from './context/StructuresProvider'

// 3. Envolver toda la app con los Providers para que cualquier página use los contextos.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <StructuresProvider>
        <App />
      </StructuresProvider>
    </AuthProvider>
  </StrictMode>,
)
