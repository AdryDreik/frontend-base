<template>
  <v-card flat style="background: transparent">
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <span class="labelStyled">{{ label }}</span>
            <br/>
            <ul>
              <li v-for="(elem, idx) in value" :key="idx">
                {{elem.label}}
              </li>
            </ul>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
const COMPONENT_NAME = 'upload';
export default {
  name: COMPONENT_NAME,
  props: [ 'form', 'field', 'model', 'to' ],
  data () {
    return {
      label: null,
      value: null
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.label = this.to.label ? this.to.label : 'Default file upload label';
      this.value = this.to.value ? this.to.value : '';
    });
  }
};
</script>
