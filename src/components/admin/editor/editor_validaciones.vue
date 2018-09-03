<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">check_box</v-icon> Validaciones</h3>
    <div v-if="imageIntro" class="personGuide">
      <img :src="`${$storage.get('path')}/static/images/tour${selectImage}.png`" class="imagenTour">
      <div class="mensajeInicial"> 
        <div>
          Hola, {{ diaNoche }}<br/> <strong>{{$storage.getUser().nombres}} {{$storage.getUser().primer_apellido}} {{$storage.getUser().segundo_apellido}} </strong> te ayudare explicandote como funciona esta sección del sistema  
        </div>
        <div> {{messageIntro}} </div>
      </div>
    </div>
    <v-card>
      <v-card-text>
        <crud-table
          ref="CrudTable"
          :headers="headers"
          :url="url"
          :order="order"
          :filters="filters"
          :path="property"
          :widthModal="800"
          data-step="1" :data-intro="guiaUsuario[1].mensaje"
        >

          <template slot="buttons">
            <v-tooltip bottom>
              <v-btn color="primary"
                :disabled="disabledTour"
                @click.native.stop="openModal()"
                slot="activator"
                data-step="2" :data-intro="guiaUsuario[2].mensaje">
                <v-icon>add</v-icon> {{$t('common.add') }}
              </v-btn>
              <span>{{$t('entity.add')}}</span>
            </v-tooltip>
          </template>
          <template slot="form">
            <div data-step="3" :data-intro="guiaUsuario[3].mensaje">
              <v-card-title class="headline">
                <v-layout raw wrap>
                  <v-flex xs10 sm10 md10 lg10 mt-2>
                    <v-icon>check_box</v-icon> {{ form._id ? 'Editar validación' : 'Crear validación' }}
                  </v-flex>
                  <v-flex xs2 sm2 md2 lg2 text-md-right text-lg-right>
                    <v-tooltip bottom>
                      <v-btn icon color="primary" slot="activator" @click.native="$store.commit('closeModal')" :disabled="disabledTour">
                        <v-icon color="white" class="ml-1">close</v-icon>
                      </v-btn>
                      <span>Cerrar configuración de validaciones</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-card-title>
              <v-form
                @submit.prevent="save"
                v-model="valid"
                ref="form"
                lazy-validation
                >
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-text-field
                          data-step="4" :data-intro="guiaUsuario[4].mensaje"
                          label="Nombre de la validación"
                          prepend-icon="people"
                          v-model="form.titulo"
                          maxlength="50"
                          autocomplete="off"
                          :rules="$validate(['requerido'])"
                          required
                          ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          name="descripcion"
                          data-step="5" :data-intro="guiaUsuario[5].mensaje"
                          :label="$t('entity.crud.description')"
                          prepend-icon="event_note"
                          id="descripcion"
                          required
                          v-model="form.descripcion"
                          :rules="[(val) => !!val || 'El campo descripción no puede estar vacio']"
                          maxlength="500"
                          :counter="500"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <v-text-field
                          data-step="6" :data-intro="guiaUsuario[6].mensaje"
                          name="mensajeError"
                          label="Mensaje en caso de error"
                          prepend-icon="warning"
                          :rules="[(val) => !!val || 'El campo mensaje en caso de error no puede estar vacio']"
                          required
                          id="mensajeError"
                          v-model="form.mensajeError"
                          maxlength="500"
                          :counter="500"
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
                        <v-radio-group v-model="form.validador" :mandatory="true" :column="false" data-step="7" :data-intro="guiaUsuario[7].mensaje">
                          <v-radio v-for="list in validadores" :key="list.value" :input-value="true" :label="list" :value="list"></v-radio>
                        </v-radio-group>
                      </v-flex>
                      <v-flex xs12 md12>
                        <!-- Editor Regex -->
                        <v-text-field
                          v-if="form.validador === 'regex'"
                          name="regex"
                          v-model="regExpression"
                          label="Expresión regular"
                          placeholder="Introduzca una expresión regular en este campo"
                          multi-line
                        ></v-text-field>
                        <!-- Editor de JSON -->
                        <div data-step="8" :data-intro="guiaUsuario[8].mensaje">
                          <ace-editor v-model="validacionJson" @init="aceEditorInit" lang="json" theme="chrome" width="100%" height="200" v-if="form.validador === 'validatejs'"></ace-editor>
                        </div>
                        <!--vue-json-editor v-model="validacionJson1" :show-btns="false" v-if="form.validador === 'validatejs'"></vue-json-editor-->
                        <!--vue-json-editor v-model="form.validacion" :show-btns="false" @json-change="onJsonChange"></vue-json-editor-->
                        <!-- Editor javascript -->
                        <ace-editor v-model="aceContent" @init="aceEditorInit" lang="javascript" theme="chrome" width="100%" height="200" v-if="form.validador === 'funcion'"></ace-editor>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-select
                          data-step="9" :data-intro="guiaUsuario[9].mensaje"
                          v-model="tipo"
                          label="Seleccione los componentes a los que se aplicará la nueva validación"
                          chips
                          multiple
                          required
                          autocomplete
                          :items="tiposComponente"
                          item-text="name"
                          item-value="tipo"
                          no-data-text="No existen componentes seleccionables"
                          prepend-icon="folder"
                          :rules="[(val) => !!val || 'Este campo no puede estar vacio']"
                          >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              close
                              @input="data.parent.selectItem(data.item)"
                              :selected="data.selected"
                              class="chip--select-multi"
                              :key="JSON.stringify(data.item)"
                              >
                              <!--v-icon>assignment</v-icon-->
                              {{ data.item.name }}
                            </v-chip>
                          </template>
                        </v-select>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-layout row wrap>
                    <v-flex xs12 sm12 md6 lg6>
                      <small class="error--text text-required">* Los campos son obligatorios</small>
                    </v-flex>
                    <v-flex xs12 sm12 md2 lg2 pr-2>
                      <v-btn
                        block
                        :disabled="disabledTour"
                        data-step="10" :data-intro="guiaUsuario[10].mensaje"
                        @click.native="closeModal">
                        <v-icon>cancel</v-icon> {{$t('common.cancel') }}
                      </v-btn>
                    </v-flex>
                    <v-flex xs12 sm12 md2 lg2 pr-2>
                      <v-btn
                        block
                        :disabled="disabledTour"
                        data-step="11" :data-intro="guiaUsuario[11].mensaje"
                        color="primary"
                        @click.native="showValidationTester">
                        <v-icon>check</v-icon> Probar
                      </v-btn>
                    </v-flex>
                    <v-flex xs12 sm12 md2 lg2 pr-2>
                      <v-btn
                        block
                        data-step="12" :data-intro="guiaUsuario[12].mensaje"
                        color="primary"
                        type="submit"
                        :disabled="!valid || disabledTour">
                        <v-icon>check</v-icon> {{$t('common.save') }}
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-actions>
              </v-form>
            </div>
          </template>

          <template slot="items" slot-scope="items">
            <td class="text-md-center">
              <v-tooltip bottom>
                <v-btn icon slot="activator" :disabled="disabledTour" @click="editThisItem(items.item._id)">
                  <v-icon color="teal">edit</v-icon>
                </v-btn>
                <span>Editar registro</span>
              </v-tooltip>
<!--               <v-tooltip v-if="esSuperAdmin || esAdmin" bottom>
                <v-btn icon slot="activator" :disabled="disabledTour" @click="deleteItem(items.item._id)">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar registro</span>
              </v-tooltip> -->
              <v-tooltip v-if="esSuperAdmin || esAdmin" bottom>
                <v-btn icon slot="activator" :disabled="disabledTour" @click="cloneItem(items.item._id)">
                  <v-icon color="success">filter_none</v-icon>
                </v-btn>
                <span>Clonar registro</span>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip bottom>
                <v-switch
                  :input-value="items.item.activo"
                  @change="changeVisible('validaciones/', items.item, items.item._id)"
                  slot="activator"
                  color="success"
                  :disabled="esCreadorPlantillas || disabledTour">
                </v-switch>
                <span>Activar/desactivar registro</span>
              </v-tooltip>
            </td>
            <td>{{ items.item.titulo }}</td>
            <td>{{ $filter.words(items.item.descripcion, 8) }}</td>
            <td>{{ items.item.validador }}</td>
            <td>{{ $datetime.format(items.item.updateAt, 'dd/MM/YYYY') }}</td>
            <td>
              <v-chip label color="success" text-color="white" v-if="items.item.activo == true">
                ACTIVO
              </v-chip>
              <v-chip label color="warning" text-color="white" v-if="items.item.activo == false">
                INACTIVO
              </v-chip>
            </td>
          </template>
        </crud-table>

      </v-card-text>
    </v-card>

    <v-dialog v-model="showTester" max-width="640" persistent scrollable>
      <v-card class="dialog-token">
        <v-card-title class="headline">
          <v-layout row wrap>
            <v-flex xs10 sm10 md10 lg10 mt-2>
              <v-icon>check_box</v-icon> {{ 'Probar validación' }}
            </v-flex>
            <v-flex xs2 sm2 md2 lg2 text-md-right text-lg-right text-sm-right text-xs-right>
              <v-tooltip bottom>
                <v-btn icon color="primary" slot="activator" @click.native="closeValidationTester()">
                  <v-icon class="ml-1" color="white">close</v-icon>
                </v-btn>
                <span>Cerrar ventana</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-form
          ref="formTester"
          lazy-validation
          >
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12>
                  <v-text-field
                    label="Valor de prueba"
                    prepend-icon="person"
                    v-model="inputForTest"
                    autofocus
                    :error="testError"
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 md12>
                  <div :class="testClass">
                    {{ testResult }}
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex xs12 sm12 md8 lg8>
                <small>Nota.- Pruebe la validación introducida antes de utilizarla en un documento</small>
              </v-flex>
              <v-flex xs12 sm12 md2 lg2>
                <v-btn
                  block
                  @click.native="closeValidationTester()">
                  <v-icon>cancel</v-icon> Cerrar
                </v-btn>
              </v-flex>
              <v-flex xs12 sm12 md2 lg2>
                <v-btn
                  block
                  @click.native="testValidation()"
                  color="primary">
                  <v-icon>check</v-icon> Probar
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
/* eslint no-new:0 */
/* eslint no-new-func:0 */
/* eslint valid-typeo:0 */
import introJs from 'intro.js';
import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
import validate from '@/common/mixins/validate';
import validatejs from 'validate.js';
import VueJsonEditor from 'vue-json-editor';
import AceEditor from 'vue2-ace-editor';
import guide from './guide.json';
import { mapState } from 'vuex';
import 'intro.js/introjs.css';
// import 'intro.js/themes/introjs-nassim.css';
const { SUPER_ADMIN, ADMIN, CREADOR_PLANTILLAS } = require('../../../../config');

export default {
  mixins: [ crud, validate ],
  computed: mapState({
    initTour: state => state.tour
  }),
  created () {
    this.user = this.$storage.getUser();
    this.esSuperAdmin = this.user.roles._id === SUPER_ADMIN;
    this.esAdmin = this.user.roles._id === ADMIN;
    this.esCreadorPlantillas = this.user.roles._id === CREADOR_PLANTILLAS;
    // this.validaciones = [];
    // this.getValidaciones();
    this.getPlugins();
    this.guiaUsuario = guide.pasos;
    this.selectImage = Math.floor(Math.random() * Math.floor(8));
  },
  data () {
    return {
      // validaciones: [],
      property: 'listado',
      aceContent: `function validacion(value, attributes, attributeName, options, constraints) {
  if (value.length > 0) {
    return true;
  } else {
    return { 
      inclusion: { 
        within: [''],
        message: 'No ha marcado la cantidad adecuada de opciones'
      }
    }
  }
}`,
      // aceContent: "if (value != 'Sociedad Anónima') { return { inclusion: { within: ['NADA', 'ALGO'], message: 'No es una unidad Economica Valida.' } } } return { presence: {message: 'is required when using AMEX'},length: {is: 5}};", // 'Hello World',
      regExpression: null,
      validacionJson: '{}',
      // validacionJson1: {
      //   Campo1: 'Inserte atributos aquí'
      // },
      form: {
        titulo: null,
        descripcion: null,
        mensajeError: null,
        validador: 'validatejs',
        validacion: {},
        regex: null,
        tipo: null
      },
      filters: [{
        field: 'titulo',
        label: 'titulo',
        type: 'text',
        typeG: 'String'
      }],
      url: 'validaciones',
      order: ['updateAt', 'DESC'],
      dialog: false,
      headers: [
        { text: this.$t('common.actions'), sortable: false, align: 'center' },
        { text: 'Activo', value: 'activo', sortable: false },
        { text: 'Título', value: 'titulo' },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'validador', value: 'validador' },
        { text: 'Ultima modificación', value: 'updateAt' }
      ],
      // items: [],
      valid: true,
      usuario: null,
      validadores: ['validatejs', 'regex', 'funcion'],
      tiposComponente: [],
      tipo: [],
      inputForTest: '',
      testResult: '',
      showTester: false,
      testError: false,
      testClass: 'text-xs-center',
      sw: false,
      intro: null,
      imageIntro: false,
      guiaUsuario: null,
      messageIntro: null,
      selectImage: null,
      diaNoche: null,
      disabledTour: false
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
    /**
     * @function tour
     * @description Esta para indicar al usuario como funciona esta vista
     */
    tour () {
      const _this = this;
      this.disabledTour = true;
      const time = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: true }).includes('AM');
      this.diaNoche = (time.toString().includes('AM')) ? ' buenos dias' : ' buenas tardes';
      this.imageIntro = true;
      this.sw = true;
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
        if (this._currentStep >= 2) {
          if (!document.querySelector('.dialog__content__active')) {
            _this.openModal();
          }
          setTimeout(() => {
            document.querySelector('.dialog__content__active').setAttribute('style', 'z-index: 9999999 !important');
            _this.form = {
              titulo: 'Titulo de ejemplo para la validación',
              descripcion: 'Este es un ejemplo de como debe ser la creación de la validación',
              mensajeError: 'Este es el mensaje de error que se mostrara cuando se ejecute la validacion',
              validador: 'validatejs',
              validacion: {},
              regex: null,
              tipo: []
            };
            _this.validacionJson = '{"presence" : { "message" : "Este campo de prueba no debe estar vacio." } }';
          }, 500);
        } else if (this._currentStep < 2) {
          _this.closeModal();
        } else {
          if (document.querySelector('.dialog__content__active')) {
            // document.querySelector('.dialog__content__active').setAttribute('style', 'z-index: 203 !important');
          }
        }
      });
      this.intro.oncomplete(function () {
        _this.disabledTour = false;
        _this.imageIntro = false;
        _this.closeModal();
        _this.$message.success('En buenahora terminaste de ver las indicaciones. Ahora puedes crear las tuyas.');
      });
      this.intro.onexit(function () {
        _this.disabledTour = false;
        _this.imageIntro = false;
        _this.closeModal();
      });
      this.intro.start();
    },
    /**
     * @function refresh
     * @description Esta funcion recargara la pantalla
     */
    refresh () {
      this.$store.commit('setMain', false);
      this.$nextTick(function () {
        this.$store.commit('setMain', true);
      });
    },
    async cloneItem (id) {
      try {
        // http://localhost:3000/api/v1/validaciones/duplicar/5b622dbb5cc88c0ff03307fa
        await this.$service.post(`validaciones/duplicar/${id}`);
        this.refresh();
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    openModal (data = {}, form = true) {
      // this.$refs.form.reset();
      if (data._id) {
        this.form = data;
        if (data.validador === 'regex') {
          this.regExpression = data.validacion.format.pattern;
          this.form.mensajeError = data.validacion.format.message;
        }
      } else {
        this.form = {
          titulo: null,
          descripcion: null,
          mensajeError: null,
          validador: 'validatejs',
          validacion: {}
        };
      }
      if (form) {
        this.$store.commit('openModal');
      }
    },
    async save () {
      try {
        let sw = false;
        let data;
        if (this.$refs.form.validate()) {
          data = Object.assign({}, this.form);
          if (this.tipo.length > 0) {
            if (data.validador === 'validatejs' && Object.keys(JSON.parse(this.validacionJson)).length > 0) {
              sw = true;
            }
            if (data.validador === 'regex' && this.regExpression) {
              sw = true;
            }
            if (data.validador === 'funcion' && this.aceContent) {
              sw = true;
            }
          } else {
            throw new Error('El campo de los componentes a los que se aplicará la validación no puede estar vacio');
          }
        } else {
          throw new Error('Todos los campos no pueden estar vacio');
        }
        if (sw) {
          if (data.validador === 'funcion') {
            data.validador = 'validatejs';
            data.validacion.funcion = this.aceContent.replace(/↵/g, '');
            data.validacion.funcion = data.validacion.funcion.replace(/\s\s+/g, ' ');
            data.validacion.funcion = data.validacion.funcion.substring(data.validacion.funcion.indexOf('{') + 1, data.validacion.funcion.lastIndexOf('}'));
          } else if (data.validador === 'validatejs') {
            data.validacion = JSON.parse(this.validacionJson);
          } else if (data.validador === 'regex') {
            let validRegex = this.isPatternValid(this.regExpression);
            if (!validRegex) {
              this.$message.error('La expresión regular no es válida!');
              return;
            }
            data.validacion = {
              format: {
                pattern: this.nomralizeRegExp(this.regExpression),
                flags: 'i',
                message: this.form.mensajeError ? this.form.mensajeError : 'texto no válido'
              }
            }
            ;
          }
          data.tipo = this.tipo;
          data.multiple = false; // Las validaciones de componentes complejos deberían ser cargadas junto con el componente
          if (data._id) {
            const id = data._id;
            delete data.activo;
            delete data.createAt;
            delete data.updateAt;
            delete data.deleteAt;
            delete data.deleted;
            delete data._id;
            delete data.__v;
            this.$service.put(`validaciones/${id}`, data).then((response) => {
              if (response) {
                this.$refs.CrudTable.getData();
                this.$message.success('Se actualizó el registro correctamente');
                this.closeModal();
              }
            });
          } else {
            this.$service.post('validaciones', data).then((response) => {
              if (response) {
                this.$refs.CrudTable.getData();
                this.$message.success('El registro fue agregado correctamente');
                this.closeModal();
              }
            });
          }
        } else {
          throw new Error('Para la validación seleccionada no tiene codigo');
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    getPlugins () {
      this.$service.get('plugins')
      .then(res => {
        if (res) {
          this.tiposComponente = [];
          res.listado.forEach(element => {
            let datosTipo = {
              'name': element.nombre,
              'tipo': element.component.type
            };
            this.tiposComponente.push(datosTipo);
          });
        }
      });
    },
    aceEditorInit: function () {
      require('brace/ext/language_tools'); // language extension prerequisite...
      require('brace/mode/html');
      require('brace/mode/javascript'); // language
      require('brace/mode/less');
      require('brace/theme/chrome');
    },
    isPatternValid (pattern) {
      try {
        new RegExp(pattern);
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    /*
    No se utiliza la función en mixins de crudTable dado que las rutas de validaciones tienen usos diferentes
    */
    editThisItem (id) {
      this.$service.get(`validaciones/mostrar/${id}`)
      .then(response => {
        if (response) {
          this.tipo = response.tipo;
          if (response.validador === 'validatejs') {
            if (response.validacion.hasOwnProperty('funcion')) {
              response.validador = 'funcion';
              this.aceContent = `function validacion(value, attributes, attributeName, options, constraints) {\n ${response.validacion.funcion} \n}`;
            } else {
              this.validacionJson = JSON.stringify(response.validacion, null, '\t');
            }
          } else if (response.validador === 'regex') {
            this.regExpression = response.regex;
          }
          this.openModal(response);
        }
      });
    },
    closeModal () {
      this.$refs.form.reset();
      this.$store.commit('closeModal');
    },
    async showValidationTester () {
      this.$refs.formTester.reset();
      this.showTester = true;
    },
    closeValidationTester () {
      this.testResult = null;
      this.$refs.formTester.reset();
      this.showTester = false;
    },
    testValidation () {
      try {
        let value = this.inputForTest;
        let validacion = null;
        if (this.form.validador === 'funcion') {
          let funcion = this.aceContent.replace(/↵/g, '');
          funcion = funcion.replace(/\s\s+/g, ' ');
          funcion = funcion.substring(funcion.indexOf('{') + 1, funcion.lastIndexOf('}'));
          validacion = new Function('value', 'attributes', 'attributeName', 'options', 'constraints', funcion);
        } else if (this.form.validador === 'regex') {
          let normalizedRegex = this.nomralizeRegExp(this.regExpression);
          let regexp = new RegExp(normalizedRegex);
          validacion = {
            'format': {
              'pattern': regexp,
              'message': this.form.mensajeError ? this.form.mensajeError : 'texto no válido'
            }
          };
        } else {
          validacion = JSON.parse(this.validacionJson);
        }
        // let isValid = this.$refs.formTester.validate();
        if (!this.inputForTest) {
          throw new Error('Introduzca un valor para probar su validacion.');
        }
        if (!value) {
          value = '';
        }
        let result = validatejs.single(value, validacion);
        this.testResult = result ? (result.length > 0 ? result[0] : 'El texto de prueba no ha pasado la validación') : 'El texto de prueba es válido';
        this.testError = result ? true : false;
        this.testClass = result ? 'text-xs-center error--text' : 'text-xs-center success--text';
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    nomralizeRegExp (expression) {
      if (expression.substring(0, 1) === '/') {
        expression = expression.substring(1);
      }
      if (expression.substring(expression.length - 1) === '/') {
        expression = expression.substring(0, expression.length - 1);
      }
      return expression;
    }
  },
  components: {
    CrudTable,
    VueJsonEditor,
    AceEditor
  }
};
</script>
<style lang="scss" scoped>
  .intro-modificado {
    box-sizing: content-box;
    position: absolute;
    z-index: 9999998;
    background-color: #FFF;
    background-color: rgba(255,255,255,.3) !important; 
    border: 1px solid #777;
    border: 1px solid rgba(0,0,0,.5);
    border-radius: 4px;
    box-shadow: 0 2px 15px rgba(0,0,0,.4);
    -webkit-transition: all 0.3s ease-out;
    -moz-transition: all 0.3s ease-out;
    -ms-transition: all 0.3s ease-out;
    -o-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
  }
</style>
