<template>
<section>
    <!--<v-card flat>
      <v-card-text>
        <v-container>
          <v-tooltip right>
            <v-btn @click.native="abrirPlataformaPagos()" class="p-interoperabilidad" color="success" slot="activator"><v-icon>payment</v-icon> </v-btn>
            <span>Plataforma de pagos del estado</span>
          </v-tooltip>
        </v-container>
      </v-card-text>
  </v-card>-->

<v-dialog v-model="mostrarPpte" max-width="800" persistent  scrollable>
    <v-card class="dialog-token">
        <v-card-title class="headline" scrollable>
          <v-icon>payment</v-icon> Configuración para la Plataforma de Pago de Trámites del Estado
          <v-btn icon @click.native="cerrarPlataformaPagos()">
            <v-icon>close</v-icon>
          </v-btn>

        </v-card-title>

        <v-card-text class="pa-0">
          <v-alert ng-if="e1 > 0" color="error" icon="help" value="true">{{mensajes.datosNecesarios}}</v-alert>
              <v-stepper v-model="e1">
                  <v-stepper-header>
                      <v-stepper-step step="1" :complete="e1 > 0">Usuario y contraseña</v-stepper-step>
                      <v-divider></v-divider>
                      <v-stepper-step step="2" :complete="e1 > 1">Datos del trámite</v-stepper-step>
                      <v-divider></v-divider>
                      <v-stepper-step step="3" :complete="e1 > 2">Cuentas y montos</v-stepper-step>
                      <v-divider></v-divider>
                      <v-stepper-step step="4" :complete="e1 > 3">Grupos y permisos</v-stepper-step>
                      <v-divider></v-divider>
                  </v-stepper-header>
                  <v-stepper-items>
                      <v-stepper-content step="1">
                          <v-card-text>
                              <v-text-field
                                  name="username"
                                  label="Usuario de la Plataforma de Pagos"
                                  id="username"
                                  append-icon="person"
                                  v-model="formAuth.username"
                                  autofocus
                                  maxlength="25"
                                  required
                              ></v-text-field>
                              <v-text-field
                                  name="password"
                                  label="Contraseña de la Plataforma de Pagos"
                                  id="password"
                                  append-icon="lock"
                                  v-model="formAuth.password"
                                  type="password"
                                  maxlength="100"
                                  required
                              ></v-text-field>
                          </v-card-text>
                      </v-stepper-content>
                      <v-stepper-content step="2">
                          <v-card-text scrollable>
                            <v-checkbox
                            v-show="id"
                             :label="'Buscar en todos los trámites existentes(Si desactiva esta opción solo se modificara el presente trámite.)'" 
                              v-model="modificarCpu" color="primary"></v-checkbox>
                              <v-text-field name="codigoPortalUnico"
                                  label="Código de portal único"
                                  id="codigoPortalUnico"
                                  append-icon=""
                                  v-model="formTramite.codigoPortalUnico"
                                  maxlegth="15"
                                  required
                                  v-on:change="recuperaDocumentoTramiteExistente()"
                              >

                              </v-text-field>
                              <v-text-field name="descripcion"
                                  label="Descripción (Nombre) del trámite de pago"
                                  id="decripcion"
                                  append-icon=""
                                  v-model="formTramite.descripcion"
                                  maxlegth="500"
                                  required
                              >
                              </v-text-field>
                              <v-text-field name="vigenciaEnDias"
                                  label="Vigencia en días"
                                  id="vigenciaEndias"
                                  v-model="formTramite.vigenciaEnDias"
                                  maxlength="3"
                                  @keydown.native="$filter.numeric($event)"
                                  required
                              >
                              </v-text-field>
                          </v-card-text>
                      </v-stepper-content>
                      <v-stepper-content step="3">
                        <h3 class="headline">
                          Montos
                          <v-btn fab dark @click="adicionarCuenta()" color="primary" title="Agregar una cuenta">
                            <v-icon dark>add</v-icon>
                          </v-btn>
                        </h3>
                        <v-checkbox
                          name="montoVariable"
                          id="montoVariable"
                          label="Monto variable"
                          v-model="formTramite.montoVariable"
                        ></v-checkbox>
                        <v-container fluid px-0>
                          <div v-for="(cuenta, index) in cuentas">
                            <v-layout row wrap>
                              <v-flex xs1>
                                <strong class="btn-remove">{{ index + 1 }}.</strong>
                              </v-flex>
                              <v-flex xs6>
                                <div class="form-group">
                                  <v-select
                                    :items="cuentasExistentes"
                                    v-model="cuenta.cuenta"
                                    label="Numero de cuenta"
                                    item-text="cuenta"
                                    item-value="cuenta"
                                    autocomplete
                                    v-on:change="onChange($event,index)"
                                  ></v-select>
                                </div>
                              </v-flex>
                              <v-flex xs1></v-flex>
                              <v-flex xs3>
                                <div class="form-group">
                                  <v-text-field
                                  :label="formTramite.montoVariable ? 'Maximo (bs.):' : 'Monto (bs.):'"
                                  id="monto"
                                  v-model="cuenta.monto"
                                  maxlength="11"
                                  @keydown.native="$filter.numeric($event)"
                                  ></v-text-field>
                                </div>
                              </v-flex>
                              <v-flex xs1>
                                <v-btn small icon @click="eliminarCuenta(index)" title="Eliminar esta fila">
                                <!-- <v-btn small icon class="sma-0 btn-remove" @click="eliminarCuenta(index)" title="Eliminar esta fila"> -->
                                  <!-- <v-icon error>remove_circle</v-icon> -->
                                  <v-icon color="red darken-4">delete</v-icon>
                                </v-btn>
                              </v-flex>
                            </v-layout>
                          </div>
                        </v-container>
                      </v-stepper-content>
                      <v-stepper-content step="4">
                        <v-card-text scrollable>
                            <h4>{{ 'Grupo propietario' }}</h4>
                              <v-flex xs12>
                                <div class="form-group">
                                  <v-select
                                      :items="grupos"
                                      item-text="role"
                                      item-value="id"
                                      v-model="grupo"
                                      label="Seleccione un grupo propietario"
                                      @change="adicionaPrincipal"
                                  ></v-select>
                                </div>
                              </v-flex>
                              <h4>{{ 'Permisos' }}</h4>
                              <v-layout row wrap>
                              <v-flex xs12>
                                <div class="text-xs-right">
                                  <v-btn fab dark small color="primary" @click.native="agregarPermiso()">
                                    <v-icon dark>add</v-icon>
                                  </v-btn>
                                </div>
                              </v-flex>
                              <v-flex>
                                <v-data-table :headers="cabeceraMain" :items="permisosObj" hide-actions class="elevation-1">
                                  <template slot="items" slot-scope="props">
                                    <td v-if="/* props.item.primario|| */ props.item.principal">{{ currentGroup.role }}</td>
                                    <td v-else>
                                         <v-select
                                            :items="grupos"
                                            item-text="role"
                                            item-value="id"
                                            v-model="props.item.role"
                                            label="Seleccione un grupo propietario"
                                          ></v-select>
                                    </td>
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
                                        <v-btn icon @click="eliminarPermiso(props.item)" v-if="/* !props.item.primario&& */ !props.item.principal">
                                          <v-icon color="red darken-4">delete</v-icon>
                                        </v-btn>
                                    </td>
                                  </template>
                                  <template slot="no-data">
                                    <span>No se han especificado los permisos para el paso actual</span>
                                  </template>
                                </v-data-table>
                              </v-flex>
                            </v-layout>
                          </v-card-text>
                      </v-stepper-content>
                  </v-stepper-items>
              </v-stepper>
          <v-card-actions>
              <v-spacer></v-spacer>
            <v-btn @click.native="cerrarPlataformaPagos()"><v-icon>cancel</v-icon> Cancelar</v-btn>
            <v-btn v-if="e1 > 1" @click.native="retrocederPaso()"><v-icon>chevron_left</v-icon> Atrás</v-btn>
            <v-btn v-if="e1 === 1" color="primary" @click.native="avanzarPaso()"><v-icon>chevron_right</v-icon> Conectar</v-btn>
            <v-btn v-if="e1 === 2 || e1 === 3" color="primary" @click.native="avanzarPaso()"><v-icon>chevron_right</v-icon> Continuar</v-btn>
            <v-btn v-if="e1 > 3" color="primary" @click.native="guardarPlataformaPagos()"><v-icon dark>check</v-icon> Guardar</v-btn>
          </v-card-actions>
        </v-card-text>
    </v-card>
</v-dialog>

</section>
</template>

<script>
/* eslint no-useless-escape: 0 */
/* eslint no-unneeded-ternary:0 */
import baseField from '../baseField';
export default {
  mixins: [baseField],
  mounted () {
    // console.log('-----------------------------grupos-------------------------------------');
    // console.log(this.grupos);
    // console.log('---------------------------------------------------------------------------');
  },
  methods: {
    onChange (event, index) {
      if (typeof event !== 'string') {
        this.cuentasExistentes.push({ cuenta: event.target.value });
        this.cuentas[index].cuenta = event.target.value;
      }
    },
    login () {
      this.$service.post(`ppte/autenticacion`, { usuario: this.formAuth.username, password: this.formAuth.password }).then((response) => {
        if (response) {
          this.$storage.set('tokenppte', response.token);
          this.$message.success('Se ha conectado exitosamente a la plataforma de pagos.');
          this.e1++;
        }
      });
    },
    abrirPlataformaPagos () {
      this.data = this.$store.state.cellData;
      this.grupos = this.data.groups;
      if (this.data.value && this.data.value.docId) {
        this.id = this.data.value.docId;
        this.permisosObj = this.data.value.permissions;
        this.grupo = this.data.value.groupId;
        this.setCurrentGroup(this.data.value.groupId);
        this.recuperardocumento();
      } else {
        this.id = null;
        console.log('-------------------------------------------------------------------------');
        console.log('nuevo');
        console.log('---------------------------------------------------------------------------');
      }
      this.e1 = 1;
      this.mostrarPpte = true;
    },
    recuperaDocumentoTramiteExistente () {
      if (!this.modificarCpu) {
        return;
      }
      this.$service.post(`ppte/verificaTramite/` + this.formTramite.codigoPortalUnico, { token: this.$storage.get('tokenppte') })
        .then((response) => {
          if (response) {
            if (response.datos === null) {
              this.formTramite.id = null;
              // this.formTramite.codigoPortalUnico = '';
              this.formTramite.vigenciaEnDias = null; // 0;
              this.formTramite.descripcion = '';
              this.cuentas = [{cuenta: '', monto: ''}];
              console.log('-------------------------------------------------------------------------');
              console.log('No se encontro nada, -> nuevito.');
              console.log('-------------------------------------------------------------------------');
            } else {
              this.formTramite.id = response.id;
              this.formTramite.codigoPortalUnico = response.codigoPortalUnico;
              this.formTramite.descripcion = response.descripcion;
              this.formTramite.vigenciaEnDias = response.vigenciaEnDias;
              this.formTramite.montoVariable = response.montoVariable;
              if (response.montos) {
                this.cuentas = [];
                response.montos.map((monto) => {
                  this.cuentas.push({ cuenta: monto.cuenta.cuenta, monto: monto.monto });
                });
              }
              console.log('-------------------------------------------------------------------------');
              console.log('Se encontró un trámite en la Ppte, -> editar.');
              console.log('-------------------------------------------------------------------------');
              this.$message.success(response.mensaje || 'Se recupero un trámite existente.');
            }
          } else {
            this.formTramite.id = null;
            this.formTramite.codigoPortalUnico = '';
            this.formTramite.vigenciaEnDias = null; // 0;
            this.formTramite.descripcion = '';
            this.cuentas = [{cuenta: '', monto: ''}];
          }
        })
        .catch((error) => {
          console.log('error:', error);
          this.$message.error(error.message || 'No se pudo recuperar la configuración del componente de de pagos.');
        });
    },
    recuperardocumento () {
      this.$service.get(`documentos_plantilla/`, this.id)
        .then((response) => {
          console.log('-------------documento recuperado------------------------------------------------------------');
          console.log(response);
          // this.modificarCpu = false;
          this.formTramite.id = response.body.id;
          this.formTramite.codigoPortalUnico = response.body.codigoPortalUnico;
          this.formTramite.descripcion = response.body.descripcion;
          this.formTramite.vigenciaEnDias = response.body.vigenciaEnDias;
          this.formTramite.montoVariable = response.body.montoVariable;
          if (response.body.montos) {
            this.cuentas = [];
            response.body.montos.map((monto) => {
              this.cuentas.push({ cuenta: monto.cuenta.cuenta, monto: monto.monto });
            });
          }
        });
    },
    cerrarPlataformaPagos () {
      this.mostrarPpte = false;
      this.e1 = 1;
      this.cuentas = [
        {
          cuenta: '',
          monto: ''
        }
      ];
      this.formAuth = {
        username: '',
        password: ''
      };
      this.formTramite = {
        id: null,
        codigoPortalUnico: '',
        descripcion: '',
        vigenciaEndias: null, // 0,
        montoVariable: false
      };
    },
    adicionarCuenta () {
      this.cuentas.push({
        cuenta: '',
        monto: null
      });
    },
    eliminarCuenta (index) {
      if (this.cuentas.length === 1) {
        this.$message.error('El trámite debe tener por lo menos una cuenta asociada.');
      } else {
        this.cuentas.splice(index, 1);
      }
    },
    retrocederPaso () {
      if (this.e1 > 1) {
        this.e1--;
      }
    },
    agregarPermiso () {
      const addPermiso = {
        principal: false,
        role: '',
        read: 0,
        write: 0,
        deny: 0
      };
      this.permisosObj.push(addPermiso);
      this.$emit('modifyPermission', this.permissions);
    },
    changePermissions (item, type) {
      if (type === 'read') {
        item.read = item.read === 1 ? 0 : 1;
      } else if (type === 'write') {
        item.write = item.write === 1 ? 0 : 1;
      } else if (type === 'deny') {
        item.deny = item.deny === 1 ? 0 : 1;
      }
      this.$emit('modifyPermission', this.permissions);
    },
    setCurrentGroup (value) {
      if (value) {
        this.grupo = value;
        this.currentGroup.id = value;
      }
      this.grupos.map(grupo => {
        if (this.currentGroup.id === grupo.id) {
          this.currentGroup.role = grupo.role;
        }
      });
    },
    setSendOption (value) {
      if (value) {
        this.configData.value.sendOption = {
          'tipo': value,
          'grupo': this.currentGroup.id
        };
      } else {
        this.configData.value.sendOption.grupo = this.currentGroup.id;
      }
    },
    adicionaPrincipal (value) {
      this.setCurrentGroup(value);
      this.permisosObj = [];
      this.permisosObj.push({principal: true, role: this.grupo, read: 1, write: 1, deny: 0});
    },
    eliminaPermiso (item) {
      const idx = this.permissions.indexOf(item);
      this.permissions.splice(idx, 1);
      this.$emit('modifyPermission', this.permissions);
    },
    avanzarPaso () {
      let step = (typeof this.e1 === 'string') ? parseInt(this.e1) : this.e1;
      switch (step) {
        case 1 :
          if (this.formAuth.username !== '' && this.formAuth.password !== '') {
            this.login();
          } else {
            this.$message.error('Debe ingresar un nombre de usuario y contraseña para la Plataforma de Pagos.');
          }
          break;
        case 2 :
          console.log(this.formTramite);
          if (this.formTramite.codigoPortalUnico !== '' && this.formTramite.descripcion !== '' && this.formTramite.vigenciaEnDias > 0) {
            this.recuperaCuentasExistentes();
            this.e1++;
          } else {
            this.$message.error('Debe completar todos los datos del trámite.');
          }
          break;
        case 3 :
          if (this.cuentas.length > 0 && this.cuentas[0].cuenta) {
            this.e1 ++;
          }
          break;
        case 4 :
          if (this.permisosObj.length !== 0) {
            this.e1 ++;
          } else {
            this.$message.error('Debe agregar permisos para el componente de pagos');
          }
          break;
        default:
          this.$message.error('Errorsito');
      }
    },
    recuperaCuentasExistentes () {
      this.$service.post(`ppte/entidades/cuentas`, { token: this.$storage.get('tokenppte') })
        .then(response => {
          if (response) {
            this.cuentasExistentes = response;
            // this.$message.success(response.mensaje);
          }
        }).catch(error => {
          this.$message.error(error.message || 'No se pudo guardar la configuración.');
        });
    },
    guardarPlataformaPagos () {
      if (this.cuentas[0].cuenta === '' || this.cuentas[0].monto === 0 || isNaN(this.cuentas[0].monto) || this.cuentas[0].monto === '') {
        this.$message.error('Ingresar al menos una cuenta y monto válidos para el trámite.');
        return;
      }
      let montos = this.cuentas.map(el => {
        el.monto = parseFloat(el.monto);
        return el;
      });
      if (!this.grupo && !this.permisosObj) {
        this.$message.error('Debe seleccionar un grupo propietario');
        return;
      }
      const enviar = {
        tramite: {
          id: this.formTramite.id,
          codigoPortalUnico: this.formTramite.codigoPortalUnico,
          descripcion: this.formTramite.descripcion,
          vigenciaEnDias: parseInt(this.formTramite.vigenciaEnDias),
          montoVariable: this.formTramite.montoVariable,
          cuentas: montos
        },
        token: this.$storage.get('tokenppte')
      };
      if (this.id === null) {
        this.$service.post(`ppte/crearTramite/${this.institucion}`, enviar)
        .then(response => {
          if (response) {
            this.$message.success(response.mensaje);
            this.permisosObj.forEach(permiso => {
              permiso.doc = response.documentoId;
              permiso.docTitle = response.descripcion;
              permiso.docType = 'P';
            });
            let sendOption = {
              'grupo': this.grupo,
              'tipo': 'todos'
            };
            let respuestaPaso = {
              'type': 'payment',
              'cellId': this.data.cellId,
              'value': {
                'tipo': this.data.value.tipo,
                'name': response.descripcion,
                'docId': response.documentoId,
                'permissions': this.permisosObj,
                'groupId': this.grupo,
                'sendOption': sendOption
              }
            };
            this.$emit('saveCellData', respuestaPaso);
            this.cerrarPlataformaPagos();
          }
        })
        .catch(error => {
          console.log(error);
          this.$message.error(
            error.message || 'No se pudo guardar la configuración para la plataforma de pagos.'
          );
        });
      } else {
        this.$service.post(`ppte/editarTramite/${this.id}`, enviar)
        .then(response => {
          if (response) {
            this.permisosObj.forEach(permiso => {
              permiso.doc = response.documentoId;
              permiso.docTitle = response.descripcion;
              permiso.docType = 'P';
            });
            this.$message.success(response.mensaje);
            let sendOption = {
              'grupo': this.grupo,
              'tipo': 'todos'
            };
            let respuestaPaso = {
              'type': 'payment',
              'cellId': this.data.cellId,
              'value': {
                'tipo': this.data.value.tipo,
                'name': response.descripcion,
                'docId': response.documentoId,
                'permissions': this.permisosObj,
                'groupId': this.grupo,
                'sendOption': sendOption
              }
            };
            console.log('----------------------------respuesta--------------------------------------');
            console.log(respuestaPaso);
            console.log('---------------------------------------------------------------------------');
            this.$emit('saveCellData', respuestaPaso);
            // this.$parent.$options.methods.updateGraphCell(respuestaPaso);
            this.cerrarPlataformaPagos();
          }
        })
        .catch(error => {
          this.$message.error(
            error.message || 'No se pudo guardar la configuración para la plataforma de pagos.'
          );
        });
      }
    }
  },
  props: {
    institucion: {
      required: true
    }
  },
  data () {
    return {
      data: {
        'cellId': '',
        'connected': {
          'onNext': []
        },
        'currentGroup': '',
        'documents': [],
        'groups': [],
        'type': '',
        'value': {
          'name': '',
          'extras': []
        }
      },
      cabeceraMain: [
        {text: 'Grupo', align: 'left', sortable: false},
        {text: 'Lectura', align: 'center', sortable: false},
        {text: 'Escritura', align: 'center', sortable: false},
        {text: 'Anulación', align: 'center', sortable: false},
        {text: 'Acciones', align: 'center', sortable: false}
      ],
      modificarCpu: true,
      permissions: [],
      permisosObj: [],
      grupos: this.data,
      grupo: null,
      currentGroup: {},
      id: null,
      modo: 'nuevo',
      cuentas: [
        {
          cuenta: '',
          monto: ''
        }
      ],
      mostrarPpte: false,
      cuentasExistentes: [],
      formAuth: {
        username: '',
        password: ''
      },
      formTramite: {
        id: null,
        codigoPortalUnico: '',
        descripcion: '',
        vigenciaEndias: 0,
        montoVariable: false
      },
      e1: 0,
      // e2: 0,
      // headers: [
      //   { text: 'Numero de cuenta', sortable: false, align: 'center' },
      //   { text: 'Monto', sortable: false, align: 'center' },
      //   { text: 'Acciones', sortable: false, align: 'right' }
      // ],
      // validezReglas: [
      //   v => !!v || 'La validez del token de retorno es un dato obligatorio.'
      // ]
      mensajes: {
        datosNecesarios:
          'Llene los datos necesarios para interactuar con la Plataforma de pagos del estado.',
        aclaracionCuentas:
          'Ingrese la(s) cuenta(s) y el monto, luego presione el boton (+)'
      }
    };
  }
};
</script>
