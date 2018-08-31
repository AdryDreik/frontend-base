'use strict';
const functions = {
  install (Vue, store) {
    /**
     * @function getComponentValue
     * @description Obtiene el valor de un componente
     * @param {String} identificador Identifidor del componente (Ejemplo input-456)
     * @description Se esta modificando el vue-formly para obtener datos en tiempo real
     */
    Vue.prototype.getComponentValue = (obj, identificator) => {
      let response;
      if (typeof obj === 'object' && obj.all) {
        response = obj.all.filter((item) => item.name === identificator);
        if (Array.isArray(response) && response.length > 0) {
          response = response[0].templateOptions.value;
        }
      }
      return response;
    };
    Vue.prototype.isValidComponent = (obj, identificator) => {
      let response;
      if (typeof obj === 'object' && obj.all) {
        response = obj.all.filter((item) => item.name === identificator);
        if (Array.isArray(response) && response.length > 0) {
          response = response[0].templateOptions.value;
        }
      }
      return (response) ? true : false;
    };
  }
};

export default functions;
