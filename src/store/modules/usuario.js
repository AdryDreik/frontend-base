'use strict';

import { getField, updateField } from 'vuex-map-fields';

const layout = {
  namespaced: true,
  state: {
    form: {
      id: '',
      usuario: '',
      contrasena: '',
      email: '',
      cargo: '',
      estado_usuario: '',
      id_entidad: '',
      id_rol: '',
      id_persona: '',
      tipo_documento: '',
      tipo_documentoOtro: '',
      nro_documento: '',
      fecha_nacimiento: '',
      nombres: '',
      primer_apellido: '',
      segundo_apellido: '',
      nombre_completo: '',
      telefono: '',
      movil: '',
      nacionalidad: '',
      pais_nacimiento: '',
      genero: '',
      estado_persona: ''
    }
  },
  getters: {
    getField
  },
  mutations: {
    updateField
  }
};

export default layout;
