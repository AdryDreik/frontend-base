<template>
  <section>
    <div v-if="imageIntro" class="personGuide">
      <img :src="`${$storage.get('path')}/static/images/tour${selectImage}.png`" class="imagenTour">
      <div class="mensajeInicial"> 
        <div>
          Hola, {{ diaNoche }}<br/> <strong>{{$storage.getUser().nombres}} {{$storage.getUser().primer_apellido}} {{$storage.getUser().segundo_apellido}} </strong> te ayudare explicandote como funciona esta sección del sistema  
        </div>
        <div> {{messageIntro}} </div>
      </div>
    </div>
    <flujoModal
      ref="cmpFlujoModal"
      />
    <graph-preview ref="cmpGraphPreview" :flowData="flowData"></graph-preview>
    <h3 class="primary--text"><v-icon color="primary">timeline</v-icon> Flujos plantilla</h3>
    <v-card>
      <v-card-text>

      <crud-table
        data-step="1" :data-intro="guiaUsuario[1].mensaje"
        :headers="headers"
        :url="url"
        :filters="filters"
        :path="property"
        :order="order"
        ref = "flowCrudTable"
        :widthModal="800"
        >
         <template slot="buttons">
            <v-tooltip bottom>
              <v-btn color="primary"
                data-step="2" :data-intro="guiaUsuario[2].mensaje"
                @click.native.stop="abrirModal()"
                slot="activator">
                <v-icon>add</v-icon> {{$t('common.add') }}
              </v-btn>
              <span>{{$t('common.add')}}</span>
            </v-tooltip>
          </template>
          
          <template slot="items" slot-scope="items">
            <td class="text-md-center">
              <v-tooltip v-if="!items.item.activo && !items.item.publicado" bottom>
                <v-btn :disabled="disabledForTour" icon slot="activator" @click="editItem(items.item)">
                  <v-icon color="teal">edit</v-icon>
                </v-btn>
                <span>Editar flujo {{ items.item._id }}</span>
              </v-tooltip>
              <v-tooltip v-if="!items.item.activo && !items.item.publicado && (esSuperAdmin || esAdmin)" bottom>
                <v-btn :disabled="disabledForTour" icon slot="activator" @click="borrarItem(items.item._id)">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar flujo</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn :disabled="disabledForTour" icon slot="activator" @click="previewItem(items.item)">
                  <v-icon color="blue-grey lighten-1">remove_red_eye</v-icon>
                </v-btn>
                <span>Ver flujo actual</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn :disabled="disabledForTour" icon slot="activator" @click="cloneItem(items.item._id, 'flujos_plantilla/')">
                  <v-icon color="blue-grey darken-1">content_copy</v-icon>
                </v-btn>
                <span>Clonar flujo</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn icon slot="activator" @click.native="shareItem(items.item)">
                  <v-icon color="green">share</v-icon>
                </v-btn>
                <span>Compartir</span>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip bottom>
                <v-switch
                  :input-value="items.item.activo"
                  value
                  @change="changeVisible('flujos_plantilla/', items.item, items.item._id)"
                  slot="activator"
                  color="success"
                  :disabled="esCreadorPlantillas || disabledForTour">
                </v-switch>
                <span>Activar/desactivar flujo</span>
              </v-tooltip>
            </td>
            <td>{{ items.item.titulo }}</td>
            <td>{{ $filter.words(items.item.descripcion, 5) }}</td>
            <td>{{ $datetime.format(items.item.createAt, 'dd/MM/YYYY') }}</td>
            <td>{{ $datetime.format(items.item.updateAt, 'dd/MM/YYYY') }}</td>
     
            <td>
              <v-chip label color="success" text-color="white" v-if="items.item.publicado == true">
                PUBLICADO
              </v-chip>
              <v-chip label color="primary" text-color="white" v-if="items.item.publicado == false && items.item.activo == true">
                ACTIVO
              </v-chip>
              <v-chip label color="warning" text-color="white" v-if="items.item.publicado == false && items.item.activo == false">
                INACTIVO
              </v-chip>
            </td>
          </template>
        </crud-table>
      </v-card-text>
    </v-card>
    <!-- ESTA PARTE ES PARA EL MODAL DEL DIALOGO -->
    <v-dialog
      persistent
      v-model="dialog"
      width="900"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Configurar documento
        </v-card-title>
        <v-alert
        :value="true"
        color="primary"
      >
        <v-icon>info</v-icon> Por favor configure los campos del formulario que aparecen en la lista de abajo.
      </v-alert>
        <v-card-text>
          <v-form ref="form">
          <v-layout row wrap>
            <v-flex xs6 sm6 md6 lg6>
              <!-- <draggable v-model="documentos" :options="{group:'primerDocumento'}" @start="drag=true" @end="drag=false">
                <div v-for="(document, idx) in documentos" :key="idx">{{document.name}}</div>
              </draggable> -->
              <!-- LISTA DE LA IZQUIERDA -->
                <v-layout row wrap v-if="false">
                  <v-flex xs8 sm8 md10 lg10>
                    <v-text-field
                      color="primary"
                      v-model="buscadorComponente"
                      label="Buscar componente"
                      :autofocus="true"
                      placeholder="Por ejemplo: nombre"
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs4 sm4 md2 lg2>
                    <v-tooltip left>
                      <v-btn icon slot="activator" color="primary">
                        <v-icon>search</v-icon>
                      </v-btn>
                      <span>Click para buscar</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
                <v-list style="margin-top: -30px; margin-left: -15px">
                  <v-subheader class="primary--text"><b>Lista de todos los componentes utilizados para el documento</b></v-subheader>
                  <draggable  class="draggableElementsIzq" v-model="documentos" :options="{group:'primerDocumento'}" @start="drag=true" @end="drag=false">
                    <div v-for="(item, idx) in filteredItems" :key="idx">
                      <v-list-tile avatar v-bind:key="item.templateOptions.id" @click="">
                        <v-list-tile-avatar>
                          <v-icon color="white" :class="(item.templateOptions.validations && item.templateOptions.validations.length > 0) ? 'error' : 'success'">{{item.templateOptions.icon}}</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title v-html="item.templateOptions.id"></v-list-tile-title>
                          <v-list-tile-sub-title v-html="item.name"></v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </div>
                  </draggable>
                </v-list>
                <small class="informacionListaComponentes"><b>Nota:</b> Los componentes que estan con color rojo, significa que son obligatorios el configurarlos.</small>
              <!-- FIN DE LA COLUMNA IZQUIERDA -->
            </v-flex>
            <v-flex xs6 sm6 md6 lg6 class="pl-2">
                <!-- COLUMNA DERECHA -->
                <small><v-icon>touch_app</v-icon> Arrastre un elemento de la lista izquierda y suelte aquí. Para eliminar un elemento haga el mismo procedimiento de derecha a izquierda.</small>
                <draggable class="draggableElements" v-model="documentosConNombre" :options="{group:'primerDocumento'}" @start="drag=true" @end="drag=false" @add="addElement">
                  <template v-for="(document, idx) in documentosConNombre">
                    <v-layout row wrap :key="idx * Math.random() + 10000000">
                      <!-- MODIFICACION PARA GRILLA Y PARA PERSONA -->
                      <template v-if="document.name.indexOf('grid') !== -1 || document.name.indexOf('persona') !== -1">
                        <!-- ESTA SECCION SERA PARA GRILLA -->
                        <template v-if="document.name.indexOf('grid') !== -1">
                          <v-flex xs6 sm6 md6 lg6 class="pl-2">
                            <v-text-field
                              label="Nombre de la grilla"
                              hint="Nombre que aparecera como columna en el csv"
                              required
                              v-model=valores[document.name]
                              :rules="[(val) => !!val || 'El campo no puede estar vacio']"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6 sm6 md6 lg6>
                            <v-list>
                              <v-list-tile avatar v-bind:key="document.templateOptions.id" @click="">
                                <v-list-tile-avatar>
                                  <v-icon color="white" :class="(document.templateOptions.validations && document.templateOptions.validations.length > 0) ? 'error' : 'success'">{{document.templateOptions.icon}}</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                  <v-list-tile-title v-html="document.templateOptions.id"></v-list-tile-title>
                                  <v-list-tile-sub-title v-html="document.name"></v-list-tile-sub-title>
                                </v-list-tile-content>
                              </v-list-tile>
                            </v-list>
                          </v-flex>
                          <div class="bloqueComponenteMultiple">
                            <v-layout row wrap v-for="(subElement, indx) in document.templateOptions.columns" :key="indx">
                              <v-flex xs6 sm6 md6 lg6 class="pl-2">
                                  <v-text-field
                                    label="Sub-campo"
                                    hint="Nombre que aparecera como columna en el csv"
                                    required
                                    v-model=valoresGrillas[document.name][subElement.name]
                                    :rules="[(val) => !!val || 'El campo no puede estar vacio']"
                                  >
                                  </v-text-field>
                              </v-flex>
                              <v-flex xs6 sm6 md6 lg6>
                                  <v-list>
                                    <v-list-tile avatar v-bind:key="indx" @click="">
                                      <v-list-tile-avatar>
                                        <v-icon color="white" :class="(subElement.templateOptions.validations && subElement.templateOptions.validations.length > 0) ? 'error' : 'success'">{{subElement.templateOptions.icon}}</v-icon>
                                      </v-list-tile-avatar>
                                      <v-list-tile-content>
                                        <v-list-tile-title v-html="subElement.templateOptions.label"></v-list-tile-title>
                                        <v-list-tile-sub-title v-html="subElement.name"></v-list-tile-sub-title>
                                      </v-list-tile-content>
                                    </v-list-tile>
                                  </v-list>
                              </v-flex>
                            </v-layout>
                          </div>
                        </template>
                        <!-- ESTA SECCION SERA PARA PERSONA -->
                        <template v-else>
                          <v-flex xs6 sm6 md6 lg6 class="pl-2">
                            <v-text-field
                              label="Nombre del componente persona"
                              hint="Nombre que aparecera como columna en el csv"
                              required
                              v-model=valores[document.name]
                              :rules="[(val) => !!val || 'El campo no puede estar vacio']"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6 sm6 md6 lg6>
                            <v-list>
                              <v-list-tile avatar v-bind:key="document.templateOptions.id" @click="">
                                <v-list-tile-avatar>
                                  <v-icon color="white" :class="(document.templateOptions.validations && document.templateOptions.validations.length > 0) ? 'error' : 'success'">{{document.templateOptions.icon}}</v-icon>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                  <v-list-tile-title v-html="document.templateOptions.id"></v-list-tile-title>
                                  <v-list-tile-sub-title v-html="document.name"></v-list-tile-sub-title>
                                </v-list-tile-content>
                              </v-list-tile>
                            </v-list>
                          </v-flex>
                          <div class="bloqueComponenteMultiple">
                            <v-layout row wrap v-for="(subElement, indx) in document.templateOptions.visibles" :key="indx">
                              <v-flex xs6 sm6 md6 lg6 class="pl-2">
                                  <v-text-field
                                    label="Sub-campo"
                                    hint="Nombre que aparecera como columna en el csv"
                                    required
                                    v-model=valoresPersonas[document.name][subElement]
                                    :rules="[(val) => !!val || 'El campo no puede estar vacio']"
                                  >
                                  </v-text-field>
                              </v-flex>
                              <v-flex xs6 sm6 md6 lg6>
                                  <v-list>
                                    <v-list-tile avatar v-bind:key="indx" @click="">
                                      <v-list-tile-avatar>
                                        <v-icon color="white" class="success">{{document.templateOptions.icon}}</v-icon>
                                      </v-list-tile-avatar>
                                      <v-list-tile-content>
                                        <v-list-tile-title v-html="subElement"></v-list-tile-title>
                                        <v-list-tile-sub-title v-html="subElement"></v-list-tile-sub-title>
                                      </v-list-tile-content>
                                    </v-list-tile>
                                  </v-list>
                              </v-flex>
                            </v-layout>
                          </div>
                        </template>
                      </template>
                      <!-- FIN DE LA GRILLA Y PERSONAS -->
                      <!-- PARA LOS DEMAS CAMPOS -->
                      <template v-else>
                        <v-flex xs6 sm6 md6 lg6 class="pl-2">
                          <v-text-field
                            label="Nombre del campo"
                            hint="Nombre que aparecera como columna en el csv"
                            required
                            v-model=valores[document.name]
                            :rules="[(val) => !!val || 'El campo no puede estar vacio']"
                          >
                          </v-text-field>  
                        </v-flex>
                        <v-flex xs6 sm6 md6 lg6>
                          <v-list>
                            <v-list-tile avatar v-bind:key="document.templateOptions.id" @click="">
                              <v-list-tile-avatar>
                                <v-icon color="white" :class="(document.templateOptions.validations && document.templateOptions.validations.length > 0) ? 'error' : 'success'">{{document.templateOptions.icon}}</v-icon>
                              </v-list-tile-avatar>
                              <v-list-tile-content>
                                <v-list-tile-title v-html="document.templateOptions.id"></v-list-tile-title>
                                <v-list-tile-sub-title v-html="document.name"></v-list-tile-sub-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-list>
                        </v-flex>
                      </template>
                    </v-layout>
                  </template>
                </draggable>
            </v-flex>
          </v-layout>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="default"
            @click="cancelConfiguration"
          >
            CANCELAR
          </v-btn>
          <v-btn
            color="primary"
            @click="saveConfiguration"
          >
            CONTINUAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import introJs from 'intro.js';
import flujoModal from '@/common/util/componentes-basicos/flujo/flujoModal.vue';
import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
import validate from '@/common/mixins/validate';
import flujo from './mixins/flujo';
import graphPreview from '@/common/util/mxgraph/graphPreview.vue';
import { mapState } from 'vuex';
import draggable from 'vuedraggable';
import guide from './guide.json';
import 'intro.js/introjs.css';
const { SUPER_ADMIN, ADMIN, CREADOR_PLANTILLAS } = require('../../../../config');

export default {
  mixins: [ crud, validate, flujo ],
  computed: mapState({
    initTour: state => state.tour,
    filteredItems () {
      return this.documentos;
      // return this.documentos.filter((item) => {
      //   return item.templateOptions.label.toLowerCase().indexOf(this.buscadorComponente.toLowerCase()) !== -1 || item.templateOptions.id.toLowerCase().indexOf(this.buscadorComponente.toLowerCase()) !== -1 || item.name.toLowerCase().indexOf(this.buscadorComponente.toLowerCase()) !== -1;
      // });
    }
  }),
  created () {
    this.user = this.$storage.getUser();
    this.instituciones = [];
    this.esSuperAdmin = this.user.roles._id === SUPER_ADMIN;
    this.esAdmin = this.user.roles._id === ADMIN;
    this.esCreadorPlantillas = this.user.roles._id === CREADOR_PLANTILLAS;
    this.guiaUsuario = guide.pasos;
    this.selectImage = Math.floor(Math.random() * Math.floor(8));
  },
  data () {
    return {
      property: 'listado',
      form: {
        id: null,
        usuario: ''
      },
      filters: [{
        field: 'titulo',
        label: 'Titulo',
        type: 'text',
        typeG: 'String'
      }],
      url: 'flujos_plantilla',
      order: ['createAt', 'DESC'],
      flujosPlantilla: [],
      documentos: [],
      documentosConNombre: [],
      valores: [],
      valoresGrillas: {},
      valoresPersonas: {},
      dialog: false,
      headers: [
        { text: this.$t('common.actions'), sortable: false, align: 'center' },
        { text: this.$t('common.active'), sortable: false, value: 'activo' },
        { text: 'Titulo', value: 'titulo' },
        { text: 'Descripcion', value: 'descripcion' },
        { text: 'Fecha de creación', value: 'createAt' },
        { text: 'Fecha de edición', value: 'updateAt' }
      ],
      items: [],
      valid: false,
      usuario: null,
      flowData: {},
      imageIntro: null,
      intro: null,
      disabledForTour: false,
      messageIntro: null,
      guiaUsuario: null,
      selectImage: null,
      diaNoche: null,
      idDocumentoPlantilla: null,
      buscadorComponente: ''
    };
  },
  watch: {
    initTour (val) {
      if (val) {
        this.tour();
      }
    }
  },
  methods: {
    async saveConfiguration () {
      try {
        if (this.documentos.length === 0) {
          if (this.$refs.form.validate()) {
            this.buildJSON();
          } else {
            throw new Error('Todos los campos son requeridos.');
          }
        } else {
          throw new Error('Estimado usuario todavía tiene componentes en el lado izquierdo que aún no los ha asignado con un nombre');
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    async buildJSON () {
      try {
        // http://localhost:3000/api/v1/external/generar_template_csv/5b6370164f11a03a837beee3
        const template = [];
        for (let index = 0; index < this.documentosConNombre.length; index++) {
          const element = this.documentosConNombre[index];
          const name = element.name;
          if (name.indexOf('grid') !== -1) {
            template.push({
              label: this.valores[name],
              key: name,
              multiple: await this.getValuesSubComponent(this.valoresGrillas, name)
            });
          } else if (name.indexOf('persona') !== -1) {
            template.push({
              label: this.valores[name],
              key: name,
              multiple: await this.getValuesSubComponent(this.valoresPersonas, name)
            });
          } else {
            template.push({
              label: this.valores[name],
              key: name,
              multiple: []
            });
          }
        }
        const response = await this.$service.put(`flujos_plantilla/guardar_template/${this.idDocumentoPlantilla}`, template);
        if (response) {
          // http://localhost:3000/api/v1/flujos_plantilla/generar_template_csv/5b6381501d552b6d4c4e1c89
          window.open(`${process.env.API_URL}flujos_plantilla/generar_template_csv/${this.idDocumentoPlantilla}`);
        }
        this.dialog = false;
        this.reset();
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    cancelConfiguration () {
      this.dialog = false;
      this.reset();
    },
    reset () {
      this.documentos = [];
      this.documentosConNombre = [];
      this.valores = [];
      this.valoresGrillas = {};
      this.valoresPersonas = {};
    },
    async getValuesSubComponent (array, name) {
      const columns = array[name];
      const cols = Object.keys(columns);
      const colsObject = [];
      cols.forEach((item) => {
        colsObject.push({
          label: columns[item],
          key: item
        });
      });
      return colsObject;
    },
    addElement () {
    },
    /**
     * @function shareItem
     * @description Esta funcion se ejecutara cuando se haga click en el boton de compartir
     * @description Obtiene el primer documento del flujo y muestra sus campos para poder renombrarlos y ser utilizados
     * @description en el archivo csv
     */
    async shareItem (item) {
      try {
        let jsonServer;
        this.idDocumentoPlantilla = item._id;
        // http://localhost:3000/flujos_plantilla/componentes_template/5b6381501d552b6d4c4e1c89;
        const res = await this.$service.get(`flujos_plantilla/componentes_template/${this.idDocumentoPlantilla}`);
        if (res) {
          this.documentos = [];
          res.componentes.reduce((ant, next) => {
            const objTmp = next;
            objTmp.key = next.type;
            objTmp.value = null;
            objTmp.templateOptions.settings = false;
            ant.push(objTmp);
            return ant;
          }, this.documentos);
          jsonServer = (res.template) ? res.template : [];
        }
        if (jsonServer.length > 0) {
          this.documentosConNombre = [...this.documentos];
          this.documentos = [];
          this.documentosConNombre.forEach((item) => {
            if (item.name.indexOf('grid') !== -1) {
              const elementoGrilla = jsonServer.filter((jsn) => {
                if (jsn.key === item.name) {
                  return jsn;
                }
              });
              item.templateOptions.columns.forEach((subItem) => {
                if (!this.valoresGrillas[item.name]) {
                  this.valoresGrillas[item.name] = {};
                }
                this.valoresGrillas[item.name][subItem.name] = elementoGrilla[0].multiple.filter((jsn) => {
                  if (jsn.key === subItem.name) {
                    return jsn;
                  }
                })[0].label;
              });
            }
            if (item.name.indexOf('persona') !== -1) {
              const elementoPersona = jsonServer.filter((jsn) => {
                if (jsn.key === item.name) {
                  return jsn;
                }
              });
              item.templateOptions.visibles.forEach((subItem) => {
                if (!this.valoresPersonas[item.name]) {
                  this.valoresPersonas[item.name] = {};
                }
                this.valoresPersonas[item.name][subItem] = elementoPersona[0].multiple.filter((jsn) => {
                  if (jsn.key === subItem) {
                    return jsn;
                  }
                })[0].label;
              });
            }
            this.valores[item.name] = jsonServer.filter((jsn) => {
              if (jsn.key === item.name) {
                return item;
              }
            })[0].label;
          });
        } else {
          this.documentos.forEach((item) => {
            if (item.name.indexOf('grid') !== -1) {
              item.templateOptions.columns.forEach((subItem) => {
                this.valoresGrillas[item.name] = {
                  [subItem.name]: null
                };
              });
            }
            if (item.name.indexOf('persona') !== -1) {
              item.templateOptions.visibles.forEach((subItem) => {
                this.valoresPersonas[item.name] = {
                  [subItem]: null
                };
              });
            }
            this.valores[item.name] = null;
          });
        }
        this.dialog = true;
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    /**
     * @function tour
     */
    tour () {
      const _this = this;
      this.disabledForTour = true;
      const time = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: true }).includes('AM');
      this.diaNoche = (time) ? ' buenos dias' : ' buenas tardes';
      this.imageIntro = true;
      this.intro = introJs();
      this.intro.setOptions({
        exitOnEsc: true,
        exitOnOverlayClick: true,
        nextLabel: 'Siguiente',
        prevLabel: 'Anterior',
        skipLabel: 'Saltar',
        doneLabel: 'Salir',
        showProgress: true
      });
      this.intro.onbeforechange(function () {
        _this.messageIntro = this._introItems[this._currentStep].intro;
      });
      this.intro.oncomplete(function () {
        _this.imageIntro = false;
        _this.disabledForTour = false;
      });
      this.intro.onexit(function () {
        _this.disabledForTour = false;
        _this.imageIntro = false;
      });
      this.intro.start();
    },
    abrirModal () {
      if (!this.disabledForTour) {
        this.$refs.cmpFlujoModal.abrirConfiguracion();
      }
    },
    editItem (item) {
      this.$router.push({ name: 'Editor de Flujo', params: item });
    },
    borrarItem (itemId) {
      this.$confirm('¿Esta seguro de eliminar este flujo?', () => {
        var url = 'flujos_plantilla/' + itemId;
        this.$service.delete(url)
          .then(response => {
            if (response) {
              this.$message.success('El flujo fue eliminado correctamente');
              this.$refs.flowCrudTable.getData();
            }
          });
      });
    },
    callChangeSwitch (item) {
      var path = 'flujos_plantilla/';
      this.$refs.flowCrudTable.changeVisible(path, item, item.id);
    },
    previewItem (item) {
      if (item.base && item.base.estructura) {
        this.flowData = {
          titulo: item.titulo,
          estructura: item.base.estructura
        };
        this.$refs.cmpGraphPreview.abrirConfiguracion();
      } else {
        this.$message.warning('Este flujo no tiene una estructura válida!');
      }
    },
    getStatus (item) {
      let status = item.activo ? 'Activo' : 'Deshabilitado';
      return status;
    },
    openModal (data = {}, form = true) {
      this.valid = true;
      this.$refs.form.reset();
      if (data._id) {
        this.form = data;
        this.form.institucion = this.getValue(this.form.institucion, this.instituciones);
        console.log(this.form);
      } else {
        this.form = {
          'titulo': '',
          'descripcion': '',
          'institucion': ''
        };
      }
      if (form) {
        this.$store.commit('openModal');
      }
    },
    save () {
      if (this.$refs.form.validate()) {
        let data = Object.assign({}, this.form);
        if (data._id) {
          if (data.institucion) { data.institucion = data.institucion.value; }
          this.$service.put(`flusjos_plantilla/${data._id}`, data).then((response) => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('Se actualizó el registro correctamente');
            }
          });
        } else {
          this.$service.post('flujos_plantilla', data).then((response) => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('Se actualizó el registro correctamente');
            }
          });
        }
      }
    },
    remove (item) {
      this.form.telefonos.splice(this.form.telefonos.indexOf(item), 1);
      this.form.telefonos = [...this.form.telefonos];
    },
    descargarTodo () {
      this.$service.post(`eapostilla/descargar_entidades_docs`)
      .then(response => {
        if (response) {
          this.updateList();
          this.$message.success(`La sincronización se realizó correctamente.`);
        }
      });
    }
  },
  components: {
    flujoModal,
    CrudTable,
    graphPreview,
    draggable
  }
};
</script>
<style scoped lang="scss">
  .toolbar {
    position: relative !important;
  }
  .draggableElements {
    background: transparent;
    border: dashed 0.1em rgba($color: #000, $alpha: 0.3);
    border-radius: 10px;
    height: 98%;
  }
  .draggableElementsIzq {
    background: transparent;
    height: 98% !important;
    min-height: 500px;
  }
  .draggableElementsText {
    background: transparent;
    border: dashed 0.1em rgba($color: #000, $alpha: 0.3);
    border-radius: 10px;
    height: 100%;
    text-align: center;
    padding-top: 50%;
  }
  .informacionListaComponentes {
    position: absolute;
    bottom: 20px;
  }
  .bloqueComponenteMultiple {
    position: relative !important;
    height: 100%;
    margin: 5px 15px 8px 15px;
    border: 2px solid rgba($color: #000, $alpha: 0.5);
    &::before {
      content: '';
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid black;
      position: absolute;
      margin-top: -11px;
      right: 45%;
    }
  }

</style>

