import { createApp } from 'vue';
import './style.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import './assets/style/dark/css-vars.css'

import App from './App.vue'
import {store,key} from './vuex/store';
import ElementPlus from "element-plus";
import router from "./router/index"

const vueApp = createApp(App);

vueApp.use(store,key);
vueApp.use(ElementPlus);
vueApp.use(router);
vueApp.mount('#app');
