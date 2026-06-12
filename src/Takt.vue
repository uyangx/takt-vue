<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { createTakt } from '@vskstudio/takt-core'
import { provideTakt, taktStore } from './store'

defineOptions({ name: 'Takt' })

interface Props {
  /** Site identifier sent with every event. Defaults to `location.hostname`. */
  domain?: string
  /** Ingestion endpoint. Defaults to `/api/event`. */
  endpoint?: string
  /** Auto-track outbound link clicks. */
  outbound?: boolean
  /** Auto-track file downloads. Pass an array to restrict to those extensions. */
  files?: boolean | string[]
  /** Track SPA navigations (history pushState/replaceState + popstate). */
  spa?: boolean
  /** Suppress events when the browser's Do Not Track is enabled. */
  respectDnt?: boolean
  /** Suppress events on localhost and private IP ranges. */
  excludeLocalhost?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  outbound: false,
  files: false,
  spa: true,
  respectDnt: true,
  excludeLocalhost: true,
})

const store = provideTakt()
let disposers: VoidFunction[] = []

onMounted(() => {
  const { domain, endpoint, respectDnt, excludeLocalhost, spa, outbound, files } = props
  const takt = createTakt({ domain, endpoint, respectDnt, excludeLocalhost })
  if (spa) disposers.push(takt.enableSpa())
  if (outbound) disposers.push(takt.enableOutbound())
  if (files) disposers.push(takt.enableFiles(Array.isArray(files) ? files : undefined))
  takt.pageview()

  store.value = takt
  taktStore.value = takt
})

onBeforeUnmount(() => {
  disposers.forEach((dispose) => dispose())
  disposers = []
  store.value = null
  taktStore.value = null
})
</script>

<template>
  <slot />
</template>
