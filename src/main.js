// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VMenu,
  VToolbar,
  transitions
} from 'vuetify';
import '../node_modules/vuetify/src/stylus/app.styl';

import store from './store';

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VMenu,
    VToolbar,
    transitions
  },
  theme: {
    primary: '#7e4e6e',
    secondary: '#ffffff',
    accent: '#82B1FF',
    info: '#36a3f7',
    warning: '#ffb822',
    error: '#f4516c',
    success: '#34bfa3'
  }
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
