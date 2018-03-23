<template>
  <section>
    <v-layout row wrap>
      <persona-segip store="usuario"></persona-segip>
      <v-flex xs4>
        <v-text-field
          label="Nombre(s)"
          v-model="nombres"
          maxlength="100"
          :rules="$validate(['required'])"
          required
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
          label="Primer apellido"
          v-model="primer_apellido"
          maxlength="100"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
          label="Segundo apellido"
          v-model="segundo_apellido"
          maxlength="100"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-select
          :items="nacionalidades"
          v-model="nacionalidad"
          label="Nacionalidad"
          item-text="text"
          item-value="id"
          :rules="$validate(['required'])"
          required
          ></v-select>
      </v-flex>

      <v-flex xs4>
        <v-select
          :items="paises"
          v-model="pais_nacimiento"
          label="País de nacimiento"
          item-text="text"
          item-value="id"
          :rules="$validate(['required'])"
          required
          ></v-select>
      </v-flex>

      <v-radio-group
        v-model="genero"
        row
        class="pl-4"
        :rules="$validate(['required'])"
        required
      >
        <v-radio
          label="Mujer"
          value="M"
        ></v-radio>
        <v-radio
          label="Varón"
          value="V"
        ></v-radio>
      </v-radio-group>

      <v-flex xs4>
        <v-text-field
          label="Móvil"
          prepend-icon="smartphone"
          v-model="movil"
          maxlength="30"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
          label="Teléfono"
          prepend-icon="phone"
          v-model="telefono"
          maxlength="30"
          ></v-text-field>
      </v-flex>
    </v-layout>
  </section>
</template>

<script>
import PersonaSegip from '@/components/admin/persona/PersonaSegip';
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
        nombres: '',
        primer_apellido: '',
        segundo_apellido: '',
        telefono: '',
        movil: '',
        nacionalidad: '',
        pais_nacimiento: '',
        genero: ''
      },
      paises: [
        { id: 'BOLIVIA', text: 'BOLIVIA' }
      ],
      nacionalidades: [
        { id: 'BOLIVIA', text: 'BOLIVIANA' }
      ]
    };
  },
  computed: {
    ...mapFields([
      'form.nombres',
      'form.primer_apellido',
      'form.segundo_apellido',
      'form.telefono',
      'form.movil',
      'form.nacionalidad',
      'form.pais_nacimiento',
      'form.genero'
    ])
  },
  components: {
    PersonaSegip
  }
};
</script>
