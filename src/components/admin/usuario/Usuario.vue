<template>
  <section>
    <h3 class="primary--text"><v-icon info>person_outline</v-icon> Usuarios</h3>
    <v-card>
      <v-card-text>
        <crud-table
          :headers="headers"
          :url="url"
          :filters="filters"
          :path="property"
          :widthModal="800"
          :order="order"
        >

          <template slot="buttons">
            <v-tooltip bottom>
              <v-btn color="primary" dark
                @click.native.stop="openModal()"
                slot="activator"
              ><v-icon dark>person_add</v-icon> {{$t('common.add') }}</v-btn>
              <span>{{$t('user.add')}}</span>
            </v-tooltip>
          </template>

          <template slot="form" slot-scope="props">
            <v-card-title class="headline">
              <v-layout row wrap>
                <v-flex xs10 sm10 md10 lg10 mt-2>
                  <v-icon>{{ form._id ? 'person' : 'person_add' }}</v-icon> {{ form._id ? $t('user.crud.editUser') : $t('user.crud.addUser') }}
                </v-flex>
                <v-flex xs2 sm2 md2 lg2 text-md-right text-lg-right text-sm right text-xs-right>
                  <v-tooltip bottom>
                    <v-btn icon color="primary" slot="activator" @click.native="$store.commit('closeModal')">
                      <v-icon color="white" class="ml-1">close</v-icon>
                    </v-btn>
                    <span>Cerrar ventana</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-form
              @submit.prevent="save"
              v-model="valid"
              ref="form"
              lazy-validation>
              <v-alert color="info"
                value="true"
                v-if="form._id == user._id && form._id">
                Puede cambiar su contraseña yendo a:
                <router-link to="/account" class="white--text">
                  <strong><v-icon dark class="icon-small">person</v-icon> {{ $t('app.account') }}</strong>
                </router-link>.
              </v-alert>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout row wrap>
                    <v-flex xs12 sm12 md6 lg6>
                      <v-text-field
                        label="Nombre de usuario"
                        prepend-icon="person"
                        v-model="form.user"
                        maxlength="50"
                        autocomplete="off"
                        :rules="$validate(['requerido'])"
                        required
                        autofocus
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6 lg6>
                      <v-text-field
                        v-if="!form._id"
                        label="Contraseña"
                        v-model="form.password"
                        :prepend-icon="getIcon"
                        :prepend-icon-cb="changeIcon"
                        :type="hidePass ? 'password' : 'text'"
                        maxlength="50"
                        autocomplete="off"
                        :rules="$validate(['requerido'])"
                        required
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md4 lg4>
                      <v-select
                          :items="tiposDocumento"
                          item-text="texto"
                          item-value="valor"
                          v-model="form.tipo_documento"
                          label="Tipo de documento"
                          :rules="$validate(['requerido'])"
                          required
                        ></v-select>
                    </v-flex>
                    <v-flex xs12 sm12 md4 lg4>
                      <v-text-field
                        label="Número de documento"
                        v-model="form.ci"
                        maxlength="100"
                        :rules="$validate(['requerido'])"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md4 lg4>
                      <v-menu 
                        ref="menu" 
                        lazy 
                        :close-on-content-click="false" 
                        v-model="menu" 
                        transition="scale-transition" 
                        offset-y
                        full-width 
                        :nudge-right="40" 
                        min-width="290px">
                        <v-text-field 
                          slot="activator" 
                          label="Fecha de nacimiento" 
                          v-model="form.fecha_nacimiento" 
                          @blur="parseDate(form.fecha_nacimiento)" 
                          prepend-icon="event"
                          :rules="$validate(['requerido', 'fecha'])">
                        </v-text-field>
                        <v-date-picker 
                          v-model="date" 
                          @input="form.fecha_nacimiento = formatDate($event)" 
                          no-title 
                          scrollable>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm12 md4 lg4>
                      <v-text-field
                        label="Nombre(s)"
                        v-model="form.nombres"
                        maxlength="100"
                        :rules="$validate(['requerido'])"
                        required
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md4 lg4>
                      <v-text-field
                        label="Primer apellido"
                        v-model="form.primer_apellido"
                        maxlength="100"
                        :rules="$validate(['requerido'])"
                        required
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md4 lg4>
                      <v-text-field
                        label="Segundo apellido"
                        v-model="form.segundo_apellido"
                        maxlength="100"
                        :rules="$validate(['requerido'])"
                        required
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6 lg6>
                      <v-text-field
                        label="Correo electrónico"
                        v-model="form.email"
                        maxlength="100"
                        prepend-icon="email"
                        :rules="$validate(['email'])"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md6 lg6>
                      <v-text-field
                        label="Teléfono"
                        prepend-icon="phone"
                        v-model="form.telefono"
                        maxlength="30"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm12 md5 lg5>
                      <v-select
                        :items="roles"
                        v-model="form.roles"
                        label="Rol"
                        item-text="text"
                        item-value="id"
                        :rules="$validate(['requerido'])"
                        required
                        ></v-select>
                    </v-flex>
                    <v-flex xs12 sm12 md7 lg7>
                      <v-select
                        :items="instituciones"
                        v-model="form.institucion"
                        label="Instituciones"
                        item-text="text"
                        item-value="value"
                        autocomplete
                        noDataText="No hay resultados"
                        :rules="$validate(['requerido'])"
                        required
                        ></v-select>
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
                    <v-btn block @click.native="$store.commit('closeModal');"><v-icon>cancel</v-icon> {{$t('common.cancel') }}</v-btn>
                  </v-flex>
                  <v-flex xs12 sm12 md2 lg2>
                    <v-btn block color="primary" type="submit" :disabled="!valid">
                      <v-icon dark>check</v-icon> {{$t('common.save') }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-form>
          </template>

          <template slot="items" slot-scope="items">
            <td>
              <v-tooltip bottom>
                <v-btn icon slot="activator" @click="editItem(items.item._id)">
                  <v-icon color="teal">edit</v-icon>
                </v-btn>
                <span>Editar registro</span>
              </v-tooltip>
              <v-tooltip bottom>
                <v-btn icon slot="activator" @click="deleteItem(items.item._id)">
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
                  @change="changeVisible('usuarios/', items.item, items.item._id)"
                  slot="activator"
                  color="success"></v-switch>
                <span>Activar/desactivar registro</span>
              </v-tooltip>
            </td>
            <td>{{ items.item.user }}</td>
            <td>{{ items.item.primer_apellido }} {{ items.item.segundo_apellido }} {{ items.item.nombres }}</td>
            <td>{{ items.item.email }}</td>
            <td>{{ items.item.roles.titulo }}</td>
            <td>{{ $datetime.format(items.item.createAt, 'dd/MM/YYYY') }}</td>            
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

import CrudTable from '@/common/util/crud-table/CrudTable.vue';
import crud from '@/common/util/crud-table/mixins/crud-table';
import validate from '@/common/mixins/validate';
// import Auth from '@/components/admin/auth/mixins/auth';
import usuario from './mixins/usuario';

export default {
  mixins: [ crud, validate, usuario ],
  created () {
    this.user = this.$storage.getUser();
    // this.usuario = this.user.usuario;
    this.instituciones = [];
    this.getInstituciones();
    this.roles = [];
    this.getRoles();
    // this.getRoles(4);
  },
  data () {
    return {
      menu: false,
      property: 'listado',
      url: 'usuarios',
      order: ['createAt', 'DESC'],
      headers: [
        { text: this.$t('common.actions'), sortable: false },
        { text: this.$t('common.active'), sortable: false },
        { text: 'Usuario', value: 'user' },
        { text: 'Nombre Completo', value: 'primer_apellido' },
        { text: 'Correo electrónico', value: 'email' },
        { text: 'Rol', value: 'roles' },
        { text: 'Fecha de creación', value: 'createAt' },
        { text: this.$t('user.crud.status'), sortable: false, value: 'estado' }
      ],
      form: {
        'user': '',
        'password': '',
        'nombres': '',
        'primer_apellido': '',
        'segundo_apellido': '',
        'ci': '',
        'tipo_documento': '',
        'fecha_nacimiento': '',
        'email': '',
        'telefono': '',
        'institucion': '',
        'roles': ''
      },
      tiposDocumento: [{'texto': 'Carnet de identidad', 'valor': 'CARNET_IDENTIDAD'}, {'texto': 'Carnet de extranjeria', 'valor': 'CARNET_EXTRANJERIA'}, {'texto': 'Pasaporte', 'valor': 'PASAPORTE'}],
      filters: [
        {
          field: 'user',
          label: this.$t('user.crud.user'),
          type: 'text',
          typeG: 'String'
        },
        {
          field: 'nombres',
          label: this.$t('user.crud.fullname'),
          type: 'text',
          typeG: 'String'
        },
        {
          field: 'email',
          label: this.$t('user.crud.email'),
          type: 'text',
          typeG: 'String'
        }
      ],
      hidePass: true,
      // usuario: null,
      valid: false,
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
    save () {
      console.log('-------------form-----------------------');
      console.log(this.form);
      console.log('------------------------------------');
      if (this.$refs.form.validate()) {
        let data = Object.assign({}, this.form);
        console.log('guardando dataa.......', data);
        data.roles = data.roles.value;
        if (data._id) {
          data.institucion = data.institucion.value;
          this.$service.put(`usuarios/${data._id}`, data).then((response) => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('Se actualizó el registro correctamente');
            }
          });
        } else {
          this.$service.post('usuarios', data).then((response) => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success('El registro fue agregado correctamente');
            }
          });
        }
      }
    },
    changeIcon () {
      if (this.form.password.length) {
        this.hidePass = !this.hidePass;
      }
    },
    callChangeSwitch (item) {
      var path = 'usuarios/';
      this.$refs.flowCrudTable.changeVisible(path, item, item.id);
    },
    openModal (data = {}) {
      this.$refs.form.reset();
      if (data._id) {
        this.form = data;
        this.form.roles = this.getValue(this.form.roles, this.roles);
        this.form.institucion = this.getValue(this.form.institucion, this.instituciones);
        this.$service.get(`usuarios/${data._id}`).then((response) => {
          console.log('response');
          console.log(response);
        });
      } else {
        this.form = {
          'user': '',
          'password': '',
          'nombres': '',
          'primer_apellido': '',
          'segundo_apellido': '',
          'email': '',
          'telefono': '',
          'institucion': '',
          'roles': '',
          'tipo_documento': '',
          'ci': '',
          'fecha_nacimiento': null
        };
      }
      this.$store.commit('openModal');
    }
  },
  components: {
    CrudTable
  },
  computed: {
    getIcon () {
      return this.form.password.length === 0 ? 'lock' : this.hidePass ? 'visibility' : 'visibility_off';
    }
  }
};
</script>
