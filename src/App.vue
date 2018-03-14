<template>
  <v-app>
    <app-sidenav></app-sidenav>
    <app-navbar></app-navbar>
    <v-content>
      <router-view/>
    </v-content>
    <app-notification></app-notification>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import AppSidenav from '@/common/layout/AppSidenav';
import AppNavbar from '@/common/layout/AppNavbar';
import AppNotification from '@/common/layout/AppNotification';
import AppFooter from '@/common/layout/AppFooter';

export default {
  data () {
    return {
    };
  },
  components: {
    AppSidenav,
    AppNotification,
    AppNavbar,
    AppFooter
  },
  name: 'App'
};
</script>

<style lang="scss">
@import 'assets/scss/index.scss';
</style>
