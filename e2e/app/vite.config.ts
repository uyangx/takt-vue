import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

// Resolve the package to its built output so the e2e exercises the real
// published artifact.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@vskstudio/takt-vue': resolve(__dirname, '../../dist/index.js'),
    },
  },
})
