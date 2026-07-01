---
'@vskstudio/takt-vue': patch
---

Slim down the self-contained `/element` bundle: the `<takt-analytics>` custom
element is now authored as a plain `HTMLElement` instead of a Vue custom element,
dropping the bundled Vue runtime. The element only wired core imperatively on
mount/unmount and rendered nothing, so no behavior or attribute changes — the
bundle shrinks from ~25.6 kB to ~3.5 kB gzipped.
