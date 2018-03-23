<template>
  <div>
    <v-layout row wrap>
      <v-flex xs4>
        <v-select
          :items="tiposDoc"
          v-model="tipo_documento"
          label="Tipo de documento"
          item-text="text"
          item-value="id"
          :rules="$validate(['required'])"
          required
          ></v-select>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          label="Número de documento"
          v-model="nro_documento"
          maxlength="20"
          @keydown.native="$filter.numeric($event)"
          :rules="$validate(['required'])"
          required
          ></v-text-field>
      </v-flex>
      <v-flex xs3>
        <select-date model="fecha_nacimiento" store="usuario"></select-date>
      </v-flex>
      <v-flex xs2>
        <v-btn
          color="info"
          @click="buscarPersona"><v-icon>search</v-icon> Buscar</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import SelectDate from '@/common/util/SelectDate';
import validate from '@/common/mixins/validate';

import { createHelpers } from 'vuex-map-fields';

const { mapFields } = createHelpers({
  getterType: 'usuario/getField',
  mutationType: 'usuario/updateField'
});

export default {
  mixins: [ validate ],
  data () {
    return {
      form: {
        tipo_documento: '',
        tipo_documentoOtro: '',
        nro_documento: ''
      },
      tiposDoc: [
        { id: 'CI', text: 'CÉDULA DE IDENTIDAD' },
        { id: 'PASAPORTE', text: 'PASAPORTE' }
      ]
    };
  },
  computed: {
    ...mapFields([
      'form.tipo_documento',
      'form.tipo_documentoOtro',
      'form.nro_documento'
    ])
  },
  methods: {
    buscarPersona () {
      console.log('search!');
    }
  },
  components: {
    SelectDate
  }
};
</script>
