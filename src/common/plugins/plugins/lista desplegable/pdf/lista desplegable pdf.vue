<template>
  <v-card flat style="background: transparent">
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-card flat style="background: transparent">
                <span class="labelStyled">{{ label }}:</span> {{ select }}
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
/* eslint no-unneeded-ternary:0 */
const COMPONENT_NAME = 'dropdown';
export default {
  name: COMPONENT_NAME,
  props: [ 'form', 'field', 'model', 'to' ],
  data () {
    return {
      select: null,
      label: null
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.label = this.to.label ? this.to.label : 'Default label';
      this.select = this.to.value ? this.to.value : 'Default value selected';
    });
  }
};
</script>
<style lang="scss">
  .titleModified {
    font-weight: 700;
  }
  .labelStyled {
    color: grey;
    margin-bottom: -25px;
  }
</style>

