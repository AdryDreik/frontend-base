<template>
  <v-card flat class="overflow" style="background: transparent">
    <v-card-text>
        <v-container>
          <v-layout>
            <v-flex xs12 md12 class="subheaderModified">
              <v-subheader>{{ label }}</v-subheader>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 md12>
              <v-radio-group v-model="radio" :mandatory="false">
                <v-radio 
                    v-for="list in chips"
                    :key="list.value"
                    :disabled="true"
                    :input-value="true"
                    :label="list"
                    :value="list">
                </v-radio>
              </v-radio-group>
            </v-flex>
          </v-layout>
        </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
const COMPONENT_NAME = 'radio-button';
export default {
  props: [ 'form', 'field', 'model', 'to' ],
  name: COMPONENT_NAME,
  data () {
    return {
      label: null,
      radio: null,
      chips: []
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.label = this.to.label ? this.to.label : 'Default radio label';
      this.chips = this.to.options ? this.to.options : ['OPT 1', 'OPT 2', 'OPT 3'];
      this.radio = this.to.value ? this.to.value : null;
    });
  }
};
</script>
<style lang="scss">
  .subheaderModified {
    li {
      padding: 0;
    }
  }
  .overflow {
    overflow: hidden !important;
  }
</style>
