<div align="center">

# @vskstudio/takt-vue

**Idiomatic Vue 3 wrapper for [Takt](https://github.com/uyangx/takt) privacy-friendly analytics.**

[![npm version](https://img.shields.io/npm/v/@vskstudio/takt-vue?color=42b883&logo=npm)](https://www.npmjs.com/package/@vskstudio/takt-vue)
[![vue 3](https://img.shields.io/badge/vue-3-42b883?logo=vuedotjs&logoColor=fff)](https://vuejs.org)
[![license](https://img.shields.io/npm/l/@vskstudio/takt-vue?color=42b883)](./LICENSE)

</div>

---

A thin, SSR-safe Vue 3 layer over [`@vskstudio/takt-core`](https://www.npmjs.com/package/@vskstudio/takt-core). It never changes the wire payload or the privacy guarantees — it just makes Takt feel native in a Vue app.

- **`<Takt>` component** — drop it once near the root; it boots analytics after mount and provides the instance to the tree.
- **`useTakt()` composable** — grab the live instance anywhere; returns a never-throwing no-op before mount or during SSR.
- **`v-takt-event` directive** — declarative click tracking, reactive to its binding.
- **`TaktPlugin`** — one-line global install (`app.use`), registers the directive and (optionally) bootstraps a single instance.
- **`<takt-analytics>` custom element** — framework-agnostic, self-contained embed for non-Vue pages.

## Install

```bash
pnpm add @vskstudio/takt-vue @vskstudio/takt-core
```

`vue` (`^3.3`) and `@vskstudio/takt-core` are peer dependencies.

## Quick start — component + composable

Mount `<Takt>` once (e.g. in `App.vue`). It fires an initial pageview, wires SPA navigation, and provides the instance to every descendant:

```vue
<script setup lang="ts">
import { Takt } from '@vskstudio/takt-vue'
</script>

<template>
  <Takt domain="example.com" :outbound="true" :files="['pdf', 'zip']">
    <RouterView />
  </Takt>
</template>
```

Then track custom events from any descendant component:

```vue
<script setup lang="ts">
import { useTakt } from '@vskstudio/takt-vue'

const takt = useTakt()

function onSignup() {
  takt.track('Signup', {
    props: { plan: 'pro' },
    revenue: { amount: '29.00', currency: 'EUR' },
  })
}
</script>

<template>
  <button @click="onSignup">Subscribe</button>
</template>
```

`useTakt()` resolves the instance provided by `<Takt>`. Called before mount (or on the server) it returns a safe no-op that never throws, so it is always safe to call.

### Component props

| Prop | Type | Default | Effect |
| --- | --- | --- | --- |
| `domain` | `string` | `location.hostname` | Site identifier sent with every event |
| `endpoint` | `string` | `/api/event` | Ingestion endpoint |
| `spa` | `boolean` | `true` | Track SPA navigations (history + popstate) |
| `outbound` | `boolean` | `false` | Auto-track outbound link clicks |
| `files` | `boolean \| string[]` | `false` | Auto-track file downloads (optionally an extension allowlist) |
| `respectDnt` | `boolean` | `true` | Suppress events when Do Not Track is on |
| `excludeLocalhost` | `boolean` | `true` | Suppress events on localhost / private IPs |

## Declarative tracking — `v-takt-event`

For simple click tracking, skip the handler and bind the directive. It is reactive — changing the bound value updates what gets tracked, and the listener is cleaned up on unmount:

```vue
<script setup lang="ts">
import { vTaktEvent } from '@vskstudio/takt-vue'
</script>

<template>
  <button v-takt-event="{ name: 'Signup', props: { plan: 'pro' } }">
    Subscribe
  </button>

  <button v-takt-event="{ name: 'Purchase', revenue: { amount: '29.00', currency: 'EUR' } }">
    Buy
  </button>
</template>
```

The directive and the core functions are also available from the `./directives` subpath if you prefer a functional import:

```ts
import { vTaktEvent, track, pageview, optOut, optIn } from '@vskstudio/takt-vue/directives'
```

## Plugin install

`app.use(TaktPlugin)` registers `v-takt-event` globally so you can use it without a per-component import. Pass options to also bootstrap a single instance (pageview + autocapture) without a `<Takt>` component:

```ts
import { createApp } from 'vue'
import { TaktPlugin } from '@vskstudio/takt-vue'
import App from './App.vue'

createApp(App)
  .use(TaktPlugin, { domain: 'example.com', outbound: true })
  .mount('#app')
```

Installing without options registers only the directive — use `<Takt>` for instance lifecycle in that case. Instance bootstrapping is skipped on the server.

## Custom element (no Vue required)

For non-Vue pages, import the `./element` subpath once. It registers `<takt-analytics>` (a self-contained custom element that bundles its own Vue runtime — no build step or import map needed) as a side effect:

```ts
import '@vskstudio/takt-vue/element'
```

```html
<takt-analytics domain="example.com" outbound></takt-analytics>
```

Boolean-style attributes (`outbound`, `files`) are presence flags. The privacy defaults stay on unless explicitly disabled — `spa`, `respect-dnt`, and `exclude-localhost` only turn off when set to `"false"` (or `"0"`):

```html
<takt-analytics domain="example.com" spa="false" respect-dnt="false"></takt-analytics>
```

`defineTaktElement()` is also exported for explicit, idempotent registration. The bundle is SSR-safe: importing it on the server is a no-op until `customElements` exists.

## SSR / Nuxt

Every entry is import-safe on the server — no module-load access to `window`, `document`, or `customElements`. The component defers all browser work to `onMounted`, `useTakt()` returns a no-op during the server pass, and the custom element only registers in the browser.

## Privacy

This wrapper sends nothing the core wouldn't: query strings and hashes are stripped from URLs by default, opt-out and Do Not Track are honored, and localhost / private IPs are excluded. See the [`@vskstudio/takt-core` privacy docs](https://www.npmjs.com/package/@vskstudio/takt-core#privacy) for the full contract and the frozen wire payload.

## License

MIT
