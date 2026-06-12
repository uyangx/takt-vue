import { createApp } from 'vue'
import { vTaktEvent } from '@vskstudio/takt-vue'
import App from './App.vue'

createApp(App).directive('takt-event', vTaktEvent).mount('#app')
