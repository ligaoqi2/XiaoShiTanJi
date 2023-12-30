import { createApp } from 'vue';
import { createPinia } from 'pinia';
import SvgIcon from '@/components/svgIcon/index.vue';

import 'normalize.css/normalize.css';
import './assets/custom.css';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);
app.component('svg-icon', SvgIcon);
app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.mount('#app');
