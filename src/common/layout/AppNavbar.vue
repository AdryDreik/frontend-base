<template>
  <v-toolbar
    app
    :clipped-left="clipped"
    height="70"
    class="app-navbar white"
  >
    <v-toolbar-side-icon @click.stop="miniVariant = !miniVariant"></v-toolbar-side-icon>
    <v-spacer></v-spacer>
    <v-menu :nudge-width="100" class="menu-user">
      <v-toolbar-title slot="activator">
        <span>Administrador</span>
        <v-icon>account_circle</v-icon>
      </v-toolbar-title>
      <v-list>
        <v-list-tile @click="">
          <v-list-tile-title>
            <v-icon>account_circle</v-icon> Mi cuenta
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-title>
            <v-icon>&#xE8AC;</v-icon> Cerrar sesión
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-btn icon @click.stop="">
      <v-icon>fullscreen</v-icon>
    </v-btn>
    <v-btn icon @click.stop="rightDrawer = !rightDrawer">
      <v-icon>notifications</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  data: () => ({
    clipped: false,
    miniVariant: false,
    rightDrawer: false
  })
};
</script>

<style lang="scss">
@import '../../assets/scss/_variables.scss';

.app-navbar {
  box-shadow: 0px 1px 15px 1px rgba(69, 65, 78, 0.1);

  .toolbar__content {
    padding: 0 15px;
  }

  .btn .icon {
    color: $color;
  }

  .menu-user {
    margin-right: 10px;
    .toolbar__title {
      font-size: 16px;
      color: $color;
    }
    .icon {
      font-size: 40px;
    }
  }
}
</style>
