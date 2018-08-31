<template>    
    <div class="crud-table">
      <h5>{{ 'Documento actual: ' + currentDoc.name }}</h5>
      <v-form ref="formPermisos" lazy-validation>
        <!--
        <div>
          <table class="timeline-table" id="main-permission-table">
            <thead>
              <tr>
                <th>Grupo actual</th>
                <th>Lectura</th>
                <th>Escritura</th>
                <th>Anulación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ currentGroup }}</td>
                <td>
                  <v-switch
                    title="Permiso de lectura"
                    value
                    v-on:change="changePermissions('read')"
                    :input-value="permissions[0] === 1 || permissions[0] === '1'"
                    color="primary"
                  ></v-switch>
                </td>
                <td>
                  <v-switch
                    title="Permiso de escritura"
                    value
                    v-on:change="changePermissions('write')"
                    :input-value="permissions[1] === 1 || permissions[1] === '1'"
                    color="primary"
                  ></v-switch>
                </td>
                <td>
                  <v-switch
                    title="Permiso de anulación"
                    value
                    v-on:change="changePermissions('deny')"
                    :input-value="permissions[2] === 1 || permissions[2] === '1'"
                    color="primary"
                  ></v-switch>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        -->
        <!-- Table for "main permissions" -->
        <v-layout row wrap>
          <v-flex xs12>
            <div class="text-xs-right">
              <v-tooltip color="primary" bottom>
                <v-btn icon slot="activator" large color="primary" @click.native="agregarPermiso()">
                  <v-icon dark>add</v-icon>
                </v-btn>
                <span>Agregar grupo</span>
              </v-tooltip>
            </div>
          </v-flex>
          <v-flex>
            <v-data-table :headers="cabeceraMain" :items="permisosObj" hide-actions class="elevation-1">
              <template slot="items" slot-scope="props">
                <td v-if="/* props.item.primario|| */ props.item.principal">{{ currentGroup.role }}</td>
                <td v-else>
                    <v-select
                        :items="listaGrupos"
                        item-text="role"
                        item-value="id"
                        v-model="props.item.role"
                        label="Seleccione un grupo"
                        :rules="grupoReglas"
                        @input="updatePermissions"
                    ></v-select>
                </td>
                <!--
                <td>
                    <v-select
                        :items="documents"
                        item-text="name"
                        item-value="id"
                        v-model="props.item.doc"
                        label="Seleccione un documento"
                        :rules="documentoReglas"
                    ></v-select>
                </td>
                -->
                <td class="text-center">
                    <v-switch
                        title="Permiso de lectura"
                        value
                        v-on:change="changePermissions(props.item, 'read')"
                        :input-value="props.item.read === 1"
                        color="primary"
                    ></v-switch>
                </td>
                <td>
                    <v-switch
                        title="Permiso de escritura"
                        value
                        v-on:change="changePermissions(props.item, 'write')"
                        :input-value="props.item.write === 1"
                        color="primary"
                    ></v-switch>
                </td>
                <td>
                    <v-switch
                        title="Permiso de anulación"
                        value
                        v-on:change="changePermissions(props.item, 'deny')"
                        :input-value="props.item.deny === 1"
                        color="primary"
                    ></v-switch>
                </td>
                <td>
                    <v-tooltip color="error" bottom>
                      <v-btn icon slot="activator" @click.prevent="eliminarPermiso(props.item)" v-if="/* !props.item.primario&& */ !props.item.principal">
                        <v-icon color="red darken-4">delete</v-icon>
                      </v-btn>
                      <span>Eliminar grupo</span>
                    </v-tooltip>
                </td>
              </template>
              <template slot="no-data">
                <span>No se han especificado los permisos para el paso actual</span>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
        <!-- Table for "extras" -->
        <br>
        <h5>{{ 'Permisos adicionales para documentos previos:' }}</h5>
        <v-layout row wrap>
          <v-flex xs12>
            <div class="text-xs-right">
              <v-tooltip color="primary" bottom>
                <v-btn icon slot="activator" large color="primary" @click.native="agregarExtra()">
                  <v-icon dark>add</v-icon>
                </v-btn>
                <span>Agregar permisos adicionales</span>
              </v-tooltip>
            </div>
          </v-flex>
          <v-flex>
            <v-data-table :headers="cabeceraExtras" :items="rows" hide-actions class="elevation-1">
              <template slot="items" slot-scope="props">
                <td>
                    <v-select
                        :items="listaGruposExtras"
                        item-text="role"
                        item-value="id"
                        v-model="props.item.role"
                        label="Seleccione un grupo"
                        :rules="grupoReglas"
                        @change="updateExtras"
                    ></v-select>
                </td>
                <td>
                    <v-select
                        :items="documents"
                        item-text="name"
                        item-value="id"
                        v-model="props.item.doc"
                        label="Seleccione un documento"
                        :rules="documentoReglas"
                        @change="updateExtras"
                    ></v-select>
                </td>
                <td>
                    <v-switch
                        title="Permiso de lectura"
                        value
                        v-on:change="changeSwitch(props.item, 'read')"
                        :input-value="props.item.readPermission === 1"
                        color="primary"
                    ></v-switch>
                </td>
                <td>
                    <v-switch
                        title="Permiso de escritura"
                        value
                        v-on:change="changeSwitch(props.item, 'write')"
                        :input-value="props.item.writePermission === 1"
                        color="primary"
                    ></v-switch>
                </td>
                <!--td>
                    <v-switch
                        title="Permiso de anulación"
                        value
                        v-on:change="changeSwitch(props.item, 'deny')"
                        :input-value="props.item.denyPermission === 1"
                        color="primary"
                    ></v-switch>
                </td-->
                <td>
                    <v-tooltip color="error" bottom>
                      <v-btn icon slot="activator" @click.prevent="eliminarExtra(props.item)">
                        <v-icon color="red darken-4">delete</v-icon>
                      </v-btn>
                      <span>Eliminar permiso</span>
                    </v-tooltip>
                </td>
              </template>
              <template slot="no-data">
                <span>No se han cargado permisos adicionales para otros documentos en este paso</span>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
        <!--
        <div>
          <table class="timeline-table" id="my-table">
              <thead>
                  <tr>
                      <th>Grupo</th>
                      <th>Lectura</th>
                      <th>Escritura</th>
                      <th>Anulación</th>
                      <!- th v-for="key in Object.keys(rows[0])">{{ key }}</th ->
                  </tr>
              </thead>
              <tbody v-for="row in rows" v-bind:key="row[index]">
                  <tr>
                      <td>
                          <v-select
                            :items="groups"
                            item-text="role"
                            item-value="id"
                            v-model="row.role"
                            label="Seleccione un grupo"
                          ></v-select>
                      </td>
                      <td>
                          <v-switch
                              title="Permiso de lectura"
                              value
                              v-on:change="changeSwitch(row, 'read')"
                              :input-value="row.readPermission === 1"
                              color="primary"
                          ></v-switch>
                      </td>
                      <td>
                          <v-switch
                              title="Permiso de escritura"
                              value
                              v-on:change="changeSwitch(row, 'write')"
                              :input-value="row.writePermission === 1"
                              color="primary"
                          ></v-switch>
                      </td>
                      <td>
                          <v-switch
                              title="Permiso de anulación"
                              value
                              v-on:change="changeSwitch(row, 'deny')"
                              :input-value="row.denyPermission === 1"
                              color="primary"
                          ></v-switch>
                      </td>
                  </tr>
              </tbody>
          </table>
        </div>
        -->
      </v-form>
    </div>
</template>
<script>
export default {
  props: {
    rows: {
      type: Array,
      default: () => []
    },
    groups: {
      type: Array,
      default: () => []
    },
    documents: {
      type: Array,
      default: () => []
    },
    currentGroup: {
      type: Object
    },
    currentDoc: {
      type: Object
    },
    permissions: {
      type: Array
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      // totalItems: 0,
      // items: [],
      // loading: true,
      // pagination: {
      //   rowsPerPage: 10
      // },
      // load: false,
      permisosObj: this.permissions,
      cabeceraMain: [
        {text: 'Grupo', align: 'left', sortable: false},
        {text: 'Lectura', align: 'center', sortable: false},
        {text: 'Escritura', align: 'center', sortable: false},
        {text: 'Anulación', align: 'center', sortable: false},
        {text: 'Acciones', align: 'center', sortable: false}
      ],
      cabeceraExtras: [
        {text: 'Grupo', align: 'left', sortable: false},
        {text: 'Documento', align: 'left', sortable: false},
        {text: 'Lectura', align: 'center', sortable: false},
        {text: 'Escritura', align: 'center', sortable: false},
        // {text: 'Anulación', align: 'center', sortable: false},
        {text: 'Acciones', align: 'center', sortable: false}],
      grupoReglas: [
        v => !!v || 'Debe seleccionar un grupo de la lista.',
        v => this.grupoNuevo(v) || 'No puede seleccionar un mismo grupo dos veces.'
      ],
      documentoReglas: [
        v => !!v || 'Debe seleccionar un documento de la lista.'
      ],
      listaGrupos: this.groups,
      listaGruposExtras: this.groups
    };
  },
  /*
  created () {
    if (this.$util.toType(this.order) === 'array' && this.order.length) {
      this.pagination.sortBy = this.order[0];
      if (this.order[1]) {
        this.pagination.descending = this.order[1] === 'DESC';
      }
    }
  },
  mounted () {
    for (var i = 0; i < this.permissions.length; i++) {
      this.permissions[i] = parseInt(this.permissions[i]);
    }
  },
  */
  watch: {
    permissions (permissions) {
      this.permisosObj = permissions.slice();
    },
    visible (visible) {
      this.loadGroupList();
      this.loadGroupListExtras();
    }
  },
  methods: {
    changeSwitch (row, type) {
      if (type === 'read') {
        row.readPermission = row.readPermission === 1 ? 0 : 1;
      } else if (type === 'write') {
        row.writePermission = row.writePermission === 1 ? 0 : 1;
      } else if (type === 'deny') {
        row.denyPermission = row.denyPermission === 1 ? 0 : 1;
      }
      this.$emit('modifyExtra', this.rows);
    },
    changePermissions (item, type) {
      /*
      if (this.permissions.length === 0) {
        var defaultPermission = {
          'read': 1,
          'write': 0,
          'deny': 0
        };
        this.permissions.push(defaultPermission);
      }
      */
      console.log('----------------permissions--------------------');
      console.log(this.permissions);
      console.log('------------------------------------');
      if (type === 'read') {
        item.read = item.read === 1 ? 0 : 1;
      } else if (type === 'write') {
        item.write = item.write === 1 ? 0 : 1;
      } else if (type === 'deny') {
        item.deny = item.deny === 1 ? 0 : 1;
      }
      this.$emit('modifyPermission', this.permissions);
    },
    agregarPermiso () {
      const addPermiso = {
        'role': '',
        'doc': this.currentDoc.id,
        'docTitle': this.currentDoc.name,
        'docType': this.currentDoc.tipo,
        'read': 0,
        'write': 0,
        'deny': 0
      };
      this.permissions.push(addPermiso);
      this.$emit('modifyPermission', this.permissions);
    },
    eliminarPermiso (item) {
      const idx = this.permissions.indexOf(item);
      this.permissions.splice(idx, 1);
      this.$emit('modifyPermission', this.permissions);
    },
    agregarExtra () {
      const addExtra = {
        'role': '',
        'doc': '',
        'docTitle': '',
        'docType': '',
        'readPermission': 0,
        'writePermission': 0,
        'denyPermission': 0
      };
      this.rows.push(addExtra);
      this.$emit('modifyExtra', this.rows);
    },
    eliminarExtra (item) {
      const idx = this.rows.indexOf(item);
      this.rows.splice(idx, 1);
      this.$emit('modifyExtra', this.rows);
    },
    validar () {
      return this.$refs.formPermisos.validate();
    },
    updateExtras () {
      this.$emit('modifyExtra', this.rows);
    },
    loadGroupList () {
      if (this.groups && this.groups.length > 0) {
        this.listaGrupos = this.groups.reduce((a, b) => {
          if (b.id === this.currentGroup.id || b.role === 'solicitante') {
            // this.listaGrupos.splice(i, 1);
          } else {
            a.push(b);
          }
          return a;
        }, []);
        console.log('-------grupos para permisos---------');
        console.log(this.listaGrupos);
        console.log('------------------------------------');
      } else {
        console.log('No se encontraron grupos en el array');
      }
    },
    loadGroupListExtras () {
      if (this.groups && this.groups.length > 0) {
        this.listaGruposExtras = [];
        this.groups.forEach(row => {
          this.permissions.forEach(el => {
            if (row.id === el.role) {
              this.listaGruposExtras.push(row);
            }
          });
        });
        console.log('-------grupos para extras-----------');
        console.log(this.listaGruposExtras);
        console.log('------------------------------------');
        this.validateExtrasGroups();
      } else {
        console.log('No se encontraron grupos en el array');
      }
    },
    grupoNuevo (valor) {
      let count = 0;
      for (let i in this.permissions) {
        if (this.permissions[i].role === valor) {
          count++;
        }
      }
      return count > 1 ? false : true;
    },
    updatePermissions (value) {
      this.$emit('modifyPermission', this.permissions);
      this.loadGroupListExtras();
    },
    validateExtrasGroups () {
      for (let i in this.rows) {
        let exists = false;
        for (let j in this.listaGruposExtras) {
          if (this.rows[i].role === this.listaGruposExtras[j].id) {
            exists = true;
          }
        }
        if (!exists) {
          this.rows[i].role = '';
        }
      }
    }
  }
};
</script>
<style lang="scss">
  $filterBackground: #f5f5f5;
  $filterBorder: #e5e5e5;

  .crud-table {
    .table-actions {
      white-space: nowrap;
      padding: 0 0 0 5px !important;
      text-align: center;
    }

    td {
      .alert {
        padding: 2px 8px;
        text-align: center;
        font-size: 0.9rem;
        font-weight: 600;
        display: inline-block;
      }
    }

    .btn-refresh {
      min-width: 52px;

      .btn__content {
        padding: 0;
      }

    }

    .btn-filter {
      display: inline-block;
      position: relative;

      &.active {
        .btn {
          background-color: $filterBackground !important;
          box-shadow: none;
        }

        &::after, &::before {
          display: block;
        }
      }

      &::after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        bottom: -11px;
        left: 12px;
        border-bottom: 12px solid $filterBackground;
        border-left: 14px solid transparent;
        border-right: 14px solid transparent;
        z-index: 1;
        display: none;
      }

      &::before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        bottom: -10px;
        left: 12px;
        border-bottom: 12px solid $filterBorder;
        border-left: 14px solid transparent;
        border-right: 14px solid transparent;
        display: none;
      }
    }

    .filter-container {
      background-color: $filterBackground;
      padding: 10px 15px 5px;
      border: 1px solid $filterBorder;
      position: relative;
      // margin-top: 10px;

      .filter-item {
        display: inline-block;
        width: 200px;
        margin-right: 10px;
        vertical-align: top;
      }

      & > .btn {
        position: absolute;
        top: -3px;
        right: -5px;
      }

      & > .icon {
        display: inline-block;
        margin: 14px 5px 0 0;
      }
    }
  }
</style>
