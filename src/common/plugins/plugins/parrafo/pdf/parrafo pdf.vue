<template>
  <v-card flat style="background: transparent">
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-card flat style="background: transparent">
              <span class="labelStyled">{{ label }}:</span> {{ texto }}
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
const COMPONENT_NAME = 'textarea';
export default {
  props: [ 'form', 'field', 'model', 'to' ],
  name: COMPONENT_NAME,
  data () {
    return {
      label: null,
      texto: null
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.texto = this.to.value ? this.to.value : 'Default textarea content';
      this.label = this.to.label ? this.to.label : 'Default label';
    });
  }
};
</script>
<style lang="scss">
  .labelStyled {
    color: grey;
    margin-bottom: -25px;
  }
</style>

