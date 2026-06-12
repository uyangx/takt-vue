<script setup lang="ts">
import { vTaktEvent } from '../../src/directives/vTaktEvent'
import type { TaktEventParams } from '../../src/directives/vTaktEvent'

// Reactive prop: changing it drives the directive's updated() through Vue's
// real reactivity, exercising the wiring a user relies on.
defineProps<{ params: TaktEventParams }>()
</script>

<template>
  <button
    v-takt-event="params"
    data-testid="btn"
  >
    go
  </button>
</template>
