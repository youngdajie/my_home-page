import { createApp } from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import '@/styles/index.css'
import App from '@/App.vue'
import { vReveal } from '@/directives/reveal'
import { initTheme } from '@/composables/useTheme'

// 主题要在 mount 之前落到 <html>，否则会闪一下白
initTheme()

const app = createApp(App)

app.use(Toast, {
	transition: 'Vue-Toastification__fade',
})

app.directive('reveal', vReveal)

app.mount('#xiaojie_index')
