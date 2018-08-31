<template>
  <v-card flat>
    <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 md12 >
              Vista para pdf vacio
            </v-flex>
          </v-layout>
        </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
  const COMPONENT_NAME = 'sample-render';
  export default {
    name: COMPONENT_NAME,
    props: {
      form: {
        type: Object,
        default: null
      },
      field: {
        type: Object,
        default: null
      },
      model: {
        type: Object,
        default: null
      },
      to: {
        type: Object,
        defautl: null
      }
    },
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
