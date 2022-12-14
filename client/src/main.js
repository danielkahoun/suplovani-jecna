import { createApp } from 'vue'
import VueCookies from 'vue-cookies'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'bootstrap'

const app = createApp(App)

app.use(createPinia())
app.use(VueCookies, { expires: '7d'})
app.use(router)

app.mount('#app')
