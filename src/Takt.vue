<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { createTakt } from '@vskstudio/takt-core'
import { provideTakt, taktStore } from './store'

interface Props {
  domain?: string
  endpoint?: string
  outbound?: boolean
  files?: boolean | string[]
  spa?: boolean
  respectDnt?: boolean
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
