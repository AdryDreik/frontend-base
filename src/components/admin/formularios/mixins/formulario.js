'use strict';

export default {
  methods: {
    restringir (componentes, noIncluir) {
      let res = false;
      componentes.forEach((item) => {
        if (item.type === noIncluir) {
          res = true;
        }
      });
      return res;
    },
    getInstituciones () {
      this.$service.get('instituciones?campos=sigla,nombre,activo')
      .then(response => {
        if (response) {
          let items = response.listado;
          let instituciones = [];
          items.map(inst => {
            if (inst.activo) {
              instituciones.push({ value: inst._id, text: (inst.sigla ? `${inst.sigla} - ` : '') + inst.nombre });
            }
          });
          this.instituciones = instituciones;
        }
      });
    }
  }
};
