<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { createTakt } from '@vskstudio/takt-core'

defineOptions({ name: 'TaktAnalytics' })

interface Props {
  domain?: string
  endpoint?: string
  scriptOrigin?: string
  outbound?: boolean
  files?: boolean
  track404?: boolean
  // String, not Boolean: an absent attribute must keep the JS default 'true'.
  // A Boolean prop coerces absence to false, silently disabling privacy defaults.
  spa?: string
  respectDnt?: string
  excludeLocalhost?: string
  enabled?: string
  sampleRate?: string
  trackQuery?: string
  queryParams?: string
  tagged?: string
}

const props = withDefaults(defineProps<Props>(), {
  outbound: false,
  files: false,
  track404: false,
  spa: 'true',
  respectDnt: 'true',
  excludeLocalhost: 'true',
})

// Coerce defensively: a consumer may set the property programmatically as a
// boolean/number rather than a string attribute. Only explicit false-y spellings
// disable; absence keeps the privacy default on.
const truthy = (v: string): boolean => String(v) !== 'false' && String(v) !== '0'

let disposers: VoidFunction[] = []

onMounted(() => {
  const parsedSampleRate = props.sampleRate != null ? parseFloat(props.sampleRate) : undefined
  const parsedQueryParams = props.queryParams
    ? props.queryParams.split(',').map((s) => s.trim()).filter(Boolean)
    : undefined

  const takt = createTakt({
    domain: props.domain,
    endpoint: props.endpoint,
    scriptOrigin: props.scriptOrigin,
    respectDnt: truthy(props.respectDnt),
    excludeLocalhost: truthy(props.excludeLocalhost),
    ...(props.enabled != null && { enabled: truthy(props.enabled) }),
    ...(parsedSampleRate != null && { sampleRate: parsedSampleRate }),
    ...(props.trackQuery != null && { trackQuery: truthy(props.trackQuery) }),
    ...(parsedQueryParams?.length && { queryParams: parsedQueryParams }),
  })
  if (truthy(props.spa)) disposers.push(takt.enableSpa())
  if (props.outbound) disposers.push(takt.enableOutbound())
  if (props.files) disposers.push(takt.enableFiles())
  if (props.track404) disposers.push(takt.enable404())
  if (props.tagged != null && truthy(props.tagged)) disposers.push(takt.enableTagged())
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
