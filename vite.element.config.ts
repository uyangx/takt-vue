import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Builds ONLY the self-contained custom-element bundle into dist/element. This
// is a no-build, framework-agnostic embed target, so the core is bundled in —
// `import '@vskstudio/takt-vue/element'` resolves in a plain browser with no
// import map. The element is a plain HTMLElement (no Vue runtime), so no Vue
// plugin is needed and the bundle stays tiny. Runs with emptyOutDir:false so it
// doesn't wipe the lib build from vite.config.ts.
export default defineConfig({
  plugins: [
    dts({ include: ['src/element'], outDir: 'dist/element', entryRoot: 'src/element' }),
  ],
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
