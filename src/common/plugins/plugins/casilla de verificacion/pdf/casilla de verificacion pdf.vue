<template>
  <v-card flat style="background: transparent">
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-subheader>{{label}}</v-subheader>
          </v-flex>
          <v-flex xs12 md12>
            <v-card flat style="background: transparent" :class="(posicion == 'vertical') ? '' : 'horizontalOptions'">
              <v-checkbox v-for="(list, index) in chips" :key="index"
                :label="list"
                :value="list"
                v-model="checkbox"
                :input-value="checkbox"
                :disabled="true"
                hide-details>
              </v-checkbox>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
const COMPONENT_NAME = 'check-button';
export default {
  name: COMPONENT_NAME,
  props: [ 'form', 'field', 'model', 'to' ],
  data () {
    return {
      chips: [],
      checkbox: null,
      label: null,
      posicion: null
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.chips = this.to.options ? this.to.options : ['Option 1', 'Option 2', 'Option 3'];
      this.label = this.to.label ? this.to.label : 'Default label';
      this.posicion = (this.to.position) ? this.to.position : 'vertical';
      this.checkbox = this.to.value ? this.to.value : ['Option 1', 'Option 3']; // this.to.checkbox ? this.to.checkbox
    });
  }
};
</script>
<style lang="scss">
  .titleModified {
    font-weight: 700;
  }
  .horizontalOptions {
    text-align: center;
    align-content: center;
    width: 100%;
    & > div {
      float: left;
      width: calc(100% / 5);
    }
  }
  .quitarEspacio {
    margin-left: -15px;
  }
</style>
