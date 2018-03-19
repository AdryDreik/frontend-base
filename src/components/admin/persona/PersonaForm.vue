<template>
  <section>
    <v-layout row wrap>
      <persona-segip></persona-segip>
      <v-flex xs4>
        <v-text-field
          label="Nombre(s)"
          v-model="form.nombres"
          maxlength="100"
          :rules="$validate(['required'])"
          required
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
          label="Primer apellido"
          v-model="form.primerApellido"
          maxlength="100"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
          label="Segundo apellido"
          v-model="form.segundoApellido"
          maxlength="100"
          ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-select
          :items="nacionalidades"
          v-model="form.nacionalidad"
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
          v-model="form.pais_nacimiento"
          label="País de nacimiento"
          item-text="text"
          item-value="id"
          :rules="$validate(['required'])"
          required
          ></v-select>
      </v-flex>

      <v-radio-group
        v-model="form.genero"
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
        v-model="form.movil"
        maxlength="30"
        ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
        label="Teléfono"
        prepend-icon="phone"
        v-model="form.telefono"
        maxlength="30"
        ></v-text-field>
      </v-flex>
    </v-layout>
  </section>
</template>

<script>
import PersonaSegip from '@/components/admin/persona/PersonaSegip';
import validate from '@/common/mixins/validate';

export default {
  mixins: [ validate ],
  data () {
    return {
      form: {
        nombres: '',
        primerApellido: '',
        segundoApellido: '',
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
  components: {
    PersonaSegip
  }
};
</script>
