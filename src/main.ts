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

//打印Banner
console.log('\u001b[34m\u001b[0m\n\u001b[34m%s\u001b[0m',`
__    __  _   _   _____       ___   __   _        _____   _____    _   _     _   _____  
\\ \\  / / | | | | |  _  \\     /   | |  \\ | |      |  _  \\ |  _  \\  | | | |   / / | ____| 
 \\ \\/ /  | | | | | |_| |    / /| | |   \\| |      | | | | | |_| |  | | | |  / /  | |__   
  \\  /   | | | | |  _  {   / /-| | | |\\   |      | | | | |  _  /  | | | | / /   |  __|  
  / /    | |_| | | |_| |  / /--| | | | \\  |      | |_| | | | \\ \\  | | | |/ /    | |___  
 /_/     \\_____/ |_____/ /_/   |_| |_|  \\_|      |_____/ |_|  \\_\\ |_| |___/     |_____|

                                                    Developed by Yuban32
                                                    Github Repository 
                                                        Web     https://bit.ly/45aOec3
                                                        Java    https://bit.ly/3MB1OhD
 `);