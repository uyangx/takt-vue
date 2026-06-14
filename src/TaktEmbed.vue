<script setup lang="ts">
import { computed } from 'vue'
import { embedUrl, type EmbedTheme, type WidgetLang } from '@vskstudio/takt-core'

defineOptions({ name: 'TaktEmbed' })

interface Props {
  /** Site identifier the embed reports on. */
  domain: string
  /** Embed color theme. */
  theme?: EmbedTheme
  /** Embed language. */
  lang?: WidgetLang
  /** Override the Takt host (defaults to the public host). */
  host?: string
  /** Iframe width. */
  width?: number | string
  /** Iframe height. */
  height?: number | string
  /** Iframe title (accessibility). */
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 404,
  height: 264,
  title: 'takt',
})

const src = computed(() =>
  embedUrl(props.domain, { host: props.host, theme: props.theme, lang: props.lang }),
)
</script>

<template>
  <iframe
    :src="src"
    :width="width"
    :height="height"
    :title="title"
    referrerpolicy="strict-origin-when-cross-origin"
    sandbox="allow-scripts allow-same-origin"
    loading="lazy"
    :style="{ border: 0 }"
  />
</template>
