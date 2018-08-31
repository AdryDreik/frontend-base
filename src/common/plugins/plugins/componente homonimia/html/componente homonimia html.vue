<template>
  <v-card flat>
    <v-card-text>
        <v-container>
          <v-form ref="formularioHomonimia">
          <v-layout row wrap>
            <v-flex xs12 sm12 md4 lg4>
              <span class="tituloHomonimia">Seleccione tipo de unidad económica (*)</span>
              <!-- SELECCIONE TIPO DE UNIDAD ECONOMICA -->
              <v-select
              class="pr-3"
              :items="aUnidadesEconomicas"
              autocomplete
              placeholder="Por favor seleccione una unidad económica"
              item-value="mUnidadEconomica"
              v-model="mUnidadEconomica"
              required
              :disabled="disabled"
              :rules="[(val) => !!val || 'El campo de unidad economica no puede estar vacio']"
              item-text="valor"
              label="Seleccione una unidad económica"
              @change="selectUnidadEconomica"
            ></v-select>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <!-- Pais de Origen -->
              <span class="tituloHomonimia">Pais de Origen (*)</span>
              <v-select
              :items="aPaises"
              class="pr-3"
              autocomplete
              placeholder="Por favor seleccione un pais de origen"
              v-model="mPaises"
              required
              :disabled="disabled"
              :rules="[(val) => !!val || 'El campo pais de origen no puede estar vacio']"
              label="Pais de origen"
              @change="selectPais"
            ></v-select>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <!-- Origen de Capital -->
              <span class="tituloHomonimia">Origen de Capital (*)</span>
              <v-select
              :items="aOrigenCapital"
              autocomplete
              placeholder="Por favor seleccione un origen capital"
              v-model="mOrigenCapital"
              required
              :disabled="disabled"
              :rules="[(val) => !!val || 'El campo de origen de capital no puede estar vacio']"
              item-text="name"
              label="Origen de capital"
            ></v-select>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <!-- Página Web -->
              <span class="tituloHomonimia">Página Web</span>
              <v-text-field
              class="pr-3"
              :disabled="disabled"
              placeholder="Por ejemplo: http://www.agetic.gob.bo.com"
              v-model="mPaginaWeb"
              label="Página Web"
            ></v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <!-- Duración de la sociedad -->
              <span class="tituloHomonimia">Duración de la sociedad</span>
              <v-menu
                lazy
                :close-on-content-click="false"
                v-model="fechaMenuDuracionSociedad"
                transition="scale-transition"
                offset-y
                full-width
                :disabled="disabled"
                :nudge-right="40"
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Duración de la sociedad"
                  v-model="mDuracionSociedad"
                  :disabled="disabled"
                  prepend-icon="event"
                  @blur="parseDate(mDuracionSociedad)"
                ></v-text-field>

                <v-date-picker 
                  v-model="date" 
                  @input="mDuracionSociedad = formatDate($event)" 
                  no-title 
                  scrollable
                  locale="es"
                >
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 class="text-md-left" v-if="multiple">
              <v-tooltip bottom>
                <v-btn icon :disabled="disabled" slot="activator" color="success" @click.prevent="addActivities">
                  <v-icon>add</v-icon>
                </v-btn>
                <span>Añadir otra actividad económica</span>
              </v-tooltip>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12>
              <!-- clasificador de actividades economicas -->
              <v-layout row wrap>
                <div v-for="(elem, idx) in actividadesEconomicas" :key="idx" class="bloqueActividadSeleccionada">
                  <v-flex xs12 sm12 md12 lg12>
                    <v-select
                      :disabled="disabled"
                      :ref="`actividad_economica_${idx}`"
                      v-model="elem.actividad"
                      :class="(multiple) ? 'pr-5':''"
                      id="suggest-homonimia"
                      placeholder="Seleccione una actividad económica"
                      label="Seleccione una actividad económica"
                      autocomplete
                      :loading="loading"
                      required
                      :max-height=500
                      no-data-text="No existen actividades económicas que listar"
                      item-text="name"
                      :items="items[idx]"
                      @keyup="setIndex(idx)"
                      @keyup.enter="selectItem(idx)"
                      :rules="[(val) => !!val || 'Tiene que seleccionar una actividad económica']"
                      :search-input.sync="search"
                      @input="selectItem(idx)"
                    ></v-select>
                  </v-flex>
                  <v-tooltip left class="eliminarActividadEconomica" v-if="multiple" color="error">
                    <v-btn :disabled="disabled" icon slot="activator" color="error" @click.prevent="removeActivities(idx)">
                      <v-icon>delete_forever</v-icon>
                    </v-btn>
                    <span>Eliminar ctividad económica</span>
                  </v-tooltip>
                  <!-- informacion extra de la seleccion -->
                  <v-flex xs12 sm12 md12 lg12 v-if="elem.actividad" :class="(multiple) ? 'pr-5' : ''">
                    <v-alert
                      class="successAlert"
                      outline
                      :value="true"
                      type="info"
                    >
                      <strong>Grupo:</strong> {{elem.actividad.name}}<br>
                      <strong>Código CAEB:</strong> {{elem.actividad.clave}}<br>
                      <strong>Actividad Económica:</strong> {{elem.actividad.name}}<br>
                    </v-alert>
                    <!-- Fecha inicio de la actividad -->
                    <v-menu
                      lazy
                      :close-on-content-click="false"
                      v-model="fechaMenuClasificador[idx]"
                      transition="scale-transition"
                      offset-y
                      :disabled="disabled"
                      full-width
                      :nudge-right="40"
                      max-width="290px"
                      min-width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        label="Fecha de inicio de actividad"
                        v-model="elem.actividad.fechaClasificador"
                        prepend-icon="event"
                        :disabled="disabled"
                        @blur="parseDate(elem.actividad.fechaClasificador)"
                      ></v-text-field>

                      <v-date-picker 
                        v-model="date" 
                        @input="elem.actividad.fechaClasificador = formatDate($event)" 
                        no-title 
                        scrollable
                        locale="es"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12 v-if="elem.actividad" :class="(multiple) ? 'pr-5' : ''">
                    <v-alert
                      class="successAlert"
                      outline
                      :value="true"
                      type="info"
                    >
                      {{elem.actividad.incluye}}
                    </v-alert>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg12 v-if="elem.actividad" :class="(multiple) ? 'pb-4 pr-5' : ''">
                    <v-alert v-if="elem.actividad.excluye.length > 5"
                      outline
                      :value="true"
                      type="error"
                    >
                      {{elem.actividad.excluye}}
                    </v-alert>
                  </v-flex>
                </div>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <!-- Ambito de accion -->
              <span class="tituloHomonimia">Ambito de accion (*)</span>
              <v-select
              :disabled="disabled"
              class="pr-3"
              :items="aAmbitoAccion"
              autocomplete
              placeholder="Por favor seleccione un ambito de acción"
              v-model="mAmbitoAccion"
              required
              :rules="[(val) => !!val || 'El campo de ambito de acción no puede estar vacio']"
              item-text="name"
              label="Ambito de acción"
            ></v-select>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <!-- Participacion en otras sociedades comerciales -->
              <span class="tituloHomonimia">Participación en otras sociedades comerciales (*)</span>
              <v-switch
                :disabled="disabled"
                color="primary"
                label="si/no"
                v-model="mParticipacionSociedadesComerciales"
              >
              </v-switch>
            </v-flex>
            <v-flex xs12 sm12 md8 lg8>
              <!-- Objeto Social -->
              <span class="tituloHomonimia">Objeto Social (*)</span>
              <v-text-field
               :disabled="disabled"
                id="auto-grow"
                v-model="mObjetoSocial"
                label="Objeto Social"
                color="primary darken-2"
                placeholder="Señalar la actividad(es) a la que se dedica la Unidad Económica de forma precisa y determinada..."
                required
                :rules="[(val) => !!val || 'El campo objeto social no puede estar vacio']"
                multi-line
                @keyup.enter="calculateHeight"
                @keyup.delete="calculateHeight"
                @keyup="calculateHeight"
                @keydown="calculateHeight"
                :rows="numeroFilas"
                @change="calculateHeight"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <!-- Fecha de cierre de gestion fiscal -->
              <span class="tituloHomonimia">Fecha de cierre de gestion fiscal (*)</span>
              <v-menu
                lazy
                :close-on-content-click="false"
                v-model="fechaMenuCierreFiscal"
                transition="scale-transition"
                :disabled="disabled"
                offset-y
                full-width
                :nudge-right="40"
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Duración de la sociedad"
                  v-model="mDuracionSociedadCierreFiscal"
                  :disabled="disabled"
                  prepend-icon="event"
                  @blur="parseDate(mDuracionSociedadCierreFiscal)"
                ></v-text-field>

                <v-date-picker 
                  v-model="date" 
                  @input="mDuracionSociedadCierreFiscal = formatDate($event)" 
                  no-title 
                  scrollable
                  locale="es"
                >
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs12 sm12 md8 lg8>
              <!-- Razon Social -->
              <span class="tituloHomonimia">Nombre, Razón Social o denominación (*)</span>
              <v-text-field
                :disabled="disabled || usarNombre"
                class="pr-3"
                required
                placeholder="Escriba el nombre, razón social o denominación..."
                :rules="[(val) => !!val || 'El campo de razón social no puede estar vacio']"
                label="Razón Social"
                v-model="mRazonSocial"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4 v-if="hideTerminacion">
              <!-- Terminaciones -->
              <span class="tituloHomonimia">Teminación (*)</span>
              <v-select
                :disabled="disabled"
                required
                autocomplete
                :items="aTerminacion"
                item-text="name"
                placeholder="Seleccione una terminación"
                :rules="[(val) => !!val || 'El campo de terminación no puede estar vacio']"
                label="Terminación"
                v-model="mTerminacion"
              >
              </v-select>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 v-if="mRazonSocial">
               <v-alert
                class="successAlert display-1"
                :value="true"
                outline
                type="info"
              >
                <strong>Vista previa nombre, razón social o denominación:</strong><br>{{mRazonSocial}} {{mTerminacion ? mTerminacion.name : ''}}
              </v-alert>
            </v-flex>
            <v-flex xs12 sm12 md8 lg8>
              <!-- Rotulo Comercial -->
              <span class="tituloHomonimia">Rotulo Comercial</span>
              <v-text-field
                :disabled="disabled"
                class="pr-3"
                placeholder="Escriba algún rotulo comercial"
                label="Rotulo Comercial"
                v-model="mRotuloComercial"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <!-- Terminaciones -->
              <span class="tituloHomonimia">Sigla</span>
              <v-text-field
                :disabled="disabled"
                placeholder="Escriba alguna sigla"
                label="Sigla"
                v-model="mSigla"
              >
              </v-text-field>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 class="text-md-right text-lg-right">
              <v-btn
               :disabled="disabled"
               color="primary"
               @click.prevent="consultarHomonimia"
              >
              Consultar
              </v-btn>
            </v-flex>
            <!-- RESULTADOS DE LA BUSQUEDA CUANDO NO SEA VALIDO EL NOMBRE  -->
            <v-flex xs12 sm12 md12 lg12 v-if="!responseConsultaHomonimia.nombreValido">
              <v-alert
                class="successAlert"
                :value="true"
                type="error"
              >
                El nombre no puede ser utilizado
              </v-alert>
              <small>Coincidencias para <strong>{{mRazonSocial}}</strong></small>
              <v-layout row wrap>
                <v-flex xs12 sm12 md12 lg12 class="pl-4">
                  <ul>
                    <li v-for="(elem, idx) in responseConsultaHomonimia.datos[1].empresa.hits.hits" :key="idx">
                      {{elem._source.nombre}}
                    </li>
                  </ul>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 v-if="mCorreoElectronicoActivar">
              <v-alert
                class="successAlert"
                :value="true"
                type="success"
              >
                El nombre puede ser utilizado
              </v-alert>
              <v-text-field
               class="mt-3"
               label="Correo Electrónico"
               v-model="mCorreoElectronico"
               required
               :rules="[(val) => !!val || 'El campo correo electrónico no puede estar vacio']"
              ></v-text-field>
            </v-flex>
          </v-layout>
          </v-form>
        </v-container>
        <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
              <v-btn icon slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">COMPONENTE HOMONIMIA</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout row wrap>
                      <v-flex xs12 sm12 md12 lg12>
                        <strong>Configuración del clasificador económico:</strong>
                        <v-checkbox class="mt-3" color="primary" label="¿Permitir ser mútiple al clasificador de actividades?" v-model="multiple"></v-checkbox>
                        <v-text-field
                          label="Url para la busqueda de actividades"
                          v-model="urlBusquedaClasificador"
                          required
                          :rules="[(val) => !!val || 'El campo url para la búsqueda de actividades no puede estar vacio']"
                        >
                        </v-text-field>
                        <v-text-field
                          label="Url para consultar si existe Homonimia"
                          v-model="urlConsultarHomonimia"
                          required
                          :rules="[(val) => !!val || 'El campo url para la consulta de homonimia no puede estar vacio']"
                        >
                        </v-text-field>
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
    </v-card-text>
  </v-card>
</template>
<script>
  import validate from '../../validate.js';
  import axios from 'axios';
  import abreviaturas from './abreviaturas.json';
  import paises from './paises.json';
  import unidadesEconomicas from './actividadesEconomicas.json';
  const COMPONENT_NAME = 'sample';
  export default {
    name: COMPONENT_NAME,
    mixins: [validate],
    props: ['form', 'field', 'model', 'to', 'all'],
    created () {
      this.aUnidadesEconomicas = unidadesEconomicas;
      this.aOrigenCapital = [
        {
          id: 1,
          name: 'Nacional'
        },
        {
          id: 2,
          name: 'Extranjero'
        },
        {
          id: 3,
          name: 'Mixto'
        }
      ];
      this.aPaises = paises;
      this.aAmbitoAccion = [
        {
          id: 1,
          name: 'Nacional'
        },
        {
          id: 2,
          name: 'Internacional'
        }
      ];
      this.actividadesEconomicas.push({
        actividad: null
      });
      this.fechaMenuClasificador.push(null);
    },
    data () {
      return {
        persona: false,
        disabled: null,
        aUnidadesEconomicas: [],
        mUnidadEconomica: null,
        aOrigenCapital: [],
        mOrigenCapital: null,
        aPaises: [],
        mPaises: null,
        mPaginaWeb: null,
        mDuracionSociedad: null,
        fechaMenuCierreFiscal: null,
        mDuracionSociedadClasificador: null,
        mDuracionSociedadCierreFiscal: null,
        fechaMenuDuracionSociedad: null,
        fechaMenuClasificador: [],
        date: null,
        query: '',
        loading: false,
        items: [],
        search: null,
        select: null,
        searchWord: null,
        activate: false,
        dialog: false,
        usarNombre: false,
        settings: true,
        multiple: false,
        actividadesEconomicas: [],
        indexActive: null,
        aAmbitoAccion: [],
        mAmbitoAccion: null,
        mParticipacionSociedadesComerciales: null,
        mObjetoSocial: null,
        mRazonSocial: null,
        numeroFilas: 1,
        aTerminacion: [],
        hideTerminacion: false,
        mTerminacion: null,
        mRotuloComercial: null,
        mSigla: null,
        responseConsultaHomonimia: {
          nombreValido: true
        },
        mCorreoElectronico: null,
        unidadesEconomicasSeleccionadas: [],
        urlBusquedaClasificador: null,
        urlConsultarHomonimia: null,
        mCorreoElectronicoActivar: false
      };
    },
    methods: {
      /**
       * @function consultarHomonimia
       * @description Esta funcion esta encargada de buscar homonimia con los servicios actual de homonimia
       */
      async consultarHomonimia () {
        try {
          this.$waiting(true, `Se esta analizando si existe homonimia con ${this.mRazonSocial} o no, espere unos segundos por favor`);
          if (this.$refs.formularioHomonimia.validate()) {
            const params = {
              nombre: `${this.mRazonSocial} ${this.mTerminacion ? this.mTerminacion.name : ''}`,
              razonSocial: `${this.mRazonSocial}`,
              tipo_empresa: this.mUnidadEconomica,
              persona: this.persona,
              ciiu: await this.unidadesEconomicasSeleccionadas.map((item) => item.clave),
              objetoSocial: this.mObjetoSocial
            };
            if (this.usarNombre) {
              this.to.value.persona = this.persona;
            } else {
              this.to.value.persona = false;
            }
            const urlBackendHomonimia = this.urlConsultarHomonimia;
            const instance = axios.create({
              headers: {'Content-Type': 'application/json'}
            });
            let response = await instance.post(urlBackendHomonimia, params);
            response = response.data;
            this.responseConsultaHomonimia = response;
            if (response.nombreValido) {
              this.mCorreoElectronicoActivar = true;
            } else {
              this.mCorreoElectronicoActivar = false;
              this.$message.error(response.mensaje);
            }
            this.$waiting(false);
          } else {
            this.mCorreoElectronicoActivar = false;
            this.$waiting(false);
            throw new Error('Todavia existen campos sin llenar, para realizar la consulta todos los campos deben estar llenados');
          }
        } catch (err) {
          this.$waiting(false);
          this.mCorreoElectronicoActivar = false;
          this.responseConsultaHomonimia = {};
          this.$message.error(err.message);
        }
      },
      /**
       * @function selectPais
       * @description Esta funcion esta encargado de seleccionar por default si pais = Bolivia a Nacional
       */
      selectPais () {
        setTimeout(() => {
          if (this.mPaises === 'Bolivia') {
            this.mOrigenCapital = this.aOrigenCapital[0];
          } else {
            this.mOrigenCapital = [];
          }
        }, 200);
      },
      /**
       * @function selectUnidadEconomica
       * @description Es cuando el usuario selecciona una unidad economica
       */
      selectUnidadEconomica () {
        setTimeout(() => {
          this.aTerminacion = [];
          this.mTerminacion = null;
          this.aTerminacion = abreviaturas[this.mUnidadEconomica.clave];
          this.hideTerminacion = (this.aTerminacion.length > 0) ? true : false;
          this.persona = false;
          this.usarNombre = false;
          if (this.mUnidadEconomica.clave === '001') {
            this.usarNombre = true;
            this.to.value.usarNombre = this.usarNombre;
            const usuario = this.$storage.getUser();
            const nombreCompleto = `${usuario.nombres} ${usuario.primer_apellido ? usuario.primer_apellido : ''} ${usuario.segundo_apellido ? usuario.segundo_apellido : ''}`;
            this.persona = {
              nombreCompleto: nombreCompleto.trim(),
              documento_identidad: usuario.ci,
              fecha_nacimiento: usuario.fecha_nacimiento
            };
            this.to.value.infoPersona = this.persona;
            this.to.value.persona = this.persona;
            this.mRazonSocial = nombreCompleto.trim();
          } else {
            this.mCorreoElectronicoActivar = false;
            this.mCorreoElectronico = null;
            this.mTerminacion = null;
            this.mRazonSocial = null;
            this.usarNombre = false;
          }
        }, 200);
      },
      calculateHeight () {
        const ta = document.getElementById('auto-grow');
        const style = (window.getComputedStyle) ? window.getComputedStyle(ta) : ta.currentStyle;
        const taLineHeight = parseInt(style.lineHeight, 10);
        const taHeight = this.calculateContentHeight(ta, taLineHeight);
        const numberOfLines = Math.ceil(taHeight / taLineHeight);
        this.numeroFilas = numberOfLines;
      },
      calculateContentHeight (ta, scanAmount) {
        const origHeight = ta.style.height;
        let height = ta.offsetHeight;
        const scrollHeight = ta.scrollHeight;
        const overflow = ta.style.overflow;
        if (height >= scrollHeight) {
          ta.style.height = (height + scanAmount) + 'px';
          ta.style.overflow = 'hidden';
          if (scrollHeight < ta.scrollHeight) {
            while (ta.offsetHeight >= ta.scrollHeight) {
              ta.style.height = (height -= scanAmount) + 'px';
            }
            while (ta.offsetHeight < ta.scrollHeight) {
              ta.style.height = (height++) + 'px';
            }
            ta.style.height = origHeight;
            ta.style.overflow = overflow;
            return height;
          }
        } else {
          return scrollHeight;
        }
      },
      /**
       * @function setIndex
       * @description Esta funcion esta encargada de setear el index correcto del combo que se esta utilizando
       * @param idx index
       */
      setIndex (idx) {
        this.indexActive = idx;
      },
      /**
       * @function removeActivities
       * @description Esta funcion esta encargada de eliminar del array
       * @param index index
       */
      removeActivities (index) {
        this.actividadesEconomicas.splice(index, 1);
        this.fechaMenuClasificador.splice(index, 1);
        this.items.splice(index, 1);
        this.unidadesEconomicasSeleccionadas.splice(index, 1);
      },
      /**
       * @function addEventKeydown
       * @description Esta funcion esta implementada nativamente, porque vue no reconoce el keydown solo el jeyup
       * @link  https://vuejs.org/v2/guide/events.html
       * @param index index
       */
      addEventKeydown (index) {
        setTimeout(() => {
          const name = `actividad_economica_${index}`;
          const element = this.$refs[name][0].$el;
          let typingTimer;
          let doneTypingInterval = 1000;
          element.onkeydown = () => {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
              this.activate = true;
            }, doneTypingInterval);
            this.activate = false;
            return true;
          };
        }, 200);
      },
      /**
       * @function addActivities
       * @description Esta funcion esta encargada de adicionar actividades al array general
       */
      addActivities () {
        this.fechaMenuClasificador.push(null);
        this.actividadesEconomicas.push({
          actividad: null
        });
        this.addEventKeydown(this.actividadesEconomicas.length - 1);
      },
      /**
       * @function selectItem
       * @description Esta funcion esta encargada de capturar cuando se selecciona la actividad economica
       * @param idx index
       */
      async selectItem (idx) {
        try {
          this.unidadesEconomicasSeleccionadas[idx] = this.actividadesEconomicas[idx].actividad;
          this.to.value.ciiu = await this.unidadesEconomicasSeleccionadas.map((item) => item.clave);
          this.to.value.unidadesEconomicasSeleccionadas = this.unidadesEconomicasSeleccionadas;
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      /**
       * @function querySelections
       * @description Esta funcion esta encargada de generar de almacenar la palabra que dese buscar
       * @param v palabra a buscar
       */
      async querySelections (v) {
        try {
          this.searchWord = v;
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      /**
       * @function loadData
       * @description Esta funcion es la encargada de cargar los datos de acuerdo al filtro
       * @param query Palabra de busqueda
       */
      async loadData (query) {
        try {
          // const url = 'http://www.miempresa.gob.bo/registro/api/v1/parametro/fundempresa/ciiu?search=';
          const url = this.urlBusquedaClasificador;
          let sw = true;
          let resultados = [];
          this.loading = true;
          return await axios.get(`${url}${query}`)
            .then((res) => {
              const response = res.data.datos;
              for (let element of response.grupoDos) {
                sw = true;
                for (let elementUno of response.grupoUno) {
                  if (element.clave === elementUno.clave) {
                    sw = false;
                    break;
                  }
                }
                if (sw) {
                  response.grupoUno.push(element);
                }
              }
              resultados = response.grupoUno;
              return resultados;
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      formatDate (date) {
        if (!date) {
          return null;
        }
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      },
      parseDate (date) {
        if (!date) {
          return null;
        }
        const [month, day, year] = date.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    },
    watch: {
      mCorreoElectronico (correoElectronico) {
        this.to.value.correoElectronico = correoElectronico;
      },
      mUnidadEconomica (unidadEconomica) {
        this.to.value.tipo_empresa = unidadEconomica;
      },
      mPaises (paisOrigen) {
        this.to.value.paisOrigen = paisOrigen;
      },
      mOrigenCapital (origenCapital) {
        this.to.value.origenCapital = origenCapital;
      },
      mPaginaWeb (paginaWeb) {
        this.to.value.paginaWeb = paginaWeb;
      },
      mDuracionSociedad (duracionSociedad) {
        this.to.value.duracionSociedad = duracionSociedad;
      },
      mAmbitoAccion (ambitoAccion) {
        this.to.value.ambitoAccion = ambitoAccion;
      },
      mParticipacionSociedadesComerciales (participacionSociedadesComerciales) {
        this.to.value.participacionSociedadesComerciales = participacionSociedadesComerciales;
      },
      mObjetoSocial (objetoSocial) {
        this.to.value.objetoSocial = objetoSocial;
      },
      mDuracionSociedadCierreFiscal (fechaCierreFiscal) {
        this.to.value.fechaCierreFiscal = fechaCierreFiscal;
      },
      mRazonSocial (razonSocial) {
        this.to.value.razonSocial = `${razonSocial}`;
        this.to.value.nombre = `${razonSocial} ${this.mTerminacion ? this.mTerminacion.name : ''}`;
        this.mCorreoElectronicoActivar = false;
        this.mCorreoElectronico = null;
      },
      mTerminacion (terminacion) {
        this.to.value.terminacion = terminacion;
        this.to.value.nombre = `${this.mRazonSocial} ${terminacion ? terminacion.name : ''}`;
      },
      mRotuloComercial (rotuloComercial) {
        this.to.value.rotuloComercial = rotuloComercial;
      },
      mSigla (sigla) {
        this.to.value.sigla = sigla;
      },
      multiple (multiple) {
        this.to.multiple = multiple;
      },
      async activate (option) {
        if (option) {
          const items = await this.loadData(this.searchWord);
          this.items[this.indexActive] = items;
          this.to.value.items = this.items;
          this.loading = false;
        }
      },
      async search (val) {
        try {
          val && await this.querySelections(val);
        } catch (err) {
          this.$message.error(err.message);
        }
      }
    },
    components: {},
    mounted () {
      this.$nextTick(() => {
        if (!this.to.value) {
          this.to.value = {};
        };
        this.to.init = [
          'correoElectronico',
          'tipo_empresa',
          'paisOrigen',
          'origenCapital',
          'paginaWeb',
          'duracionSociedad',
          'ambitoAccion',
          'participacionSociedadesComerciales',
          'objetoSocial',
          'fechaCierreFiscal',
          'razonSocial',
          'nombre',
          'terminacion',
          'rotuloComercial',
          'sigla',
          'ciiu',
          'persona',
          'unidadesEconomicasSeleccionadas'
        ];
        this.to.value.persona = false;
        this.settings = this.to.settings;
        this.urlBusquedaClasificador = (this.to.urlBusquedaClasificador) ? this.to.urlBusquedaClasificador : 'https://test.agetic.gob.bo/miempresa-backend/api/v1/parametro/fundempresa/ciiu?search=';
        this.urlConsultarHomonimia = (this.to.urlConsultarHomonimia) ? this.to.urlConsultarHomonimia : 'https://test.agetic.gob.bo/miempresa-backend/api/v1/buscar_empresa';
        this.multiple = (this.to.multiple) ? this.to.multiple : false;
        this.disabled = this.to.disabled ? this.to.disabled : false;
        // recuperando los valores almacenados en BD para los campos
        if (this.to.value.tipo_empresa) {
          const findElement = unidadesEconomicas.filter((item) => {
            if (item.clave === this.to.value.tipo_empresa.clave) {
              return item;
            }
          });
          this.mUnidadEconomica = findElement.length > 0 ? findElement.pop() : null;
        }
        if (this.to.value.paisOrigen) {
          const findElement = paises.filter((item) => {
            if (item === this.to.value.paisOrigen) {
              return item;
            }
          });
          this.mPaises = findElement.length > 0 ? findElement.pop() : null;
        }
        if (this.to.value.origenCapital) {
          const findElement = this.aOrigenCapital.filter((item) => {
            if (item.id === this.to.value.origenCapital.id) {
              return item;
            }
          });
          this.mOrigenCapital = findElement.length > 0 ? findElement.pop() : null;
        }
        if (this.to.value.paginaWeb) {
          this.mPaginaWeb = this.to.value.paginaWeb;
        }
        if (this.to.value.duracionSociedad) {
          this.mDuracionSociedad = this.to.value.duracionSociedad;
        }
        if (this.to.value.correoElectronico) {
          this.mCorreoElectronico = this.to.value.correoElectronico;
        }
        if (this.to.value.usarNombre) {
          this.usarNombre = this.to.value.usarNombre;
        }
        if (this.to.value.ambitoAccion) {
          const findElement = this.aAmbitoAccion.filter((item) => {
            if (item.id === this.to.value.ambitoAccion.id) {
              return item;
            }
          });
          this.mAmbitoAccion = findElement.length > 0 ? findElement.pop() : null;
        }
        if (this.to.value.participacionSociedadesComerciales) {
          this.mParticipacionSociedadesComerciales = this.to.value.participacionSociedadesComerciales;
        }
        if (this.to.value.objetoSocial) {
          this.mObjetoSocial = this.to.value.objetoSocial;
        }
        if (this.to.value.fechaCierreFiscal) {
          this.mDuracionSociedadCierreFiscal = this.to.value.fechaCierreFiscal;
        }
        if (this.to.value.razonSocial) {
          this.mRazonSocial = this.to.value.razonSocial;
        }
        if (this.to.value.rotuloComercial) {
          this.mRotuloComercial = this.to.value.rotuloComercial;
        }
        if (this.to.value.sigla) {
          this.mSigla = this.to.value.sigla;
        }
        if (this.to.value.infoPersona) {
          this.persona = this.to.value.infoPersona;
        }
        // Verificando si es multiple
        if (!this.to.multiple) {
          if (Array.isArray(this.to.value.items) && this.to.value.items.length > 0) {
            if (Array.isArray(this.to.value.unidadesEconomicasSeleccionadas) && this.to.value.unidadesEconomicasSeleccionadas.length > 0) {
              this.items[0] = this.to.value.items[0];
              const ActividadEconomica = this.to.value.unidadesEconomicasSeleccionadas[0];
              const findElement = this.items[0].filter((item) => {
                if (item.clave === ActividadEconomica.clave) {
                  return item;
                }
              });
              this.actividadesEconomicas[0].actividad = findElement.length > 0 ? findElement[0] : null;
            }
          }
        } else {
          if (Array.isArray(this.to.value.items) && this.to.value.items.length > 0) {
            if (Array.isArray(this.to.value.unidadesEconomicasSeleccionadas) && this.to.value.unidadesEconomicasSeleccionadas.length > 0) {
              this.items = this.to.value.items;
              this.actividadesEconomicas = this.to.value.unidadesEconomicasSeleccionadas;
              for (let i = 0; i < this.to.value.items.length; i++) {
                const ActividadEconomica = this.to.this.unidadesEconomicasSeleccionadasvalue.unidadesEconomicasSeleccionadas[i];
                const findElement = this.items[i].filter((item) => {
                  if (item.clave === ActividadEconomica.clave) {
                    return item;
                  }
                });
                this.actividadesEconomicas[i].actividad = findElement.length > 0 ? findElement[0] : null;
              }
            }
          }
        }
        this.unidadesEconomicasSeleccionadas = this.to.value.unidadesEconomicasSeleccionadas;
        if (!Array.isArray(this.unidadesEconomicasSeleccionadas)) {
          this.unidadesEconomicasSeleccionadas = [];
          this.unidadesEconomicasSeleccionadas.push({});
        }
        if (Array.isArray(this.to.value.unidadesEconomicasSeleccionadas)) {
          this.to.value.ciiu = this.to.value.unidadesEconomicasSeleccionadas.map((item) => item.clave);
        }
        this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
        setTimeout(() => {
          const name = 'actividad_economica_0';
          const element = this.$refs[name][0].$el;
          let typingTimer;
          let doneTypingInterval = 1000;
          element.onkeydown = () => {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
              this.activate = true;
            }, doneTypingInterval);
            this.activate = false;
            return true;
          };
        }, 400);
      });
    }
  };
</script>
<style lang="scss" scoped>
  .tituloHomonimia {
    font-size: 14px;
    font-weight: 700;
    color: #003366;
    text-transform: uppercase;
  }
  .bloqueActividadSeleccionada {
    width: 100%;
    border-radius: 10px;
    padding: 10px;
    border: 1.5px solid #003366;
    margin-bottom: 15px;
  }
  .eliminarActividadEconomica {
    position: absolute;
    right: 40px;
    margin-top: -70px;
  }
</style>
