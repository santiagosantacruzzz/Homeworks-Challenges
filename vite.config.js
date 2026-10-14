import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // El SDK de Firebase (Auth + Firestore) pesa ~540 KB por sí solo.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        // Firebase y React en archivos aparte: el navegador los guarda en caché por separado.
        codeSplitting: {
          groups: [
            { name: 'firebase', test: /node_modules[\\/](@firebase|firebase)[\\/]/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|react-bootstrap|@restart|@react-aria|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5 todavía usa @import y funciones antiguas de SASS:
        // se ocultan esos avisos para que la consola quede limpia.
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
})
