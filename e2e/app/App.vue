<script setup lang="ts">
import { Takt } from '@vskstudio/takt-vue'

function navigate(e: Event) {
  e.preventDefault()
  history.pushState({}, '', '/about')
}
</script>

<!-- excludeLocalhost is forced off: the e2e server runs on localhost, where core
     otherwise suppresses every event. -->
<template>
  <Takt
    domain="example.com"
    endpoint="/api/event"
    :exclude-localhost="false"
  >
    <h1>Takt Vue e2e</h1>
    <button
      id="signup"
      v-takt-event="{ name: 'Signup', props: { plan: 'pro' } }"
    >
      Sign up
    </button>
    <a
      id="nav"
      href="/about"
      @click="navigate"
    >About</a>
  </Takt>
</template>
