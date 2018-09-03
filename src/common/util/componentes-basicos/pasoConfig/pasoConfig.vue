<template>
  <section>
    <v-dialog v-model="mostrarConfiguracion" max-width="900" persistent scrollable>
      <v-card class="dialog-token">
        <v-card-title class="headline">
          <v-layout row wrap>
            <v-flex xs10 sm10 md10 lg10 mt-2>
              <v-icon>description</v-icon> Configuración de documento
            </v-flex>
            <v-flex xs2 sm2 md2 lg2 text-md-right>
              <v-tooltip bottom>
                <v-btn icon color="primary" slot="activator" @click.native="cerrarConfiguracion()">
                  <v-icon color="white" class="ml-1">close</v-icon>
                </v-btn>
                <span>Cerrar configuración del documento</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-stepper v-model="e1" alt-labels>
            <v-stepper-header>
              <v-stepper-step step="1" :complete="e1 > 1">Configuración general</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2" :complete="e1 > 2" v-if="this.currentDoc.tipoDocumento === 'R'">Componentes Comodin</v-stepper-step>
              <v-divider v-if="this.currentDoc.tipoDocumento === 'R'"></v-divider>
              <v-stepper-step step="3" :complete="e1 > 3">Permisos</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="4" :complete="e1 > 4">Temporizador</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="5" :complete="e1 > 5">Acciones posteriores</v-stepper-step>
              <v-divider v-if="configData.connected.onPrev && configData.connected.onPrev.length > 0 && currentGroup.role !== 'solicitante'"></v-divider>
              <v-stepper-step step="6" :complete="e1 > 6" v-if="configData.connected.onPrev && configData.connected.onPrev.length > 0 && currentGroup.role !== 'solicitante'">Derivar a</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card-text>
                  <v-form ref="form1" lazy-validation>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-text-field label="Etiqueta en el flujo" v-model="configData.value.name" required :rules="nombrePasoReglas">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-select
                          :items="configData.groups"
                          item-text="role"
                          item-value="id"
                          v-model="configData.value.groupId"
                          label="Seleccione el grupo al que se le asigna este paso"
                          :rules="grupoReglas"
                          autocomplete
                          @change="setCurrentGroup"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-select
                          :items="configData.documents"
                          item-text="name"
                          item-value="id"
                          v-model="configData.value.docId"
                          label="Seleccione el formulario que debe llenarse en este paso"
                          :rules="documentoReglas"
                          @change="setCurrentDoc"
                        ></v-select>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-stepper-content>
              <v-stepper-content step="2" v-if="this.currentDoc.tipoDocumento === 'R'">
                <v-card-text>|
                  <comodin-decision ref="comodinDecision" :configData="configData"></comodin-decision>
                </v-card-text>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-card-text>
                  <permisos-config
                    :rows="configData.value.extras"
                    :groups="configData.groups"
                    :documents="configData.documents"
                    :currentGroup="currentGroup"
                    :currentDoc="currentDoc"
                    :permissions="configData.value.permissions"
                    :visible="e1===3 ? true : false"
                    v-on:modifyExtra="actualizarExtras"
                    v-on:modifyPermission="actualizarPermisos"
                    ref="permisosConfig"
                  />
                </v-card-text>
              </v-stepper-content>
              <v-stepper-content step="4">
                <v-card-text>
                  <v-form ref="formTemporizador" lazy-validation>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-checkbox
                          :label="'Este paso tiene un tiempo limite'"
                          v-model="temporizadorCheck"
                        ></v-checkbox>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs2></v-flex>
                      <v-flex xs3>
                        <v-layout row wrap v-if="temporizadorCheck">
                          <v-flex xs3>
                            <v-btn flat icon large dark color="primary" @click="reducirDias" title="Restar dias">
                              <v-icon>remove</v-icon>
                            </v-btn>
                          </v-flex>
                          <v-flex xs6>
                            <v-text-field
                              label="Dias"
                              v-model="configData.value.temporizador[0].dias"
                              @change="validarDia"
                              maxlength="3"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs3>
                            <v-btn flat icon large dark color="primary" @click="aumentarDias" title="Aumentar dias">
                              <v-icon>add</v-icon>
                            </v-btn>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex xs2></v-flex>
                      <v-flex xs3>
                        <v-layout row wrap v-if="temporizadorCheck">
                          <v-flex xs3>
                            <v-btn flat icon large dark color="primary" @click="reducirHoras" title="Restar horas">
                              <v-icon>remove</v-icon>
                            </v-btn>
                          </v-flex>
                          <v-flex xs6>
                            <v-text-field
                              label="Horas"
                              v-model="configData.value.temporizador[0].horas"
                              maxlength="2"                              
                              @change="validarHora"
                            ></v-text-field>
                          </v-flex>
                          <v-flex xs3>
                            <v-btn flat icon large dark color="primary" @click="aumentarHoras" title="Aumentar horas">
                              <v-icon>add</v-icon>
                            </v-btn>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-stepper-content>
              <v-stepper-content step="5">
                <v-card-text>
                  <v-form ref="formAcciones" lazy-validation>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-checkbox
                          :label="'Notificar por correo electronico'"
                          v-model="notificarCheck"
                        ></v-checkbox>
                        <!--
                        <v-text-field 
                          v-if="notificarCheck"
                          label="Destinatario"
                          v-model="notificarDestinatario"
                          required
                          :rules="destinatarioReglas"
                        ></v-text-field>
                        -->
                        <v-checkbox
                          v-if="notificarCheck"
                          :label="'Notificar al solicitante'"
                          v-model="notificarSolicitante"
                        ></v-checkbox>
                        <v-checkbox
                          :label="'Seleccione para enviar correos adicionalmente en copia oculta'"
                          v-model="notificarCco"
                          v-if = "notificarCheck"
                        ></v-checkbox>
                        <template v-if="notificarCco">
                            <!-- utilizar todos los roles de la institución no solamente los configurados para el flujo -->
                          <v-select
                            v-if="notificarCheck"
                            v-model="notificarGrupo"
                            label="Seleccione el/los grupos a los que se enviará la notificación"
                            chips
                            multiple
                            autocomplete
                            :items="configData.generalRoles" 
                            item-text="role"
                            item-value="id"
                            :rules="destinatariosCCoReglas"
                            >
                            <template slot="selection" slot-scope="data">
                              <v-chip
                                close
                                @input="data.parent.selectItem(data.item)"
                                :selected="data.selected"
                                class="chip--select-multi"
                                :key="JSON.stringify(data.item)"
                                >
                                <v-icon>assignment_ind</v-icon>
                                {{ data.item.role }}
                              </v-chip>
                            </template>
                          </v-select>
                          <v-text-field 
                            v-if="notificarCheck"
                            label="Seleccione un email en concreto"
                            v-model="notificarCorreo"
                            :rules="correoReglasCCo"
                          ></v-text-field>
                        </template>
                        <v-text-field
                            v-if="notificarCheck"
                            label="Mensaje"
                            v-model="notificarMensaje"
                            :counter="400"
                            :rules="mensajeReglas"
                            multi-line
                          ></v-text-field>
                        <!--
                        <v-select
                          v-if="notificarCheck"
                          :items="configData.groups"
                          item-text="role"
                          item-value="id"
                          v-model="notificarGrupo"
                          label="Seleccione el/los grupos a los que se enviará la notificación"
                        ></v-select>
                        -->
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-checkbox
                          :label="'Firmar documento digitalmente'"
                          v-model="firmarCheck"
                        ></v-checkbox>  
                      </v-flex>
                      <v-flex xs12>
                        <v-checkbox
                          :label="'Adjuntar el documento firmado en notificación'"
                          v-model="adjuntarDoc"
                          v-if ="firmarCheck && notificarCheck"
                        ></v-checkbox>
                        
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-stepper-content>
              <v-stepper-content step="6" v-if="configData.connected.onPrev && configData.connected.onPrev.length > 0 && currentGroup.role !== 'solicitante'">
                <v-card-text>
                  <v-form ref="formDerivar">
                    <!--<v-layout v-if="configData.connected.onNext && configData.connected.onNext.length > 0" row wrap>-->
                    <v-layout row wrap>
                      <h3>Indique el tipo de derivación para el grupo: {{ currentGroup.role }} en este paso</h3>
                      <v-flex xs6>
                        <!-- v-radio-group v-model="configData.value.sendOption[0]" label="Derivar a:" required column :rules="derivarReglas" -->
                        <!--<v-radio-group label="Derivar a:" required column v-model="configData.value.sendOption[0].mode">-->
                        <v-radio-group label="Derivar a:" required column v-model="configData.value.sendOption.tipo">
                          <v-radio
                            v-for="(o, i) in opcionesDerivar"
                            :key="o"
                            :label="`${i}`"
                            :value="o"
                            v-on:change="setSendOption(o)"
                          ></v-radio>
                          <!--v-on:change="setSendOption(configData.connected.onNext[0].id, o)"-->
                        </v-radio-group>
                      </v-flex>
                    </v-layout>
                    <!--
                    <v-layout v-if="!configData.connected.onNext || configData.connected.onNext.length === 0" row wrap>
                      <h4>No existen pasos siguientes</h4>
                    </v-layout>
                    -->
                  </v-form>
                </v-card-text>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click.native="cerrarConfiguracion()"><v-icon>cancel</v-icon> Cancelar</v-btn>
          <v-btn v-if="e1 > 1" @click.native="retrocederPaso()"><v-icon>chevron_left</v-icon> Atrás</v-btn>
          <v-btn v-if="e1 < 5 || ((configData.connected.onPrev && configData.connected.onPrev.length > 0 && currentGroup.role !== 'solicitante') && e1 === 5)" color="primary" @click.native="avanzarPaso()"><v-icon dark>chevron_right</v-icon> Continuar</v-btn>
          <v-btn v-if="((!configData.connected.onPrev || configData.connected.onPrev.length === 0 || currentGroup.role === 'solicitante') && e1 === 5) || e1 == 6"  color="primary" @click.native="guardarConfiguracion()"><v-icon dark>save</v-icon> Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </section>
</template>
<script>
  /* eslint no-useless-escape: 0 */
  /* eslint no-unneeded-ternary:0 */
  /* eslint no-unused-vars:0 */
  import permisosConfig from './permisosConfig.vue';
  import comodinDecision from '../comodinConfig/DecisionComodin.vue';
  import validate from '@/common/mixins/validate';
  export default {
    components: {
      permisosConfig,
      comodinDecision
    },
    mixins: [validate],
    methods: {
      abrirConfiguracion () {
        console.log('------------------store------------------');
        console.log(this.$store.state.cellData);
        console.log('-----------------------------------------');
        if (this.$store.state.cellData.value) {
          this.configData = JSON.parse(JSON.stringify(this.$store.state.cellData));
          let onlyForms = this.configData.documents.reduce((a, b) => {
            if (b.tipo === 'F' || b.tipo === 'I') {
              a.push(b);
            }
            return a;
          }, []);
          this.configData.documents = onlyForms;
          if (!this.configData.value.permissions || this.configData.value.permissions.length === 0) {
            this.configData.value.permissions = [];
            var defaultPermissions = {
              'role': '',
              'doc': '',
              'docTitle': this.currentDoc.name,
              'docType': this.currentDoc.tipo,
              'read': 1,
              'write': 0,
              'deny': 0,
              'principal': true
            };
            // if (this.configData.primary) {
            //   defaultPermissions.primario = true;
            // } else {
            //   defaultPermissions.principal = true;
            // }
            this.configData.value.permissions.push(defaultPermissions);
          }
          if (!this.configData.value.extras || this.configData.value.extras === null) {
            this.configData.value.extras = [];
          }
          if (!this.configData.value.hasOwnProperty('sendOption') || this.configData.value.sendOption === null || this.configData.value.sendOption.length === 0) {
            this.configData.value.sendOption = {
              'tipo': 'todos',
              'grupo': ''
            };
            // if (this.configData.connected && this.configData.connected.onNext && this.configData.connected.onNext.length > 0) {
            //   let initialObj = {
            //     'goTo': this.configData.connected.onNext[0].id,
            //     'mode': 'ninguno'
            //   };
            //   // if (this.configData.value.sendOption === null) {
            //   this.configData.value.sendOption = [];
            //   // }
            //   this.configData.value.sendOption.push(initialObj);
            // } else {
            //   this.configData.value.sendOption = [];
            // }
          }
          if (!this.configData.value.hasOwnProperty('temporizador') || this.configData.value.temporizador === null || this.configData.value.temporizador.length === 0) {
            this.temporizadorCheck = false;
            this.configData.value.temporizador = [
              {
                'dias': 0,
                'horas': 0
              }
            ];
          } else {
            this.temporizadorCheck = true;
          }
          if (!this.configData.value.hasOwnProperty('acciones') || this.configData.value.acciones === null) {
            this.configData.value.acciones = [];
          } else if (this.configData.value.acciones.length > 0) {
            const currentActions = this.configData.value.acciones;
            for (let row in currentActions) {
              if (currentActions[row].hasOwnProperty('notificar')) {
                this.notificarCheck = true;
                this.notificarMensaje = currentActions[row].notificar.mensaje;
                // this.notificarDestinatario = currentActions[row].notificar.destinatario;
                this.notificarSolicitante = currentActions[row].notificar.solicitante;
                this.notificarCco = currentActions[row].notificar.notificarCco;
                this.notificarGrupo = currentActions[row].notificar.grupo;
                this.notificarCorreo = currentActions[row].notificar.correo ? currentActions[row].notificar.correo : '';
                this.adjuntarDoc = currentActions[row].notificar.adjuntarDoc;
              }
              if (currentActions[row].hasOwnProperty('firmar')) {
                this.firmarCheck = true;
              }
            }
          }
          this.setCurrentGroup();
          this.setCurrentDoc();
          console.log('-----------CONFIG DATA ADRIAN---------------');
          console.log(this.configData);
          console.log('------------------------------------');
          this.mostrarConfiguracion = true;
        } else {
          this.$message.error('Sucedió un error al cargar la configuración de inicio del componente!');
        }
      },
      reducirDias () {
        if (this.configData.value.temporizador[0].dias > 0) {
          this.configData.value.temporizador[0].dias = parseInt(this.configData.value.temporizador[0].dias) - 1;
        }
      },
      aumentarDias () {
        if (this.configData.value.temporizador[0].dias < 365) {
          this.configData.value.temporizador[0].dias = parseInt(this.configData.value.temporizador[0].dias) + 1;
        }
      },
      aumentarHoras () {
        if (this.configData.value.temporizador[0].horas < 23) {
          this.configData.value.temporizador[0].horas = parseInt(this.configData.value.temporizador[0].horas) + 1;
        } else if (this.configData.value.temporizador[0].horas === 23 && this.configData.value.temporizador[0].dias < 365) {
          this.aumentarDias();
          this.configData.value.temporizador[0].horas = 0;
        }
      },
      reducirHoras () {
        if (this.configData.value.temporizador[0].horas > 0) {
          this.configData.value.temporizador[0].horas = parseInt(this.configData.value.temporizador[0].horas) - 1;
        } else if (this.configData.value.temporizador[0].horas === 0 && this.configData.value.temporizador[0].dias > 0) {
          this.reducirDias();
          this.configData.value.temporizador[0].horas = 23;
        }
      },
      validarDia () {
        if (this.configData.value.temporizador[0].dias && this.configData.value.temporizador[0].dias > 0) {
          if (this.configData.value.temporizador[0].dias > 365) {
            this.configData.value.temporizador[0].dias = 365;
          }
        } else {
          this.configData.value.temporizador[0].dias = 0;
        }
      },
      validarHora () {
        if (this.configData.value.temporizador[0].horas && this.configData.value.temporizador[0].horas > 0) {
          if (this.configData.value.temporizador[0].horas > 23) {
            this.configData.value.temporizador[0].horas = 23;
          }
        } else {
          this.configData.value.temporizador[0].horas = 0;
        }
      },
      cerrarConfiguracion () {
        if (this.$refs.form1) {
          this.$refs.form1.reset();
        }
        if (this.$refs.formAcciones) {
          this.$refs.formAcciones.reset();
        }
        if (this.$refs.formTemporizador) {
          this.$refs.formTemporizador.reset();
        }
        if (this.$refs.formDerivar) {
          this.$refs.formDerivar.reset();
        }
        this.mostrarConfiguracion = false;
        this.e1 = 1;
        // this.configData.value.extras = [];
      },
      irPaso (e) {
        this.e1 = parseInt(e);
      },
      retrocederPaso () {
        if (this.e1 > 1) {
          this.e1--;
          if (this.e1 === 2 && this.currentDoc.tipoDocumento !== 'R') {
            this.e1--;
          }
        }
      },
      async avanzarPaso () {
        try {
          if (parseInt(this.e1) === 1) {
            if (this.$refs.form1) {
              if (this.$refs.form1.validate()) {
                this.e1 = (this.currentDoc.tipoDocumento === 'R') ? 2 : 3;
                if (this.e1 === 2) {
                  this.$refs.comodinDecision.asignarConfigComodin();
                }
              }
            } else {
              this.e1 = (this.currentDoc.tipoDocumento === 'R') ? 2 : 3;
              if (this.e1 === 2) {
                this.$refs.comodinDecision.asignarConfigComodin();
              }
            }
          } else if (parseInt(this.e1) === 2) {
            if (this.$refs.comodinDecision) {
              let isValid = true;
              for (let item of this.$refs.comodinDecision.$children) {
                if (!item.$refs.camposNormales.validate()) {
                  isValid = false;
                  break;
                }
              }
              if (isValid) {
                this.configData.value.configComodin = this.$refs.comodinDecision.obtenerConfigComodin();
                // let obj = [];
                // if (Array.isArray(this.configData.value.configComodin) && this.configData.value.configComodin.length > 0) {
                //   for (let item of this.configData.value.configComodin) {
                //     obj.push({
                //       docOrigen: item.campoNormalSeleccionado.documento.id,
                //       nameOrigen: item.campoNormalSeleccionado.component.name,
                //       docDestino: this.configData.value.docId,
                //       nameDestino: item.infoComodin.name
                //     });
                //   }
                // }
                // this.$store.state.objetoComodines[this.configData.cellId] = obj;
                this.e1++;
              } else {
                this.$message.error('Faltan campos por llenar');
              }
            } else {
              this.e1++;
            }
          } else if (parseInt(this.e1) === 3) {
            if (this.$refs.permisosConfig) {
              if (this.$refs.permisosConfig.validar()) {
                this.e1++;
              }
            } else {
              this.e1++;
            }
          } else if (parseInt(this.e1) === 4) {
            if (this.temporizadorCheck && this.configData.value.temporizador[0].dias === 0 && this.configData.value.temporizador[0].horas === 0) {
              this.$message.error('Debe especificar el tiempo maximo de espera!');
            } else {
              this.e1++;
            }
          } else if (parseInt(this.e1) === 5) {
            if (this.$refs.formAcciones) {
              if (this.$refs.formAcciones.validate()) {
                if (this.notificarCheck && !this.notificarSolicitante && !this.notificarCco) {
                  this.$message.error('Debe seleccionar al menos una de las opciones de notificacion');
                } else {
                  this.e1++;
                }
              }
            } else {
              this.e1++;
            }
          } else if (parseInt(this.e1) === 6 && (!this.configData.value.sendOption || this.configData.value.sendOption.length === 0)) {
            this.$message.error('Debe especificar cual será la opción de derivación en este paso!');
          } else {
            this.e1++;
          }
        } catch (err) {
          this.$message.error(err.message);
        }
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
        /*
        var addOption = {
          'goTo': key,
          'mode': value
        };
        this.configData.value.sendOption = [];
        this.configData.value.sendOption.push(addOption);
        */
        /*
        if (this.configData.value.sendOption) {
          var exists = false;
          for (var m = 0; m < this.configData.value.sendOption.length; m++) {
            if (this.configData.value.sendOption[m].goTo === key) {
              this.configData.value.sendOption[m].mode = value;
              exists = true;
            }
          }
          if (!exists) {
            this.configData.value.sendOption.push(addOption);
          }
        } else {
          this.configData.value.sendOption = [];
          this.configData.value.sendOption.push(addOption);
        }
        */
      },
      setCurrentGroup (value) {
        if (value) {
          this.currentGroup.id = value;
          this.configData.value.permissions[0].role = this.currentGroup.id;
        } else if (this.configData.value && this.configData.value.permissions && this.configData.value.permissions.length > 0) {
          this.currentGroup.id = this.configData.value.permissions[0].role;
        }
        for (let i = 0; i < this.configData.groups.length; i++) {
          let group = this.configData.groups[i];
          if (this.currentGroup.id === group.id) {
            this.currentGroup.role = group.role;
          }
        }
        this.setSendOption();
        console.log('-----------GRUPO SELECCIONADO-------------');
        console.log(this.currentGroup);
        console.log('------------------------------------');
      },
      setCurrentDoc (value) {
        if (value) {
          this.currentDoc.id = value;
          this.configData.value.permissions[0].doc = this.currentDoc.id;
        } else if (this.configData.value && this.configData.value.permissions && this.configData.value.permissions.length > 0) {
          this.currentDoc.id = this.configData.value.permissions[0].doc;
        }
        const esNodoInicial = (this.configData.connected) ? this.configData.connected.onPrev.length : null;
        if (esNodoInicial === 0) {
          this.configData.value.primerDocumentoTemporal = true;
          // this.primerDocumentoTemporal = this.configData.value.docId;
          // const docId = this.configData.value.docId;
          // this.configData.documents.forEach(item => {
          //   if (item.id === docId) {
          //     // se esta asignado temporalmente el primerDocumentoTemporal
          //     this.primerDocumentoTemporal = item;
          //   }
          // });
        }
        for (let i = 0; i < this.configData.documents.length; i++) {
          let document = this.configData.documents[i];
          if (this.currentDoc.id === document.id) {
            this.currentDoc.name = document.name;
            this.currentDoc.tipo = document.tipo;
            this.currentDoc.tipoDocumento = document.tipoComponentes;
            this.currentDoc.template = document.template;
            this.configData.value.permissions.forEach(element => {
              element.docTitle = document.name; // Update doc name for every permission record
              element.docType = document.tipo; // Update doc type for every permission record
            });
          }
        }
        setTimeout(() => {
          if (this.$refs.comodinDecision) {
            this.$refs.comodinDecision.documentoComodin = [this.currentDoc];
          }
        }, 200);
        console.log('--------DOCUMENTO ACTUAL------------');
        console.log(this.currentDoc);
        console.log('------------------------------------');
      },
      actualizarExtras (extras) {
        this.configData.value.extras = extras;
      },
      actualizarPermisos (permisos) {
        this.configData.value.permissions = permisos;
      },
      guardarConfiguracion () {
        if (this.e1 === 5 && (!this.$refs.formAcciones.validate() || (this.notificarCheck && !this.notificarCco && !this.notificarSolicitante))) {
          this.$message.error('Debe seleccionar al menos una de las opciones de notificación');
          return;
        }
        // ¿Por qué 4 es notificación?
        if (this.e1 === 4 && this.notificarCheck && !this.$refs.formAcciones.validate()) {
          this.$message.error('Revise los campos en el formulario de notificación e intente de nuevo por favor');
        } else if (this.e1 === 4 && this.notificarCheck && this.notificarSolicitante === false && (!this.notificarGrupo || this.notificarGrupo.length === 0) && (this.notificarCorreo === null || this.notificarCorreo === '')) {
          this.$message.error('Debe seleccionar al menos una de las opciones de notificacion (solicitante, grupo o correo)');
        } else {
          var temp = JSON.parse(JSON.stringify(this.configData));
          temp.value.temporizador = [];
          if (this.temporizadorCheck) {
            const tempObj = {
              'dias': this.configData.value.temporizador[0].dias,
              'horas': this.configData.value.temporizador[0].horas
            };
            temp.value.temporizador.push(tempObj);
          }
          temp.value.acciones = [];
          if (this.firmarCheck) {
            const firmarObj = {
              'firmar': {
                'version': '1.0.0'
              }
            };
            temp.value.acciones.push(firmarObj);
          }
          if (this.notificarCheck) {
            const notificarObj = {
              'notificar': {
                'version': '1.0.0',
                'mensaje': this.notificarMensaje,
                // 'destinatario': this.notificarDestinatario,
                'solicitante': this.notificarSolicitante,
                'grupo': this.notificarGrupo,
                'correo': this.notificarCorreo,
                'notificarCco': this.notificarCco,
                'adjuntarDoc': this.firmarCheck === true ? this.adjuntarDoc : false
              }
            };
            temp.value.acciones.push(notificarObj);
          }
          // console.log('-------------temp-------------------');
          // console.log(temp);
          // console.log('------------------------------------');
          // Se agrega el titulo e id del documento a cada registro en extras
          temp.value.extras.forEach(element => {
            this.configData.documents.forEach(el => {
              if (element.doc === el.id) {
                element.docTitle = el.name;
                element.docType = el.tipo;
              }
            });
          });
          var respuestaPaso = {
            'type': 'formulario',
            'cellId': temp.cellId,
            'value': {
              'tipo': temp.value.tipo,
              'name': temp.value.name,
              'docId': temp.value.docId,
              'groupId': temp.value.groupId,
              'extras': temp.value.extras,
              'permissions': temp.value.permissions,
              'sendOption': temp.value.sendOption,
              'acciones': temp.value.acciones,
              'temporizador': temp.value.temporizador,
              'configComodin': temp.value.configComodin,
              'repeticion': temp.value.repeticion,
              'primerDocumentoPlantilla': (this.configData.value.primerDocumentoTemporal) ? temp.value.docId : null
            }
          };
          console.log('----------respuesta-----------------');
          console.log(respuestaPaso);
          console.log('------------------------------------');
          this.$emit('saveCellData', respuestaPaso);
          // this.$parent.$options.methods.updateGraphCell(respuestaPaso);
          this.cerrarConfiguracion();
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
        configData: {
          'cellId': '',
          'connected': {
            'onPrev': [],
            'onNext': []
          },
          'currentGroup': '',
          'documents': [],
          'groups': [],
          'type': '',
          'value': {
            'name': '',
            'extras': [],
            'sendOption': {
              'tipo': 'todos',
              'grupo': ''
            }
            // 'sendOption': [
            //   {
            //     'goTo': 0,
            //     'mode': 'ninguno'
            //   }
            // ]
          }
        },
        currentGroup: {
          'role': 'Grupo actual',
          'id': 0
        },
        currentDoc: {
          'name': 'Documento actual',
          'id': 0
        },
        temporizadorCheck: false,
        firmarCheck: false,
        notificarCheck: false,
        notificarCco: false, // flag para indicar que se va a notificar con cco
        adjuntarDoc: false, // flag para indicar que se va a adjuntar el doc firmado digitalmente (firmarCheck debe ser true, previamente)
        notificarMensaje: '', // mensaje de notificación
        notificarSolicitante: false,
        notificarGrupo: null,
        notificarCorreo: '',
        respuesta: [],
        mostrarConfiguracion: false,
        e1: 0,
        nombrePaso: null,
        nombrePasoReglas: [
          v => !!v || 'Debe especificar un nombre para este paso.'
        ],
        correoReglas: [
          // v => (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || /^$/.test(v)) || 'Debe introducir una dirección de correo electrónico válida.'
          v => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || /^$/.test(v)) || 'Debe introducir un correo electrónico válido'
        ],
        // Reglas para el texto del mensaje
        mensajeReglas: [
          v => this.notificarCheck && !!v || 'Debe especificar el contenido de la notificación.'
        ],
        correoReglasCCo: [
          v => (this.notificarCco && !!v || Boolean(this.notificarGrupo)) || 'Debe especificar el correo en concreto al que desea notificar'
        ],
        destinatariosCCoReglas: [
          v => (this.notificarCco && v.length > 0 || Boolean(this.notificarCorreo)) || 'Debe especificar el grupo al que se desea notificar'],
        grupoReglas: [
          v => !!v || 'El grupo al que se le asigna este paso es un dato obligatorio.'
        ],
        documentoReglas: [
          v => !!v || 'El formulario a llenar en este paso es un dato obligatorio.'
        ],
        derivarReglas: [
          v => !!v || 'El tipo de derivación es un dato obligatorio.'
        ],
        // urlReglas: [
        //   v => !!v || 'La URL es un dato obligatorio.',
        //   v => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v) || 'La URL no es una URL válida.'
        // ],
        // headers: [{text: 'Nombre del atributo', sortable: false, align: 'center'}, {text: 'Valor del atributo', sortable: false, align: 'center'}, {text: 'Acciones', sortable: false, align: 'right'}],
        opcionesDerivar: {
          'Todos': 'todos',
          'Aleatorio': 'aleatorio',
          'Seleccion': 'seleccion'
        },
        mensajes: [
          'Llene los datos necesarios para la configuración de este documento.',
          'Especifique los permisos por grupo para este paso',
          'Especifique el tiempo maximo que el proceso puede detenerse en este paso',
          'Configure acciones complementarias para este paso',
          'Especifique el tipo de derivacion al siguiente paso'
        ]
      };
    }
  };
</script>

<style lang="scss">
  .p-interoperabilidad {
    width: 80px;
    height: 80px;
    .material-icons {
      font-size: 55px;
    }
  }

  .seccionConf {
    width: auto;
    height: 100%;
    margin-left: 20px;
    border: 2px solid rgba(0,0,0, .2);
    background: rgb(255, 255, 255);
    background: -moz-linear-gradient(top, rgba(255, 255, 255, 1) 0%, rgba(246, 246, 246, 1) 47%, rgba(237, 237, 237, 1) 100%);
    background: -webkit-linear-gradient(top, rgba(255, 255, 255, 1) 0%, rgba(246, 246, 246, 1) 47%, rgba(237, 237, 237, 1) 100%);
    background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(246, 246, 246, 1) 47%, rgba(237, 237, 237, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#ededed', GradientType=0);
    color: rgb(58, 53, 53);
  }

  .interoperabilidadDraggable {
    border: 1px solid rgb(199, 199, 199);
    padding: 0px 5px;

    .detalle {
      padding: 10px 5px;
    }

  }

  .interoperabilidadDraggableAtributo {
    padding: 0px 30px;
  }

</style>
<style src='../../../../components/admin/formularios/formularios.scss' lang='scss'></style>
