/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import { setupCalendar } from 'v-calendar';

const app = createApp(App)

registerPlugins(app)

app.use(setupCalendar, {})
app.mount('#app')
