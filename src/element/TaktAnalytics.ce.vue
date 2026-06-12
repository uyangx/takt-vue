<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { createTakt } from '@vskstudio/takt-core'

interface Props {
  domain?: string
  endpoint?: string
  outbound?: boolean
  files?: boolean
  // String, not Boolean: an absent attribute must keep the JS default 'true'.
  // A Boolean prop coerces absence to false, silently disabling privacy defaults.
  spa?: string
  respectDnt?: string
  excludeLocalhost?: string
}

const props = withDefaults(defineProps<Props>(), {
  outbound: false,
  files: false,
  spa: 'true',
  respectDnt: 'true',
  excludeLocalhost: 'true',
})

const truthy = (v: string): boolean => v !== 'false' && v !== '0'

let disposers: VoidFunction[] = []

onMounted(() => {
  const takt = createTakt({
    domain: props.domain,
    endpoint: props.endpoint,
    respectDnt: truthy(props.respectDnt),
    excludeLocalhost: truthy(props.excludeLocalhost),
  })
  if (truthy(props.spa)) disposers.push(takt.enableSpa())
  if (props.outbound) disposers.push(takt.enableOutbound())
  if (props.files) disposers.push(takt.enableFiles())
  takt.pageview()
})

onBeforeUnmount(() => {
  disposers.forEach((dispose) => dispose())
  disposers = []
})
</script>

<template>
  <span style="display: none" />
</template>
