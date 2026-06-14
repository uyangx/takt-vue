<script setup lang="ts">
import { computed } from 'vue'
import { badgeUrl, type BadgeVariant, type BadgeGlyph, type WidgetLang } from '@vskstudio/takt-core'

defineOptions({ name: 'TaktBadge' })

interface Props {
  /** Site identifier the badge reports on. */
  domain: string
  /** Badge layout variant. */
  variant?: BadgeVariant
  /** Badge glyph. */
  glyph?: BadgeGlyph
  /** Badge language. */
  lang?: WidgetLang
  /** Override the Takt host (defaults to the public host). */
  host?: string
  /** Image alt text (accessibility). */
  alt?: string
}

const props = withDefaults(defineProps<Props>(), { alt: 'takt' })

const src = computed(() =>
  badgeUrl(props.domain, { host: props.host, variant: props.variant, glyph: props.glyph, lang: props.lang }),
)
</script>

<template>
  <img :src="src" :alt="alt" loading="lazy" decoding="async" />
</template>
