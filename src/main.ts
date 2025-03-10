import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia';
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia());
app.mount('#app')