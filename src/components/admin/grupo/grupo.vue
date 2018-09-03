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
    <h3 class="primary--text"><v-icon color="primary">business</v-icon> Grupos</h3>
    <v-card>
      <v-card-text>
        <crud-table
          data-step="1" :data-intro="guiaUsuario[1].mensaje"
          :headers="headers"
          :url="url"
          :filters="filters"
          :path="property"
          :widthModal="800"
          :order="order"
        >

          <template slot="buttons">
            <v-tooltip bottom>
              <v-btn color="primary"
                data-step="2" :data-intro="guiaUsuario[2].mensaje"
                @click.native.stop="openModal()"
                slot="activator">
                <v-icon>add</v-icon> {{$t('common.add') }}
              </v-btn>
              <span>{{$t('common.add')}}</span>
            </v-tooltip>
          </template>

          <template slot="form">
            <v-card-title class="headline">
              <v-layout row wrap>
                <v-flex xs10 sm10 md10 lg10 mt-2>
                  <v-icon>business</v-icon> {{ form._id ? 'Editar grupos' : 'Agregar grupos' }}
                </v-flex>
                <v-flex xs2 sm2 md2 lg2 text-sm-right text-xs-right text-md-right text-lg-right>
                  <v-tooltip bottom>
                    <v-btn icon color="primary" slot="activator" @click.native="$store.commit('closeModal')">
                      <v-icon color="white" class="ml-1">close</v-icon>
                    </v-btn>
                    <span>Cerrar configuración</span>
                  </v-tooltip>
                </v-flex>
                <v-flex xs12 sm12 md12 lg12 text-sm-right text-md-right text-lg-right>
                  <v-chip label color="success" text-color="white" v-if="form.estado == 'ACTIVO'">
                    {{ form.estado }}
                  </v-chip>
                  <v-chip label color="warning" text-color="white" v-if="form.estado == 'INACTIVO'">
                    {{ form.estado }}
                  </v-chip>
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
                  <v-layout row wrap>

                    <v-flex sm12 xs12 md6 lg6>
                      <v-text-field
                        label="Nombre de grupo"
                        prepend-icon="people"
                        v-model="form.titulo"
                        maxlength="50"
                        autocomplete="off"
                        :rules="$validate(['requerido'])"
                        required
                        autofocus
                        ></v-text-field>
                    </v-flex>
                    <v-flex sm12 xs12 md12 lg12>
                        <v-select
                            :items="instituciones"
                            v-model="form.institucion"
                            label="Institución"
                            prepend-icon="business"
                            item-text="text"
                            item-value="value"
                            autocomplete
                            noDataText="No hay resultados"
                            :rules="$validate(['requerido'])"
                            required
                            ></v-select>
                    </v-flex>
                    <v-flex sm12 xs12 md12 lg12>
                      <v-text-field
                        name="descripcion"
                        :label="$t('entity.crud.description')"
                        prepend-icon="event_note"
                        id="descripcion"
                        v-model="form.descripcion"
                        maxlength="500"
                        :counter="500"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md8 lg8>
                    <small class="error--text text-required">* Los campos son obligatorios</small>
                  </v-flex>
                  <v-flex xs12 sm12 md2 lg2>
                    <v-btn
                      block
                      @click.native="$store.commit('closeModal');">
                      <v-icon>cancel</v-icon> {{$t('common.cancel') }}
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm12 md2 lg2>
                    <v-btn
                      block
                      color="primary"
                      type="submit"
                      :disabled="!valid">
                      <v-icon>check</v-icon> {{$t('common.save') }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-form>
          </template>
          <template slot="items" slot-scope="items">
            <td class="text-md-center">
              <v-tooltip bottom>
                <v-btn :disabled="disabledForTour" icon slot="activator" @click="editItem(items.item._id)">
                  <v-icon color="teal">edit</v-icon>
                </v-btn>
                <span>Editar registro</span>
              </v-tooltip>
              <v-tooltip v-if="esSuperAdmin || esAdmin" bottom>
                <v-btn :disabled="disabledForTour" icon slot="activator" @click="deleteItem(items.item._id)">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar registro</span>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip bottom>
                <v-switch
                  :input-value="items.item.activo"
                  @change="changeVisible('grupos/', items.item, items.item._id)"
                  slot="activator"
                  color="success"
                  :disabled="esCreadorPlantillas || disabledForTour">
                </v-switch>
                <span>Activar/desactivar registro</span>
              </v-tooltip>
            </td>
            <td>{{ items.item.titulo }}</td>
            <td>{{ $filter.words(items.item.descripcion, 5) }}</td>
            <td>{{ $filter.words(items.item.institucion.nombre, 5) }}</td>
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
  </section>
</template>
<script>
import introJs from 'intro.js';
import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
import validate from '@/common/mixins/validate';
import grupo from './mixins/grupo';
import guide from './guide.json';
import { mapState } from 'vuex';
import 'intro.js/introjs.css';
const { SUPER_ADMIN, ADMIN, CREADOR_PLANTILLAS } = require('../../../../config');

export default {
  mixins: [ crud, validate, grupo ],
  computed: mapState({
    initTour: state => state.tour
  }),
  created () {
    this.user = this.$storage.getUser();
    this.esSuperAdmin = this.user.roles._id === SUPER_ADMIN;
    this.esAdmin = this.user.roles._id === ADMIN;
    this.esCreadorPlantillas = this.user.roles._id === CREADOR_PLANTILLAS;
    this.instituciones = [];
    this.getInstituciones();
    this.guiaUsuario = guide.pasos;
    this.selectImage = Math.floor(Math.random() * Math.floor(8));
  },
  data () {
    return {
      property: 'listado',
      form: {
        id: null,
        usuario: '',
        institucion: null
      },
      filters: [{
        field: 'titulo',
        label: 'titulo',
        type: 'text',
        typeG: 'String'
      }],
      url: 'grupos',
      order: ['createAt', 'DESC'],
      documentos: [],
      dialog: false,
      headers: [
        { text: this.$t('common.actions'), sortable: false, align: 'center' },
        { text: this.$t('common.active'), sortable: false },
        { text: 'Título', value: 'titulo' },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Institución', value: 'institucion' },
        { text: 'Fecha de creación', value: 'createAt' }
      ],
      items: [],
      valid: false,
      usuario: null,
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
    openModal (data = {}, form = true) {
      if (!this.disabledForTour) {
        this.valid = true;
        this.$refs.form.reset();
        if (data._id) {
          this.form = data;
          this.form.institucion = this.getValue(this.form.institucion, this.instituciones);
        } else {
          this.form = {
            titulo: '',
            descripcion: '',
            institucion: ''
          };
        }
        if (form) {
          this.$store.commit('openModal');
        }
      }
    },
    save () {
      if (this.$refs.form.validate()) {
        let data = Object.assign({}, this.form);
        // Object.assign(data, this.form);
        if (data._id) {
          if (typeof data.institucion === 'object') {
            data.institucion = data.institucion.value;
          }
          const id = data._id;
          delete data.activo;
          delete data.createAt;
          delete data.updateAt;
          delete data.deleteAt;
          delete data.deleted;
          delete data._id;
          delete data.__v;
          console.log(data);
          this.$service.put(`grupos/${id}`, data).then((response) => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('Se actualizó el registro correctamente');
            }
          });
        } else {
          this.$service.post('grupos', data).then((response) => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('El registro fue agregado correctamente');
            }
          });
        }
      }
    },
    remove (item) {
      this.form.telefonos.splice(this.form.telefonos.indexOf(item), 1);
      this.form.telefonos = [...this.form.telefonos];
    }
  },
  components: {
    CrudTable
  }
};
</script>
