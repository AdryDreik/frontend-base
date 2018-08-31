<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">business</v-icon> Documentos plantilla</h3>
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
          data-step="2" :data-intro="guiaUsuario[2].mensaje"
          :headers="headers"
          :url="url"
          :filters="filters"
          :order="order"
          :path="property"
          :widthModal="800"
        >
        <template slot="buttons">
            <v-tooltip bottom>
              <v-btn color="primary"
                data-step="1" :data-intro="guiaUsuario[1].mensaje"
                slot="activator" @click.native="redirectForm(null)">
                <v-icon>add</v-icon> {{$t('common.add') }}
              </v-btn>
              <span>Crear un nuevo documento plantilla</span>
            </v-tooltip>
          </template>

          <template slot="items" slot-scope="items">
            <td class="text-md-center">
              <v-tooltip v-if="!items.item.publicado" bottom>
                <v-btn :disabled="disabledForTour" icon slot="activator" @click="redirectForm(items.item._id)">
                  <v-icon color="teal">edit</v-icon>
                </v-btn>
                <span>Editar registro</span>
              </v-tooltip>
              <v-tooltip v-if="!items.item.publicado && (esSuperAdmin || esAdmin)" bottom>
                <v-btn :disabled="disabledForTour" icon slot="activator" @click="deleteItem(items.item._id)">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar registro</span>
              </v-tooltip>
              <v-tooltip :disabled="disabledForTour" v-if="!items.item.publicado && (esSuperAdmin || esAdmin)" bottom>
                <v-btn :disabled="disabledForTour" icon slot="activator" @click="publishItem(items.item._id, 'documentos_plantilla/')">
                  <v-icon color="teal darken-4">done_all</v-icon>
                </v-btn>
                <span>Publicar Documento</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn :disabled="disabledForTour" icon slot="activator" @click="cloneItem(items.item._id, 'documentos_plantilla/')">
                  <v-icon color="blue-grey darken-1">content_copy</v-icon>
                </v-btn>
                <span>Clonar documento</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn :disabled="disabledForTour"  icon slot="activator" @click.prevent="preview(items.item._id)">
                  <v-icon color="blue-grey lighten-1">remove_red_eye</v-icon>
                </v-btn>
                <span>Vista previa</span>
              </v-tooltip>
               <v-tooltip bottom>
                <v-btn icon slot="activator" @click="shareItem(items.item._id)">
                  <v-icon color="green">share</v-icon>
                </v-btn>
                <span>Compartir</span>
              </v-tooltip>
            </td>
            <td>{{ $filter.words(items.item.titulo, 5) }}</td>
            <td>{{ (items.item.institucion) ? items.item.institucion.sigla : '' }} - {{ (items.item.institucion) ? items.item.institucion.nombre : ''}}</td>
            <td>{{ (items.item) ? items.item.version : '' }}</td>
            <td>{{ $datetime.format(items.item.createAt, 'dd/MM/YYYY') }}</td>
            <td>
              <v-chip label color="success" text-color="white" v-if="items.item.publicado == true">
                PUBLICADO
              </v-chip>
              <v-chip label color="warning" text-color="white" v-if="items.item.publicado == false">
                PENDIENTE
              </v-chip>
            </td>
          </template>
        </crud-table>

        <!-- MODAL CREADO PARA LA VISUALIZACION DE FORMULARIOS -->
        <v-dialog v-model="dialogPreview" persistent max-width="1000">
          <v-card>
            <div class="cerrar">
              <v-tooltip bottom>
                <v-btn slot="activator" icon color="primary white--text" large @click.prevent="closeModal">
                  <v-icon>close</v-icon>
                </v-btn>
                <span>Cerrar vista previa</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn slot="activator" icon color="info white--text" large @click.prevent="modoVista">
                  <v-icon>{{(view) ? 'visibility_off' : 'visibility'}} </v-icon>
                </v-btn>
                <span>{{(view) ? 'Cambiar al modo editable' : 'Cambiar al modo vista'}}</span>
              </v-tooltip>
            </div>
            <visualizador :componente="idFormulario" :fields="datos" :layout="posicion" :mode="view"></visualizador>
          </v-card>
        </v-dialog>
        <!--  TERMINA AQUI  -->
        <!-- API-->
        <v-dialog v-model="shareDialogPreview" persistent max-width="1280">
          <configurarApi v-if="shareDialogPreview" :idFormulario="idFormulario" @updateVisible="updateShareDialogPreview"></configurarApi>
        </v-dialog>

      </v-card-text>
    </v-card>
  </section>
</template>
<script>
import introJs from 'intro.js';
import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
import validate from '@/common/mixins/validate';
import visualizador from './preview.vue';
import configurarApi from './configurar_api';
import { mapState } from 'vuex';
import guide from './guide.json';
import 'intro.js/introjs.css';
const { SUPER_ADMIN, ADMIN } = require('../../../../config');
export default {
  mixins: [ crud, validate ],
  computed: mapState({
    initTour: state => state.tour
  }),
  created () {
    this.user = this.$storage.getUser();
    this.idInstitucion = this.user.institucion;
    this.esSuperAdmin = this.user.roles._id === SUPER_ADMIN;
    this.esAdmin = this.user.roles._id === ADMIN;
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
        label: 'Nombre',
        type: 'text',
        typeG: 'String'
      }],
      url: 'documentos_plantilla',
      order: ['createAt', 'DESC'],
      documentosPlantilla: [],
      documentos: [],
      dialog: false,
      headers: [
        { text: this.$t('common.actions'), sortable: false, align: 'center' },
        { text: 'Nombre', value: 'titulo' },
        { text: 'Institucion', value: 'institucion' },
        { text: 'Version', value: 'version' },
        { text: 'Fecha creacion', value: 'createAt' }
      ],
      items: [],
      valid: false,
      usuario: null,
      flowData: {},
      view: null,
      posicion: [],
      datos: [],
      dialogPreview: null,
      idFormulario: null,
      shareDialogPreview: null,
      configApiDialogPreview: null,
      imageIntro: null,
      intro: null,
      disabledForTour: false,
      messageIntro: null,
      guiaUsuario: null,
      selectImage: null,
      diaNoche: null
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
    updateShareDialogPreview (valor) {
      this.shareDialogPreview = valor;
    },
    /*
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
    modoVista () {
      this.view = !this.view;
    },
    closeModal () {
      this.dialogPreview = false;
    },
    async preview (id) {
      try {
        this.idFormulario = id;
        const res = await this.$service.get(`documentos_plantilla/${this.idFormulario}`);
        if (res) {
          this.datos = [];
          res.body.componentes.reduce((ant, next) => {
            const objTmp = next;
            objTmp.key = next.type;
            objTmp.templateOptions.settings = false;
            ant.push(objTmp);
            return ant;
          }, this.datos);
          this.posicion = res.body.posicion;
          this.dialogPreview = true;
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    redirectForm (id) {
      if (!this.disabledForTour) {
        if (id) {
          this.$router.push({
            path: 'formularios',
            query: {id: id}
          });
        } else {
          this.$router.push('formularios');
        }
      }
    },
    async shareItem (id) {
      this.idFormulario = id;
      this.shareDialogPreview = true;
    }
  },
  components: {
    CrudTable,
    visualizador,
    configurarApi
  }
};
</script>
<style lang="scss">
  .cerrar {
    position: absolute;
    top: 0;
    z-index: 2;
    right: 0;
    margin-top: 16px;
    margin-right: 0px;
  }
</style>

