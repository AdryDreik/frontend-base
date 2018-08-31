<template>
  <v-layout row wrap class="decision">
    <v-flex sm4 xs4 lg4>
      <v-select
        class="pr-3"
        :name="paso"
        :items="keys"
        v-model="modelkeys"
        item-text="label"
        item-value="id"
        max-width="auto"
        label="Nombre del campo"
        autocomplete
        no-data-result="No hay data"
        @change="checkComponentOptions"
      >
        <template slot="item" slot-scope="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-tile-content v-text="data.item"></v-list-tile-content>
          </template>
          <template v-else>
            <v-list-tile-avatar>
              <v-icon>{{ data.item.icon }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="data.item.label"></v-list-tile-title>
              <v-list-tile-sub-title v-html="data.item.group"></v-list-tile-sub-title>
            </v-list-tile-content>
          </template>
        </template>
      </v-select>
    </v-flex>
    <v-flex sm3 xs3 lg3>
      <v-select
        class="pr-3"
        item-text="label"
        :items="conditions"
        v-model="modelConditions"
        label="Condicion"
        autocomplete
      ></v-select>
    </v-flex>
    <v-flex sm3 xs3 lg3>
      <v-text-field
          v-if="!hasOptions"
          name="input"
          v-model="valorRegla"
          label="Valor"
          placeholder="Ejemplo: 250"
        ></v-text-field>
      <v-select
        v-if="hasOptions"
        class="pr-3"
        :items="listOptions"
        v-model="valorRegla"
        label="Valor"
        autocomplete
        no-data-result="No hay opciones"
      >
      </v-select>
    </v-flex>
    <v-flex sm2 xs2 lg2 class="text-md-right pr-1">
      <v-tooltip bottom>
        <v-btn color="error" icon slot="activator" @click.prevent="deleteSelf()">
          <v-icon>delete_forever</v-icon>
        </v-btn>
        <span>Eliminar condicion</span>
      </v-tooltip>
    </v-flex>
  </v-layout>
</template>
<script>
  export default {
    name: 'rule',
    props: ['paso', 'documentos', 'regla'],
    created () {
      this.valorRegla = null;
      this.modelkeys = null;
      this.modelConditions = null;
      this.idDocumentoPlantilla = null;
      // this.checkComponentOptions(this.valorRegla);
      // this.checkComponentOptions(this.modelkeys);
    },
    mounted () {
      this.idDocumentoPlantilla = (this.regla.documentoPlantilla) ? this.regla.documentoPlantilla : null;
      this.valorRegla = this.regla && this.regla.value ? this.regla.value : null;
      this.modelkeys = this.regla && this.regla.key ? this.regla.key : null;
      this.modelConditions = this.regla && this.regla.operator ? this.regla.operator : null;
      this.tipoDocumento = this.regla && this.regla.tipoDocumento ? this.regla.tipoDocumento : null;
      this.setKeys();
      // this.checkComponentOptions(this.valorRegla);
      setTimeout(() => {
        this.checkComponentOptions(this.modelkeys);
      }, 100);
    },
    data () {
      return {
        avatarSize: '1',
        noData: 'No existen datos',
        keys: [],
        nombrePaso: null,
        conditions: [{
          key: 1,
          label: 'igual',
          value: '='
        }, {
          key: 2,
          label: 'distinto',
          value: '!='
        }, {
          key: 3,
          label: 'menor a',
          value: '<'
        }, {
          key: 4,
          label: 'mayor',
          value: '>'
        }],
        valorRegla: null, // this.regla && this.regla.length > 0 ? this.regla[0].value : null,
        modelkeys: null, // this.regla && this.regla.length > 0 ? this.regla[0].key : null,
        componentId: null,
        modelConditions: null, // this.regla && this.regla.length > 0 ? this.regla[0].operator : null
        idDocumentoPlantilla: null,
        listOptions: [],
        hasOptions: false,
        tipoDocumento: null
      };
    },
    watch: {
      modelkeys (value) {
        if (value) {
          const element = this.keys.filter((item) => {
            if (item.id === value) {
              return item;
            }
          }).shift();
          if (element && element.documentoPlantilla) {
            this.idDocumentoPlantilla = element.documentoPlantilla;
            this.tipoDocumento = element.tipoDocumento;
          }
          this.checkComponentOptions(value);
        }
      },
      regla (regla) {
        this.idDocumentoPlantilla = (regla && regla.documentoPlantilla) ? regla.documentoPlantilla : null;
        this.valorRegla = regla && regla.value ? regla.value : null;
        this.modelkeys = regla && regla.key ? regla.key : null;
        this.modelConditions = regla && regla.operator ? regla.operator : null;
        this.tipoDocumento = regla && regla.tipoDocumento ? regla.tipoDocumento : null;
        // this.checkComponentOptions(this.valorRegla);
        this.checkComponentOptions(this.modelkeys);
      },
      documentos (documentos) {
        this.setKeys();
        setTimeout(() => {
          this.checkComponentOptions(this.modelkeys);
        }, 100);
      }
    },
    methods: {
      deleteSelf () {
        this.$emit('delete-rule');
      },
      queryFormStatus () {
        return {
          'documentoPlantilla': this.idDocumentoPlantilla,
          'key': this.modelkeys,
          'id': this.componentId,
          'operator': this.modelConditions,
          'value': this.valorRegla,
          'tipoDocumento': this.tipoDocumento
        };
      },
      setKeys () {
        this.keys = [];
        let items;
        setTimeout(() => {
          this.documentos.reduce((a, b) => {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> b', b);
            if (b.componentes && b.componentes.length > 0) {
              items = b.componentes.reduce((c, d) => {
                if (d.name.length > 0) {
                  c.push({
                    documentoPlantilla: b.id,
                    id: d.name,
                    compId: d.templateOptions.id,
                    icon: d.templateOptions.icon ? d.templateOptions.icon : 'view-module',
                    label: d.templateOptions.label, // d.name,
                    group: b.name,
                    options: d.templateOptions.hasOwnProperty('options') ? d.templateOptions.options : null
                  });
                }
                return c;
              }, [{header: b.name}]);
            }
            this.keys = this.keys.concat(items);

            let itemInteroperabilidad = [];
            if (b.componentes && b.componentes.envio && b.componentes.envio.length > 0) {
              itemInteroperabilidad = b.componentes.envio.reduce((c, d) => {
                if (d.name && d.name.length > 0 && d.tipo !== 'array') {
                  c.push({
                    documentoPlantilla: b.id,
                    id: d.name,
                    icon: 'cloud_upload',
                    compId: d.descripcionAtributo,
                    label: d.descripcionAtributo, // d.name,
                    group: b.name,
                    options: null,
                    tipoDocumento: b.tipo
                  });
                }
                return c;
              }, [{header: b.name}]);
              this.keys = this.keys.concat(itemInteroperabilidad);
            }
            return a;
          }, []);
        }, 100);
      },
      checkComponentOptions (value) {
        this.listOptions = [];
        this.hasOptions = false;
        if (value) {
          this.keys.forEach(item => {
            if (item.id === value && item.id !== null && item.id !== undefined && item.options !== null && item.options.length > 0) {
              this.listOptions = item.options;
              this.hasOptions = true;
            }
            if (item.id === value && item.id !== null && item.id !== undefined) {
              this.componentId = item.compId;
            }
          });
        }
      }
    }
  };
</script>

<style>
  .decision {
    position: relative;
    height: 60px;
    margin-top: 0px;
    margin-left: 15px !important;
    padding-left: 25px;
  }

  .decision:before,
  .decision:after {
    content: '';
    position: absolute;
    left: -1px;
    width: 16px;
    height: calc(50% + 15px);
    border-color: #c0c5e2;
    border-style: solid;
  }

  .decision:before {
    top: -15px;
    border-width: 0 0 2px 2px;
  }

  .decision:after {
    top: 50%;
    border-width: 0 0 0 2px;
  }

  .decision:last-child:after {
    border: none;
  }
</style>
