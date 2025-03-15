import { createApp } from 'vue';
import {createPinia} from 'pinia';
import persistedState from 'pinia-plugin-persistedstate';
//@ts-ignore
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import './assets/styles/main.scss';

const pinia = createPinia();
pinia.use(persistedState);

createApp(App)
  .use(pinia)
  .use(vuetify)
  .mount('#app');

