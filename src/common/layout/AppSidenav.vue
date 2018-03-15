<template>
  <v-navigation-drawer
    persistent
    :mini-variant="$store.state.layout.miniVariant"
    :clipped="clipped"
    v-model="drawer"
    enable-resize-watcher
    fixed
    class="app-sidenav"
    app
    width="260"
    mini-variant-width="68"
  >
    <div class="app-logo">
      <h1 class="app-title"><v-icon color="white">whatshot</v-icon><span>{{ title }}</span></h1>
    </div>
    <v-list>
      <v-list-tile
        value="true"
        v-for="(item, i) in items"
        :key="i"
      >
        <v-list-tile-action>
          <v-icon v-html="item.icon"></v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="item.title"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    drawer: true,
    title: 'Base frontend',
    clipped: false,
    items: [
      {
        icon: 'home',
        title: 'Escritorio'
      },
      {
        icon: 'bubble_chart',
        title: 'Inspire'
      }
    ]
  })
};
</script>

<style lang="scss">
@import '../../assets/scss/_variables.scss';

$bgSidenav: darken($primary, 5%);

.app-sidenav {
  background-color: $bgSidenav !important;

  .list {
    background-color: $bgSidenav;
  }

  .list__tile.primary--text {
    color: lighten($primary, 40%) !important;

    .list__tile__title {
      font-size: 16px;
    }

    .list__tile__action {
      min-width: 36px;
    }
  }

  .app-logo {
    background-color: darken($bgSidenav, 2%);
    height: 70px;

    .icon {
      font-size: 36px;
      margin: -5px 5px 0 0;
    }

    .app-title {
      color: white;
      font-weight: 300;
      line-height: 66px;
      font-size: 24px;
      padding: 0 15px;
      white-space: nowrap;
    }
  }

  &.navigation-drawer--mini-variant {
    .app-title {
      span {
        display: none;
      }
    }
  }

}
</style>
