import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // Los tests corren contra los JSON de public/data, no contra el back.
  test: { environment: 'jsdom', include: ['tests/**/*.test.jsx'], env: { VITE_USE_MOCK: 'true' } },
})
