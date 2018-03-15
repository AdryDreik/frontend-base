<template>
  <v-breadcrumbs>
    <v-icon slot="divider">chevron_right</v-icon>
    <v-breadcrumbs-item
      v-for="item in items"
      :key="item.text"
      :disabled="item.disabled"
    >
      {{ item.text }}
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>
export default {
  created () {
    if (this.$storage.exist('menu')) {
      let items = this.$util.getMenuOption(this.$storage.get('menu'), this.$route.path);
      this.$store.commit('layout/setBreadcrumbs', items);
    }
  },
  data () {
    return {
      items: [
        {
          text: 'Dashboard',
          disabled: false
        },
        {
          text: 'Link 1',
          disabled: false
        },
        {
          text: 'Link 2',
          disabled: true
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.breadcrumbs {
  padding: 12px 15px;
}
</style>
