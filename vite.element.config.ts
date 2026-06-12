import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// Builds ONLY the self-contained custom-element bundle into dist/element. This
// is a no-build, framework-agnostic embed target, so Vue and the core are
// bundled in — `import '@vskstudio/takt-vue/element'` resolves in a plain
// browser with no import map. Runs with emptyOutDir:false so it doesn't wipe
// the lib build from vite.config.ts.
export default defineConfig({
  plugins: [
    vue({ customElement: true }),
    dts({ include: ['src/element'], outDir: 'dist/element', entryRoot: 'src/element' }),
  ],
  // Drop the Options API and devtools hooks — this element only uses the
  // Composition API, so these tree-shake cleanly out of the self-contained bundle.
  define: {
    __VUE_OPTIONS_API__: 'false',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  build: {
    emptyOutDir: false,
    outDir: 'dist/element',
    lib: {
      entry: 'src/element/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
  },
})
