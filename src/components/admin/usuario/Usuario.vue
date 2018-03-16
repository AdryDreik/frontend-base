<template>
  <section>
    <h3 class="primary--text"><v-icon info>person_outline</v-icon> {{$t('user.title') }}</h3>
    <v-card>
      <v-card-text>
        <crud-table
          :headers="headers"
          :url="url"
          :filters="filters"
          :graphql="graphql"
          :data-graphql="dataGraphql"
          :widthModal="800"
        >
          <template slot="buttons">
            <v-tooltip bottom v-if="$store.state.permissions['usuarios:create']">
              <v-btn
                color="primary"
                @click.native.stop="openModal()"
                slot="activator"
              ><v-icon>person_add</v-icon> {{$t('common.add') }}</v-btn>
              <span>{{$t('user.add')}}</span>
            </v-tooltip>
          </template>

          <template slot="form" slot-scope="props">
            <v-card-title class="headline">
              <v-icon>{{ form.id ? 'person' : 'person_add' }}</v-icon> {{ form.id ? $t('user.crud.editUser') : $t('user.crud.addUser') }}
              <v-btn icon @click.native="$store.commit('closeModal')">
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>
            <v-form
              @submit.prevent="save"
              v-model="valid"
              ref="form"
              lazy-validation>
              <v-alert color="info"
                value="true"
                v-if="form.usuario == usuario && form.id">
                Puede cambiar su contraseña yendo a:
                <router-link to="/account" class="white--text">
                  <strong><v-icon dark class="icon-small">person</v-icon> {{ $t('app.account') }}</strong>
                </router-link>.
              </v-alert>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout row wrap>
                    <v-flex xs6>
                      <v-text-field
                        label="Nombre de usuario"
                        prepend-icon="person"
                        v-model="form.usuario"
                        maxlength="50"
                        autocomplete="off"
                        :rules="$validate(['required'])"
                        required
                        autofocus
                        ></v-text-field>
                    </v-flex>

                    <v-flex xs6>
                      <v-text-field
                        v-if="!form.id"
                        label="Contraseña"
                        v-model="form.contrasena"
                        :prepend-icon="getIcon"
                        :prepend-icon-cb="changeIcon"
                        :type="hidePass ? 'password' : 'text'"
                        maxlength="50"
                        autocomplete="off"
                        :rules="$validate(['required'])"
                        required
                        ></v-text-field>
                    </v-flex>

                    <v-flex xs4>
                      <v-text-field
                        label="Nombre(s)"
                        v-model="form.nombres"
                        maxlength="100"
                        ></v-text-field>
                    </v-flex>

                    <v-flex xs4>
                      <v-text-field
                        label="Primer apellido"
                        v-model="form.primer_apellido"
                        maxlength="100"
                        ></v-text-field>
                    </v-flex>

                    <v-flex xs4>
                      <v-text-field
                        label="Segundo apellido"
                        v-model="form.segundo_apellido"
                        maxlength="100"
                        ></v-text-field>
                    </v-flex>

                    <v-flex xs6>
                      <v-text-field
                        label="Correo electrónico"
                        v-model="form.email"
                        maxlength="100"
                        prepend-icon="email"
                        :rules="$validate(['email'])"
                        ></v-text-field>
                    </v-flex>

                    <v-flex xs6>
                      <v-text-field
                        label="Teléfono"
                        prepend-icon="phone"
                        v-model="form.telefono"
                        maxlength="30"
                        ></v-text-field>
                    </v-flex>

                    <v-flex xs7 v-if="$store.state.user.id_rol != 5">
                      <v-select
                        :items="entidades"
                        v-model="form.id_entidad"
                        label="Entidad"
                        item-text="text"
                        item-value="value"
                        autocomplete
                        noDataText="No hay resultados"
                        :rules="$validate(['required'])"
                        required
                        ></v-select>
                    </v-flex>

                    <v-flex xs5 v-if="!(form.usuario == usuario && form.id)">
                      <v-select
                        :items="roles"
                        v-model="form.id_rol"
                        label="Rol"
                        item-text="text"
                        item-value="id"
                        :rules="$validate(['required'])"
                        required
                        ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <small class="error--text text-required">* Los campos son obligatorios</small>
                <v-spacer></v-spacer>
                <v-btn @click.native="$store.commit('closeModal');"><v-icon>cancel</v-icon> {{$t('common.cancel') }}</v-btn>
                <v-btn color="primary" type="submit"><v-icon>check</v-icon> {{$t('common.save') }}</v-btn>
              </v-card-actions>
            </v-form>
          </template>

          <template slot="items" slot-scope="items">
            <td class="nowrap">
              <v-tooltip bottom v-if="$store.state.permissions['usuarios:update'] && items.item.id_rol != 8">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="editItem(items.item.id, 'usuario', dataGraphql)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <span>Editar registro</span>
              </v-tooltip>
              <v-tooltip
                bottom
                v-if="$store.state.permissions['usuarios:delete'] && items.item.id_rol != 8 && usuario !== items.item.usuario">
                <v-btn
                  icon
                  slot="activator"
                  @click.native="deleteItem(items.item.id, 'usuario')">
                  <v-icon color="red">delete</v-icon>
                </v-btn>
                <span>Eliminar registro</span>
              </v-tooltip>
            </td>
            <td>
              <v-tooltip bottom v-if="$store.state.permissions['usuarios:update'] && items.item.id_rol != 8">
                <v-switch
                  v-model="items.item.active"
                  value="ACTIVE"
                  v-if="usuario !== items.item.usuario"
                  @change="changeActive(items.item, items.item.id, 'usuario', 'EditUsuario')"
                  slot="activator"
                  color="success"></v-switch>
                <span>Activar/desactivar registro</span>
              </v-tooltip>
              <v-icon
                v-if="!$store.state.permissions['usuarios:update'] && usuario !== items.item.usuario"
                :color="items.item.active === 'ACTIVE' ? 'success' : 'error'">
                {{ items.item.active === 'ACTIVE' ? 'check' : 'close' }}
              </v-icon>
              <v-tooltip bottom>
                <router-link
                  to="/account"
                  v-if="usuario === items.item.usuario"
                  slot="activator">
                  <v-icon>person</v-icon>
                </router-link>
                <span>Este usuario soy yo, clic aquí para ir a mi cuenta.</span>
              </v-tooltip>
            </td>
            <td>{{ items.item.usuario }}</td>
            <td>{{ items.item.primer_apellido }} {{ items.item.segundo_apellido }} {{ items.item.nombres }}</td>
            <td>{{ items.item.email }}</td>
            <td>{{ items.item.entidad_nombre }}</td>
            <td>{{ items.item.rol_nombre }}</td>
            <td>
              <v-chip label color="success" text-color="white" v-if="items.item.estado == 'ACTIVO'">
                {{ items.item.estado }}
              </v-chip>
              <v-chip label color="warning" text-color="white" v-if="items.item.estado == 'INACTIVO'">
                {{ items.item.estado }}
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
import Auth from '@/components/admin/auth/mixins/auth';
import validate from '@/common/mixins/validate';
import usuario from './mixins/usuario';

export default {
  mixins: [ crud, validate, Auth, usuario ],
  created () {
    this.user = this.$storage.getUser();
    this.usuario = this.user.usuario;
    this.entidades = [];
    this.getEntidades(3);
    this.roles = [];
    this.getRoles(4);
  },
  data () {
    return {
      graphql: true, // Definiendo el CRUD con Graphql
      url: 'usuarios',
      headers: [
        { text: this.$t('common.actions'), sortable: false },
        { text: this.$t('common.active'), sortable: false },
        { text: this.$t('user.crud.user'), value: 'usuario' },
        { text: this.$t('user.crud.fullname'), value: 'primer_apellido' },
        { text: this.$t('user.crud.email'), value: 'email' },
        { text: this.$t('user.crud.entity'), value: 'id_entidad' },
        { text: this.$t('user.crud.role'), value: 'id_rol' },
        { text: this.$t('user.crud.status'), value: 'estado' }
      ],
      dataGraphql: `
        id
        usuario
        email
        nombres
        primer_apellido
        segundo_apellido
        telefono
        estado
        id_entidad
        id_rol
        entidad_nombre
        rol_nombre
      `,
      form: {
        'usuario': '',
        'contrasena': '',
        'nombres': '',
        'primer_apellido': '',
        'segundo_apellido': '',
        'email': '',
        'telefono': '',
        'id_entidad': '',
        'id_rol': ''
      },
      filters: [
        {
          field: 'usuario',
          label: this.$t('user.crud.user'),
          type: 'text',
          typeG: 'String'
        },
        {
          field: 'nombre_completo',
          label: this.$t('user.crud.fullname'),
          type: 'text',
          typeG: 'String'
        },
        {
          field: 'email',
          label: this.$t('user.crud.email'),
          type: 'text',
          typeG: 'String'
        },
        {
          field: 'id_entidad',
          label: this.$t('user.crud.entity'),
          type: 'select',
          typeG: 'Int',
          items: []
        },
        {
          field: 'id_rol',
          label: this.$t('user.crud.role'),
          type: 'select',
          typeG: 'Int',
          items: []
        },
        {
          field: 'estado',
          label: this.$t('user.crud.status'),
          type: 'select',
          typeG: 'EstadoUsuario',
          items: [
            { value: '', text: 'TODOS' },
            { value: 'ACTIVO', text: 'ACTIVO' },
            { value: 'INACTIVO', text: 'INACTIVO' }
          ]
        }
      ],
      hidePass: true,
      usuario: null,
      valid: true
    };
  },
  methods: {
    changeIcon () {
      if (this.form.contrasena.length) {
        this.hidePass = !this.hidePass;
      }
    },
    openModal (data = {}) {
      this.$refs.form.reset();
      if (data.id) {
        this.form = data;
        this.form.id_rol = this.getValue(this.form.id_rol, this.roles);
        this.form.id_entidad = this.getValue(this.form.id_entidad, this.entidades);
      } else {
        this.form = {
          'usuario': '',
          'contrasena': '',
          'nombres': '',
          'primer_apellido': '',
          'segundo_apellido': '',
          'email': '',
          'telefono': '',
          'id_entidad': '',
          'id_rol': ''
        };
      }
      this.$store.commit('openModal');
    },
    save () {
      if (this.$store.state.user.id_rol === 5) {
        this.form.id_entidad = this.$store.state.user.id_entidad;
      }
      if (this.$refs.form.validate()) {
        let data = Object.assign({}, this.form);
        if (data.id_rol.value) {
          data.id_rol = data.id_rol.value;
        }
        if (data.id_entidad.value) {
          data.id_entidad = data.id_entidad.value;
        }
        if (data.id) {
          delete data.id;
          delete data.entidad_nombre;
          delete data.rol_nombre;
          this.$service.graphql({
            query: `
              mutation edit($id: Int!, $usuario: EditUsuario!) {
                usuarioEdit(id: $id, usuario: $usuario) {
                  id
                }
              }
            `,
            variables: {
              id: this.form.id,
              usuario: data
            }
          }).then(response => {
            if (response) {
              if (this.usuario === this.form.usuario) {
                this.$message.warning('Sus datos fueron actualizados, debe ingresar de nuevo al sistema.');
                this.logout();
              } else {
                this.$store.commit('closeModal');
                this.updateList();
                this.$message.success('Se actualizó el registro correctamente');
              }
            }
          });
        } else {
          this.$service.graphql({
            query: `
              mutation add($usuario: NewUsuario!) {
                usuarioAdd(usuario: $usuario) {
                  id
                }
              }
            `,
            variables: {
              usuario: data
            }
          }).then(response => {
            if (response) {
              this.$store.commit('closeModal');
              this.updateList();
              this.$message.success();
            }
          });
        }
      }
    }
  },
  components: {
    CrudTable
  },
  computed: {
    getIcon () {
      return this.form.contrasena.length === 0 ? 'lock' : this.hidePass ? 'visibility' : 'visibility_off';
    }
  }
};
</script>