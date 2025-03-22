import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'  // Import path module

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),  // Alias "@" to "src"
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
