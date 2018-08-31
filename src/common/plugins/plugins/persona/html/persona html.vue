<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid grid-list-md grid-list-xs>
        <v-layout row wrap class="borderDashed ml-0">
          <v-flex sm6 xs6 lg6>
            <v-subheader color="primary" class="tituloComponentePersona" v-text="label"></v-subheader>
          </v-flex>
          <v-flex sm6 xs6 lg6 class="text-md-right" v-show="interoperabilidadActivada && !disabled">
            <v-tooltip top>
              <v-btn v-if="switchInteroperar" color="info" slot="activator" @click.prevent="consultarMicroservicio">
                <v-icon>check_circle</v-icon>
                Validar con SEGIP
              </v-btn>
              Se hará un proceso de validación con el SEGIP
              </v-tooltip>
              <v-tooltip top>
              <v-btn v-if="switchMultiple" color="info" slot="activator" @click.prevent="agregarPersona(objects)">
                <v-icon>add</v-icon>
                Agregar
              </v-btn>
              Agregar mas personas
              </v-tooltip>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-layout flat row wrap class="pt-2 borderDashed ml-0" v-for="(object, index) in objects" :key="index" >
            <v-flex xs6 md6 class="pa-0 pr-2" v-if="!disabled">
              <v-tooltip bottom >
                  <v-btn icon slot="activator" @click.native="eliminarPersona(index)">
                    <v-icon color="red">delete_forever</v-icon>
                  </v-btn>
                  <span>Quitar persona</span>
            </v-tooltip>
            <v-tooltip bottom >
                  <v-btn icon slot="activator" @click.native="limpiarPersona(index)">
                    <v-icon color="primary">delete_sweep</v-icon>
                  </v-btn>
                  <span>Limpiar</span>
            </v-tooltip>
            </v-flex>
            <v-flex xs6 md6 class="pa-0 pr-2">
            </v-flex>
          <v-flex xs6 md6 class="pa-0 pr-2" v-show="persona.tipoPersona.options.visibility">
            <v-select
              :name="`${persona.tipoPersona.name}-${index}`"
              v-show="persona.tipoPersona.options.visibility"
              :disabled="persona.tipoPersona.options.disabled"
              :items="tiposDocumento"
              item-text="tipoDocumento"
              item-value="id"
              v-model="objects[index].tipoPersona.valor"
              :rules="(persona.tipoPersona.options.required) ? [() =>  objects[index].tipoPersona.valor > 0 || 'Este campo es requerido' ] : []"
              label="Tipo de documento"
              autocomplete
              :required="persona.tipoPersona.options.required"
              v-on:change="cambiaRespuesta($event,index)"
            ></v-select>
          </v-flex>
          <v-flex xs6 md6 class="pa-0 pr-2" v-show="persona.numeroDocumento.options.visibility">
            <v-text-field
              v-show="persona.numeroDocumento.options.visibility"
              :disabled="persona.numeroDocumento.options.disabled"
              :name="`${persona.numeroDocumento.name}-${index}`"
              :rules="(persona.numeroDocumento.options.required) ? [() =>  objects[index].numeroDocumento.valor.length > 0 || 'Este campo es requerido' ] : []"
              label="Número de documento"
              placeholder="Ejemplo: 123456"
              v-model="objects[index].numeroDocumento.valor"
              :required="persona.numeroDocumento.options.required"
              >
            </v-text-field>
          </v-flex>
          <v-flex xs6 md6 class="pa-0 pr-2" v-show="persona.fechaNacimiento.options.visibility">
            <v-menu
                :ref="`menu-${index}`" 
                lazy 
                :close-on-content-click="false" 
                v-model="menusFecha[index]" 
                transition="scale-transition" 
                offset-y 
                full-width 
                :nudge-right="40"
                max-width="290px" 
                min-width="290px"
              >
              <v-text-field 
                :name="`${persona.fechaNacimiento.name}-${index}`"
                v-show="persona.fechaNacimiento.options.visibility" 
                :disabled="persona.fechaNacimiento.options.disabled"
                slot="activator" 
                label="Fecha de nacimiento"
                v-model="objects[index].fechaNacimiento.valor" 
                :rules="(persona.fechaNacimiento.options.required) ? [() =>  objects[index].fechaNacimiento.valor.length > 0 || 'Este campo es requerido' ] : []"
                prepend-icon="event"
                @blur="parseDate(objects[index].fechaNacimiento.valor)" 
                :required="persona.fechaNacimiento.options.required"
              ></v-text-field>
              <v-date-picker 
                v-model="date[index]" 
                locale="es"
                no-title 
                scrollable 
                @input="objects[index].fechaNacimiento.valor = formatDate($event)" 
                >
              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs6 md6 class="pa-0 pr-2" v-show="persona.nombres.options.visibility" >
            <v-text-field
              v-show="persona.nombres.options.visibility" 
              :disabled="persona.nombres.options.disabled"
              :name="`${persona.nombres.name}-${index}`"
              label="Nombres"
              placeholder="Ej. Luis Pedro"
              autocomplete="false"
              v-model="objects[index].nombres.valor"
              :rules="(persona.nombres.options.required) ? [() =>  objects[index].nombres.valor.length > 0 || 'Este campo es requerido' ] : []"
              :required="persona.nombres.options.required"
              hint="Nombre(s) de la persona"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs6 md6 class="pa-0 pr-2" v-show="persona.primerApellido.options.visibility" >
            <v-text-field
              :name="`${persona.primerApellido.name}-${index}`"
              v-show="persona.primerApellido.options.visibility" 
              :disabled="persona.primerApellido.options.disabled"
              label="Primer Apellido"
              placeholder="Ej. Lopez"
              autocomplete="false"
              v-model="objects[index].primerApellido.valor"
              :rules="(persona.primerApellido.options.required) ? [() =>  objects[index].primerApellido.valor.length > 0 || 'Este campo es requerido' ] : []"
              hint="Primer apellido de la persona"
              :required="persona.primerApellido.options.required"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs6 md6 class="pa-0 pr-2" v-show="persona.segundoApellido.options.visibility" >
            <v-text-field
              :name="`${persona.segundoApellido.name}-${index}`"
              v-show="persona.segundoApellido.options.visibility" 
              :disabled="persona.segundoApellido.options.disabled"
              label="Segundo Apellido"
              placeholder="Ej. Soriano"
              autocomplete="false"
              v-model="objects[index].segundoApellido.valor"
              :rules="(persona.segundoApellido.options.required) ? [() =>  objects[index].segundoApellido.valor.length > 0 || 'Este campo es requerido' ] : []"
              hint="Segundo Apellido de la persona"
              :required="persona.segundoApellido.options.required"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs6 md6 class="pa-0 pr-2" v-show="persona.estadoCivil.options.visibility">
            <v-select
              :name="`${persona.estadoCivil.name}-${index}`"
              v-show="persona.estadoCivil.options.visibility" 
              :disabled="persona.estadoCivil.options.disabled"
              :items="listaEstados"
              :filter="customFilter"
              v-model="objects[index].estadoCivil.valor"
              :rules="(persona.estadoCivil.options.required) ? [() =>  objects[index].estadoCivil.valor.length > 0 || 'Este campo es requerido' ] : []"
              label="Estado civil"
              autocomplete
              :required="persona.estadoCivil.options.required"
            ></v-select>
          </v-flex>
          <v-flex xs6 md6 class="pa-0 pr-2" v-show="persona.sexo.options.visibility">
          <v-select
              :name="`${persona.sexo.name}-${index}`"
              v-show="persona.sexo.options.visibility" 
              :disabled="persona.sexo.options.disabled"
              :items="listaSexo"
              v-model="objects[index].sexo.valor"
              label="Sexo"
              :rules="(persona.sexo.options.required) ? [() =>  objects[index].sexo.valor.length > 0 || 'Este campo es requerido' ] : []"
              autocomplete
              :required="persona.sexo.options.required"
            ></v-select>
          </v-flex>
          <v-flex xs6 md6 class="pa-0 pr-2" v-show="persona.ocupacion.options.visibility">
            <v-text-field
              :name="`${persona.ocupacion.name}-${index}`"
              v-show="persona.ocupacion.options.visibility"
              :disabled="persona.ocupacion.options.disabled"
              label="Ocupación"
              placeholder=""
              autocomplete="false"
              v-model="objects[index].ocupacion.valor"
              multi-line
              rows="3"
              hint="Ocupación"
              :rules="(persona.ocupacion.options.required) ? [() =>  objects[index].ocupacion.valor.length > 0 || 'Este campo es requerido' ] : []"
              :required="persona.ocupacion.options.required"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs6 md6 class="pa-0 pr-2" v-show="persona.direccion.options.visibility">
            <v-text-field
              :name="`${persona.direccion.name}-${index}`"
              v-show="persona.direccion.options.visibility"
              :disabled="persona.direccion.options.disabled"
              label="Dirección"
              placeholder="Dirección donde reside actualmente"
              autocomplete="false"
              v-model="objects[index].direccion.valor"
              :rules="(persona.direccion.options.required) ? [() =>  objects[index].direccion.valor.length > 0 || 'Este campo es requerido' ] : []"
              multi-line
              rows="3"
              hint="Direccion de la persona"
              :required="persona.direccion.options.required"
            >
            </v-text-field>
          </v-flex>
          </v-layout>
        </v-layout>
        <div id="mainDialog">
          <v-dialog v-model="dialog" persistent max-width="670" :content-class="`translate-position-${translatePosition}`" v-if="settings" origin="center center">
              <v-btn icon absolute slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Atributos del componente</span>
                </v-card-title>
                  <v-stepper v-model="e1">
                    <v-stepper-header>
                      <v-stepper-step step="1" :complete="e1 > 1">Configuración</v-stepper-step>
                      <v-divider></v-divider>
                      <v-stepper-step step="2" :complete="e1 > 2">Campos</v-stepper-step>
                      <v-divider></v-divider>
                      <v-stepper-step v-if="switchInteroperar" step="3" :complete="e1 > 3">Enviar</v-stepper-step>
                      <v-divider></v-divider>
                      <v-stepper-step v-if="switchInteroperar" step="4" :complete="e1 > 4">Recibir</v-stepper-step>
                      <v-divider></v-divider>
                  </v-stepper-header>
                  <v-stepper-items>
                    <v-stepper-content step="1">
                      <v-container grid-list-md>
                      <v-card-text>
                      <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                        <v-text-field label="Label" v-model="label" placeholder="Ejemplo: Representante(s)" hint="Nombre descriptivo que aparecerá encima del componente."></v-text-field>
                        </v-flex>
                    </v-layout>
                    </v-card-text>
                    <v-card-text class="pa-0">
                      <v-switch class= "pa-0"
                      :label="`Habilitar opción multiple`"
                      v-model="switchMultiple"
                      color="primary"
                      >
                      </v-switch>
                      <v-switch  class="pa-0"
                          :label="`Interoperar este componente con SEGIP`"
                          v-model="switchInteroperar"
                          color="primary"
                        ></v-switch>
                        <v-card-text v-if="switchInteroperar">
                          <v-flex >
                            <v-select
                              :items="metodosSegip"
                              v-model="metodoSegip"
                              label="Método de verificación"
                              autocomplete
                            ></v-select>
                          </v-flex>
                        </v-card-text>
                    </v-card-text>
                  </v-container>
                    </v-stepper-content>
                    <v-stepper-content step="2">
                      <v-container grid-list-md>
                      <v-card-text>
                      <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <table class="tabla center">
                          <thead>
                            <th class="text-md-center">Nombre</th>
                            <th class="text-md-center">Requerido</th>
                            <th class="text-md-center">Deshabilitado</th>
                            <th class="text-md-center">Visible</th>
                            <th class="text-md-center" v-show="false">&nbsp;</th>
                          </thead>
                          <tbody>
                            <tr v-for="element in persona" :key="element.name">
                              <td>{{element.label}}</td>
                              <td class="text-md-center">
                                <v-tooltip bottom>
                                  <v-btn icon slot="activator" @click.native="activarDesactivarObligatorio(element)">
                                    <v-icon :color="(element.options.required) ? 'primary' : 'grey lighten-1'" class="ediciones">{{(element.options.required) ? 'check_circle' : 'do_not_disturb_off'}}</v-icon>
                                  </v-btn>
                                  <p>{{ (element.options.required) ? `Quitar requerido para ${element.label}` : `Activar requerido para ${element.label}` }}</p>
                                </v-tooltip>
                              </td>
                              <td class="text-md-center">
                                <v-tooltip bottom>
                                  <v-btn icon slot="activator" @click="activarDesactivarDeshabilitado(element)"> 
                                    <v-icon :color="(!element.options.disabled) ? 'grey lighten-1' : 'primary'" class="ediciones">{{(!element.options.disabled) ? 'do_not_disturb_off' : 'check_circle'}}</v-icon>
                                  </v-btn>
                                  <p>{{ (!element.options.disabled) ? `Volver a habilitar ${element.label}` : `Deshabilitar ${element.label}` }}</p>
                                </v-tooltip>
                              </td>
                              <td class="text-md-center">
                               <v-tooltip bottom>
                                  <v-btn icon slot="activator" @click="activarDesactivarVisible(element)"> 
                                    <v-icon :color="(element.options.visibility) ? 'primary' : 'grey lighten-1'" class="ediciones">{{(element.options.visibility) ? 'check_circle' : 'do_not_disturb_off'}}</v-icon>
                                  </v-btn>
                                  <p>{{ (element.options.visibility) ? ` ${element.label}` : `Interopabilidad deshabilitada para ${element.label}` }}</p>
                                </v-tooltip>
                              </td>
                              <!-- <td class="text-md-center" v-show="false">
                                <v-tooltip bottom>
                                  <v-btn icon @click.prevent="editElement(element)" slot="activator">
                                    <v-icon color="info">edit</v-icon> 
                                  </v-btn>
                                  <span>Editar {{element.label}}</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                  <v-btn icon @click.prevent="deleteElement(element)" slot="activator">
                                    <v-icon color="red">delete</v-icon>
                                  </v-btn>
                                  <span>Eliminar {{element.label}}</span>
                                </v-tooltip>
                              </td> -->
                            </tr>
                          </tbody>
                        </table>
                      </v-flex>
                    </v-layout>
                    </v-card-text>
                  </v-container>
                    </v-stepper-content>
                    <v-stepper-content step="3">
                      <v-container grid-list-md>
                      <v-card-text class="mx-auto">
                      <v-layout wrap>
                      <v-flex xs12 sm12 md12  >
                        <table class="tabla center">
                          <thead>
                            <th class="text-md-center">Nombre</th>
                            <th class="text-md-center">Enviar</th>
                          </thead>
                          <tbody>
                            <tr v-for="element in filtraInteroperables(persona)" :key="element.name">
                              <td>{{element.label}}</td>
                              <td class="text-md-center">
                                <v-tooltip bottom>
                                  <v-btn icon slot="activator" @click.prevent="enviar(element)">
                                    <v-icon :color="(element.options.enviar) ? 'primary' : 'grey lighten-1'" class="ediciones">{{(element.options.enviar) ? 'check_circle' : 'do_not_disturb_off'}}</v-icon>
                                  </v-btn>
                                  <p>{{ (element.options.enviar) ? `Quitar enviar para ${element.label}` : `Activar enviar para ${element.label}` }}</p>
                                </v-tooltip>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </v-flex>
                    </v-layout>
                    </v-card-text>
                  </v-container>
                    </v-stepper-content>
                    <v-stepper-content step="4">
                      <table class="tabla center" >
                          <thead>
                            <th class="text-md-center">Nombre</th>
                            <th class="text-md-center">Recibir</th>
                          </thead>
                          <tbody>
                            <tr v-for="element in filtraInteroperables(persona)" :key="element.name">
                              <td>{{element.label}}</td>
                              <td class="text-md-center">
                                <v-tooltip bottom>
                                  <v-btn icon slot="activator" @click.native="recibir(element)">
                                    <v-icon :color="(element.options.recibir) ? 'primary' : 'grey lighten-1'" class="ediciones">{{(element.options.recibir) ? 'check_circle' : 'do_not_disturb_off'}}</v-icon>
                                  </v-btn>
                                  <p>{{ (element.options.recibir) ? `Quitar recibir para ${element.label}` : `Activar recibir para ${element.label}` }}</p>
                                </v-tooltip>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                    </v-stepper-content>
                  </v-stepper-items>
                  </v-stepper>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click.native="dialog = false"> <v-icon>cancel</v-icon> Cancelar</v-btn>
                  <v-btn v-if="e1 > 1" @click.native="retrocederPaso()"><v-icon>chevron_left</v-icon> Atrás</v-btn>
                  <v-btn v-if="e1 == 1" @click.native="avanzarPaso()"><v-icon>chevron_right</v-icon> Siguiente</v-btn>
                  <v-btn v-if="e1 > 1 && e1 < 4 && switchInteroperar" @click.native="avanzarPaso()"><v-icon>chevron_right</v-icon> Siguiente</v-btn>
                  <v-btn color="primary" @click.native="guardar">Guardar</v-btn>
                  </v-card-actions>
              </v-card>
            </v-dialog>
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
  import validate from '../../validate.js';
  import axios from 'axios';
  import slugify from 'slugify';
  export default {
    mixins: [validate],
    props: [ 'form', 'field', 'model', 'to', 'all' ],
    data () {
      return {
        menusFecha: [],
        disabled: null,
        dialogPrueba: false,
        switchInteroperar: false,
        switchMultiple: false,
        incluirPasaporte: false,
        e1: 0,
        metodosSegip: ['Contrastar', 'Recuperar'],
        tiposDocumento: [
          { id: 1, tipoDocumento: 'Carnet de identidad C.I.', interoperabilidad: true },
          { id: 2, tipoDocumento: 'Carnet de extranjeria', interoperabilidad: true },
          { id: 3, tipoDocumento: 'Pasaporte', interoperabilidad: false }
        ],
        metodoSegip: '',
        tipoDocumento: '',
        objetoEnviar: {},
        camposEnviar: [],
        camposRecibir: [],
        interoperabilidadActivada: true,
        translatePosition: false,
        label: 'Persona',
        dialog: null,
        settings: false,
        numeroDocumento: null,
        menu: false,
        date: [],
        fechaNacimiento: null,
        valorAnterior: null,
        observar: false,
        listaEstados: ['Casado(a)', 'Soltero(a)', 'Viudo(a)', 'Divorciado(a)'],
        camposInteroperables: {},
        customFilter (item, queryText, itemText) {
          const hasValue = val => val != null ? val : '';
          const text = hasValue(item);
          const query = hasValue(queryText);
          return text.toString()
            .toLowerCase()
            .indexOf(query.toString().toLowerCase()) > -1;
        },
        listaNacionalidad: ['Boliviana', 'Extranjera'],
        listaSexo: ['Masculino', 'Femenino'],
        tiposPersona: [
          {id: 1, tipoPersona: 'Nacional'},
          {id: 2, tipoPersona: 'Extranjera'}
        ],
        persona: {
          tipoPersona: {
            name: 'tipoPersona',
            label: 'Tipo de documento',
            valor: '',
            options: {
              visibility: true,
              disabled: false,
              required: true,
              interoperabilidad: true,
              enviar: false,
              recibir: false
            }
          },
          numeroDocumento: {
            name: 'numeroDocumento',
            label: 'Documento de identidad',
            valor: '',
            options: {
              visibility: true,
              disabled: false,
              required: true,
              interoperabilidad: true,
              enviar: false,
              recibir: false
            }
          },
          fechaNacimiento: {
            name: 'fechaNacimiento',
            label: 'Fecha de nacimiento',
            valor: '',
            options: {
              visibility: true,
              disabled: false,
              required: true,
              interoperabilidad: true,
              enviar: false,
              recibir: false
            }
          },
          nombres: {
            name: 'nombres',
            label: 'Nombres',
            valor: '',
            options: {
              visibility: true,
              disabled: false,
              required: true,
              interoperabilidad: true,
              enviar: false,
              recibir: false
            }
          },
          primerApellido: {
            name: 'primerApellido',
            label: 'Primer Apellido',
            valor: '',
            options: {
              visibility: true,
              disabled: false,
              required: true,
              interoperabilidad: true,
              enviar: false,
              recibir: false
            }
          },
          segundoApellido: {
            name: 'segundoApellido',
            label: 'Segundo Apellido',
            valor: '',
            options: {
              visibility: true,
              disabled: false,
              required: false,
              interoperabilidad: true,
              enviar: false,
              recibir: false
            }
          },
          ocupacion: {
            name: 'ocupacion',
            label: 'Ocupación',
            valor: '',
            options: {
              visibility: true,
              disabled: false,
              required: true,
              interoperabilidad: false,
              enviar: false,
              recibir: false
            }
          },
          direccion: {
            name: 'direccion',
            label: 'Direccion',
            valor: '',
            options: {
              visibility: true,
              disabled: false,
              required: true,
              interoperabilidad: false,
              enviar: false,
              recibir: false
            }
          },
          estadoCivil: {
            name: 'estadoCivil',
            label: 'Estado Civil',
            valor: '',
            options: {
              visibility: true,
              disabled: false,
              required: true,
              interoperabilidad: false,
              enviar: false,
              recibir: false
            }
          },
          sexo: {
            name: 'sexo',
            label: 'Sexo',
            valor: '',
            options: {
              visibility: true,
              disabled: false,
              required: true,
              interoperabilidad: false,
              enviar: false,
              recibir: false
            }
          }
        },
        objects: []
      };
    },
    methods: {
      retrocederPaso () {
        this.e1--;
      },
      avanzarPaso () {
        if (this.switchInteroperar && (this.metodoSegip === '' || this.metodoSegip === undefined) && this.e1 === '1') {
          this.$message.error(`Debe seleccionar un método de verificación con el SEGIP.`);
          return;
        }
        this.e1++;
      },
      agregarPersona () {
        /* let idResp;
        if (this.switchInteroperar === false) {
          idResp = '000';
        } else {
          if (this.observar === true ) {
            idResp = null;
          }
        } */
        this.objects.push(Object.assign({}, {
          idRespuesta: {
            valor: '000'
          },
          tipoPersona: {
            valor: ''
          },
          numeroDocumento: {
            valor: ''
          },
          fechaNacimiento: {
            valor: ''
          },
          nombres: {
            valor: ''
          },
          primerApellido: {
            valor: ''
          },
          segundoApellido: {
            valor: ''
          },
          ocupacion: {
            valor: ''
          },
          direccion: {
            valor: ''
          },
          estadoCivil: {
            valor: ''
          },
          sexo: {
            valor: ''
          }}));
        this.menusFecha.push(null);
      },
      filtraInteroperables (persona) {
        let nuevoObjeto = {};
        Object.keys(persona).forEach(key => {
          if (persona[key].options.interoperabilidad === true) {
            nuevoObjeto[key] = persona[key];
          }
        });
        return nuevoObjeto;
      },
      filtraEnviar (persona) {
        let nuevoObjeto = {};
        Object.keys(persona).forEach(key => {
          if (persona[key].options.enviar === true) {
            nuevoObjeto[key] = persona[key];
          }
        });
        return nuevoObjeto;
      },
      filtraRecibir (persona) {
        let nuevoObjeto = {};
        Object.keys(persona).forEach(key => {
          if (persona[key].options.recibir === true) {
            nuevoObjeto[key] = persona[key];
          }
        });
        return nuevoObjeto;
      },
      filtraRequeridos (persona) {
        let nuevoObjeto = [];
        // let nuevoArray = [];
        Object.keys(persona).forEach(key => {
          if (persona[key].options.required === true) {
            // nuevoObjeto[key] = [{ id: this.listValidations[0].id, titulo: this.listValidations[0].titulo, idComponente: key }];
            nuevoObjeto.push({ id: this.listValidations[0].id, titulo: this.listValidations[0].titulo, idComponente: key });
          }
        });
        return nuevoObjeto;
      },
      recuperaNombres (objects) {
        let array = [];
        if (typeof objects === 'object') {
          Object.keys(objects).forEach(property => {
            array.push(objects[property].name);
          });
        }
        return array;
      },
      recuperaEnviar (array) {
        Object.keys(this.persona).forEach(property => {
          array.forEach(item => {
            if (this.persona[property].name === item) {
              this.persona[property].options.enviar = true;
            }
          });
        });
      },
      recuperaRecibir (array) {
        Object.keys(this.persona).forEach(property => {
          array.forEach(item => {
            if (this.persona[property].name === item) {
              this.persona[property].options.recibir = true;
            }
          });
        });
      },
      recuperaVisibles (array) {
        Object.keys(this.persona).forEach(property => {
          array.forEach(item => {
            if (this.persona[property].name === item) {
              this.persona[property].options.visibility = true;
            }
          });
        });
      },
      recuperaObligatorios (array) {
        Object.keys(this.persona).forEach(property => {
          array.forEach(item => {
            if (this.persona[property].name === item) {
              this.persona[property].options.required = true;
            }
          });
        });
      },
      recuperaDeshabilitados (array) {
        Object.keys(this.persona).forEach(property => {
          array.forEach(item => {
            if (this.persona[property].name === item) {
              this.persona[property].options.disabled = true;
            }
          });
        });
      },
      filtraVisible (persona) {
        let nuevoObjeto = {};
        Object.keys(persona).forEach(key => {
          if (persona[key].options.visibility === true) {
            nuevoObjeto[key] = persona[key];
          }
        });
        return nuevoObjeto;
      },
      filtraDeshabilitado (persona) {
        let nuevoObjeto = {};
        Object.keys(persona).forEach(key => {
          if (persona[key].options.disabled === true) {
            nuevoObjeto[key] = persona[key];
          }
        });
        return nuevoObjeto;
      },
      filtraObligatorio (persona) {
        let nuevoObjeto = {};
        Object.keys(persona).forEach(key => {
          if (persona[key].options.required === true) {
            nuevoObjeto[key] = persona[key];
          }
        });
        return nuevoObjeto;
      },
      eliminarPersona (index) {
        if (this.objects.length !== 1) {
          this.$confirm(`Esta seguro de quitar este registro?`, () => {
            this.objects.splice(index, 1);
          });
        }
      },
      consultarMicroservicio () {
        Promise.all(this.objects.map(async (object, index) => {
          const tipoDocumento = this.tiposDocumento.find(tipo => {
            const idTipoDocumento = !isNaN(parseInt(object.tipoPersona.valor)) ? parseInt(object.tipoPersona.valor) : 0;
            return tipo.id === idTipoDocumento;
          });
          if (tipoDocumento && tipoDocumento.interoperabilidad !== true) {
            this.$message.success(`La fila ${index + 1} del componente "${this.label}" no realizará el proceso de interoperabilidad.`);
            return;
          }
          let objetoEnviar = [];
          this.to.enviar.forEach(campo => {
            objetoEnviar.push({campo: campo, valor: object[campo].valor});
          });
          const req = {
            url: `${process.env.SERVER}/proxy/${this.to.proxy.idPlugin}/configuraciones/resolver/${this.to.idConfiguracion}`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$storage.get('token')}`
            },
            json: true,
            data: objetoEnviar
          };
          let respuesta;
          respuesta = axios(req)
          .then(respuesta => {
            if (respuesta && respuesta.data && respuesta.data.datos) {
              object.idRespuesta.valor = respuesta.data.datos.idRespuesta;
              respuesta.data.datos.respuesta.forEach(campo => {
                object[campo.campo].valor = campo.valor;
              });
            } else {
              object.idRespuesta.valor = null;
              this.$message.error('No se pudo resolver la configuración.');
            }
          })
          .catch(error => {
            if (error.response && error.response.data) {
              respuesta = error.response.data;
              object.idRespuesta.valor = null;
              this.$message.error(`La fila ${index + 1} del componente "${this.label}" devolvió el siguiente error: ${respuesta.mensaje}` || 'No se pudo resolver la configuración.');
            }
          });
        }));
      },
      async guardar () {
        this.to.interoperar = this.switchInteroperar;
        this.to.multiple = this.switchMultiple;
        this.to.incluirPasaporte = this.incluirPasaporte;
        this.to.label = this.label;
        this.to.validations = this.filtraRequeridos(this.persona);
        this.to.obligatorios = this.recuperaNombres(this.filtraObligatorio(this.persona));
        this.to.visibles = this.recuperaNombres(this.filtraVisible(this.persona));
        this.to.deshabilitados = this.recuperaNombres(this.filtraDeshabilitado(this.persona));
        if (this.switchInteroperar) {
          this.camposEnviar = this.filtraEnviar(this.persona);
          this.to.enviar = this.recuperaNombres(this.camposEnviar);
          this.camposRecibir = this.filtraRecibir(this.persona);
          this.to.recibir = this.recuperaNombres(this.camposRecibir);
          this.to.operacion = this.metodoSegip;
          this.objetoEnviar = {
            operacion: this.to.operacion.toLowerCase(),
            entrada: this.to.enviar,
            salida: this.to.recibir,
            obligatorio: this.to.obligatorios,
            origen: 'BPM'
          };
          const req = {
            url: `${process.env.SERVER}/proxy/${this.to.proxy.idPlugin}/configuraciones`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$storage.get('token')}`
            },
            json: true,
            data: this.objetoEnviar
          };
          let respuesta;
          try {
            respuesta = await axios(req);
            if (respuesta && respuesta.data && respuesta.data.datos) {
              this.to.idConfiguracion = respuesta.data.datos._id;
              this.$message.success(respuesta.mensaje || 'La configuración fue correctamente creada.');
              this.dialog = false;
            } else {
              this.$message.error('No se pudo crear la configuración.');
            }
          } catch (error) {
            if (error.response && error.response.data) {
              respuesta = error.response.data;
              this.$message.error(respuesta.mensaje || 'No se pudo crear la configuración.');
            } else {
              this.$message.error('No se pudo crear la configuración. El servicio no se encuentra disponible.');
            }
          }
        } else {
          this.dialog = false;
        }
      },
      /* FUNCIONES  PARA MARCAR Y DESMARCAR */
      enviar (element) {
        const mensaje = (element.options.enviar) ? `Esta seguro de quitar el campo <strong>${element.label}</strong> ?` : `Esta seguro de enviar a interoperabilidad el campo <strong>${element.label}</strong> ?`;
        this.$confirm(mensaje, () => {
          element.options.enviar = !element.options.enviar;
        });
      },
      recibir (element) {
        const mensaje = (element.options.recibir) ? `Esta seguro de quitar el campo <strong>${element.label}</strong> ?` : `Esta seguro de recibir desde interoperabilidad el campo <strong>${element.label}</strong> ?`;
        this.$confirm(mensaje, () => {
          element.options.recibir = !element.options.recibir;
        });
      },
      activarDesactivarDeshabilitado (item) {
        const mensaje = (!item.options.disabled) ? `Esta seguro de deshabilitar el campo <strong>${item.label}</strong> ?` : `Esta seguro de habilitar nuevamente el campo <strong>${item.label}</strong> ?`;
        // if (item.key === 1 || item.key === 2) {
          // this.$alert(`Estimado usuario no se puede deshabilitar el campo <strong>${item.label}</strong>`);
        // } else {
        this.$confirm(mensaje, () => {
          item.options.disabled = !item.options.disabled;
        });
        // }
      },
      activarDesactivarVisible (item) {
        const mensaje = (!item.options.visibility) ? `Esta seguro de mostrar el campo <strong>${item.label}</strong> ?`
                                                : `Esta seguro de ocultar campo <strong>${item.label}</strong> ?`;
        this.$confirm(mensaje, () => {
          item.options.visibility = !item.options.visibility;
          if (item.options.visibility === false) {
            item.options.required = false;
          }
        });
      },
      activarDesactivarObligatorio (item) {
        if (item.name === 'segundoApellido') {
          this.$message.info(`El campo ${item.name} no puede ser obligatorio`);
          item.options.required = false;
          return;
        }
        const mensaje = (item.options.required) ? `Esta seguro de quitar requerido para el campo <strong>${item.label}</strong> ?` : `Esta seguro de activar requerido para el campo <strong>${item.label}</strong> ?`;
        this.$confirm(mensaje, () => {
          item.options.required = !item.options.required;
        });
        this.to.validations = this.filtraRequeridos(this.persona);
      },
      editElement (element) {
        this.$modalForm('persona.vue', () => {
        });
      },
      deleteElement (element) {
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
      },
      recuperaValores (objects) {
        let nuevoObjects = [];
        let nuevoObjeto = {};
        objects.forEach(object => {
          nuevoObjeto = {};
          Object.keys(object).forEach(key => {
            if (this.to.visibles) {
              if (this.to.visibles.indexOf(key) !== -1) {
                nuevoObjeto[key] = object[key].valor;
              }
            }
          });
          nuevoObjeto.idRespuesta = object.idRespuesta.valor;
          nuevoObjects.push(nuevoObjeto);
        });
        return nuevoObjects;
      },
      cambiaRespuesta (event, index) {
        const tipoDocumento = this.tiposDocumento.find(tipo => {
          const idTipoDocumento = event;
          return tipo.id === idTipoDocumento;
        });
        if (tipoDocumento && tipoDocumento.interoperabilidad !== true) {
          this.objects[index].idRespuesta.valor = '000';
        } else {
          if (this.switchInteroperar) {
            if (this.objects[index].idRespuesta.valor === '000') {
              this.objects[index].idRespuesta.valor = null;
              this.objects[index].nombres.valor = '';
              this.objects[index].primerApellido.valor = '';
              this.objects[index].segundoApellido.valor = '';
              // this.objects[index].numeroDocumento.valor = '';
              // this.objects[index].fechaNacimiento.valor = '';
            }
          } else {
            this.objects[index].idRespuesta.valor = '000';
          }
        }
      },
      limpiarPersona (index) {
        Object.keys(this.objects[index]).forEach(item => {
          this.objects[index][item].valor = '';
        });
        this.objects[index].idRespuesta.valor = null;
      }
    },
    watch: {
      label (label) {
        this.to.label = label;
        this.to.id = slugify(label, '_');
        this.to.id = this.to.id.replace('ñ', 'n');
      },
      switchInteroperar (valor) {
        if (this.observar === true) {
          if (valor) {
            this.objects.forEach(object => {
              object.idRespuesta.valor = null;
            });
          } else {
            this.objects.forEach(object => {
              object.idRespuesta.valor = '000';
            });
          }
        }
      },
      disabled (disabled) {
        this.to.disabled = disabled;
        if (disabled) {
          Object.keys(this.persona).forEach(property => {
            this.persona[property].options.disabled = true;
          });
        }
      },
      objects: {
        handler: function (valor, anterior) {
          if (this.observar) {
            console.log(`observador ${this.observar} `, this.objects);
            this.to.value = this.recuperaValores(this.objects);
          }
        },
        deep: true
      },
      metodoSegip (metodo) {
        if (metodo && metodo.toLowerCase() === 'recuperar') {
          this.persona.fechaNacimiento.options.enviar = true;
          this.persona.numeroDocumento.options.enviar = true;
          this.persona.tipoPersona.options.recibir = true;
          this.persona.numeroDocumento.options.recibir = true;
          this.persona.fechaNacimiento.options.recibir = true;
          this.persona.nombres.options.recibir = true;
          this.persona.primerApellido.options.recibir = true;
          this.persona.segundoApellido.options.recibir = true;
        }
        if (metodo && metodo.toLowerCase() === 'contrastar') {
          this.persona.tipoPersona.options.enviar = true;
          this.persona.fechaNacimiento.options.enviar = true;
          this.persona.numeroDocumento.options.enviar = true;
          this.persona.nombres.options.enviar = true;
          this.persona.primerApellido.options.enviar = true;
          this.persona.segundoApellido.options.enviar = true;

          this.persona.tipoPersona.options.recibir = true;
          this.persona.numeroDocumento.options.recibir = true;
          this.persona.fechaNacimiento.options.recibir = true;
          this.persona.nombres.options.recibir = true;
          this.persona.primerApellido.options.recibir = true;
          this.persona.segundoApellido.options.recibir = true;
        }
      }
    },
    created () {
    },
    mounted () {
      console.log(`----------------persona -> mounted------------------------------------------------`);
      this.$nextTick(() => {
        this.objects.splice(0, this.objects.length);
        this.settings = this.to.settings;
        this.to.id = 'componente_persona';
        this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
        this.switchInteroperar = this.to.interoperar;
        this.metodoSegip = this.to.operacion;
        this.switchMultiple = this.to.multiple;
        this.disabled = this.to.disabled || false;
        if (this.to.enviar && this.to.recibir) {
          this.recuperaEnviar(this.to.enviar);
          this.recuperaRecibir(this.to.recibir);
        }
        if (this.to && this.to.obligatorios && this.to.visibles && this.to.deshabilitados) {
          this.recuperaVisibles(this.to.visibles);
          this.recuperaObligatorios(this.to.obligatorios);
          this.recuperaDeshabilitados(this.to.deshabilitados);
        }
        if (Array.isArray(this.to.value) && this.to.value[0]) {
          if (Array.isArray(this.to.value)) {
            this.to.value.forEach((element, index) => {
              this.agregarPersona();
              Object.keys(element).forEach(key => {
                this.objects[index][key].valor = element[key];
              });
            });
          }
        } else {
          this.agregarPersona();
          this.to.value = this.recuperaValores(this.objects);
        }
        setTimeout(() => {
          this.observar = true;
          this.to.validations = this.filtraRequeridos(this.persona);
          this.to.obligatorios = this.recuperaNombres(this.filtraObligatorio(this.persona));
          this.to.visibles = this.recuperaNombres(this.filtraVisible(this.persona));
          this.to.deshabilitados = this.recuperaNombres(this.filtraDeshabilitado(this.persona));
        }, 2000);
      });
    }
  };
</script>

<style lang="scss">
.tituloComponentePersona {
  margin-left: -21px;
  color: #006fba !important;
  font-weight: 700;
  font-size: 21px;
}
.borderDashed {
  border-bottom: 1px dashed #006fba;
}
.tabla {
  font-size: 13px;
  td {
    padding: 0.2rem;
    border-bottom: 1px solid rgba($color: #000, $alpha: 0.2);
  }
}
.translate-position-true {
  transform: perspective(1000px) rotateY(60deg) !important;
  animation-delay: 2s !important;
}
.ediciones {
  cursor: pointer;
}
.center {
  margin: auto;
}
</style>
