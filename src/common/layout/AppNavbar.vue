<template>
  <v-toolbar
    app
    :clipped-left="clipped"
    height="70"
    class="app-navbar white"
  >
    <v-toolbar-side-icon class="btn-mini-variant" @click.stop="$store.commit('layout/toggleMiniVariant')"></v-toolbar-side-icon>
    <v-toolbar-side-icon class="btn-drawer" @click.stop="$store.commit('layout/toggleDrawer')"></v-toolbar-side-icon>
    <v-spacer></v-spacer>
    <!-- <app-lang></app-lang> -->
    <v-tooltip bottom>
      <v-btn @click="activateTour()" slot="activator" color="primary">INICIAR GUIA</v-btn>
      <span>Iniciar guia para esta sección</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn icon @click="fullscreen()" class="btn-fullscreen" slot="activator">
        <v-icon>fullscreen</v-icon>
        <v-icon>fullscreen_exit</v-icon>
      </v-btn>
      <span>Pantalla completa</span>
    </v-tooltip>
    <v-tooltip bottom>
      <v-btn icon @click="reload" slot="activator">
        <v-icon>refresh</v-icon>
      </v-btn>
      <span>Actualizar la página</span>
    </v-tooltip>
    <v-menu
      origin="center center"
      transition="scale-transition"
      bottom
      content-class="app-notifications"
    >
        <v-btn icon slot="activator">
          <v-icon>notifications</v-icon>
        </v-btn>
        <v-list>
          <!-- <iframe src="http://localhost:8888" frameborder="0"></iframe> -->
          <v-list-tile class="item-notificacion" avatar>
            <v-list-tile-avatar>
              <v-icon>info</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Ejemplo de notificación</v-list-tile-title>
              <v-list-tile-sub-title>Ejemplo de detalle de notificación con descripción definida</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile class="item-notificacion" avatar>
            <v-list-tile-avatar>
              <v-icon>info</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Ejemplo de notificación</v-list-tile-title>
              <v-list-tile-sub-title>Ejemplo de detalle de notificación con descripción definida</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
    </v-menu>
    <v-menu bottom left>
      <v-btn icon slot="activator">
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="cursor" @click="$router.push('account')"><v-icon>account_circle</v-icon> {{$t('app.account') }}</v-list-tile-title>
        </v-list-tile>
        <!-- <v-list-tile>
          <v-list-tile-title class="cursor" @click="$router.push('settings')"><v-icon>settings</v-icon> {{$t('app.settings') }}</v-list-tile-title>
        </v-list-tile> -->
        <v-list-tile>
          <v-list-tile-title class="cursor" @click="logout()"><v-icon>&#xE8AC;</v-icon> {{$t('app.logOut') }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import Auth from '@/components/admin/auth/mixins/auth';
import AppLang from './AppLang';
import { mapState } from 'vuex';

export default {
  mixins: [ Auth ],
  data: () => ({
    clipped: false
  }),
  methods: {
    activateTour () {
      this.$store.state.tour = Math.floor(Math.random() * Math.floor(10000));
    },
    fullscreen () {
      document.querySelector('body').classList.toggle('fullscreen');
      this.$util.fullscreen();
    },
    reload () {
      this.$store.commit('setMain', false);
      this.$nextTick(function () {
        this.$store.commit('setMain', true);
      });
    }
  },
  components: { AppLang },
  computed: {
    ...mapState(['user']),
    nombreCompleto () {
      let user = this.$store.state.user;

      return user.nombres;
    },
    inicial () {
      let user = this.$store.state.user;
      if (user.usuario) {
        return (user.usuario[0] || '?').toUpperCase();
      }
      return '?';
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/_variables.scss';
$heightToolbar: 56px;
.app-navbar {
  box-shadow: 0px 1px 15px 1px rgba(69, 65, 78, 0.1);

  .v-toolbar__content {
    padding: 0 15px;
    height: $heightToolbar !important;
  }

  .v-btn .v-icon {
    color: $color;
  }

  .menu-user {
    margin-right: 10px;
    .v-toolbar__title {
      font-size: 16px;
      color: $color;
    }
    .v-icon {
      font-size: 40px;
    }
  }

}

.btn-fullscreen {
  .v-icon:last-child {
    display: none;
  }
}

body.fullscreen {
  .btn-fullscreen {
    .v-icon:first-child {
      display: none;
    }
    .v-icon:last-child {
      display: inline-block;
    }
  }
}

.menu-person {
  color: lighten($warning, 10%);
  font-size: 1rem;
  padding: 10px 15px;
  background-color: darken($primary, 5%);
  background-image: url(../../assets/images/bg.png);
  background-position: center;
  background-size: cover;

  h3 {
    font-size: 1.3rem;
    color: white;
    font-weight: 400;
  }

  .v-icon {
    color: white !important;
    font-size: 1.1rem;
  }
}

.btn-mini-variant {
  display: inline-block;
}
.btn-drawer {
  display: none;
}
// Notifications
.app-notifications {
  top: 55px !important;
  overflow: inherit;
  max-width: 400px;
  &::before {
    position: absolute;
    content: '';
    top: -10px;
    border-bottom: 10px solid #eee;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    width: 0;
    height: 0;
    left: 50%;
    margin: 0 0 0 5px;
  }

  .list {
    padding: 0;

    iframe {
      border: none;
      margin: 0 0 -5px;
      padding: 0;
      height: 380px;
      width: 350px;
    }
  }

  .item-notificacion {
    padding: 10px 0;
    border-bottom: 1px dotted #c9c9c9;
  }
}
@media (max-width: 1256px) {
  .btn-mini-variant {
    display: none;
  }
  .btn-drawer {
    display: inline-block;
  }
}
</style>
