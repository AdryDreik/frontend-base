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
      <h1 class="app-title"><v-icon color="white">whatshot</v-icon><span>{{ $t('app.title') }}</span></h1>
    </div>
    <v-list dense id="sidenav-menu">
      <template v-for="(item, i) in menu">
        <v-list-group v-if="item.submenu" v-model="item.model" no-action>
          <v-list-tile slot="item" @click="send(item.url, item.submenu)" :data-url="item.url">
            <v-list-tile-action>
              <v-icon color="warning">{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ getLabel(item) }}
              </v-list-tile-title>
              <v-icon>{{ item.model ? 'keyboard_arrow_down' : 'keyboard_arrow_right' }}</v-icon>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="(child, i) in item.submenu" :key="i" @click="send(child.url)" :data-url="child.url">
            <v-list-tile-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ getLabel(child) }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile v-else @click="send(item.url, item.submenu)" :data-url="item.url">
          <v-list-tile-action>
            <v-icon color="warning">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ getLabel(item) }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';
import Layout from './mixins/layout';

export default {
  mixins: [ Layout ],
  mounted () {
    if (this.$storage.exist('menu')) {
      this.$store.commit('setMenu', this.$storage.get('menu'));
    }

    if (this.$storage.existUser()) {
      this.$store.commit('setUser', this.$storage.getUser());
    }

    this.setActive(this.$route.path);
    setTimeout(() => (this.clickEvent(this.$route.path)), 1000);
  },
  data: () => ({
    drawer: true,
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
  }),
  computed: {
    ...mapState(['menu', 'user'])
  },
  methods: {
    send (url, submenu) {
      if (submenu === undefined) {
        if (this.$storage.exist('menu')) {
          let page = this.$util.getMenuOption(this.$storage.get('menu'), url);
          this.$store.state.breadcrumbs = page;
        }

        this.setActive(url);

        this.$router.push(url || '/');
      }
    },
    getLabel (item) {
      console.log(item);
      // if (item.url) {
      //   let label = this.$t(`menu.${item.url.replace('/', '')}`);
      //   if (label.indexOf('.') === -1) {
      //     return label;
      //   }
      // }

      return item.label;
    }
  }
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
