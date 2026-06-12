import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({ features: { customElement: /\.ce\.vue$/ } })],
  resolve: { conditions: ['browser'] },
  test: {
    environment: 'jsdom',
    globals: true,
    environmentOptions: { jsdom: { url: 'https://example.com/' } },
  },
})
