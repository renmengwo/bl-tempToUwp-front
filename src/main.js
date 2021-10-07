import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import locale from 'element-ui/lib/locale/lang/en'; // lang i18n

import '@/styles/index.scss'; // global css
import '@/utils/veeValidate';
import App from './App';
import store from './store';
import router from './router';
import { getTokenFrom } from '@/utils/orignFrom';
Vue.use(getTokenFrom);
import '@/icons'; // icon
import '@/permission'; // permission control
import resetMessage from '../src/utils/resetMessage';
import './styles/element-variables.scss';
/* imporst echarts from 'echarts';
Vue.prototype.$echarts = echarts;*/
import Directives from 'btn-permission';
Vue.use(Directives);
import * as filters from '@/utils/filter';
// 全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/* if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}*/

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
import formCreate from '@form-create/element-ui';
Vue.use(formCreate);
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI);

Vue.prototype.$message = resetMessage;
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
