<template>
  <section>
    <v-layout row wrap>
      <persona-segip></persona-segip>
      <v-flex xs4>
        <v-text-field
        label="Nombre(s)"
        v-model="form.nombres"
        maxlength="100"
        ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
        label="Primer apellido"
        v-model="form.primer_apellido"
        maxlength="100"
        ></v-text-field>
      </v-flex>

      <v-flex xs4>
        <v-text-field
        label="Segundo apellido"
        v-model="form.segundo_apellido"
        maxlength="100"
        ></v-text-field>
      </v-flex>

      <v-flex xs6>
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

export default {
  data () {
    return {
      form: {
        nombres: '',
        primer_apellido: '',
        segundo_apellido: '',
        telefono: ''
      }
    };
  },
  components: {
    PersonaSegip
  }
};
</script>
