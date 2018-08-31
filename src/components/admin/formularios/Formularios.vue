<template>
  <section>
      <v-layout raw wrap>
        <v-flex xs12 sm12 md12 lg12 v-droppable.list="agregarComponente">
          <div class="verFormulario">
            <v-tooltip bottom>
              <v-btn icon dark fab top right color="error darknet-3" slot="activator" @click.stop="generarCodigoJavascript" v-show="false">
                <v-icon>edit</v-icon>
              </v-btn>
              <span>Codigo Javascript</span>
            </v-tooltip>
            <v-tooltip max-width="200" color="primary" bottom>
              <v-btn icon dark fab top right color="info" slot="activator" @click.stop="vistaPreviaFormulario" v-show="false">
                <v-icon>remove_red_eye</v-icon>
              </v-btn>
              <span>Vista previa</span>
            </v-tooltip>
          </div>
          <div v-if="imageIntro" class="personGuide">
            <img :src="`${$storage.get('path')}/static/images/tour${selectImage}.png`" class="imagenTour">
            <div class="mensajeInicial"> 
              <div>
                Hola, {{ diaNoche }}<br/> <strong>{{$storage.getUser().nombres}} {{$storage.getUser().primer_apellido}} {{$storage.getUser().segundo_apellido}} </strong> te ayudare explicandote como funciona esta sección del sistema  
              </div>
              <div> {{messageIntro}} </div>
            </div>
          </div>
          <h4 class="primary--text text-xs-center tituloCentral"><v-icon color="primary">view_comfy</v-icon> {{ $t('forms.template') }}</h4>
          <div data-step="1" :data-intro="guiaUsuario[1].mensaje" class="headline px-4 primary--text" raw wrap>{{tituloFormulario}}</div>
          <!-- NUEVo AGRUPADOR DE  DE COMPONENTES -->
          <div class="iconsComponentes2">
            <v-tooltip bottom color="primary">
              <v-btn slot="activator" icon large color="primary white--text" @click.native="mostrarAgrupadorIconosComponentes = !mostrarAgrupadorIconosComponentes">
                <v-icon>apps</v-icon>
              </v-btn>
              <span>Ver todos los componentes</span>
            </v-tooltip>
            <v-tooltip large bottom color="success">
              <v-btn icon color="success" large slot="activator" @click.stop="mostrarAgrupadorIconosComponentes = false;dialogSaveForm = true" data-step="3" :data-intro="guiaUsuario[3].mensaje">
                <v-icon>save</v-icon>
              </v-btn>
              <span>Guardar Formulario</span>
            </v-tooltip>
            <v-tooltip bottom color="warning">
              <v-btn icon color="warning" large slot="activator" @click.native="irDocumentosPlantilla" v-show="true" data-step="4" :data-intro="guiaUsuario[4].mensaje">
                <v-icon>subdirectory_arrow_left</v-icon>
              </v-btn>
              <span>Volver</span>
            </v-tooltip>
          </div>
          <div class="nuevoAgrupadorComponentes" v-if="mostrarAgrupadorIconosComponentes">
            <v-layout row wrap>
              <v-flex xs6 sm6 md4 lg4 class="flexAgrupador text-md-center text-lg-center" v-for="element in list" :key="element.templateOptions.order" v-draggable.list="element">
                <template>
                  <v-tooltip bottom max-width="200" color="primary">
                    <v-icon large icon slot="activator" color="primary white--text">
                      {{element.templateOptions.icon}}
                    </v-icon>
                    <span class="descripcionIconosComponentes">{{element.templateOptions.descripcion}}</span>
                  </v-tooltip>
                  <div style="font-size: 13px !important">
                    {{ element.nombrePlugin.replace(/[0-9\.]/g, '')}}<br>
                    <strong><small>Versión: {{ element.version}}</small></strong>
                  </div>
                </template>
              </v-flex>
            </v-layout>
                <!-- <v-btn color="primary" icon slot="activator">
                  <v-icon>{{element.templateOptions.icon}}</v-icon>
                </v-btn>
                <span>
                  <div class="tituloIconosComponentes">
                    {{ element.type.replace(/_/ig, ' ').replace('html', '').toUpperCase() }}
                  </div>
                  <div class="descripcionIconosComponentes text-sm-justify text-md-justify text-lg-justify">
                    {{ element.templateOptions.descripcion }}  
                  </div>
                </span> -->
          </div>
          <!-- AQUI TERMINA El NUEVO AGRUPADOR DE ICONOS PARA DIBUJAR EL FORMULARIO -->
          <div v-if="false" class="bloqueFondoFixedComponentes" v-show="(fixed) ? true : false"></div>
          <div v-if="false" class="iconosComponentes" :class="fixed" v-scroll="handleScroll">
            <v-toolbar data-step="2" :data-intro="guiaUsuario[2].mensaje">
              <v-tooltip max-width="200" color="primary" bottom v-for="element in list" :key="element.templateOptions.order" v-draggable.list="element">
                <v-btn color="primary" icon slot="activator">
                  <v-icon>{{element.templateOptions.icon}}</v-icon>
                </v-btn>
                <span>
                  <div class="tituloIconosComponentes">
                    {{ element.type.replace(/_/ig, ' ').replace('html', '').toUpperCase() }}
                  </div>
                  <div class="descripcionIconosComponentes text-sm-justify text-md-justify text-lg-justify">
                    {{ element.templateOptions.descripcion }}  
                  </div>
                </span>
              </v-tooltip>
              <div class="seccionOpcionesDocumento">
                <v-tooltip max-width="200" bottom color="primary">
                  <v-btn icon color="success" slot="activator" @click.stop="dialogSaveForm = true" data-step="3" :data-intro="guiaUsuario[3].mensaje">
                    <v-icon>save</v-icon>
                  </v-btn>
                  <span>Guardar Formulario</span>
                </v-tooltip>
                <v-tooltip bottom color="primary">
                  <v-btn icon color="success" slot="activator" @click.native="irDocumentosPlantilla" v-show="true" data-step="4" :data-intro="guiaUsuario[4].mensaje">
                    <v-icon>subdirectory_arrow_left</v-icon>
                  </v-btn>
                  <span>Volver</span>
                </v-tooltip>
              </div>
            </v-toolbar>
          </div>
          <v-card class="gestorFormulario" v-if="fields.length>0">
          <grid-layout
              :layout="layout"
              :col-num="12"
              :row-height="50"
              :is-draggable="true"
              :is-resizable="true"
              :vertical-compact="true"
              :auto-size="true"
              :margin="[10, 10]"
              :use-css-transforms="true"
              @layout-updated="layoutUpdatedEvent"
            >
              <grid-item v-for="(item, idx) in this.layout" :key="idx"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                @moved="movedEvent"
                >
                <v-tooltip bottom class="eliminarComponente">
                  <v-btn icon slot="activator" @click.native="eliminarComponente(idx)">
                    <v-icon color="red">delete_forever</v-icon>
                  </v-btn>
                  <span>Eliminar componente</span>
                </v-tooltip>
              <formly-form :id="`item-${idx}`" :form="form" :all="fields" :model="model" :fields="[fields[parseInt(idx)]]"></formly-form>
              </grid-item>
            </grid-layout>
          </v-card>
          <div class="gestorFormulario seccionDnDF text-xs-center" align-center v-if="fields.length ==0" data-step="5" :data-intro="guiaUsuario[5].mensaje">
            Arrastre aquí y suelte cualquier componente que seleccione cuando haga click en el boton azul con cuadrados blancos.
          </div>
        </v-flex>
        <v-dialog
          v-model="dialog"
          max-width="1300px"
        >
          <v-card>
            <v-card-text>
              <v-layout>
                <v-flex xs12 md12 lg12 class="mt-4">
                  <!-- <preview :componentes="fields" :form="form" :model="model"></preview> -->
                </v-flex>
              </v-layout>
            </v-card-text>
            <div style="flex: 1 1 auto;"></div>
          </v-card>
        </v-dialog>
        <!-- Modal para el almacenamiento del formulario -->
        <v-form ref="form">
          <v-dialog
            v-model="dialogSaveForm"
            persistent
            max-width="500px">
            <v-card id="createDialog">
              <v-card-title>
                  <span class="headline">Datos generales del formulario</span>
              </v-card-title>
              <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                          <v-text-field 
                            id="idTituloFormulario"
                            :disabled="disabledTour"
                            v-model="tituloFormulario"
                            label="Título del formulario" 
                            required
                            :rules="[v => !!v || 'El campo no puede estar vacio']"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                  </v-container>
                  <v-container grid-list-md v-if="esSuperAdmin">
                    <v-select
                      id="idInstitucion"
                      :disabled="disabledTour"
                      :items="instituciones"
                      v-model="institucion"
                      label="Institución"
                      autocomplete
                      required
                      :rules="[v => !!v || 'El campo no puede estar vacio']"
                      >
                      </v-select>
                  </v-container>
                  <!-- PARA LOS DIAS DE VIGENCIA -->
                  <v-container>
                    <v-layout row wrap>
                      <v-flex xs3 sm3 md3 lg3 class="text-md-center text-lg-center">
                        <v-tooltip left color="error">
                          <v-btn color="error" icon slot="activator" @click="removeDays">
                            <v-icon>remove</v-icon>
                          </v-btn>
                          <span>Reducir dias</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs6 sm6 md6 lg6>
                        <v-text-field
                          id="idVigencia"
                          :disabled="disabledTour"
                          label="Vigencia"
                          v-model="vigencia"
                          :hint="`${getDate()}`"
                          :rules="[(val) => !!val || 'La vigencia no puede estar vacia']"
                          persistent-hint
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs3 sm3 md3 lg3 class="text-md-center text-lg-center">
                        <v-tooltip right color="primary">
                          <v-btn color="primary" icon slot="activator" @click="addDays">
                            <v-icon>add</v-icon>
                          </v-btn>
                          <span>Añadir dias</span>
                        </v-tooltip>
                      </v-flex>
                    </v-layout>
                  </v-container>

                  <!-- PARA LA CANTIDAD DE USO QUE LE PUEDE DAR AL DOCUMENTO -->
                  <v-container>
                    <v-layout row wrap>
                      <small>Cantidad de veces que se utilizara el formulario</small>
                      <v-flex xs12 sm12 md12 lg12 class="text-md-center text-lg-center">
                        <v-slider
                          id="idCantidad"
                          v-model="slider"
                          :disabled="disabledTour"
                          :hint="`<b>Se utilizara ${slider} veces este formulario.</b>`"
                          persistent-hint
                          prepend-icon="add_to_queue"
                          min="1"
                          color="primary"
                          max="100"
                          name="cantidad"
                        ></v-slider>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <v-container>
                    <small>Tipo de formulario</small>
                    <v-radio-group id="idTipoDocumento" v-model="tipo" required row :mandatory="false" persistent-hint hint="<b>Reporte</b>, Podrá recuperar datos de componentes que se llenaron en documentos anteriores dentro de un flujo. Una vez usado en este flujo no podrá usarse en otros mientras que <b>Formulario</b> es para el llenado de datos">
                      <v-radio label="Reporte" value="R" color="primary" :disabled="$route.query.id || disabledTour ? true : false"></v-radio>
                      <v-radio label="Formulario" value="D" color="primary" :disabled="$route.query.id || disabledTour ? true : false"></v-radio>
                    </v-radio-group>
                  </v-container>
                  <small style="color: red">*Los campos marcados con asterisco son requeridos.</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="default" id="idCancelar" :disabled="disabledTour" @click.native="modalSaveForm(false)">Cancelar</v-btn>
                <v-btn color="primary" id="idCrearFormulario" :disabled="disabledTour" @click.native="modalSaveForm(true)">{{ fields.length > 0 || $route.query.id ? 'Guardar Formulario' : 'Crear Formulario' }}</v-btn>
            </v-card-actions>
            </v-card>
            </v-dialog>
        </v-form>
        <!-- Aqui termina el modal -->
        <!-- EDITOR JAVASCRIPT -->
        <div id="editorJs" v-show="editor" class="editor">
          <div class="ocultarEditor" row>
            <v-tooltip bottom>
              <v-btn icon color="white" slot="activator" @click="ocultarEditor">
                <v-icon>format_clear</v-icon>
              </v-btn>
              <span>Ocultar editor</span>
            </v-tooltip>
          </div>
          <v-layout class="spaceTop">
            <v-flex md12 xs12 lg12>
              seccion del código...
            </v-flex>
          </v-layout>
        </div>
      </v-layout>
  </section>
</template>

<script>
/**
 * @name Formularios.vue
 * @description Archivo utilizado para graficar los documentos plantilla
 * @description NOTA: Los atributos importantes son model, form, field para el formly
 */
import introJs from 'intro.js';
import formulario from './mixins/formulario';
import {GridLayout, GridItem} from 'vue-grid-layout';
import guide from './guide.json';
import guide2 from './guide2.json';
import { mapState } from 'vuex';
import 'intro.js/introjs.css';
const { SUPER_ADMIN } = require('../../../../config');
export default {
  mixins: [ formulario ],
  computed: mapState({
    initTour: state => state.tour
  }),
  created () {
    // window.addEventListener('scroll', this.handleScroll);
    this.user = this.$storage.getUser();
    this.esSuperAdmin = this.user.roles._id === SUPER_ADMIN;
    this.instituciones = [];
    this.getInstituciones();
    this.guiaUsuario = guide.pasos;
    this.selectImage = Math.floor(Math.random() * Math.floor(8));
    /**
     * @description Esta condicional verifica si existe un parametro en la url, en particular
     * @description la variable id, ejemplo documentos_plantilla?id=5ac2ab524db4c77c9bdd779e
     * @description si existe volvera a graficar el documento plantilla
     */
    if (this.$route && this.$route.query && this.$route.query.id) {
      this.$waiting(true, 'Se estan cargando los componentes necesarios para el formulario, espere unos segundos por favor');
      this.$service.get(`documentos_plantilla/${this.$route.query.id}`)
      .then((res) => {
        if (res) {
          this.getPlugins(res.tipoComponentes);
          this.layout = res.body.posicion;
          this.tipo = res.tipoComponentes;
          this.tituloFormulario = res.titulo;
          this.institucion = res.institucion;
          this.fields = res.body.componentes;
          this.vigencia = (res.vigencia && res.vigencia.tiempo) ? res.vigencia.tiempo : null;
          this.slider = (res.vigencia && res.vigencia.usos) ? res.vigencia.usos : 1;
        } else {
          this.layout = [];
          this.tituloFormulario = '';
          this.fields = [];
        }
        this.$waiting(false);
      })
      .catch((err) => this.$message.error(err.message));
    } else {
      this.dialogSaveForm = true;
    }
  },
  data () {
    return {
      editor: false,
      list: [],
      form: {},
      model: {},
      dialog: null,
      dialogSaveForm: null,
      tituloFormulario: null,
      institucion: null,
      fields: [],
      selected: null,
      layout: [],
      vista: 'mitad',
      offsetTop: 0,
      fixed: null,
      tipo: 'D',
      listPlugins: [],
      vigencia: null,
      slider: null,
      intro: null,
      imageIntro: false,
      messageIntro: null,
      guiaUsuario: null,
      selectImage: null,
      diaNoche: null,
      disabledTour: false,
      mostrarAgrupadorIconosComponentes: false
    };
  },
  watch: {
    initTour (val) {
      if (val) {
        if (this.$route && this.$route.query && this.$route.query.id) {
          this.tour();
        } else {
          this.tour(5);
        }
      }
    }
  },
  methods: {
    /*
     * @function tourAddComponent
     * @description Esta es la adicion de components para mostrar visualmente en la guia al usuario
     */
    tourAddComponent (dom, objThis) {
      dom.templateOptions.settings = true;
      objThis.selected = dom;
      const nameSearch = dom.type.replace('_html', '').replace('_', ' ');
      const findElement = objThis.listPlugins.filter((item) => {
        if (item.nombre === nameSearch) {
          return item;
        }
      }).shift();
      if (findElement) {
        dom.templateOptions.proxy = {
          headers: (findElement.headers) ? findElement.headers : null,
          urlBase: (findElement.urlBase) ? findElement.urlBase : null,
          idPlugin: (findElement._id) ? findElement._id : null
        };
      }
      objThis.fields.push(dom);
      let calculandoRestante = 0;
      if (objThis.layout.length > 0) {
        calculandoRestante = 6 - parseInt(objThis.layout[objThis.layout.length - 1].x);
        calculandoRestante = (calculandoRestante === 6) ? calculandoRestante : 0;
      } else {
        calculandoRestante = 0;
      }
      objThis.layout.push({
        x: calculandoRestante,
        y: 0,
        w: 6,
        h: 2,
        i: (objThis.layout.length === 0) ? '0' : (parseInt(objThis.layout[objThis.layout.length - 1].i) + 1).toString()
      });
    },
    /*
     * @function tour
     */
    tour (number) {
      const _this = this;
      this.disabledTour = true;
      this.imageIntro = true;
      const time = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: true }).includes('AM');
      this.diaNoche = (time) ? ' buenos dias' : ' buenas tardes';
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
        if (document.querySelector('.dialog__content__active')) {
          document.querySelector('.dialog__content__active').setAttribute('style', 'z-index: 203 !important');
        }
        _this.disabledTour = false;
        _this.imageIntro = false;
      });
      this.intro.onexit(function () {
        if (document.querySelector('.dialog__content__active')) {
          document.querySelector('.dialog__content__active').setAttribute('style', 'z-index: 203 !important');
        }
        _this.disabledTour = false;
        _this.imageIntro = false;
      });
      if (!number) {
        this.intro.start();
      } else {
        this.intro.addStep({
          element: document.querySelector('#createDialog'),
          intro: guide2.pasos[1].mensaje,
          position: 'right'
        });
        this.intro.addStep({
          element: document.querySelector('#idTituloFormulario'),
          intro: guide2.pasos[2].mensaje,
          position: 'left'
        });
        this.intro.addStep({
          element: document.querySelector('#idInstitucion'),
          intro: guide2.pasos[3].mensaje,
          position: 'right'
        });
        this.intro.addStep({
          element: document.querySelector('#idVigencia'),
          intro: guide2.pasos[4].mensaje,
          position: 'left'
        });
        this.intro.addStep({
          element: document.querySelector('#idCantidad'),
          intro: guide2.pasos[5].mensaje,
          position: 'right'
        });
        this.intro.addStep({
          element: document.querySelector('#idTipoDocumento'),
          intro: guide2.pasos[6].mensaje,
          position: 'left'
        });
        this.intro.addStep({
          element: document.querySelector('#idCancelar'),
          intro: guide2.pasos[7].mensaje,
          position: 'right'
        });
        this.intro.addStep({
          element: document.querySelector('#idCrearFormulario'),
          intro: guide2.pasos[8].mensaje,
          position: 'left'
        });
        document.querySelector('.dialog__content__active').setAttribute('style', 'z-index: 9999999 !important');
        this.intro.start();
      }
    },
    getDate () {
      const year = parseInt(this.vigencia / 365);
      let days = parseInt(this.vigencia - (365 * year));
      let months;
      if (days > 30) {
        months = parseInt(days / 30);
        days = parseInt(days - (30 * months));
      } else {
        months = 0;
      }
      return `<b>Tiempo:</b> ${(year === 1) ? `${year} año` : `${year} años`}, ${(months === 1) ? `${months} mes` : `${months} meses`} y ${days} dias`;
    },
    /**
     * [removeDays description]
     * @return {[none]} [No retornara nada]
     */
    removeDays () {
      if (parseInt(this.vigencia) > 0) {
        this.vigencia --;
      }
    },
    /**
     * @function addDays
     * @description Esta funcion incrementara el numero de dias
     */
    addDays () {
      this.vigencia ++;
    },
    /**
     * @description Se consulta la api plugins para obtener todos los componentes disponibles
     * @description y esto se reflejara en la lista de elementos con los cuales puedes formar
     * @description tu documento plantilla.
     * @param {char} tipoDocumento R, D R = Reporte, D = Documento
     */
    async getPlugins (tipoDocumento) {
      try {
        const res = await this.$service.get('plugins');
        if (res) {
          this.list = [];
          this.listPlugins = res.listado;
          this.model = {};
          this.list = res.listado.reduce((a, b) => {
            const obj = b.component;
            obj.version = b.version;
            obj.nombrePlugin = b.nombre;
            if (tipoDocumento === 'D') {
              if (!b.component.type.includes('comodin')) {
                a.push(obj);
                this.model[b.component.type] = '';
              }
            } else {
              a.push(obj);
              this.model[b.component.type] = '';
            }
            return a;
          }, []);
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    /**
     * @function handleScroll
     * @description Redireccionara a la lista de documentos plantilla
     */
    handleScroll (event) {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop;
      if (this.offsetTop > 50) {
        this.fixed = 'siFixed';
      } else {
        this.fixed = null;
      }
    },
    /**
     * @function irDocumentosPlantilla
     * @description Redireccionara a la lista de documentos plantilla
     */
    irDocumentosPlantilla () {
      this.$router.push('documentos_plantilla');
    },
    /**
     * @function movedEvent
     * @argument {e} Event
     * @description Capturara el evento de mover de los elementos del formulario
     */
    movedEvent (e) {},
    /**
     * @function modalSaveForm
     * @argument {option} Boolean valor para realizar acciones.
     * @description Guardar y realizar acciones con el formulario que se creara
     */
    async modalSaveForm (option) {
      try {
        if (option) {
          if (this.$refs.form.validate()) {
            const path = 'documentos_plantilla';
            if (this.$route && this.$route.query && this.$route.query.id) {
              this.$service.put(`${path}/${this.$route.query.id}`, await this.documentoPlantilla())
              .then((res) => {
                if (res) {
                  this.$message.success('Formulario exitosamente actualizado');
                }
              })
              .catch((err) => this.$message.error(err.message));
            } else {
              this.$service.post(`${path}`, await this.documentoPlantilla())
              .then((res) => {
                if (res) {
                  this.$message.success('Formulario exitosamente guardado');
                  this.redirectForm(res._id);
                }
              })
              .catch((err) => this.$message.error(err.message));
            }
            this.dialogSaveForm = false;
            this.irDocumentosPlantilla();
          } else {
            this.dialogSaveForm = true;
            this.$message.error('Faltan campos por llenar');
          }
        } else if (this.fields.length === 0 && typeof this.$route.query.id === 'undefined') {
          this.irDocumentosPlantilla();
        } else {
          this.dialogSaveForm = false;
        }
      } catch (err) {
        this.dialogSaveForm = false;
        this.$message.error(err.message);
      }
    },
    redirectForm (id) {
      if (id) {
        this.$router.push({
          path: 'formularios',
          query: {id: id}
        });
      }
    },
    /**
     * @function getValidations
     * @description Esta funcion esta encargada de generar las validaciones
     * @param {none}
     */
    async getValidations () {
      try {
        const ant = [];
        for (let next of this.fields) {
          if (next.name.includes('grid')) {
            const infoPlugin = this.listPlugins.filter((item) => {
              if (next.nombrePlugin.includes(item.nombre.toLowerCase().replace(/\s/g, '_')) || next.name.includes(item.nombre.toLowerCase().replace(/\s/g, '_'))) {
                return item;
              }
            });
            const v = [];
            for (let collection of next.templateOptions.columns) {
              const obj = {};
              if (collection && collection.templateOptions) {
                const cont = [];
                for (let elem of collection.templateOptions.validations) {
                  const tmpObj = elem;
                  if (tmpObj) {
                    if (!tmpObj.idComponente) {
                      tmpObj.idComponente = '';
                    }
                    tmpObj.idComponente = (collection.templateOptions.id) ? collection.templateOptions.id : null;
                    cont.push(tmpObj);
                  }
                }
                obj[collection.name] = cont;
              }
              v.push(obj);
            }
            ant.push({
              [next.name]: v,
              idPlugin: (infoPlugin[0]) ? infoPlugin[0]._id : null
            });
          } else if (next.name.includes('persona')) {
            const infoPlugin = this.listPlugins.filter((item) => {
              if (next.name.includes(item.nombre.toLowerCase().replace(/\s/g, '_'))) {
                return item;
              }
            });
            const v = [];
            for (let elem of next.templateOptions.validations) {
              const obj = {};
              obj[elem.idComponente] = [{id: elem.id, idComponente: elem.idComponente, titulo: elem.titulo}];
              // const tmpObj = elem;
              // tmpObj.idComponente = (elem.idComponente) ? elem.idComponente : null;
              // obj[elem.idComponente] = [{id: elem.id, idComponente: elem.idComponente, titulo: elem.titulo}];
              v.push(obj);
            }
            ant.push({
              [next.name]: v,
              idPlugin: (infoPlugin[0]) ? infoPlugin[0]._id : null
            });
          } else {
            const infoPlugin = this.listPlugins.filter((item) => {
              if (next.nombrePlugin.includes(item.nombre.toLowerCase().replace(/\s/g, '_')) || next.name.includes(item.nombre.toLowerCase().replace(/\s/g, '_'))) {
                return item;
              }
            });
            const v = [];
            for (let elem of next.templateOptions.validations) {
              const tmpObj = elem;
              if (tmpObj) {
                if (!tmpObj.idComponente) {
                  tmpObj.idComponente = '';
                }
                tmpObj.idComponente = (next.templateOptions.id) ? next.templateOptions.id : '';
              }
              v.push(elem);
            }
            ant.push({
              [next.name]: v,
              idPlugin: (infoPlugin[0]) ? infoPlugin[0]._id : null
            });
          }
        }
        return ant;
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    /**
     * @function documentoPlantilla
     * @argument {none}
     * @description Funcion encargada de generar un esquema de documento plantilla para el backend
     * @description NOTA: tipo=F, significa (Formulario)
     */
    async documentoPlantilla () {
      try {
        const docPlt = {
          titulo: this.tituloFormulario,
          version: 1,
          tipo: 'F',
          uso: false,
          vigencia: {
            tiempo: this.vigencia, // El tiempo se expresa en dias, si esta vacio, no tiene limite de tiempo
            usos: this.slider // Se determina cuantos usos puede hacer de un documento. si esta vacio, no tiene limite de usos
          },
          tipoComponentes: this.tipo,
          // institucion: (this.user.roles._id === '000000000000000000000222') ? this.institucion : this.user.institucion._id,
          institucion: this.esSuperAdmin ? this.institucion : this.user.institucion._id,
          body: {
            componentes: this.fields,
            validacion: await this.getValidations(),
            posicion: this.layout
          }
        };
        return docPlt;
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    /**
     * @function ocultarEditor
     * @argument {none}
     * @description Se pensaba crear como un editor de codigo para embeber js
     */
    ocultarEditor () {
      this.editor = false;
    },
    /**
     * @function generarCodigoJavascript
     * @argument {none}
     * @description Funcion pensada en crear codigo javascript, utilizarlo de flag, etc
     */
    generarCodigoJavascript () {
      this.editor = !this.editor;
    },
    /**
     * @function vistaPreviaFormulario
     * @argument {none}
     * @description Vista previa del formulario, pero se necesita el componente vista-previa
     */
    vistaPreviaFormulario () {
      this.dialog = true;
      this.fields.push({});
      this.fields.pop();
      this.fields = [...this.fields];
    },
    /**
     * @function eliminarComponente
     * @argument {index} Integer Indice del objeto u componente
     * @description Eliminara con un mensaje de configuracion el elemento seleccionado
     */
    eliminarComponente (index) {
      this.$confirm('¿Esta seguro de eliminar el componente?', () => {
        const obj = this.fields[parseInt(index)];
        this.fields.splice(this.fields.indexOf(obj), 1);
        this.layout.splice(index, 1);
      });
    },
    detectElementMove (item) {
      const element = document.querySelector(`#item-${item}`);
      element.addEventListener('mousemove', () => {
        if (element.parentNode.className.includes('vue-draggable-dragging')) {
          element.parentNode.className += (element.parentNode.className.includes('specialDragging')) ? '' : ' specialDragging';
        }
      }, false);
    },
    /**
     * @function agregarComponente
     * @argument {dom} Object Objecto con todas las propiedades necesarias para crear un componente
     * @description Agregara un componente al lienzo del documento plantilla
     * @description Para los layouts se utilizo la medida 1h = 60px
     */
    agregarComponente (dom) {
      if (this.vista === 'mitad') {
        this.mostrarAgrupadorIconosComponentes = false;
        if (dom) {
          dom = JSON.parse(dom);
          dom.templateOptions.settings = true;
          this.selected = dom;
          const nameSearch = dom.type.replace('_html', '').replace('_', ' ');
          const findElement = this.listPlugins.filter((item) => {
            if (item.nombre === nameSearch) {
              return item;
            }
          }).shift();
          if (findElement) {
            dom.templateOptions.proxy = {
              headers: (findElement.headers) ? findElement.headers : null,
              urlBase: (findElement.urlBase) ? findElement.urlBase : null,
              idPlugin: (findElement._id) ? findElement._id : null
            };
          }
          this.fields.push(dom);
          let calculandoRestante = 0;
          if (this.layout.length > 0) {
            calculandoRestante = 6 - parseInt(this.layout[this.layout.length - 1].x);
            calculandoRestante = (calculandoRestante === 6) ? calculandoRestante : 0;
          } else {
            calculandoRestante = 0;
          }
          this.layout.push({
            x: calculandoRestante,
            y: 0,
            w: 6,
            h: 2,
            i: (this.layout.length === 0) ? '0' : (parseInt(this.layout[this.layout.length - 1].i) + 1).toString()
          });
          setTimeout(() => {
            this.detectElementMove(this.layout.length - 1);
          }, 500);
        }
      } else if (this.vista === 'normal') {
        if (dom) {
          dom = JSON.parse(dom);
          dom.templateOptions.settings = true;
          this.selected = dom;
          this.fields.push(dom);
          this.layout.push({
            x: 0,
            y: 0,
            w: 12,
            h: 2,
            i: (this.layout.length === 0) ? '0' : (parseInt(this.layout[this.layout.length - 1].i) + 1).toString()
          });
        }
      }
    },
    /**
     * @function layoutUpdatedEvent
     * @argument {newlayout} Array Array de todos los elementos que componen el lienzo
     * @description layout Actualizado cuando se realiza una accion con sus elementos internos
     */
    layoutUpdatedEvent (newlayout) {}
  },
  components: {
    GridLayout,
    GridItem
  }
};
</script>
<style src='./formularios.scss' lang='scss'></style>
