<template>
  <section>
    <v-btn icon slot="activator" large class="botonApps" @click.native="abrirConfiguracion" v-if="esComponenteFormulario">
      <v-icon color="primary darken-1">settings</v-icon>
    </v-btn>
    <!-- Dialog para la desactivación -->
    <v-dialog v-model="mostrarConfiguracion" max-width="1000" persistent scrollable>
      <v-card class="dialog-token">
        <v-card-title class="headline">
          <v-icon>cloud</v-icon> Configuración de Interoperabilidad en {{ data.titulo }}
          <v-btn icon @click.native="cerrarConfiguracion()">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-alert v-if="e1 > 0 && (e1 != 4 || conf.tipo != 'S') && (e1 != 6 || conf.tipo != 'A')" color="info" icon="help" value="true">{{mensajes[e1-1]}}</v-alert>
          <v-alert v-if="e1 > 0 && (e1 == 4 && conf.tipo == 'S') || (e1 == 6 && conf.tipo == 'A')" color="info" icon="help" value="true">{{mensajes[5]}}</v-alert>
          <v-stepper v-model="e1" alt-labels>
            <v-stepper-header>
              <v-stepper-step step="1" :complete="e1 > 1" @click.native="e1 > 1 && irPaso(1)">Configuración general</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2" :complete="e1 > 2" @click.native="e1 > 2 && irPaso(2)">Configuración del envío</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="3" :complete="e1 > 3" @click.native="e1 > 3 && irPaso(3)">Configuración de la respuesta</v-stepper-step>
              <v-divider v-if="conf.tipo == 'S'"></v-divider>
              <v-stepper-step step="4" :complete="e1 > 4" v-if="conf.tipo == 'S'" @click.native="e1 > 4 && irPaso(4)">Resumen</v-stepper-step>
              <v-divider v-if="conf.tipo == 'A'"></v-divider>
              <v-stepper-step step="4" :complete="e1 > 4" v-if="conf.tipo == 'A'" @click.native="e1 > 4 && irPaso(4)">Configuración de la respuesta (retorno)</v-stepper-step>
              <v-divider v-if="conf.tipo == 'A'"></v-divider>
              <v-stepper-step step="5" :complete="e1 > 5" v-if="conf.tipo == 'A'" @click.native="e1 > 5 && irPaso(5)">Configuración del envío (retorno)</v-stepper-step>
              <v-divider v-if="conf.tipo == 'A'"></v-divider>
              <v-stepper-step step="6" :complete="e1 > 6" v-if="conf.tipo == 'A'" @click.native="e1 > 6 && irPaso(6)">Resumen</v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-card-text>
                  <v-form ref="form1" lazy-validation>
                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-text-field label="Descripción" v-model="descripcion" required :rules="descripcionReglas">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs12 class="pr-2 mb-3">
                        <v-icon class="error--text">help</v-icon>
                        <span class="error--text body-1">Si la URL tiene parámetros, identificar su nombre con guión bajo (<strong>_</strong>) . Ej.: https://www.dominio.gob.bo/persona/<strong>_CI</strong></span>
                      </v-flex>
                      <v-flex xs6 class="pr-2">
                        <v-text-field label="URL del servicio" v-model="conf.url" required :rules="urlReglas" placeholder="https://ejemplo.gob.bo/servicios/">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6 class="pr-2">
                        <v-text-field label="Ruta de consumo" v-model="conf.urlRequest" required :rules="consumoReglas" placeholder="segip/personas">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs3 class="pr-2">
                        <v-text-field label="Ruta de estado" v-model="conf.urlStatus" required :rules="estadoReglas" placeholder="segip/status">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs3 class="pr-2">
                        <v-select
                          :items="opcionesMetodos"
                          v-model="conf.metodo"
                          label="Método de consumo"
                           :rules="metodoReglas"
                        ></v-select>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field label="Token" v-model="conf.token" required :rules="tokenReglas">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs6 v-if="!esComponenteFormulario">
                        <v-radio-group v-model="conf.tipo" label="Tipo" required column :rules="tipoReglas">
                          <v-radio
                            v-for="(o, i) in opcionesTipo"
                            :key="o"
                            :label="`${o}`"
                            :value="i"
                          ></v-radio>
                        </v-radio-group>
                      </v-flex>
                      <v-flex xs6 v-if="conf.tipo === 'A'">
                        <v-text-field label="Validez del token de retorno (en días)" v-model="conf.validezTokenRetorno" :rules="validezReglas" mask="###" required>
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12>
                        <span class="body-1 primary--text"><strong>SERVICIO: </strong>{{conf.url}}{{conf.urlRequest}}</span>
                      </v-flex>
                      <v-flex xs12>
                        <span class="body-1 primary--text"><strong>ESTADO: </strong>{{conf.url}}{{conf.urlStatus}}</span>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12 md12>
                      <v-expansion-panel inset expand>
                        <v-expansion-panel-content style="max-width: 100%;">
                          <div slot="header"><v-subheader class="pa-0 ma-0 title primary--text">Agregar datos de los Documentos</v-subheader></div>
                          <v-flex xs12 class="pa-3" >
                            <v-form ref="formAtributoAux" lazy-validation>
                              <v-layout row wrap>
                                <v-flex xs12 class="pa-1 body-1 primary--text">
                                  <v-icon class="primary--text">help</v-icon>
                                  Si no selecciona el documento, en vez del atributo se enviará el valor.
                                </v-flex>
                                <v-flex xs6 class="pa-1">
                                  <v-select :items="documentos" v-model="atributoAux.documento" item-text="name" label="Documento Origen" hide-details clearable></v-select>
                                </v-flex>
                                <v-flex xs5 class="pa-1">
                                  <v-text-field :label="atributoAux.idDocumento ? 'Nombre del atributo en el documento' : 'Valor del atributo'" v-model="atributoAux.name" required hide-details :placeholder="atributoAux.idDocumento ? 'Ejempo: cite' : 'Ejemplo: C-1234'"></v-text-field>
                                </v-flex>
                                <v-flex xs2 class="pa-1">
                                  <v-select :items="tiposParametro" v-model="atributoAux.tipoParametro" label="Tipo de atributo" :rules="obligatorioReglas" required hide-details></v-select>
                                </v-flex>
                                <v-flex xs4 class="pa-1">
                                  <v-select v-if="atributoAux.tipoParametro === 'param'" :items="paramsLista" v-model="atributoAux.nombreAtributo" label="Nombre del atributo" hide-details :rules="obligatorioReglas"></v-select>
                                  <v-text-field v-if="atributoAux.tipoParametro !== 'param'" label="Nombre del atributo para envío" v-model="atributoAux.nombreAtributo" :rules="nombreAtributoReglas" hide-details placeholder="Ejemplo: tramite.nro_documento"></v-text-field>
                                </v-flex>
                                <v-flex xs4 class="pa-1">
                                  <v-text-field label="Descripción del atributo" v-model="atributoAux.descripcionAtributo" :rules="obligatorioReglas" hide-details placeholder="Ejemplo: Código del trámite"></v-text-field>
                                </v-flex>
                                <v-flex xs2 md2>
                                  <div class="text-xs-right">
                                    <v-btn icon large color="primary" @click.native="agregarAtributoAux()">
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
                    <v-flex xs12 md12>
                      <v-subheader class="title primary--text">Atributos de los formularios</v-subheader>
                    </v-flex>
                    <v-flex xs4 md4 lg4 sm4>
                      <div class="bloqueComponentes">
                        <v-expansion-panel inset expand>
                          <v-expansion-panel-content class="ma-0" v-for="(o, i) in documentos" :key="i" style="max-width: 100%;">
                            <div slot="header"><h5>{{o.name || 'Documento'}}</h5></div>
                            <div>
                              <v-list-tile v-for="(element, i) in o.componentes" :key="i" v-draggable.list="element">
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
                      </div>
                    </v-flex>
                    <v-flex xs8 md8 lg8 sm8>
                      <div class="seccionConf" xs8 v-droppable.list="agregarComponente">
                        <v-card>
                          <draggable>
                            <div class="interoperabilidadDraggable" v-for="(element, idx) in esquema" :key="idx" :class="element.atributoDocumento ? 'fondo' : ''">
                              <v-layout row wrap>
                                <v-flex xs12 class="text-md-right">
                                  <small class="info--text">{{element.descripcionAtributo}}</small>
                                </v-flex>
                                <v-flex xs12 class="pa-0 ma-0" v-if="element.atributoDocumento">
                                  <small >Atributo de un documento.</small>
                                </v-flex>
                                <v-flex xs3 class="pa-1">
                                  <v-select :items="tiposParametro" v-model="element.tipoParametro" label="Tipo de atributo" hide-details :disabled="element.atributoDocumento"></v-select>
                                </v-flex>
                                <v-flex xs4 class="pa-1">
                                  <v-select v-if="element.tipoParametro === 'param'" :items="paramsLista" v-model="element.nombreAtributo" label="Nombre del atributo" hide-details></v-select>
                                  <v-text-field v-if="element.tipoParametro !== 'param'" label="Nombre del atributo" v-model="element.nombreAtributo" :rules="nombreAtributoReglas" required hide-details :disabled="element.atributoDocumento"></v-text-field>
                                </v-flex>
                                <v-flex xs4 class="pl-3">
                                  <div class="detalle">
                                    <strong>
                                      {{ element.name || "Sin nombre" }}
                                    </strong>
                                    <br>
                                  </div>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <v-flex xs1>
                                  <v-btn class="pt-3" flat icon color="red" @click.native="eliminarComponente(idx)" left>
                                    <v-icon>delete</v-icon>
                                  </v-btn>
                                </v-flex>
                              </v-layout>
                              <v-layout v-if="element.value" column>
                                <div class="interoperabilidadDraggableAtributo" v-for="(valor, key) in element.value" :key="key">
                                  <v-layout row wrap>
                                    <v-flex xs6>
                                      <v-text-field label="Nombre del atributo" v-model="valor.nombreAtributo" :rules="nombreAtributoReglas" required hide-details></v-text-field>
                                    </v-flex>
                                    <v-flex xs6 class="pl-5 pt-4 align-middle">
                                      <strong>
                                        {{valor.name}}
                                      </strong>
                                      <br>
                                      {{valor.descripcionAtributo}}
                                    </v-flex>
                                  </v-layout>
                                </div>
                              </v-layout>
                            </div>
                          </draggable>
                        </v-card>
                        <div class="text-xs-center" align-center v-if="esquema.length == 0">
                          Arrastre aquí y suelte cualquier elemento de la lista de componentes
                        </div>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-stepper-content>
              <v-stepper-content step="3">
                <v-card-text>
                  <v-card>
                    <v-card-text>
                      <v-form @submit.prevent="deactivate">
                        <v-layout row wrap>
                          <v-flex xs12 v-if="aux.tipo === 'array_seleccionable'">
                            <v-icon class="error--text">info</v-icon>
                            <span class="error--text body-1">
                              Considere que la <b>Lista Seleccionable</b> solo puede ser utilizada una vez. La misma obligará al usuario que seleccione algún conjunto de datos para poder continuar.
                            </span>
                          </v-flex>
                          <v-flex xs2 pt-3>
                            <v-checkbox label="Obligatorio" v-model="aux.requerido" hide-details></v-checkbox>
                          </v-flex>
                          <v-flex xs4 pr-3>
                            <v-text-field label="Nombre de variable del atributo" v-model="aux.nombreRespuesta" :rules="nombreAtributoReglas" required hide-details></v-text-field>
                          </v-flex>
                          <v-flex xs4>
                            <v-select :items="tiposAtributo" v-model="aux.tipo" label="Tipo de dato del atributo" item-text="texto" item-value="tipo" hide-details></v-select>
                          </v-flex>
                        </v-layout>
                        <v-layout row wrap>
                          <v-flex xs6 pr-3>
                            <v-text-field label="Descripción del atributo" v-model="aux.descripcionAtributo" required hide-details></v-text-field>
                          </v-flex>
                          <v-flex xs4>
                            <v-text-field label="Valor del atributo" v-model="aux.valorRespuesta" hide-details></v-text-field>
                          </v-flex>
                          <v-flex xs2>
                            <div class="text-xs-right">
                              <v-btn icon large color="primary" @click.native="agregarAux()">
                                <v-icon>add</v-icon>
                              </v-btn>
                            </div>
                          </v-flex>
                          <v-flex xs2 pt-3 v-if="aux.tipo && !aux.tipo.includes('array') && !aux.tipo.includes('base64') && aux.tipo !== 'url'">
                            <v-checkbox label="Editable" v-model="aux.editable" @change="cambioEditable(aux)" hide-details></v-checkbox>
                          </v-flex>
                          <v-flex xs4 pr-3 v-if="aux.tipo && !aux.tipo.includes('array') && !aux.tipo.includes('base64') && aux.tipo !== 'url'">
                            <v-select :items="listPlugins" v-model="aux.component" label="Seleccione el componente" item-text="nombre" :disabled="!aux.editable" hide-details  @change="cambioComponente()"></v-select>
                          </v-flex>
                          <v-flex xs4>
                          </v-flex>
                          <v-flex xs10 v-if="aux.component">
                            <formly-form :id="`item-${idxComp}`" :form="formLista" :model="modelLista" :fields="[aux.component]"></formly-form>
                          </v-flex>
                        </v-layout>
                      </v-form>
                    </v-card-text>
                  </v-card>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-data-table :headers="headers" :items="respuesta" hide-actions class="elevation-1">
                        <template slot="items" slot-scope="props">
                          <td>{{ props.item.requerido ? 'SI' : 'NO' }}</td>
                          <td>{{ props.item.nombreAtributo }}</td>
                          <td>{{ props.item.tipo }}</td>
                          <td>{{ props.item.descripcionAtributo }}</td>
                          <td>{{ props.item.valorRespuesta }}</td>
                          <td>
                            <span>{{ props.item.editable ? 'SI' : 'NO' }}</span>
                            <span v-if="props.item.editable && props.item.component && props.item.component"><br>{{props.item.component.type}}</span>
                          </td>
                          <td class="layout px-0 right">
                            <v-btn icon class="mx-0" @click="editarAux(props.item)" right>
                              <v-icon color="primary">edit</v-icon>
                            </v-btn>
                            <v-btn icon class="mx-0" @click="eliminarAux(props.item)" right>
                              <v-icon color="red">delete</v-icon>
                            </v-btn>
                          </td>
                        </template>
                        <template slot="no-data">
                          <span>Sin registros.</span>
                        </template>
                      </v-data-table>
                    </v-flex>
                    <v-flex xs12>
                      <v-flex xs12 pt-3>
                        <v-checkbox label="Validar cabeceras" v-model="mostrarCabeceraRespuesta" hide-details></v-checkbox>
                      </v-flex>
                      <v-flex v-if="mostrarCabeceraRespuesta">
                        <v-layout row wrap>
                          <v-flex xs5 pr-3>
                            <v-text-field label="Nombre del atributo" v-model="cabecera.nombreAtributo" :rules="nombreAtributoReglas" required hide-details disabled></v-text-field>
                          </v-flex>
                          <v-flex xs5 pr-3>
                            <v-text-field label="Valor del atributo" v-model="cabecera.valorRespuesta" required hide-details mask="###"></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-stepper-content>
              <v-stepper-content step="4" v-if="conf.tipo == 'S'">
                <v-card-text>
                  <v-form @submit.prevent="deactivate">
                    <v-layout row wrap class="text-xs-left">
                      <v-flex xs3 pt-2>
                        <v-icon v-if="!pruebaEstado" color="red">help</v-icon>
                        <v-icon v-if="pruebaEstado" color="info">done</v-icon>
                        <label class="subheading"><strong>Estado del Servicio:</strong></label>
                      </v-flex>
                      <v-flex xs6 pt-2>
                        <label class="primary--text"><strong>{{conf.url}}{{conf.urlStatus}}</strong></label>
                      </v-flex>
                      <v-flex xs3>
                        <div class="text-xs-right">
                          <v-btn color="info" @click.native="probarEstado()"><v-icon dark>keyboard_arrow_right</v-icon> Probar</v-btn>
                        </div>
                      </v-flex>
                      <v-flex xs12>
                        <div class="ma-3" v-if="pruebaEstado">
                          <small>
                            <strong>Respuesta estado: </strong><br>
                            <pre>{{pruebaEstado}}</pre>
                          </small>
                        </div>
                      </v-flex>
                      <v-flex xs3 pt-2>
                        <v-icon v-if="!pruebaConsumo" color="red">help</v-icon>
                        <v-icon v-if="pruebaConsumo" color="info">done</v-icon>
                        <label class="subheading"><strong>Consumo del Servicio:</strong></label>
                      </v-flex>
                      <v-flex xs6 pt-2>
                        <label class="primary--text"><strong>{{conf.url}}{{conf.urlRequest}}</strong></label>
                      </v-flex>
                      <v-flex xs3>
                        <div class="text-xs-right">
                          <v-btn color="info" @click.native="probarConsumo()"><v-icon dark>keyboard_arrow_right</v-icon> Ejemplo</v-btn>
                        </div>
                      </v-flex>
                      <v-flex xs12 class="ml-3" v-if="pruebaConsumo">
                        <v-icon class="primary--text">info</v-icon>
                        <span class="primary--text body-1">La siguiente respuesta solo muestra un EJEMPLO de la estructura de los datos para la petición.</span>
                      </v-flex>
                      <v-flex xs12>
                        <div class="ma-3" v-if="pruebaConsumo">
                          <p><small><strong>Url: </strong>{{pruebaConsumo.url}}</small></p>
                          <p><small><strong>Método: </strong>{{pruebaConsumo.method}}</small></p>
                          <p>
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
                          </p>
                          <p>
                            <small>
                              <strong>Cuerpo retorno: </strong><br>
                              <pre>{{pruebaConsumo.return}}</pre>
                            </small>
                          </p>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-stepper-content>
              <v-stepper-content step="4" v-if="conf.tipo == 'A'">
                <v-card-text>
                  <v-form @submit.prevent="deactivate">
                    <v-layout row wrap>
                      <v-flex xs2 pt-3>
                        <v-checkbox label="Obligatorio" v-model="aux.requerido" hide-details></v-checkbox>
                      </v-flex>
                      <v-flex xs4 pr-3>
                        <v-text-field label="Nombre de variable del atributo" v-model="aux.nombreRespuesta" :rules="nombreAtributoReglas" required hide-details></v-text-field>
                      </v-flex>
                      <v-flex xs4>
                        <v-select :items="tiposAtributo" v-model="aux.tipo" label="Tipo del atributo" item-text="texto" item-value="tipo" hide-details></v-select>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex xs6 pr-3>
                        <v-text-field label="Descripción del atributo" v-model="aux.descripcionAtributo" required hide-details></v-text-field>
                      </v-flex>
                      <v-flex xs4>
                        <v-text-field label="Valor del atributo" v-model="aux.valorRespuesta" required hide-details></v-text-field>
                      </v-flex>
                      <v-flex xs2>
                        <div class="text-xs-right">
                           <v-btn icon large color="primary"  @click.native="agregarAux()">
                            <v-icon>add</v-icon>
                          </v-btn>
                        </div>
                      </v-flex>
                       <v-flex xs2 pt-3 v-if="aux.tipo && !aux.tipo.includes('array') && !aux.tipo.includes('base64') && aux.tipo !== 'url'">
                        <v-checkbox label="Editable" v-model="aux.editable" @change="cambioEditable(aux)" hide-details></v-checkbox>
                      </v-flex>
                      <v-flex xs4 pr-3 v-if="aux.tipo && !aux.tipo.includes('array') && !aux.tipo.includes('base64') && aux.tipo !== 'url'">
                        <v-select :items="listPlugins" v-model="aux.component" label="Seleccione el componente" item-text="nombre" :disabled="!aux.editable" hide-details  @change="cambioComponente()"></v-select>
                      </v-flex>
                      <v-flex xs4>
                      </v-flex>
                      <v-flex xs10 v-if="aux.component">
                        <formly-form :id="`item-${idxComp}`" :form="formLista" :model="modelLista" :fields="[aux.component]"></formly-form>
                      </v-flex>
                    </v-layout>
                  </v-form>
                  <v-layout row wrap>
                    <v-flex>
                      <v-data-table :headers="headers" :items="esquemaRetorno" hide-actions class="elevation-1">
                        <template slot="items" slot-scope="props">
                          <td>{{ props.item.requerido ? 'SI' : 'NO' }}</td>
                          <td>{{ props.item.nombreAtributo }}</td>
                          <td>{{ props.item.tipo }}</td>
                          <td>{{ props.item.descripcionAtributo }}</td>
                          <td>{{ props.item.valorRespuesta }}</td>
                          <td>
                            <span>{{ props.item.editable ? 'SI' : 'NO' }}</span>
                            <span v-if="props.item.editable && props.item.component && props.item.component"><br>{{props.item.component.type}}</span>
                          </td>
                          <td class="layout px-0 right">
                            <v-btn icon class="mx-0" @click="editarAux(props.item)" right>
                              <v-icon color="primary">edit</v-icon>
                            </v-btn>
                            <v-btn icon class="mx-0" @click="eliminarAux(props.item)" right>
                              <v-icon color="red">delete</v-icon>
                            </v-btn>
                          </td>
                        </template>
                        <template slot="no-data">
                          <span>Sin registros.</span>
                        </template>
                      </v-data-table>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-stepper-content>
              <v-stepper-content step="5" v-if="conf.tipo == 'A'">
                <v-card-text>
                  <v-form @submit.prevent="deactivate">
                    <v-layout row wrap>
                      <v-flex xs12 class="title primary--text">URL de Retorno:</v-flex>
                      <v-flex xs12>
                        <pre>
[URL DEL BACKEND]/client/api/v1/interoperabilidad/recepcion
                        </pre>
                      </v-flex>
                      <v-flex xs12 class="title primary--text">Método de Retorno:</v-flex>
                      <v-flex xs12>
                        <pre>
PUT
                        </pre>
                      </v-flex>
                      <v-flex xs12 class="title primary--text">Formato de Respuesta en caso de éxito:</v-flex>
                      <v-flex xs12>
                        <pre>
{
  "finalizado": true,
  "mensaje": "Registros obtenidos correctamente",
  "datos": {
      "_id": "5b1fe0c91b1a656132bde713",
  }
}
                        </pre>
                      </v-flex>
                      <v-flex xs12 class="title error--text">Formato de Respuesta en caso de error:</v-flex>
                      <v-flex xs12>
                        <pre>
{
  "finalizado": false,
  "mensaje": "Descripción del error"
}
                        </pre>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-stepper-content>
              <v-stepper-content step="6" v-if="conf.tipo == 'A'">
                <v-card-text>
                  <v-form @submit.prevent="deactivate">
                    <v-layout row wrap class="text-xs-left">
                      <v-flex xs12 class="title mb-4 primary--text text-xs-center">ENVÍO:</v-flex>
                      <v-flex xs3 pt-2>
                        <v-icon v-if="!pruebaEstado" color="red">help</v-icon>
                        <v-icon v-if="pruebaEstado" color="info">done</v-icon>
                        <label class="subheading"><strong>Estado del Servicio:</strong></label>
                      </v-flex>
                      <v-flex xs6 pt-2>
                        <label class="primary--text"><strong>{{conf.url}}{{conf.urlStatus}}</strong></label>
                      </v-flex>
                      <v-flex xs3>
                        <div class="text-xs-right">
                          <v-btn color="info" @click.native="probarEstado()"><v-icon dark>keyboard_arrow_right</v-icon> Probar</v-btn>
                        </div>
                      </v-flex>
                      <v-flex xs12>
                        <div class="ma-3" v-if="pruebaEstado">
                          <small>
                            <strong>Respuesta estado: </strong><br>
                            <pre>{{pruebaEstado}}</pre>
                          </small>
                        </div>
                      </v-flex>
                      <v-flex xs3 pt-2>
                        <v-icon v-if="!pruebaConsumo" color="red">help</v-icon>
                        <v-icon v-if="pruebaConsumo" color="info">done</v-icon>
                        <label class="subheading"><strong>Consumo del Servicio:</strong></label>
                      </v-flex>
                      <v-flex xs6 pt-2>
                        <label class="primary--text"><strong>{{conf.url}}{{conf.urlRequest}}</strong></label>
                      </v-flex>
                      <v-flex xs3>
                        <div class="text-xs-right">
                          <v-btn color="info" @click.native="probarConsumo()"><v-icon dark>keyboard_arrow_right</v-icon> Ejemplo</v-btn>
                        </div>
                      </v-flex>
                      <v-flex xs12 class="ml-3" v-if="pruebaConsumo">
                        <v-icon class="primary--text">info</v-icon>
                        <span class="primary--text body-1">La siguiente respuesta solo muestra un EJEMPLO de la estructura de los datos para la petición.</span>
                      </v-flex>
                      <v-flex xs12>
                        <div class="ma-3" v-if="pruebaConsumo">
                          <p><small><strong>Url: </strong>{{pruebaConsumo.url}}</small></p>
                          <p><small><strong>Método: </strong>{{pruebaConsumo.method}}</small></p>
                          <p>
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
                          </p>
                          <p>
                            <small>
                              <strong>Cuerpo retorno: </strong><br>
                              <pre>{{pruebaConsumo.return}}</pre>
                            </small>
                          </p>
                        </div>
                      </v-flex>
                      <v-flex xs12 class="my-3 title primary--text text-xs-center">RETORNO:</v-flex>
                      <v-flex xs3 pt-2>
                        <v-icon v-if="!pruebaConsumoRetorno" color="red">help</v-icon>
                        <v-icon v-if="pruebaConsumoRetorno" color="info">done</v-icon>
                        <label class="subheading"><strong>Retorno del Servicio:</strong></label>
                      </v-flex>
                      <v-flex xs9>
                        <div class="text-xs-right">
                          <v-btn color="info" @click.native="probarConsumoRetorno()"><v-icon dark>keyboard_arrow_right</v-icon> Ejemplo</v-btn>
                        </div>
                      </v-flex>
                      <v-flex xs12 class="ml-3" v-if="pruebaConsumoRetorno">
                        <v-icon class="primary--text">info</v-icon>
                        <span class="primary--text body-1">La siguiente respuesta solo muestra un EJEMPLO de la estructura de los datos de retorno.</span>
                      </v-flex>
                      <v-flex xs12>
                        <div class="ma-3" v-if="pruebaConsumoRetorno">
                          <p>
                            <small>
                              <strong>Cuerpo retorno: </strong><br>
                              <pre>{{pruebaConsumoRetorno}}</pre>
                            </small>
                          </p>
                        </div>
                      </v-flex>
                    </v-layout>
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
          <v-btn v-if="(e1 != 4 && conf.tipo == 'S') || (e1 != 6 && conf.tipo == 'A')" color="primary" @click.native="avanzarPaso()"><v-icon dark>check</v-icon> Continuar</v-btn>
          <v-btn v-if="(e1 == 4 && conf.tipo == 'S') || (e1 == 6 && conf.tipo == 'A')" color="primary" @click.native="guardarConfiguracion()"><v-icon dark>check</v-icon> Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </section>
</template>
<script>
  /* eslint no-useless-escape: 0 */
  /* eslint no-unneeded-ternary:0 */
  import baseField from '../baseField';
  import draggable from 'vuedraggable';

  export default {
    components: { draggable },
    mixins: [baseField],
    methods: {
      abrirConfiguracion () {
        this.data = this.$store.state.cellData;
        this.mostrarConfiguracion = true;
        this.mostrarCabeceraRespuesta = false;
        this.procesarDocumentos();
        console.log('this.data.value: ', this.data.value);
        if (this.data && this.data.value && this.data.value.docId) {
          console.log('\n\nconsultando documento interopreabilidad');
          this.$service.get(`plantilla_interoperabilidad/`, this.data.value.docId)
          .then(response => {
            if (response) {
              this.procesarDatos(response);
            }
          });
        } else if (this.esComponenteFormulario && this.options && this.options.titulo) {
          console.log('\n\n>>>>>>>>>>>>>>< si envio options', this.options);
          this.data.documents = [];
          this.procesarDatos(this.options);
        }
      },
      procesarDatos (response) {
        this.descripcion = response.titulo;
        this.conf = response.body;
        console.log(response);
        // this.$message.success(response.mensaje);
        if (response.body && response.body.envio) {
          // Only esquema options with valid doc ids will be shown
          let newEsquema = response.body.envio.esquema.reduce((a, b) => {
            let isInDocArray = false;
            this.data.documents.forEach(element => {
              if (b.idDocumento === element.id) {
                isInDocArray = true;
              } else if (!b.idDocumento && b.atributoDocumento) {
                isInDocArray = true;
              }
            });
            if (isInDocArray || this.esComponenteFormulario) {
              a.push(b);
            }
            return a;
          }, []);
          this.esquema = newEsquema; // response.body.envio.esquema;
          this.respuesta = response.body.envio.respuesta;
          const cabeceras = response.body.envio.respuesta.filter(item => item.nombreAtributo === '___cabecera');
          if (cabeceras && cabeceras.length > 0) {
            this.mostrarCabeceraRespuesta = true;
            this.cabecera = cabeceras[0].value[0];
            const idx = this.respuesta.indexOf(cabeceras[0]);
            this.respuesta.splice(idx, 1);
          }
        }
        if (response.body && response.body.retorno) {
          this.esquemaRetorno = response.body.retorno.esquema;
          this.respuestaRetorno = response.body.retorno.respuesta;
        }
      },
      procesarDocumentos () {
        console.log('this.data.documentos');
        console.log(this.data.documents);
        this.documentos = [];
        // this.documentos = this.documentosEjemplos;
        if (this.esComponenteFormulario && this.fieldsDoc && this.fieldsDoc.length) {
          this.data = {
            value: { }
          };
          this.data.documents = [{
            id: this.$route.query.id,
            name: 'Documento Actual',
            componentes: JSON.parse(JSON.stringify(this.fieldsDoc))
          }];
          console.log('this.fieldsDoc:::::::::: ', this.fieldsDoc);
        }
        console.log('this.data.documents:::::::::: ', this.data.documents);
        if (this.data.documents) {
          if (this.data.documents.length > 0 && this.data.documents[0].componentes) {
            this.data.documents.forEach(doc => {
              if (doc.componentes && doc.componentes.envio) {
                doc.componentes.envio.forEach(comp => { comp.esq = 'ENVIO'; });
                doc.componentes = doc.componentes.envio.filter(ix => ix.nombreAtributo !== '___cabecera');
                // doc.componentes = doc.componentes.map(ix => { ix.name = ix.nombreAtributo; return ix; });
              }
              if (doc.componentes && doc.componentes.retorno) {
                doc.componentes.retorno.forEach(comp => { comp.esq = 'RETORNO'; });
                doc.componentes = doc.componentes.retorno;
              }
              if (doc.componentes) {
                doc.componentes.forEach(comp => {
                  comp.idDocumento = doc.id;
                  comp.nombreDocumento = doc.name;
                });
              }
              console.log('por agregar-----', this.data);
              if (this.data && this.data.value && this.data.value.docId !== doc.id) {
                console.log('por agregar-----', 'agregarComponente');
                this.documentos.push(JSON.parse(JSON.stringify(doc)));
              }
            });
          } else if (!this.esComponenteFormulario) {
            setTimeout(() => {
              this.procesarDocumentos();
            }, 100);
          }
          console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx => this.documents');
          console.log(this.documentos);
        } else {
          this.$message.error('No se encontraron documentos.');
        }
      },
      cerrarConfiguracion () {
        this.mostrarConfiguracion = false;
        this.e1 = 1;
        if (!this.esComponenteFormulario) {
          this.$refs.form1.reset();
          this.conf = {
            tipo: 'S'
          };
          this.esquema = [];
          this.respuesta = [];
          this.aux = {};
          this.indiceAuxSeleccionado = null;
          this.esquemaRetorno = [];
          this.respuestaRetorno = [];
          this.pruebaEstado = null;
          this.pruebaConsumo = null;
          this.pruebaConsumoRetorno = null;
        }
      },
      agregarComponente (dom) {
        const agregarObj = JSON.parse(dom);
        delete agregarObj.tipo;
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> agregarObj');
        console.log(agregarObj);
        // agregarObj.idComponente = agregarObj.templateOptions ? agregarObj.templateOptions.id : null;
        if (agregarObj && agregarObj.templateOptions && agregarObj.templateOptions.visibles && agregarObj.templateOptions.visibles.length) {
          agregarObj.value = [];
          agregarObj.tipo = 'object';
          for (const k of agregarObj.templateOptions.visibles) {
            agregarObj.value.push({
              name: k,
              nombreAtributo: null
            });
          }
          if (agregarObj && agregarObj.templateOptions && agregarObj.templateOptions.multiple === true) {
            agregarObj.multiple = true;
          }
        } else if (agregarObj && agregarObj.templateOptions && agregarObj.templateOptions.init && agregarObj.templateOptions.init.length) {
          agregarObj.value = [];
          agregarObj.tipo = 'object';
          for (const k of agregarObj.templateOptions.init) {
            agregarObj.value.push({
              name: k,
              nombreAtributo: null
            });
          }
        } else if (agregarObj && agregarObj.templateOptions && typeof agregarObj.templateOptions.columns === 'object' && agregarObj.templateOptions.columns) {
          agregarObj.value = [];
          agregarObj.tipo = 'table';
          for (const k in agregarObj.templateOptions.columns) {
            const columna = agregarObj.templateOptions.columns[k];
            if (columna.type !== 'total') {
              agregarObj.value.push({
                name: columna.name,
                nombreAtributo: null,
                descripcionAtributo: columna.templateOptions ? columna.templateOptions.label : columna.label
                // idComponente: columna.templateOptions ? columna.templateOptions.id : null
              });
            }
          }
        } else {
          agregarObj.descripcionAtributo = agregarObj.templateOptions ? agregarObj.templateOptions.label : agregarObj.descripcionAtributo ? agregarObj.descripcionAtributo : 'SIN DESCRIPCIÓN';
          agregarObj.descripcionAtributo = agregarObj.nombreDocumento + ' - ' + agregarObj.descripcionAtributo;
        }
        this.esquema.push(agregarObj);
        console.log('----------------esquema--------------------');
        console.log(this.esquema);
        console.log('------------------------------------');
      },
      eliminarComponente (idx) {
        this.esquema.splice(idx, 1);
      },
      validarEsquema () {
        this.$service.post(`plantilla_interoperabilidad/validar`, {
          esquema: this.esquema
        }).then(response => {
          if (response) {
            console.log('--------Validacion esquema----------');
            console.log(response);
            console.log('------------------------------------');
            if (response.finalizado) {
              this.e1++;
              this.aux = { };
              this.indiceAuxSeleccionado = null;
            }
          }
        }).catch(error => {
          this.$message.error(error.message || 'No se pudo validar la configuración.');
        });
      },
      agregarAux () {
        if (this.aux.editable && !this.aux.component) {
          this.$message.error('Si agrega un atributo Editable debe configurar el componente.');
          return;
        }
        this.listPlugins = JSON.parse(JSON.stringify(this.listPluginsBK));
        const objAux = {
          valorRespuesta: this.aux.valorRespuesta,
          name: this.aux.nombreRespuesta,
          nombreAtributo: this.aux.nombreRespuesta,
          descripcionAtributo: this.aux.descripcionAtributo,
          tipo: this.aux.tipo,
          requerido: this.aux.requerido,
          editable: this.aux.editable,
          component: this.aux.component
        };
        if (objAux.component && objAux.component.templateOptions) {
          delete objAux.component.templateOptions.settings;
        }
        if (parseInt(this.e1) === 3) {
          if (this.indiceAuxSeleccionado !== null) Object.assign(this.respuesta[this.indiceAuxSeleccionado], objAux);
          else this.respuesta.push(objAux);
          this.indiceAuxSeleccionado = null;
        };
        if (parseInt(this.e1) === 4) {
          if (this.indiceAuxSeleccionado !== null) Object.assign(this.esquemaRetorno[this.indiceAuxSeleccionado], objAux);
          else this.esquemaRetorno.push(objAux);
          this.indiceAuxSeleccionado = null;
        }
        if (parseInt(this.e1) === 5) this.respuestaRetorno.push(objAux);
        this.indiceAuxSeleccionado = null;
        this.aux = { };
      },
      editarAux (item) {
        if (parseInt(this.e1) === 3 || (parseInt(this.e1) === 4 && this.conf.tipo === 'A')) {
          if (parseInt(this.e1) === 3) {
            this.indiceAuxSeleccionado = this.respuesta.indexOf(item);
          } else {
            this.indiceAuxSeleccionado = this.esquemaRetorno.indexOf(item);
          }
          this.aux = {
            valorRespuesta: item.valorRespuesta,
            nombreRespuesta: item.name,
            descripcionAtributo: item.descripcionAtributo,
            tipo: item.tipo,
            requerido: item.requerido,
            editable: item.editable,
            component: item.component
          };
          this.idxComp = new Date();
        }
      },
      eliminarAux (item) {
        if (parseInt(this.e1) === 3) {
          const idx = this.respuesta.indexOf(item);
          this.respuesta.splice(idx, 1);
        }
        if (parseInt(this.e1) === 4) {
          const idx = this.esquemaRetorno.indexOf(item);
          this.esquemaRetorno.splice(idx, 1);
        }
        if (parseInt(this.e1) === 5) {
          const idx = this.respuestaRetorno.indexOf(item);
          this.respuestaRetorno.splice(idx, 1);
        }
      },
      agregarAtributoAux () {
        if (this.$refs.formAtributoAux.validate()) {
          if (parseInt(this.e1) === 2) {
            const objAux = {
              idDocumento: this.atributoAux.documento ? this.atributoAux.documento.id : null,
              name: this.atributoAux.name,
              nombreAtributo: this.atributoAux.nombreAtributo,
              descripcionAtributo: this.atributoAux.documento ? `${this.atributoAux.documento.name} - ${this.atributoAux.descripcionAtributo}` : this.atributoAux.descripcionAtributo,
              tipoParametro: this.atributoAux.tipoParametro,
              atributoDocumento: true
            };
            console.log('\n\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<< objAux');
            console.log(objAux);
            this.esquema.push(objAux);
            this.atributoAux = {};
          }
        } else {
          this.$message.error('Debe completar los datos obligatorios.');
        }
      },
      irPaso (e) {
        this.e1 = parseInt(e);
        this.aux = { };
        this.indiceAuxSeleccionado = null;
      },
      retrocederPaso () {
        if (this.e1 > 1) {
          this.e1--;
          this.aux = { };
          this.indiceAuxSeleccionado = null;
        }
      },
      avanzarPaso () {
        if (parseInt(this.e1) === 1) {
          if (this.$refs.form1.validate()) {
            this.paramsLista = [];
            const partidos = (this.conf.url + this.conf.urlRequest).split('/');
            partidos.forEach(i => {
              if (i.indexOf('_') === 0) {
                this.paramsLista.push(i);
              }
            });
            if ((this.e1 < 4 && this.conf.tipo === 'S') || (this.e1 < 6 && this.conf.tipo === 'A')) {
              this.e1++;
              this.aux = { };
              this.indiceAuxSeleccionado = null;
            }
          }
        } else if (parseInt(this.e1) === 2) {
          if (this.esquema.length === 0) {
            this.$message.error('Debe configurar el esquema de envío.');
          } else {
            this.validarEsquema();
          }
        } else if (parseInt(this.e1) === 3 && this.respuesta.length === 0) {
          this.$message.error('Debe configurar la respuesta del envío.');
        } else if (parseInt(this.e1) === 3 && this.respuesta.length && this.respuesta.filter(item => item.tipo === 'array_seleccionable').length > 1) {
          this.$message.error('Solo puede elegir un conjunto de datos como Lista Seleccionable.');
        } else if (parseInt(this.e1) === 4 && this.esquemaRetorno.length === 0) {
          this.$message.error('Debe configurar el esquema de respuesta (retorno).');
        // } else if (parseInt(this.e1) === 5 && this.respuestaRetorno.length === 0) {
          // this.$message.error('Debe configurar la respuesta de envío (retorno).');
        } else {
          if ((this.e1 < 4 && this.conf.tipo === 'S') || (this.e1 < 6 && this.conf.tipo === 'A')) {
            this.e1++;
            this.aux = { };
            this.indiceAuxSeleccionado = null;
          }
        }
      },
      guardarConfiguracion () {
        console.log('this.conf', this.conf);
        const enviar = {
          version: 0,
          tipo: 'I',
          deleted: false,
          institucion: this.institucion,
          titulo: this.descripcion,
          body: this.conf
        };
        enviar.body.envio = {
          esquema: this.esquema,
          respuesta: this.respuesta
        };
        if (this.mostrarCabeceraRespuesta) {
          enviar.body.envio.respuesta.push({
            nombreAtributo: '___cabecera',
            value: [this.cabecera]
          });
        }
        if (this.conf.tipo === 'A') {
          enviar.body.retorno = {
            esquema: this.esquemaRetorno
            // respuesta: this.respuestaRetorno
          };
        }
        console.log(enviar);
        if (this.data.value && this.data.value.docId) {
          enviar.id = this.data.value.docId;
        }
        if (!this.esComponenteFormulario) {
          this.$service.save(`plantilla_interoperabilidad`, enviar)
          .then(response => {
            if (response) {
              this.$message.success(response.mensaje);
              const tipoCell = this.data.value.tipo;
              this.data.value = {
                tipo: tipoCell,
                name: response.titulo,
                docId: response._id,
                tipoInteroperabilidad: this.conf.tipo
              };
              // this.$parent.$options.methods.updateGraphCell(this.data);
              this.$emit('saveCellData', this.data);
              this.cerrarConfiguracion();
            } else {
              if (enviar.body.envio.respuesta) {
                const cabeceras = enviar.body.envio.respuesta.filter(item => item.nombreAtributo === '___cabecera');
                if (cabeceras && cabeceras.length > 0) {
                  const idx = this.respuesta.indexOf(cabeceras[0]);
                  this.respuesta.splice(idx, 1);
                }
              }
            }
          }).catch(error => {
            this.$message.error(error.message || 'No se pudo guardar la configuración.');
          });
        } else {
          this.$emit('actualizarOptions', JSON.parse(JSON.stringify(enviar)));
          this.cerrarConfiguracion();
        }
      },
      probarEstado () {
        const enviar = {
          version: 0,
          tipo: 'I',
          deleted: false,
          institucion: this.institucion,
          titulo: this.descripcion,
          body: this.conf
        };
        this.pruebaEstado = null;
        let valorId = 0;
        if (this.data && this.data.value && this.data.value.docId) valorId = this.data.value.docId;
        this.$service.post(`plantilla_interoperabilidad/${valorId}/pruebaEstado`, enviar)
        .then(respuesta => {
          this.$message.success('Se hizo la petición.');
          this.pruebaEstado = respuesta;
        });
      },
      probarConsumo () {
        const enviar = {
          version: 0,
          tipo: 'I',
          deleted: false,
          institucion: this.institucion,
          titulo: this.descripcion,
          body: this.conf
        };
        enviar.body.envio = {
          esquema: this.esquema,
          respuesta: this.respuesta
        };
        if (this.conf.tipo === 'A') {
          enviar.body.retorno = {
            esquema: this.esquemaRetorno
          };
        }
        this.pruebaConsumo = null;
        let valorId = 0;
        if (this.data && this.data.value && this.data.value.docId) valorId = this.data.value.docId;
        this.$service.post(`plantilla_interoperabilidad/${valorId}/pruebaConsumo`, enviar)
        .then(respuesta => {
          this.$message.success('Se recuperó la estructura.');
          this.pruebaConsumo = respuesta;
        });
      },
      probarConsumoRetorno () {
        const enviar = {
          version: 0,
          tipo: 'I',
          deleted: false,
          institucion: this.institucion,
          titulo: this.descripcion,
          body: this.conf,
          retorno: true
        };
        this.pruebaConsumoRetorno = null;
        this.$service.post(`plantilla_interoperabilidad/${this.data.value.docId}/pruebaConsumo`, enviar)
        .then(respuesta => {
          this.$message.success('Se recuperó la estructura.');
          this.pruebaConsumoRetorno = respuesta;
        });
      },
      cambioEditable (aux) {
        if (!aux.editable) {
          aux.component = null;
        }
      },
      cambioComponente () {
        this.$nextTick(() => {
          this.idxComp = new Date();
          if (this.aux.descripcionAtributo) {
            this.aux.component.templateOptions.label = this.aux.descripcionAtributo;
          }
        });
      }
    },
    props: {
      institucion: {
        required: true
      },
      id: {
        required: false
      },
      esComponenteFormulario: false,
      options: null,
      fieldsDoc: null
    },
    mounted () {
      // const excluir = ['comodin', 'grid', 'persona', 'subir archivo', 'ubicacion', 'texto', 'cite'];
      const incluir = ['casilla de verificacion', 'autocompletado', 'fecha', 'entrada', 'lista desplegable', 'parrafo', 'seleccion radio'];
      this.modelLista = {};
      this.$service.get('plugins/cliente')
      .then((res) => {
        if (res) {
          this.listPlugins = res.listado.reduce((a, b) => {
            if (incluir.indexOf(b.nombre) !== -1) {
              b.component.nombre = b.nombre;
              b.component.templateOptions.settings = true;
              a.push(b.component);
              this.modelLista[b.nombre] = '';
            }
            return a;
          }, []);
          this.listPluginsBK = JSON.parse(JSON.stringify(this.listPlugins));
        }
      });
    },
    data () {
      return {
        data: {
          required: true,
          type: Object,
          default: () => {}
        },
        documentos: [],
        esquema: [],
        formLista: {},
        idxComp: new Date(),
        indiceAuxSeleccionado: null,
        listPlugins: [],
        listPluginsBK: [],
        modelLista: {},
        paramsLista: [],
        aux: { },
        atributoAux: {},
        cabecera: {
          nombreAtributo: 'codigo',
          name: 200
        },
        respuesta: [],
        esquemaRetorno: [],
        respuestaRetorno: [],
        mostrarConfiguracion: false,
        mostrarCabeceraRespuesta: false,
        e1: 0,
        pruebaEstado: null,
        pruebaConsumo: null,
        pruebaConsumoRetorno: null,
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
        ],
        tokenReglas: [
          v => !!v || 'El token es un dato obligatorio.'
        ],
        estadoReglas: [
          v => !!v || 'La URL de estado del servicio es un dato obligatorio.'
        ],
        consumoReglas: [
          v => !!v || 'La URL de consumo del servicio es un dato obligatorio.'
        ],
        metodoReglas: [
          v => !!v || 'El método de consumo del servicio es un dato obligatorio.'
        ],
        tipoReglas: [
          v => !!v || 'El tipo de respuesta del servicio es un dato obligatorio.'
        ],
        validezReglas: [
          v => !!v || 'La validez del token de retorno es un dato obligatorio.'
        ],
        descripcion: 'Plantilla de interoperabilidad',
        conf: {
          tipo: 'S'
        },
        opcionesTipo: {
          'S': 'Inmediato',
          'A': 'Con tiempo de respuesta'
        },
        tiposAtributo: [{
          tipo: 'array_seleccionable',
          texto: 'Lista Seleccionable'
        }, {
          tipo: 'array',
          texto: 'Lista'
        }, {
          tipo: 'string',
          texto: 'Cadena de texto'
        }, {
          tipo: 'number',
          texto: 'Valor Numérico'
        }, {
          tipo: 'decimal',
          texto: 'Valor Decimal'
        }, {
          tipo: 'date',
          texto: 'Fecha'
        }, {
          tipo: 'base64/pdf',
          texto: 'PDF (base64)'
        }, {
          tipo: 'base64/image',
          texto: 'Imagen (base64)'
        }, {
          tipo: 'url',
          texto: 'URL'
        }, {
          tipo: 'json',
          texto: 'Texto JSON'
        }, {
          tipo: 'otro',
          texto: 'Otros'
        }],
        tiposParametro: ['body', 'param', 'query'],
        opcionesMetodos: ['GET', 'POST', 'PUT'],
        headers: [{text: 'Obligatorio', sortable: false, align: 'center'}, {text: 'Variable', sortable: false, align: 'center'}, {text: 'Tipo', sortable: false, align: 'center'}, {text: 'Descripción', sortable: false, align: 'center'}, {text: 'Valor', sortable: false, align: 'center'}, {text: 'Editable', sortable: false, align: 'center'}, {text: 'Acciones', sortable: false, align: 'right'}],
        mensajes: [
          'Llene los datos necesarios para la configuración de interoperabilidad.',
          'A continuación se listan los datos de sus documentos. Seleccione aquellos atributos que desea enviar.',
          'Seleccione el formato de la respuesta.',
          'Seleccione el formato de la respuesta (retorno).',
          'Seleccione el formato del envío (retorno).',
          'Se recomienda que pruebe los servicios para validar la interoperabilidad.'
        ]
      };
    },
    watch: {
      'conf.metodo' () {
        if (this.conf.metodo === 'GET') {
          this.tiposParametro = ['param', 'query'];
        } else {
          this.tiposParametro = ['body', 'param'];
        }
      }
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

  .interoperabilidadDraggable.fondo {
    background: #ECEFF1;
  }

  .int-form-comp {
    border-bottom: 1px solid rgb(204, 204, 204);
  }

  .interoperabilidadDraggableAtributo {
    padding: 0px 30px;
  }

</style>
<style src='../../../../components/admin/formularios/formularios.scss' lang='scss'></style>
