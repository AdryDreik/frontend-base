<template>
  <v-layout row wrap class="decisionCom">
    <v-flex sm6 xs6 lg6>
      <v-form ref="camposNormales">
        <v-select
          class="pr-3"
          :items="itemsCamposDocumentosNormal"
          v-model="camposDocumentoSeleccionado"
          item-text="component.templateOptions.id"
          max-width="auto"
          label="Nombre del campo"
          autocomplete
          required
          no-data-result="No hay data"
          :rules="[(v) => !!v || 'El campo no puede estar vacio']"
        >
          <template slot="item" slot-scope="data">
            <template v-if="typeof data.item !== 'object'">
              <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
            <template v-else>
              <v-list-tile-avatar>
                <v-icon>{{ data.item.component.templateOptions.icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="data.item.component.templateOptions.id"></v-list-tile-title>
                <v-list-tile-sub-title v-html="data.item.documento.grupo"></v-list-tile-sub-title>
              </v-list-tile-content>
            </template>
          </template>
        </v-select>
      </v-form>
    </v-flex>
    <v-flex sm1 xs1 lg1 class="text-md-center text-sm-center text-lg-center">
      <v-icon class="compareArrows mt-1" color="primary">trending_flat</v-icon>
    </v-flex>
    <v-flex sm5 xs5 lg5>
      <v-text-field
        class="pr-3"
        v-model="comodinSeleccionado"
        label="Comodin a utilizar"
        disabled
x      >
      </v-text-field>
    </v-flex>
    <v-flex sm12 xs12 lg12 v-if="camposDocumentoSeleccionado && camposDocumentoSeleccionado.documento && camposDocumentoSeleccionado.documento.tipoDocumentoPlantilla === 'I'">
       <div v-for="(item, idx) in camposDocumentoSeleccionado.component.templateOptions.attributes" :key="idx">
          <v-checkbox :label="item.label" color="primary" v-model="seleccionados" :value="item.name"></v-checkbox>
        </div>
    </v-flex>
  </v-layout>
</template>
<script>
  export default {
    name: 'ruleComodin',
    props: {
      normal: {
        type: Array,
        default: null
      },
      comodin: {
        type: Array,
        default: null
      },
      configData: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        camposDocumentoSeleccionado: null,
        comodinSeleccionado: null,
        infoComodinSeleccionado: null,
        itemsCamposDocumentosNormal: [],
        seleccionados: []
      };
    },
    watch: {
      normal (normal) {
        if (normal) {
          this.itemsCamposDocumentosNormal = [];
          for (let item of normal) {
            item.components.reduce((container, component) => {
              const objTmp = {
                documento: {
                  grupo: item.nombre,
                  tipoDocumento: item.nombre,
                  id: item.id,
                  tipoDocumentoPlantilla: item.tipo
                },
                component: component
              };
              container.push(objTmp);
              return container;
            }, this.itemsCamposDocumentosNormal);
          }
        }
      },
      comodin (comodin) {
        if (comodin[0] && comodin[0].templateOptions) {
          this.comodinSeleccionado = (comodin[0].templateOptions.id) ? comodin[0].templateOptions.id.replace(/_/g, ' ') : '';
          this.infoComodinSeleccionado = comodin[0];
        }
      },
      seleccionados () {
        this.camposDocumentoSeleccionado.component.options = this.seleccionados;
      }
    },
    methods: {
      configuracionReglaComodin () {
        try {
          return {
            campoNormalSeleccionado: Object.assign({}, this.camposDocumentoSeleccionado),
            campoComodinSeleccionado: this.comodinSeleccionado,
            infoComodin: this.infoComodinSeleccionado
          };
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      asignarConfiguracionReglaComodin (normal, comodin, infoComodin) {
        if (Array.isArray(this.itemsCamposDocumentosNormal) && this.itemsCamposDocumentosNormal.length > 0) {
          const elemento = this.itemsCamposDocumentosNormal.filter((item) => {
            if (item.component.name === normal.component.name && (normal.documento && normal.documento.tipoDocumentoPlantilla !== 'I' ||
                (normal.documento && normal.documento.tipoDocumentoPlantilla === 'I' && item.component.type === normal.component.type))) {
              if (normal.component.options) this.seleccionados = normal.component.options;
              return item;
            }
          });
          this.camposDocumentoSeleccionado = elemento[0];
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .compareArrows {
    font-size: 3em;
    user-select: none;
  }
  .decisionCom {
    position: relative;
    // height: 60px;
    margin-top: 0px;
    margin-left: 15px !important;
    padding-left: 25px;
  }

  .decisionCom:before,
  .decisionCom:after {
    content: '';
    position: absolute;
    left: -1px;
    width: 16px;
    height: calc(50% + 15px);
    border-color: #c0c5e2;
    border-style: solid;
  }

  .decisionCom:before {
    top: -15px;
    border-width: 0 0 2px 2px;
  }

  .decisionCom:after {
    top: 50%;
    border-width: 0 0 0 2px;
  }

  .decisionCom:last-child:after {
    border: none;
  }
</style>
