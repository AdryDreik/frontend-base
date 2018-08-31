<template>
  <v-card flat>
    <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 md12 >
              <span>{{to.label}}</span>
              <div v-html="to.value"></div>
            </v-flex>
          </v-layout>
        </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
  const COMPONENT_NAME = 'editor-de-textos-pdf';
  export default {
    name: COMPONENT_NAME,
    props: ['form', 'field', 'model', 'to', 'all'],
    data () {
      return {
      };
    },
    mounted () {
      this.$nextTick(() => {});
    }
  };
</script>
<style lang="scss" scoped></style>
