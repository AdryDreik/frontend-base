<template>
  <section>
    <h3 class="primary--text"><v-icon color="primary">business</v-icon> Instituciones</h3>
    <v-card>
      <v-card-text>
        <crud-table
          :headers="headers"
          :url="url"
          :filters="filters"
          :path="property"
          :widthModal="800"
          v-if="esSuperAdmin"
          :order="order"
        >
        <!-- v-if="$store.state.user.roles != '000000000000000000000222'" -->

          <template slot="buttons">
            <v-tooltip bottom>
              <v-btn color="primary"
                @click.native.stop="openModal()"
                slot="activator">
                <v-icon>add</v-icon> {{$t('common.add') }}
              </v-btn>
              <span>{{$t('entity.add')}}</span>
            </v-tooltip>
          </template>

          <template slot="form">
            <v-card-title class="headline">
              <v-flex xs10>
                <v-icon>business</v-icon> {{ form._id ? 'Editar Instituciones' : 'Agregar Instituciones' }}
              </v-flex>
              <v-flex xs2>
                <v-chip label color="success" text-color="white" v-if="form.estado == 'ACTIVO'">
                  {{ form.estado }}
                </v-chip>
                <v-chip label color="warning" text-color="white" v-if="form.estado == 'INACTIVO'">
                  {{ form.estado }}
                </v-chip>
              </v-flex>
              <v-btn icon @click.native="$store.commit('closeModal')">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-form
              @submit.prevent="save"
              v-model="valid"
              ref="form"
              lazy-validation
              >
              <v-card-text>
                <v-container grid-list-md>
                  <h4>Datos generales</h4>
                  <v-layout wrap>
                    <v-flex xs4>
                      <v-text-field
                        name="codigo_portal"
                        label="Código único de portal"
                        id="codigo_portal"
                        v-model="form.codigo_portal"
                        maxlength="20"
                        :rules="$validate(['requerido'])"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs3>
                      <v-btn
                        @click.native="obtenerInstitucionPortal()" color="primary" type="submit">
                        <v-icon>check</v-icon> Obtener datos
                      </v-btn>
                    </v-flex>
                    <v-flex xs9>
                      <v-text-field
                        name="nombre"
                        :label="$t('entity.crud.name')"
                        id="nombre"
                        v-model="form.nombre"
                        autofocus
                        maxlength="150"
                        :rules="$validate(['requerido'])"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs3>
                      <v-text-field
                        name="sigla"
                        :label="$t('entity.crud.acronym')"
                        id="sigla"
                        v-model="form.sigla"
                        maxlength="20"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field
                        name="descripcion"
                        :label="$t('entity.crud.description')"
                        id="descripcion"
                        v-model="form.descripcion"
                        maxlength="500"
                        :counter="500"
                        :rules="$validate(['requerido'])"
                        required
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <h4>Datos de contacto</h4>
                  <v-layout wrap>
                    <v-text-field
                      name="email"
                      :label="$t('entity.crud.email')"
                      prepend-icon="email"
                      id="email"
                      v-model="form.email"
                      maxlength="100"
                      :rules="$validate(['email'])"
                    ></v-text-field>
                    <v-text-field
                      name="web"
                      :label="$t('entity.crud.web')"
                      prepend-icon="public"
                      id="web"
                      v-model="form.web"
                      maxlength="100"
                      :rules="$validate(['url'])"
                    ></v-text-field>
                  </v-layout>
                  <v-layout wrap>
                      <v-text-field
                        name="direccion"
                        :label="$t('entity.crud.address')"
                        id="direccion"
                        v-model="form.direccion"
                        maxlength="500"
                        :counter="500"
                        :rules="$validate(['requerido'])"
                        required
                      ></v-text-field>
                      <v-select
                        :label="$t('entity.crud.phones')"
                        chips
                        tags
                        prepend-icon="phone"
                        v-model="form.telefonos"
                      >
                        <template slot="selection" slot-scope="data">
                          <v-chip
                            close
                            @input="remove(data.item)"
                            :selected="data.selected"
                          >
                            {{ data.item }}
                          </v-chip>
                        </template>
                      </v-select>
                    </v-layout>
                  <h4>Usuario MAE</h4>
                  <v-layout row wrap>
                    <v-flex xs12 sm12 md6 lg6>
                      <v-text-field
                          label="Escriba el carnet de identidad"
                          placeholder="12345678"
                          hint="Este usuario sera designado como MAE de la institución"
                          v-model="form.mae"
                          :rules="[(val) => !!val || 'Este campo no puede estar vacio']"
                        ></v-text-field>  
                    </v-flex>
                    <v-flex xs12 sm12 md6 lg6>
                      <!-- FECHA DE NACIMIENTO -->
                      <v-menu
                        lazy
                        :close-on-content-click="false"
                        v-model="menu"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-right="40"
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          label="Escriba la fecha de nacimiento"
                          v-model="form.fecha_nacimiento"
                          :rules="[(val) => !!val || 'Este campo no puede estar vacio']"
                          prepend-icon="event"
                          @blur="parseDate(form.fecha_nacimiento)"
                        ></v-text-field>

                        <v-date-picker 
                          v-model="date" 
                          @input="form.fecha_nacimiento = formatDate($event)" 
                          no-title 
                          scrollable
                          locale="es"
                        >
                        </v-date-picker>
                      </v-menu>
                      <!-- FIN FECHA DE NACIMIENTO -->
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <small class="error--text text-required">* Los campos son obligatorios</small>
                <v-spacer></v-spacer>
                <v-btn
                  @click.native="$store.commit('closeModal');">
                  <v-icon>cancel</v-icon> {{$t('common.cancel') }}
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :disabled="!valid">
                  <v-icon>check</v-icon> {{$t('common.save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </template>

          <template slot="items" slot-scope="items">
            <td class="text-md-center">
              <v-tooltip bottom>
                <v-btn icon slot="activator" @click="editItem(items.item._id)">
                  <v-icon color="teal">edit</v-icon>
                </v-btn>
                <span>Editar registro</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn icon slot="activator" @click="deleteInstitucion(items.item._id)">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar registro</span>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip bottom>
                <v-switch
                  :input-value="items.item.activo"
                  value
                  @change="changeVisible('instituciones/', items.item, items.item._id)"
                  slot="activator"
                  color="success">
                </v-switch>
                <span>Activar/desactivar registro</span>
              </v-tooltip>
            </td>
            <td>{{ $filter.words(items.item.nombre, 5) }}</td>
            <td>{{ items.item.sigla }}</td>
            <td>{{ items.item.web }}</td>
            <td>{{ $filter.words(items.item.direccion, 5) }}</td>
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

        <v-form
          @submit.prevent="save"
          v-model="valid"
          ref="form"
          lazy-validation
          v-else
          >
          <v-card-text>
            <v-container grid-list-md>
              <h4>Datos generales</h4>
              <v-layout wrap>
                <v-flex xs9>
                  <v-text-field
                    name="nombre"
                    :label="$t('entity.crud.name')"
                    id="nombre"
                    v-model="form.nombre"
                    autofocus
                    maxlength="150"
                    :rules="$validate(['requerido'])"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs3>
                  <v-text-field
                    name="sigla"
                    :label="$t('entity.crud.acronym')"
                    id="sigla"
                    v-model="form.sigla"
                    maxlength="20"
                  ></v-text-field>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                    name="descripcion"
                    :label="$t('entity.crud.description')"
                    id="descripcion"
                    v-model="form.descripcion"
                    maxlength="500"
                    :counter="500"
                    :rules="$validate(['requerido'])"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field
                    name="codigo_portal"
                    label="Código único de portal"
                    id="codigo_portal"
                    v-model="form.codigo_portal"
                    maxlength="20"
                    :rules="$validate(['requerido'])"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <h4>Datos de contacto</h4>
              <v-layout wrap>
                <v-text-field
                  name="email"
                  :label="$t('entity.crud.email')"
                  prepend-icon="email"
                  id="email"
                  v-model="form.email"
                  maxlength="100"
                  :rules="$validate(['email'])"
                ></v-text-field>
                <v-text-field
                  name="web"
                  :label="$t('entity.crud.web')"
                  prepend-icon="public"
                  id="web"
                  v-model="form.web"
                  maxlength="100"
                  :rules="$validate(['url'])"
                ></v-text-field>
              </v-layout>
              <v-flex xs12>
                <v-text-field
                  name="direccion"
                  :label="$t('entity.crud.address')"
                  id="direccion"
                  v-model="form.direccion"
                  maxlength="500"
                  :counter="500"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  :label="$t('entity.crud.phones')"
                  chips
                  tags
                  prepend-icon="phone"
                  v-model="form.telefonos"
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      close
                      @input="remove(data.item)"
                      :selected="data.selected"
                    >
                      {{ data.item }}
                    </v-chip>
                  </template>
                </v-select>
              </v-flex>
              <h4>Usuario MAE</h4>
              <v-layout row wrap>
                <v-flex xs12 sm12 md12 lg12>
                  <v-text-field
                      label="Escriba el carnet de identidad"
                      placeholder="12345678"
                      v-model="form.mae"
                      hint="Este usuario sera designado como MAE de la institución"
                      :rules="[(val) => !!val || 'Este campo no puede estar vacio']"
                    ></v-text-field>  
                </v-flex>
                <v-flex xs12 sm12 md6 lg6>
                      <!-- FECHA DE NACIMIENTO -->
                      <v-menu
                        lazy
                        :close-on-content-click="false"
                        v-model="menu"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-right="40"
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          label="Escriba la fecha de nacimiento"
                          v-model="form.fecha_nacimiento"
                          :rules="[(val) => !!val || 'Este campo no puede estar vacio']"
                          prepend-icon="event"
                          @blur="parseDate(form.fecha_nacimiento)"
                        ></v-text-field>

                        <v-date-picker 
                          v-model="date" 
                          @input="form.fecha_nacimiento = formatDate($event)" 
                          no-title 
                          scrollable
                          locale="es"
                        >
                        </v-date-picker>
                      </v-menu>
                      <!-- FIN FECHA DE NACIMIENTO -->
                    </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <small class="error--text text-required">* Los campos son obligatorios</small>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              type="submit"
              :disabled="!valid">
              <v-icon>check</v-icon> Guardar cambios
            </v-btn>
          </v-card-actions>
        </v-form>

      </v-card-text>
    </v-card>
  </section>
</template>
<script>

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
import validate from '@/common/mixins/validate';
import Auth from '../auth/mixins/auth.js';
const { SUPER_ADMIN } = require('../../../../config');

export default {
  mixins: [ crud, validate, Auth ],
  created () {
    this.user = this.$storage.getUser();
    this.esSuperAdmin = this.user.roles._id === SUPER_ADMIN;
    this.idInstitucion = this.user.institucion;
  },
  data () {
    return {
      property: 'listado',
      form: {
        id: null,
        usuario: ''
      },
      filters: [{
        field: 'nombre',
        label: 'nombre',
        type: 'text',
        typeG: 'String'
      }],
      url: 'instituciones',
      order: ['createAt', 'DESC'],
      documentos: [],
      dialog: false,
      headers: [
        { text: this.$t('common.actions'), sortable: false, align: 'center' },
        { text: this.$t('common.active'), sortable: false },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Sigla', value: 'sigla' },
        { text: 'Web', value: 'web' },
        { text: 'Dirección', value: 'direccion' },
        { text: 'Fecha de creación', value: 'createAt' }
      ],
      items: [],
      valid: false,
      usuario: null,
      menu: null,
      date: null
    };
  },
  methods: {
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
    },
    openModal (data = {}, form = true) {
      this.valid = true;
      this.$refs.form.reset();
      if (data._id) {
        if (data.telefonos) {
          data.telefonos = data.telefonos;
        } else {
          data.telefonos = [];
        }
        this.form = data;
      } else {
        this.form = {
          nombre: '',
          sigla: '',
          descripcion: '',
          email: '',
          web: '',
          mae: '',
          fecha_nacimiento: '',
          direccion: '',
          telefonos: [],
          estado: ''
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
          const id = data._id;
          delete data.activo;
          delete data.createAt;
          delete data.updateAt;
          delete data.deleteAt;
          delete data.deleted;
          delete data._id;
          delete data.__v;
          this.$service.put(`instituciones/${id}`, data).then((response) => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('Se actualizó el registro correctamente');
              if (id === this.user.institucion._id) {
                this.logout();
              }
            }
          });
        } else {
          delete data.usuario;
          this.$service.post('instituciones', data).then((response) => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('Se actualizó el registro correctamente');
            }
          });
        }
      }
    },
    deleteInstitucion (id, url) {
      this.$confirm('¿Esta seguro de que desea eliminar esta institución? Todo registro relacionado a esta institución será eliminado', () => {
        this.$service.delete(url || this.url, id)
          .then(response => {
            this.$message.success('¡Registro eliminado correctamente!');
            if (id === this.user.institucion._id) {
              this.logout();
            }
            this.updateList();
          });
      });
    },
    remove (item) {
      this.form.telefonos.splice(this.form.telefonos.indexOf(item), 1);
      this.form.telefonos = [...this.form.telefonos];
    },
    obtenerInstitucionPortal () {
      const id = this.form.codigo_portal;
      const url = `instituciones/portal_unico/entidades/${id}`;
      this.$service.get(url)
      .then(response => {
        if (response) {
          this.$refs.form.reset();
          this.$message.success('¡Registro obtenido correctamente!');
          this.form.codigo_portal = id;
          this.form.nombre = response.denominacion;
          this.form.sigla = response.sigla;
          this.form.descripcion = response.objetivo || response.denominacion;
          this.form.email = response.contacto_correo_electronico;
          this.form.web = response.url_sitio_web;
          this.form.telefonos = this.form.telefonos || [];
          if (response.telefono) {
            this.form.telefonos.push(response.telefono);
          }
          if (response.contacto_celular) {
            this.form.telefonos.push(response.contacto_celular);
          }
        }
      });
    }
  },
  components: {
    CrudTable
  }
};
</script>
