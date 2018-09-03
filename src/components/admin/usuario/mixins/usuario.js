/* eslint no-useless-escape: 0 */

'use strict';

export default {
  methods: {
    getRoles () {
      this.$service.get('roles?campos=titulo')
        .then(response => {
          if (response) {
            let items = response.listado;
            let roles = [];
            items.map(rol => {
              roles.push({
                value: rol._id,
                text: rol.titulo
              });
            });
            this.roles = roles;
          }
        });
    },
    getInstituciones () {
      this.$service.get('instituciones?campos=sigla,nombre')
        .then(response => {
          if (response) {
            let items = response.listado;
            let instituciones = [];
            items.map(inst => {
              instituciones.push({
                value: inst._id,
                text: (inst.sigla ? `${inst.sigla} - ` : '') + inst.nombre
              });
            });
            this.instituciones = instituciones;
          }
        });
    }
  }
};
