'use strict';
import axios from 'axios';
export default {
  methods: {
    obtenerDocumentos () {
      const instance = axios.create();
      instance.get(`${this.$apiUrl}documentos_plantilla`)
        .then((res) => {
          this.documentos = res.data.listado;
        });
    },
    eliminarDocumento (id) {
      const instance = axios.create();
      instance.delete(`${this.$apiUrl}documentos_plantilla/${id}`)
        .then((res) => {
          this.$message.success('Documento eliminado satisfactoriamente');
        })
        .catch((err) => this.$message.error(err.message));
    }
  }
};
