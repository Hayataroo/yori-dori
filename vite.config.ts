import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-router-dom': fileURLToPath(new URL('./src/lib/react-router-dom.tsx', import.meta.url)),
    },
  },
})
