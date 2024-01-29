import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Enter from './views/Enter.vue';
import router from './router'
import store from './store/store';

const app = createApp(App)

app.use(store);
app.use(router)

app.component('Enter', Enter);
app.mount('#app')
