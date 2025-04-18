import '@/assets/main.css'
import '@/assets/theme-custom.css'
import '@/assets/theme.css'
import 'primeicons/primeicons.css'

import App from '@/App.vue'
import MyPreset from '@/presets/MyPreset'
import router from '@/router'
import { useThemeStore } from '@/stores/theme'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { createApp } from 'vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue, {
  unstyled: false,
  theme: {
    dark: useThemeStore().isDark,
    preset: MyPreset,
  },
})
app.use(ToastService)
app.use(router)
app.mount('#app')
