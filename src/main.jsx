import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/figtree'
// Bootstrap (librería CSS) compilado con SASS y nuestros propios estilos.
import './styles/main.scss'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider'
import { TasksProvider } from './context/TasksProvider'
import { isFirebaseConfigured } from './firebase/config'
import SetupFirebase from './pages/SetupFirebase'

// Dos contextos distintos: uno para la sesión (login/registro) y otro para las tareas.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isFirebaseConfigured ? (
      <AuthProvider>
        <TasksProvider>
          <App />
        </TasksProvider>
      </AuthProvider>
    ) : (
      <SetupFirebase />
    )}
  </StrictMode>,
)
