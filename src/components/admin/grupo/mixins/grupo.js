/* eslint no-useless-escape: 0 */

'use strict';

export default {
  methods: {
    getInstituciones () {
      this.$service.get('instituciones?campos=sigla,nombre')
      .then(response => {
        if (response) {
          let items = response.listado;
          let instituciones = [];
          items.map(inst => {
            instituciones.push({ value: inst._id, text: (inst.sigla ? `${inst.sigla} - ` : '') + inst.nombre });
          });
          this.instituciones = instituciones;
        }
      });
    }
  }
};
