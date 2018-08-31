<template>
  <section>
     <!-- PARA API -->
           <v-card >
            <v-card-title class="headline">
              <v-icon>cloud</v-icon> Configurar  Servicio para el Documento
            <v-btn icon @click.native="cerrar()">
            <v-icon>close</v-icon>
          </v-btn>
          </v-card-title>
           <v-alert ng-if="e1 > 0" color="primary" icon="help" value="true">Asigne nombres a los campos del documento para usarlos en la peticion y respuesta 
              del servicio. </v-alert>
            <v-stepper v-model="e1">
                  <v-stepper-header>
                      <!--<v-stepper-step step="1" :complete="e1 > 1">Configuración del Modelo</v-stepper-step>-->
                      <v-stepper-step step="1" :complete="e1 > 1">Petición</v-stepper-step>
                      <v-stepper-step step="2" :complete="e1 > 2">Respuesta</v-stepper-step>
                      <v-stepper-step step="3" :complete="e1 > 3">Url</v-stepper-step>
                  </v-stepper-header>
                  <v-stepper-items>
                   <!-- <v-stepper-content step="1">
                      <v-card>
                        <v-card-text>
                                <v-layout>
                                  <v-flex xs4>
                                      <v-expansion-panel inset expand>
                                        <v-expansion-panel-content class="ma-0" v-for="(documento, i) in documentos" :key="i" style="max-width: 100%;">
                                          <div slot="header"><h5>{{documento.titulo || 'Documento'}}</h5></div>
                                          <div>
                                            <v-list-tile v-for="(element, i) in documento.body.componentes" :key="i" v-draggable.list="element">
                                              <v-list-tile-content class="int-form-comp">
                                                <v-list-tile-title>
                                                  {{ element.templateOptions && element.templateOptions.label ? element.templateOptions.label : element.descripcionAtributo ? element.descripcionAtributo : element.type }}
                                                  <span v-if="element.esq">({{element.esq}})</span>
                                                </v-list-tile-title>
                                                <v-list-tile-sub-title>
                                                  {{ element.name || "Sin nombre" }}
                                                  <span class="info--text" v-if="element.tipo">({{element.tipo}})</span>
                                                </v-list-tile-sub-title>
                                              </v-list-tile-content>
                                            </v-list-tile>
                                          </div>
                                        </v-expansion-panel-content>
                                      </v-expansion-panel>
                                  </v-flex>
                                  <v-flex>
                                    <div xs8 v-droppable.list="agregarComponente">
                                        <draggable :options="{sort:false}" >
                                          <div class="interoperabilidadDraggable" v-for="(element, idx) in esquema" :key="idx">
                                            <v-layout row wrap>
                                              <v-flex xs4 class="pa-1">
                                                <v-text-field v-if="element.tipoParametro !== 'param'"
                                                        label="Nombre del atributo"
                                                        v-model="element.nombreAtributo"
                                                        required hide-details
                                                ></v-text-field>
                                              </v-flex>
                                              <v-flex xs4 class="pl-3">
                                                <div class="detalle">
                                                  <strong>
                                                    {{ element.name || "Sin nombre" }}
                                                  </strong>
                                                  <br>
                                                  {{element.descripcionAtributo}}
                                                </div>
                                              </v-flex>
                                              <v-spacer></v-spacer>
                                              <v-flex xs1>
                                                <v-btn class="pt-3" flat icon color="red" @click.native="eliminarComponente(idx)" left>
                                                  <v-icon>delete</v-icon>
                                                </v-btn>
                                              </v-flex>
                                              <v-flex xs1 v-if="element.tipo && (element.tipo === 'object' ||element.tipo === 'table') ">
                                                <v-btn class="pt-3" flat icon color="primary" @click.native="configurarComponente(idx, element.value)" left>
                                                  <v-icon>settings</v-icon>
                                                </v-btn>
                                              </v-flex>
                                            </v-layout>
                                            <v-dialog v-model="configurarComponenteWeb"  max-width="200" persistent>
                                              <v-card class="pa-0">
                                                <v-card-title
                                                  class="headline grey lighten-2"
                                                  primary-title
                                                >
                                                  Seleccione el campo anidado.
                                                </v-card-title>
                                                <v-card-text class="pa-4">
                                                  <v-select
                                                      :items="camposSecundarios"
                                                      v-model="campo"
                                                      label="Campos anidados del componente"
                                                      autocomplete
                                                      v-on:change="onChange($event,idx)"
                                                    ></v-select>
                                                </v-card-text>
                                                <v-card-actions>
                                                  <v-btn icon @click="configurarComponenteWeb=false" title="ACEPTAR">
                                                    <v-icon color="green darken-4">done</v-icon>
                                                  </v-btn>
                                                </v-card-actions>
                                              </v-card>
                                            </v-dialog>
                                          </div>
                                        </draggable>
                                      <div class="drag-area" v-if="esquema.length === 0">
                                        Arrastre aquí y suelte cualquier elemento de la lista de componentes
                                      </div>
                                    </div>
                                  </v-flex>
                                </v-layout>
                              </v-card-text>
                              </v-card>
                    </v-stepper-content> -->
                      <v-stepper-content step="1">
                        <v-card>
                          <h3 class="headline">
                          Campos para la petición
                          <v-flex xs12 md12>
                      <v-expansion-panel inset expand>
                        <v-expansion-panel-content style="max-width: 100%;">
                          <div slot="header"><v-subheader class="pa-0 ma-0 title primary--text">Agregar datos de los Documentos</v-subheader></div>
                          <v-flex xs12 class="pa-3" >
                            <v-form ref="formAtributoAuxRequest" lazy-validation>
                              <v-layout row wrap>
                                <v-flex xs4 class="pa-1">
                                  <v-text-field 
                                    label="Nombre del atributo" 
                                    v-model="atributoAux.nombreAtributo" 
                                    required hide-details 
                                    placeholder="numeroDocumento"></v-text-field>
                                </v-flex>
                                <v-flex xs5 class="pa-1">
                                  <v-text-field
                                   label="Nombre del atributo en el documento" 
                                   v-model="atributoAux.name"
                                   :rules="nombreAtributoReglas" 
                                   hide-details 
                                   placeholder="Ejemplo: tramite.cite">
                                   </v-text-field>
                                </v-flex>
                                <v-flex xs4 class="pa-1">
                                  <v-text-field label="Descripción del atributo" 
                                    v-model="atributoAux.descripcionAtributo" 
                                    :rules="obligatorioReglas" 
                                    hide-details 
                                    placeholder="Ejemplo: Código del trámite"></v-text-field>
                                </v-flex>
                                <v-flex xs2 md2>
                                  <div class="text-xs-right">
                                    <v-btn icon large color="primary" @click.native="agregarAtributoAuxRequest()">
                                      <v-icon>add</v-icon>
                                    </v-btn>
                                  </div>
                                </v-flex>
                              </v-layout>
                            </v-form>
                          </v-flex>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-flex>
                        </h3>
                        <v-card-text>
                                <v-layout>
                                  <v-flex xs4>
                                      <div v-for="(documento, index) in documentos" :key="index">
                                          <div slot="header"><h5>{{documento.titulo || 'Documento'}}</h5></div>
                                          <div>
                                            <v-list-tile v-for="(element, i) in documento.body.componentes" :key="i" v-draggable.list="element">
                                              <v-list-tile-avatar>
                                                <v-icon color="white" :class="'success'">{{element.templateOptions.icon}}</v-icon>
                                              </v-list-tile-avatar>
                                              <v-list-tile-content class="int-form-comp">
                                                <v-list-tile-title>
                                                  {{ element.templateOptions && element.templateOptions.label ? element.templateOptions.label : element.descripcionAtributo ? element.descripcionAtributo : element.type }}
                                                  <span v-if="element.esq">({{element.esq}})</span>
                                                </v-list-tile-title>
                                                <v-list-tile-sub-title>
                                                  {{ element.name || "Sin nombre" }}
                                                  <span class="info--text" v-if="element.tipo">({{element.tipo}})</span>
                                                </v-list-tile-sub-title>
                                              </v-list-tile-content>
                                            </v-list-tile>
                                          </div>
                                        </div>
                                  </v-flex>
                                  <v-flex>
                                    <div xs8 v-droppable.list="agregarComponenteRequest" class="drag-area">
                                      <v-form ref="formPeticion" lazy-validation>
                                        <draggable :options="{sort:false}" >
                                          <div class="interoperabilidadDraggable" v-for="(element, idx) in esquemaRequest" :key="idx">
                                            <v-layout row wrap>
                                              <v-flex xs4 class="pa-1">
                                                <v-text-field v-if="element.tipoParametro !== 'param'"
                                                        label="Nombre del atributo"
                                                        v-model="element.nombreAtributo"
                                                        :rules="!element.nombreAtributo ? ['Este campo es requerido' ] : []"
                                                        required hide-details
                                                        :name="`nombreAtributo${idx}`"
                                                ></v-text-field>
                                              </v-flex>
                                              <v-flex xs4 class="pl-3">
                                                <div class="detalle">
                                                  <strong>
                                                    {{ element.name || "Sin nombre" }}
                                                  </strong>
                                                  <br>
                                                  {{element.descripcionAtributo}}
                                                  <v-text-field  v-if="element.tipo && (element.tipo === 'object' || element.tipo === 'table') "
                                                        label="Atributos anidados"
                                                        v-model="element.secundarios"
                                                        :rules="!element.secundarios ? ['Este campo es requerido' ] : []"
                                                        required hide-details
                                                        :name="`secundarios${idx}`"
                                                ></v-text-field>
                                                </div>
                                              </v-flex>
                                              <v-spacer></v-spacer>
                                              <v-flex xs1>
                                                <v-btn class="pt-3" flat icon color="red" @click.native="eliminarComponenteRequest(idx)" left>
                                                  <v-icon>delete</v-icon>
                                                </v-btn>
                                              </v-flex>
                                            </v-layout>
                                          </div>
                                        </draggable>
                                      </v-form>
                                      <div class="drag-area" v-if="esquemaRequest.length === 0">
                                        Arrastre aquí y suelte cualquier elemento de la lista de componentes
                                      </div>
                                    </div>
                                  </v-flex>
                                </v-layout>
                              </v-card-text>
                              </v-card>
                          <v-container fluid px-0>
                          <!-- <div v-for="(campo, index) in request" :key="index">
                            <v-layout row wrap>
                              <v-flex xs1>
                                <strong class="btn-remove">{{ index + 1 }}.</strong>
                              </v-flex>
                              <v-flex xs3>
                                <div class="form-group">
                                  <v-select
                                    :items="tiposParametro"
                                    v-model="request[index].param"
                                    label="Tipo"
                                    item-text="tiposParametro"
                                    item-value="tiposParametro"
                                    autocomplete
                                  ></v-select>
                                </div>
                              </v-flex>
                              <v-flex xs3>
                                <div class="form-group">
                                  <v-select
                                    :items="modelo"
                                    v-model="request[index].campo"
                                    label="Campo"
                                    item-text="atributo"
                                    item-value="atributo"
                                    autocomplete
                                  ></v-select>
                                </div>
                              </v-flex>
                              <v-flex xs1>
                                <v-btn small icon @click="eliminarCampoRequest(index)" title="Eliminar esta fila">
                                  <v-icon color="red darken-4">delete</v-icon>
                                </v-btn>
                              </v-flex>
                            </v-layout>
                          </div> -->
                        </v-container>
                      </v-stepper-content>
                      <v-stepper-content step="2">
                        <v-card>
                          <h3 class="headline">
                          Campos para la respuesta
                          </h3>
                          <v-expansion-panel inset expand>
                        <v-expansion-panel-content style="max-width: 100%;">
                          <div slot="header"><v-subheader class="pa-0 ma-0 title primary--text">Agregar datos de los Documentos</v-subheader></div>
                          <v-flex xs12 class="pa-3" >
                            <v-form ref="formAtributoAuxResponse" lazy-validation>
                              <v-layout row wrap>
                                <v-flex xs4 class="pa-1">
                                  <v-text-field 
                                    label="Nombre del atributo" 
                                    v-model="atributoAuxResponse.nombreAtributo" 
                                    required hide-details 
                                    placeholder="numeroDocumento"></v-text-field>
                                </v-flex>
                                <v-flex xs5 class="pa-1">
                                  <v-text-field
                                   label="Nombre del atributo en el documento" 
                                   v-model="atributoAuxResponse.name"
                                   :rules="nombreAtributoReglas" 
                                   hide-details 
                                   placeholder="Ejemplo: tramite.cite">
                                   </v-text-field>
                                </v-flex>
                                <v-flex xs4 class="pa-1">
                                  <v-text-field label="Descripción del atributo" 
                                    v-model="atributoAuxResponse.descripcionAtributo" 
                                    :rules="obligatorioReglas" 
                                    hide-details 
                                    placeholder="Ejemplo: Código del trámite"></v-text-field>
                                </v-flex>
                                <v-flex xs2 md2>
                                  <div class="text-xs-right">
                                    <v-btn icon large color="primary" @click.native="agregarAtributoAuxResponse()">
                                      <v-icon>add</v-icon>
                                    </v-btn>
                                  </div>
                                </v-flex>
                              </v-layout>
                            </v-form>
                          </v-flex>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                        <v-card-text>
                                <v-layout>
                                  <v-flex xs4>
                                      <div v-for="(documento, index) in documentos" :key="index">
                                          <div slot="header"><h5>{{documento.titulo || 'Documento'}}</h5></div>
                                          <div>
                                            <v-list-tile v-for="(element, i) in documento.body.componentes" :key="i" v-draggable.list="element">
                                              <v-list-tile-avatar>
                                                <v-icon color="white" :class="'success'">{{element.templateOptions.icon}}</v-icon>
                                              </v-list-tile-avatar>
                                              <v-list-tile-content class="int-form-comp">
                                                <v-list-tile-title>
                                                  {{ element.templateOptions && element.templateOptions.label ? element.templateOptions.label : element.descripcionAtributo ? element.descripcionAtributo : element.type }}
                                                  <span v-if="element.esq">({{element.esq}})</span>
                                                </v-list-tile-title>
                                                <v-list-tile-sub-title>
                                                  {{ element.name || "Sin nombre" }}
                                                  <span class="info--text" v-if="element.tipo">({{element.tipo}})</span>
                                                </v-list-tile-sub-title>
                                              </v-list-tile-content>
                                            </v-list-tile>
                                          </div>
                                        </div>
                                  </v-flex>
                                  <v-flex>
                                    <div xs8 v-droppable.list="agregarComponenteResponse" class="drag-area">
                                      <v-form ref="formRespuesta" lazy-validation>
                                        <draggable :options="{sort:false}" >
                                          <div class="interoperabilidadDraggable" v-for="(element, idx) in esquemaResponse" :key="idx">
                                            <v-layout row wrap>
                                              <v-flex xs4 class="pa-1">
                                                <v-text-field v-if="element.tipoParametro !== 'param'"
                                                        label="Nombre del atributo"
                                                        v-model="element.nombreAtributo"
                                                        required hide-details
                                                        :rules="!element.nombreAtributo ? ['Este campo es requerido' ] : []"
                                                ></v-text-field>
                                              </v-flex>
                                              <v-flex xs4 class="pl-3">
                                                <div class="detalle">
                                                  <strong>
                                                    {{ element.name || "Sin nombre" }}
                                                  </strong>
                                                  <br>
                                                  {{element.descripcionAtributo}}
                                                  <v-text-field  v-if="element.tipo && (element.tipo === 'object' ||element.tipo === 'table') "
                                                        label="Atributos anidados"
                                                        v-model="element.secundarios"
                                                        hide-details
                                                        placeholder="*Si lo deja vacio, devolverá la lista completa."
                                                ></v-text-field>
                                                </div>
                                              </v-flex>
                                              <v-spacer></v-spacer>
                                              <v-flex xs1>
                                                <v-btn class="pt-3" flat icon color="red" @click.native="eliminarComponenteResponse(idx)" left>
                                                  <v-icon>delete</v-icon>
                                                </v-btn>
                                              </v-flex>
                                            </v-layout>
                                          </div>
                                        </draggable>
                                      </v-form>
                                      <div class="drag-area" v-if="esquemaResponse.length === 0">
                                        Arrastre aquí y suelte cualquier elemento de la lista de componentes
                                      </div>
                                    </div>
                                  </v-flex>
                                </v-layout>
                              </v-card-text>
                              </v-card>
                          <v-container fluid px-0>
                          <!--<div v-for="(campo, index) in response" :key="index">
                            <v-layout row wrap>
                              <v-flex xs1>
                                <strong class="btn-remove">{{ index + 1 }}.</strong>
                              </v-flex>
                              <v-flex xs3>
                                <div class="form-group">
                                  <v-select
                                    :items="modelo"
                                    v-model="response[index].campo"
                                    label="Campo"
                                    item-text="atributo"
                                    item-value="atributo"
                                    autocomplete
                                  ></v-select>
                                </div>
                              </v-flex>
                              <v-flex xs1>
                                <v-btn small icon @click="eliminarCampoResponse(index)" title="Eliminar esta fila">
                                  <v-icon color="red darken-4">delete</v-icon>
                                </v-btn>
                              </v-flex>
                            </v-layout>
                          </div> -->
                        </v-container>
                      </v-stepper-content>
                      <v-stepper-content step="3">
                        <strong>Debe reemplazar las cadenas que tienen el prefijo ':' por los valores con los que se desea consultar.</strong>
                        <v-flex xs12 class="pr-2">
                          <v-flex>
                            <label class="primary--text"><strong>{{urlBaseCompartirCopia}}</strong></label>
                          </v-flex>
                        </v-flex>
                        <v-divider></v-divider>
                        <v-layout row wrap class="text-xs-left">
                          <v-flex xs12 class="ml-3">
                            <v-text-field 
                              xs12
                              rows="3"
                              v-model="token"
                              label="Token para el consumo"
                              readonly
                              >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs12 class="ml-3">
                            <v-text-field 
                              xs12
                              rows="3"
                              v-model="urlStatus"
                              label="Status"
                              readonly
                              >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs12>
                            <div class="text-xs-right">
                              <v-btn color="info" @click.native="probarServicio()"><v-icon dark>find_in_page</v-icon> Probar el servicio</v-btn>
                            </div>
                          </v-flex>
                          <v-text-field 
                          xs12
                          v-model="urlBaseCompartir"
                          rows="3">
                          </v-text-field>
                          <v-flex xs12 class="ml-3">
                            <v-icon class="primary--text">info</v-icon>
                            <span class="primary--text body-1">La siguiente respuesta solo muestra un EJEMPLO de la estructura de los datos para la petición.</span>
                          </v-flex>
                          <v-flex xs12>
                            <div class="ma-3">
                              <!--<p><small><strong>Url: </strong>url</small></p>-->
                              <p><small><strong>Método: </strong>GET</small></p>
                              <p><small><strong>Status: </strong>{{statusPrueba}}</small></p>
                              <!--<p>
                                <small>
                                  <strong>Cabeceras: </strong><br>
                                  <pre>{{pruebaConsumo.headers}}</pre>
                                </small>
                              </p>
                              <p>
                                <small>
                                  <strong>Cuerpo envío: </strong><br>
                                  <pre>{{pruebaConsumo.data}}</pre>
                                </small>
                              </p> -->
                              <p>
                                <small>
                                  <strong>Cuerpo retorno: </strong><br>
                                  <ace-editor 
                                  v-model="respuestaPrueba" 
                                    @init="aceEditorInit" 
                                    lang="json" 
                                    theme="monokai" 
                                    width="100%" 
                                    height="400" 
                                    tabSize= "4"
                                    useSoftTabs="true"
                                    ></ace-editor>
                                </small>
                              </p>
                            </div>
                          </v-flex>
                        </v-layout>
                      </v-stepper-content>
                  </v-stepper-items>
              </v-stepper>
          <v-card-text>
              </v-card-text>
                 <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click.native="atrasPaso()"><v-icon>chevron_left</v-icon> Atras</v-btn>
                  <v-btn color="primary" v-if="e1 != 2 && e1!= 3 " @click.native="avanzarPaso()"><v-icon>chevron_right</v-icon> Continuar</v-btn>
                  <v-btn color="primary" v-if="e1 === 2" @click.native="guardarConfiguracionApi()"><v-icon dark>check</v-icon> Guardar</v-btn>
                  <v-btn color="primary" v-if="e1 === 3 " @click.native="cerrar()"><v-icon dark>check</v-icon> Salir</v-btn>
                </v-card-actions>
            </v-card>
  </section>
</template>
<script>
/* eslint no-useless-escape: 0 */
/* eslint no-unneeded-ternary:0 */
import draggable from 'vuedraggable';
import axios from 'axios';
import AceEditor from 'vue2-ace-editor';
export default {
  props: {
    idFormulario: {
      required: true
    }
  },
  methods: {
    cerrar () {
      this.$emit('updateVisible', false);
    },
    async adicionarCampoRequest () {
      this.request.push({param: '', campo: ''});
    },
    async adicionarCampoResponse () {
      this.response.push({ campo: '' });
    },
    async avanzarPaso () {
      if (parseInt(this.e1) === 1) {
        if (this.esquemaRequest.length === 0) {
          this.$message.error('Debe configurar los atributos de la petición.');
          return;
        }
        if (!this.$refs.formPeticion.validate()) {
          this.$message.error('Debe llenar los nombres correspondientes a cada campo.');
          return;
        }
      }
      if (parseInt(this.e1) === 2) {
        if (this.esquemaResponse.length === 0) {
          this.$message.error('Debe configurar los atributos de la respuesta.');
          return;
        }
        if (!this.$refs.formRespuesta.validate()) {
          this.$message.error('Debe llenar los nombres correspondientes para cada campo.');
          return;
        }
      }
      this.e1 ++;
    },
    async atrasPaso () {
      this.e1 --;
    },
    actualizaURL () {
      this.urlBaseCompartir = ``;
      this.urlParcial = '';
      this.request.map(campo => {
        this.urlParcial += `:${campo.campo}/`;
      });
      this.urlParcial = this.urlParcial.slice(0, -1);
    },
    async guardarConfiguracionApi () {
      this.modelo = [];
      this.request = [];
      this.response = [];
      if (this.esquemaResponse.length === 0) {
        this.$message.error('Debe configurar los atributos de la respuesta.');
        return;
      }
      if (!this.$refs.formRespuesta.validate()) {
        this.$message.error('Debe llenar los nombres correspondientes para cada campo.');
        return;
      }
      this.esquemaRequest.map(item => {
        if (item.tipo === 'object' || item.tipo === 'table') {
          this.modelo.push(
            { tipo: 'dinamico', atributo: item.nombreAtributo, componente: item.name, secundario: item.secundarios || '' }
            );
        } else {
          this.modelo.push({ tipo: item.tipo, atributo: item.nombreAtributo, componente: item.name, secundario: item.secundarios || '' });
        }
        this.request.push({param: '', campo: item.nombreAtributo});
      });
      this.esquemaResponse.map(item => {
        if (item.tipo === 'object' || item.tipo === 'table') {
          this.modelo.push(
            { tipo: 'dinamico',
              atributo: item.nombreAtributo,
              componente: item.name,
              secundario: item.secundarios || ''
            }
          );
        } else {
          this.modelo.push(
            { tipo: item.tipo, atributo: item.nombreAtributo, componente: item.name, secundario: item.secundarios || '' });
        }
        this.response.push({campo: item.nombreAtributo});
      });
      this.actualizaURL();
      let api = {};
      api.modelo = this.modelo;
      api.request = this.request;
      api.response = this.response;
      api.url = this.urlParcial;
      api.esquemaRequest = this.esquemaRequest;
      api.esquemaResponse = this.esquemaResponse;
      const res = await this.$service.put(`documentos_plantilla/metadata/${this.idFormulario}`, api);
      if (res) {
        this.$message.success('Se guardo correctamente.');
        this.urlBaseCompartir = `${process.env.SERVER}/api/interoperabilidad/${res.voucher}/${this.idFormulario}/${this.urlParcial}`;
        this.urlBaseCompartirCopia = this.urlBaseCompartir;
        this.token = res.token;
        this.urlStatus = `${process.env.SERVER}/status`;
        // this.urlBaseCompartirCopia = this.urlBaseCompartirCopia.replace(':', '_');
        this.respuestaPrueba = '';
        this.statusPrueba = '';
        this.avanzarPaso();
      }
    },
    agregarComponenteRequest (dom) {
      /** los componentes de tipo plugin necesitan el campo los nombres de sus campos en VISIBLES */
      const agregarObj = JSON.parse(dom);
      console.log('----el dom----------------------------------------------------------');
      console.log(agregarObj);
      delete agregarObj.tipo;
      agregarObj.secundario = null;
      agregarObj.idComponente = agregarObj.templateOptions ? agregarObj.templateOptions.id : null;
      if (agregarObj && agregarObj.templateOptions && agregarObj.templateOptions.visibles && agregarObj.templateOptions.visibles.length) {
        agregarObj.value = [];
        agregarObj.tipo = 'object';
        agregarObj.hijos = agregarObj.templateOptions.visibles;
      } else if (agregarObj && agregarObj.templateOptions && typeof agregarObj.templateOptions.columns === 'object' && agregarObj.templateOptions.columns) {
        agregarObj.value = [];
        agregarObj.tipo = 'table';
        agregarObj.hijos = agregarObj.templateOptions.columns;
      } else {
        agregarObj.descripcionAtributo = agregarObj.templateOptions ? agregarObj.templateOptions.label : agregarObj.descripcionAtributo ? agregarObj.descripcionAtributo : 'SIN DESCRIPCIÓN';
        agregarObj.tipo = 'dinamico';
      }
      this.esquemaRequest.push(
        { tipo: agregarObj.tipo,
          nombreAtributo: '',
          name: agregarObj.name,
          secundarios: agregarObj.secundarios,
          hijos: agregarObj.hijos,
          descripcionAtributo: agregarObj.descripcionAtributo
        });
    },
    agregarComponenteResponse (dom) {
      /** los componentes de tipo plugin necesitan el campo los nombres de sus campos en VISIBLES */
      const agregarObj = JSON.parse(dom);
      delete agregarObj.tipo;
      agregarObj.secundario = null;
      agregarObj.idComponente = agregarObj.templateOptions ? agregarObj.templateOptions.id : null;
      if (agregarObj && agregarObj.templateOptions && agregarObj.templateOptions.visibles && agregarObj.templateOptions.visibles.length) {
        agregarObj.value = [];
        agregarObj.tipo = 'object';
        agregarObj.hijos = agregarObj.templateOptions.visibles;
      } else if (agregarObj && agregarObj.templateOptions && typeof agregarObj.templateOptions.columns === 'object' && agregarObj.templateOptions.columns) {
        agregarObj.value = [];
        agregarObj.tipo = 'table';
        agregarObj.hijos = agregarObj.templateOptions.columns;
      } else {
        agregarObj.descripcionAtributo = agregarObj.templateOptions ? agregarObj.templateOptions.label : agregarObj.descripcionAtributo ? agregarObj.descripcionAtributo : 'SIN DESCRIPCIÓN';
        agregarObj.tipo = 'dinamico';
      }
      this.esquemaResponse.push(
        { tipo: agregarObj.tipo,
          nombreAtributo: '',
          name: agregarObj.name,
          secundarios: agregarObj.secundarios,
          hijos: agregarObj.hijos,
          descripcionAtributo: agregarObj.descripcionAtributo
        });
    },
    eliminarComponenteRequest (idx) {
      this.esquemaRequest.splice(idx, 1);
    },
    eliminarComponenteResponse (idx) {
      this.esquemaResponse.splice(idx, 1);
    },
    eliminarComponente (idx) {
      this.esquema.splice(idx, 1);
    },
    eliminarCampoResponse (idx) {
      this.response.splice(idx, 1);
    },
    eliminarCampoRequest (idx) {
      this.request.splice(idx, 1);
    },
    configurarComponente (idx, valores) {
      this.filaSeleccionada = idx;
      this.configurarComponenteWeb = true;
      this.camposSecundarios = [];
      if (valores) {
        valores.forEach(valor => {
          this.camposSecundarios.push(valor.name);
        });
      }
    },
    onChange (event, index) {
      if (typeof event !== 'string') {
        this.camposSecundarios.push(event.target.value);
        this.campo = event.target.value;
        this.esquema[this.filaSeleccionada].descripcionAtributo = this.campo;
        this.esquema[this.filaSeleccionada].secundario = `.${this.campo}`;
      } else {
        this.campo = event;
        this.esquema[this.filaSeleccionada].descripcionAtributo = `${this.campo}`;
        this.esquema[this.filaSeleccionada].secundario = `.${this.campo}`;
      }
    },
    probarServicio () {
      const req = {
        url: `${this.urlBaseCompartir}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${this.token}`
        },
        json: true
      };
      axios(req)
      .then(respuesta => {
        this.respuesta = respuesta;
        this.statusPrueba = `${respuesta.status} ${respuesta.statusText}`;
        this.respuestaPrueba = JSON.stringify(respuesta.data, null, 4);
      })
      .catch(error => {
        this.respuestaPrueba = JSON.stringify(error.response.data, null, 4);
        this.statusPrueba = `${error.response.status} ${error.response.statusText}`;
      });
    },
    agregarAtributoAuxRequest () {
      if (this.$refs.formAtributoAuxRequest.validate()) {
      // if (parseInt(this.e1) === 2) {
        const atrs = this.atributoAux.name.split('.');
        let strAtrs = '';
        if (atrs.length > 1) {
          for (let j = 1; j < atrs.length; j++) {
            strAtrs += atrs[j] + '.';
          }
        }
        strAtrs = strAtrs.substr(0, strAtrs.length - 1);
        const objAux = {
          tipo: 'estatico',
          name: atrs[0] || this.atributoAux.name,
          nombreAtributo: this.atributoAux.nombreAtributo,
          secundarios: strAtrs,
          descripcionAtributo: strAtrs || this.atributoAux.descripcionAtributo,
          hijos: null
        };
        this.esquemaRequest.push(objAux);
        this.atributoAux = {};
      // }
      } else {
        this.$message.error('Debe completar los datos obligatorios.');
      }
    },
    agregarAtributoAuxResponse () {
      if (this.$refs.formAtributoAuxResponse.validate()) {
      // if (parseInt(this.e1) === 2) {
        const atrs = this.atributoAuxResponse.name.split('.');
        let strAtrs = '';
        if (atrs.length > 1) {
          for (let j = 1; j < atrs.length; j++) {
            strAtrs += atrs[j] + '.';
          }
        }
        strAtrs = strAtrs.substr(0, strAtrs.length - 1);
        const objAux = {
          tipo: 'estatico',
          name: atrs[0] || this.atributoAuxResponse.name,
          nombreAtributo: this.atributoAuxResponse.nombreAtributo,
          secundarios: strAtrs,
          descripcionAtributo: strAtrs || this.atributoAuxResponse.descripcionAtributo,
          hijos: null
        };
        this.esquemaResponse.push(objAux);
        this.atributoAux = {};
      // }
      } else {
        this.$message.error('Debe completar los datos obligatorios.');
      }
    },
    aceEditorInit: function () {
      require('brace/ext/language_tools'); // language extension prerequisite...
      require('brace/mode/html');
      require('brace/mode/json'); // language
      require('brace/mode/less');
      require('brace/theme/monokai');
      require('brace/theme/monokai');
      // require('brace/snippet/javascript') //snippet
    }
  },
  data () {
    return {
      // desde aqui para Compartir APi
      atributoAux: {},
      atributoAuxResponse: {},
      tiposParametro: ['param'],
      opcionesMetodos: ['GET', 'POST', 'PUT'],
      esquema: [],
      esquemaRequest: [],
      esquemaResponse: [],
      documentoPlantillaOriginal: {},
      e1: null,
      request: [],
      response: [],
      urlBaseCompartir: null,
      urlBaseCompartirCopia: null,
      respuesta: null,
      respuestaPrueba: '',
      statusPrueba: null,
      metodoPrueba: null,
      urlParcial: null,
      urlStatus: null,
      modelo: [],
      shareDialogPreview: null,
      configurarComponenteWeb: false,
      camposSecundarios: [],
      campo: null,
      token: null,
      filaSeleccionada: null,
      documentos: [],
      descripcionReglas: [
        v => !!v || 'La descripción del servicio es un dato obligatorio.'
      ],
      urlReglas: [
        v => !!v || 'La URL del servicio es un dato obligatorio.',
        v => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v) || 'La URL del servicio no es una URL válida.'
      ],
      nombreAtributoReglas: [
        v => !!v || 'El nombre del atributo es un dato obligatorio.',
        v => /^[$A-Z_][0-9A-Z_.$]*$/i.test(v) || 'El nombre del atributo no es válido.'
      ],
      obligatorioReglas: [
        v => !!v || 'El dato es obligatorio.'
      ]
    };
  },
  watch: {
    /* request: {
      handler: function (valor, anterior) {
        this.actualizaURL();
      },
      deep: true
    } */
  },
  components: {
    draggable,
    AceEditor
  },
  async mounted () {
    if (!this.idFormulario) {
      return;
    }
    try {
      const res = await this.$service.get(`documentos_plantilla/${this.idFormulario}`);
      if (res) {
        this.documentos.push(res);
        this.datos = [];
        res.body.componentes.reduce((ant, next) => {
          const objTmp = next;
          objTmp.key = next.type;
          objTmp.templateOptions.settings = false;
          ant.push(objTmp);
          return ant;
        }, this.datos);
        this.documentoPlantillaOriginal = res;
        this.configApiDialogPreview = true;
        if (this.documentoPlantillaOriginal.metadata && this.documentoPlantillaOriginal.metadata.request && this.documentoPlantillaOriginal.metadata.response) {
          this.request = this.documentoPlantillaOriginal.metadata.request;
          this.response = this.documentoPlantillaOriginal.metadata.response;
          this.esquemaRequest = this.documentoPlantillaOriginal.metadata.esquemaRequest || [];
          this.esquemaResponse = this.documentoPlantillaOriginal.metadata.esquemaResponse || [];
          this.modelo = this.documentoPlantillaOriginal.metadata.modelo;
        }
      }
    } catch (err) {
      this.$message.error(err.message);
    }
  }
};
</script>
<style lang="scss">
  .drag-area {
    background: #f0f0f0;
    min-height: 150px;
    padding: 10px;
    height: 100%;
  }
  .interoperabilidadDraggableAtributo {
    padding: 0px 30px;
  }
</style>
