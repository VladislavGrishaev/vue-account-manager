import { createApp } from 'vue';
// @ts-ignore
import App from "./App.vue";
import { createPinia } from "pinia";
import vuetify from "./plugins/vuetify";
import './assets/styles/main.scss';


const app = createApp(App);
app
  .use(createPinia())
  .use(vuetify)
  .mount('#app');

