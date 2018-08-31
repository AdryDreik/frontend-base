<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-select
							append-icon="keyboard_arrow_down"
              :items="chips"
              :required="requiredElement"
							:rules="(requiredElement) ? [() => modelComponent.length > 0 || 'El campo no pueder estar vacio'] : []"
              :loading="ending"
              v-model="modelComponent"
              :label="label"
              autocomplete
              :item-text="api.label"
              :placeholder="placeholder"
              :disabled="disabled"
            ></v-select>
          </v-flex>
        </v-layout>
        <div>
          <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
              <v-btn icon slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Autocompletado</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <!-- INICIANDO LOS TABS -->
                    <v-tabs
                      dark
                      color="primary"
                      slot="extension"
                      grow
                      class="tabsAutocomplete"
                    >
                      <v-tabs-slider color="white"></v-tabs-slider>
                      <v-tab key="1" href="#tab-1"> Adicionar opciones </v-tab>
                      <v-tab key="2" href="#tab-2"> Cargar CSV </v-tab>
                      <v-tab key="3" href="#tab-3" v-if="false"> Consumir APIS </v-tab>
                      <v-tabs-items>
                        <v-tab-item key="1" id="tab-1">
                          <v-card>
                            <v-card-text>
                              <v-layout raw wrap>
                                <v-flex sm12 xs12 md12 lg12>
                                <label class="overflow">Adicionar opciones manualmente:</label>
                                  <v-select
                                    class="mt-2"
                                    color="primary"
                                    chips
                                    tags
                                    solo
                                    append-icon=""
                                    clearable
                                    v-model="chips"
                                    placeholder="Escriba palabras..."
                                  >
                                  <template slot="selection" slot-scope="data">
                                    <v-chip
                                      close
                                      @input="remove(data.item)"
                                      :selected="data.selected"
                                      color="primary"
                                      text-color="white"
                                    >
                                      <strong>{{ data.item }}</strong> 
                                    </v-chip>
                                  </template>
                                </v-select>
                                <small>Nota. Para adicionar mas de una opcion solo tiene que escribir la o las palabras y presionar la tecla enter.</small>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                          </v-card>
                        </v-tab-item>
                        <v-tab-item key="2" id="tab-2">
                          <v-card flat>
                            <v-card-text>
                              <small>Puede cargar las opciones desde un archivo csv</small>
                                <v-layout row wrap>
                                  <v-flex xs12 md12 sm12 lg12 class="text-md-center">
                                    <input class="file" type="file" @change="subiendoArchivo($event)">
                                    <small class="archivoOk" v-show="mostrarNombreArchivo">Archivo cargado satisfactoriamente</small>
                                    <small class="archivoError" v-show="!mostrarNombreArchivo">Debe subir un archivo con extension .csv</small>
                                  </v-flex>
                                </v-layout>
                            </v-card-text>
                          </v-card>
                        </v-tab-item>
                        <v-tab-item key="3" id="tab-3">
                          <v-card flat>
                            <v-card-text>
                              <v-layout row wrap>
                                <v-flex sm12 xs12 md12 lg12>
                                  <v-text-field label="Token" v-model="api.token" hint="Token de acceso para el recurso a consumir"></v-text-field>
                                </v-flex>
                                <v-flex sm12 xs12 md12 lg12>
                                  <v-layout row wrap>
                                    <v-flex sm-12 xs12 md9 lg9>
                                      <v-text-field label="Ruta" v-model="api.path" hint="Ruta al que se consumira para retornar valores con el verbo GET"></v-text-field>
                                    </v-flex>
                                    <v-flex sm-12 xs12 md3 lg3 class="text-md-right">
                                      <v-tooltip bottom>
                                        <v-btn color="primary" slot="activator" @click.prevent="verificar" :disabled="!api.path">verificar</v-btn>
                                        <span>Verificar si esta funcionando correctamente la ruta de consumo.</span>
                                      </v-tooltip>
                                    </v-flex>
                                    <v-flex sm12 xs12 md12 lg12>
                                      <ace-editor v-model="validacionJson" @init="aceEditorInit" lang="json" theme="chrome" width="100%" height="200"></ace-editor>
                                    </v-flex>
                                  </v-layout>
                                </v-flex>
                                <v-flex sm12 xs12 md12 lg12>
                                  <v-text-field label="Atributo que se mostrara" v-model="api.label" hint="Atributo que se mostrara en la lista desplegable"></v-text-field>
                                </v-flex>
                                <v-flex sm12 xs12 md12 lg12>
                                  <v-text-field label="Seleccionar array que se iterara" placeholder="Ejemplo: datos.objeto.array" v-model="api.list" hint="Seleccionar array que se iterara"></v-text-field>
                                </v-flex>
                              </v-layout>
                            </v-card-text>
                          </v-card>
                        </v-tab-item>
                      </v-tabs-items>
                    </v-tabs>

                    <v-layout row wrap>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-text-field label="Nombre" v-model="label" hint="Nombre descriptivo que aparecera encima de las opciones añadidas."></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-text-field label="Placeholder" v-model="placeholder"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <label for="validations">Validaciones</label>
                        <div class="listaValidaciones">
                          <div v-for="(item, idx) in listValidations" :key="idx">
                            <v-checkbox :label="item.titulo" color="primary" v-model="selected" :value="item.titulo"></v-checkbox>
                          </div>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click.native="dialog = false">Cancelar</v-btn>
                  <v-btn color="primary" @click.native="dialog = false">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
import validate from '../../validate.js';
import axios from 'axios';
import AceEditor from 'vue2-ace-editor';
import slugify from 'slugify';
const COMPONENT_NAME = 'suggest';
export default {
  mixins: [validate],
  name: COMPONENT_NAME,
  props: ['form', 'field', 'model', 'to', 'all'],
  data () {
    return {
      disabled: null,
      identificador: null,
      label: null,
      modelComponent: [],
      mostrarNombreArchivo: false,
      validacionJson: '{}',
      errorMessages: ['No se encontraron coincidencias'],
      chips: [],
      placeholder: null,
      search: null,
      dialog: null,
      asyncElements: [],
      ending: false,
      settings: null,
      requiredElement: false,
      api: {
        token: null,
        path: null,
        label: null,
        list: null
      }
    };
  },
  watch: {
    'api.token' () {
      this.asyncElements = [];
      this.to.api = {
        token: this.api.token,
        path: this.api.path,
        label: this.api.label,
        list: this.api.list
      };
    },
    'api.path' () {
      this.asyncElements = [];
      this.to.api = {
        token: this.api.token,
        path: this.api.path,
        label: this.api.label,
        list: this.api.list
      };
    },
    'api.label' () {
      this.asyncElements = [];
      this.to.api = {
        token: this.api.token,
        path: this.api.path,
        label: this.api.label,
        list: this.api.list
      };
    },
    'api.list' () {
      this.asyncElements = [];
      this.to.api = {
        token: this.api.token,
        path: this.api.path,
        label: this.api.label,
        list: this.api.list
      };
    },
    disabled (disabled) {
      this.to.disabled = disabled;
    },
    label (label) {
      this.to.label = label;
      this.to.id = slugify(label, '_');
    },
    placeholder (placeholder) {
      this.to.placeholder = placeholder;
    },
    modelComponent (newVal) {
      this.to.value = newVal;
    },
    chips () {
      this.to.options = this.chips;
    },
    selected (rule) {
      if (Array.isArray(rule) && rule.includes('requerido')) {
        this.requiredElement = true;
      } else {
        this.requiredElement = false;
      }
    }
  },
  methods: {
    serialize (json) {
      const string = [];
      for (let i in json) {
        string.push(i + '=' + json[i]);
      }
      return string.join('&');
    },
    async querySelections (value) {
      try {
        const instance = axios.create({
          timeout: 10000,
          headers: {'Authorization': `Bearer ${this.api.token}`}
        });
        this.ending = true;
        const response = await instance.get(this.to.api.path);
        const lst = response.data.datos.grupoUno.map(item => {
          if (item.name.indexOf(value)) {
            return item;
          }
        });
        this.asyncElements = lst;
        this.ending = false;
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    aceEditorInit: function () {
      require('brace/ext/language_tools');
      require('brace/mode/html');
      require('brace/mode/javascript');
      require('brace/mode/less');
      require('brace/theme/chrome');
    },
    verificar () {
      this.$waiting(true, 'Verificando ruta espere unos segundos por favor...');
      try {
        const instance = axios.create({
          timeout: 10000,
          headers: {'Authorization': `Bearer ${this.api.token}`}
        });
        instance.get(`${this.api.path}`)
          .then((res) => {
            if (res && res.data) {
              setTimeout(() => {
                this.$waiting(false);
                this.validacionJson = JSON.stringify(res.data);
                this.$message.success('Verificación exitosa.');
              }, 1000);
            }
          })
          .catch(err => {
            this.$waiting(false);
            this.$message.error(err.message);
          });
      } catch (err) {
        this.$waiting(close);
        this.$message.error(err.message);
      }
    },
    subiendoArchivo (event) {
      if (event.target.files[0] && event.target.files[0].type === 'text/csv') {
        if (window.FileReader) {
          this.chips = [];
          const reader = new FileReader();
          reader.onload = (e) => {
            const csv = e.target.result;
            const allTextLines = csv.split(/\r\n|\n/);
            while (allTextLines.length) {
              const tmp = allTextLines.shift().split(',');
              this.chips.push(tmp[0]);
            }
            this.$message.success('Se termino de leer el archivo');
          };
          reader.readAsText(event.target.files[0]);
        } else {
          this.$message.error('Su navegador no soporta la lectura de archivos');
        }
      } else {
        this.mostrarNombreArchivo = false;
      }
    },
    remove (item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.api = (this.to.api) ? this.to.api : {};
      this.label = this.to.label;
      this.settings = this.to.settings;
      this.placeholder = this.to.placeholder;
      // Adicionando la opcion de que cuando sea comodin, este sea solo vista aunque tenga todos los permisos
      this.disabled = this.to.disabled;
      if (this.field.comodin) {
        this.disabled = this.to.disabled || !!this.field.comodin;
      }
      setTimeout(() => {
        if (this.to.isgrid) {
          this.requiredElement = false;
        }
      }, 1000);
      this.chips = (this.to.options) ? this.to.options : [];
      this.modelComponent = (this.to.value) ? this.to.value : [];
      this.field.name = (this.field && this.field.name && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
    });
  },
  components: {
    AceEditor
  }
};
</script>
<style lang="scss">
  .titleModified {
    font-weight: 700;
  }
  .tabsAutocomplete {
    margin-left: -24px;
    margin-right: -24px;
    margin-top: -24px;
  }
  .file {
    margin-top: 5px;
    width: 135px !important;
    cursor: pointer;
    &::before {
      width: 135px !important;
      height: 32px;
      font-size: 14px;
      line-height: 32px;
      content: 'Elegir Archivo';
      display: inline-block;
      background: white;
      border: 1px solid #000;
      padding: 0 10px;
      text-align: center;
    }
    &::-webkit-file-upload-button {
      width: 135px !important;
      display: none;
    }
    &::-moz-file-upload-button {
      width: 135px !important;
      display: none;
    }
    &::-ms-file-upload-button {
      width: 135px !important;
      display: none;
    }
    ~ small {
      margin-top: 5px;
      display: block;
    }
  }
  .archivoOk {
    color: green;
  }
  .archivoError {
    color: red;
  }
  .overflow {
    .input-group__selections {
      overflow: auto;
    }
  }
</style>

