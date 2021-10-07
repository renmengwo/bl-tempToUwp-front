import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import app from './modules/app';
import settings from './modules/settings';
import user from './modules/user';
/* import permission from './modules/permission';*/
import { aynscRoutes, constantRoutes, errorPath } from '@/router';
import router from '@/router';
const setting = require('@/settings');
const exportObj = require('router-permission');
const permission = exportObj.permission(setting, router, aynscRoutes, constantRoutes, errorPath);
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    permission,
    user
  },
  getters
});

export default store;