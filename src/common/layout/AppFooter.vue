<template>
  <v-footer :fixed="fixed" :inset="inset" app>
    <span>&copy; {{ new Date().getFullYear() }}</span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    fixed: false,
    inset: true
  })
};
</script>
