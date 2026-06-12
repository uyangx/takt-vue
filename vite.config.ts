import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// Builds entries A (`.`) and the directives surface, with `vue` and the core
// kept external (peer deps). The self-contained custom element is built
// separately by vite.element.config.ts.
export default defineConfig({
  plugins: [
    vue(),
    dts({ include: ['src'], exclude: ['src/element/**', 'test/**'] }),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        index: 'src/index.ts',
        'directives/index': 'src/directives/index.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', '@vskstudio/takt-core'],
      output: { entryFileNames: '[name].js' },
    },
  },
})
