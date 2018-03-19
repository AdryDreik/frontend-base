<template>
  <div>
    <v-layout row wrap>
      <v-flex xs4>
        <v-select
          :items="tiposDoc"
          v-model="form.tipoDocumento"
          label="Tipo de documento"
          item-text="text"
          item-value="id"
          :rules="$validate(['required'])"
          required
          ></v-select>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          label="Número de documento"
          v-model="form.nroDocumento"
          maxlength="2"
          @keydown.native="$filter.numeric($event)"
          :rules="$validate(['required'])"
          required
          ></v-text-field>
      </v-flex>
      <v-flex xs4>
        <select-date model="fecNacimiento"></select-date>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import SelectDate from '@/common/util/SelectDate';
import validate from '@/common/mixins/validate';

export default {
  mixins: [ validate ],
  data () {
    return {
      form: {
        tipoDocumento: '',
        tipoDocumentoOtro: '',
        nroDocumento: ''
      },
      tiposDoc: [
        { id: 'CI', text: 'CÉDULA DE IDENTIDAD' },
        { id: 'PASAPORTE', text: 'PASAPORTE' }
      ]
    };
  },
  components: {
    SelectDate
  }
};
</script>
