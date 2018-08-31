<template>
  <v-card flat style="background: transparent">
    <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 md12 >
                <span class="labelStyled">{{ label }}:</span> {{ input }}
            </v-flex>
          </v-layout>
        </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
  const COMPONENT_NAME = 'input-render';
  export default {
    name: COMPONENT_NAME,
    props: ['form', 'field', 'model', 'to'],
    data () {
      return {
        input: null,
        label: null
      };
    },
    mounted () {
      this.$nextTick(() => {
        this.label = this.to.label ? this.to.label : 'Default label';
        // this.settings = this.to.settings;
        // this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
        // this.placeholder = this.to.placeholder;
        // this.disabled = this.to.disabled;
        // this.espacioSuperior = (this.to.paddingTop) ? this.to.paddingTop : 0;
        // if (this.to && this.to.value) {
        this.input = this.to.value ? this.to.value : 'Default value';
        // }
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
