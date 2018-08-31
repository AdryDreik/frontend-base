<template>
  <v-card flat>
    <v-card-text class="grid-container">
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-subheader class="title primary--text">{{label}}</v-subheader>
          </v-flex>
          <v-flex xs12 md12 lg12 sm12 text-xs-right>
            <v-tooltip bottom>
              <v-btn fab slot="activator" small class="botonAnadir" @click.native="adicionarFila" v-if="!settings && !disabled" color="success" tabindex="20">
                <v-icon v-if="filaSeleccionada === false" large class="mt-1">add</v-icon>
                <v-icon v-else medium class="mt-2">edit</v-icon>
              </v-btn>
              <span>{{filaSeleccionada === false ? 'Agregar registro' : 'Editar registro'}}</span>
            </v-tooltip>
          </v-flex>
          <v-flex xs12 md12>
            <div v-if="to && to.columns && to.columns.length == 0">
              <div class="text-md-center">Grilla vacía, para adicionar columnas por favor haga clic en el botón de configuración.</div>
            </div>
            <div v-else>
              <v-form ref="formTabla" v-if="layout && layout.length">
                <grid-layout
                  v-if="!disabled"
                  :layout="layout"
                  :col-num="12"
                  :row-height="50"
                  :is-draggable="settings"
                  :is-resizable="settings"
                  :vertical-compact="settings"
                  :auto-size="true"
                  :margin="[10, 10]"
                  :use-css-transforms="true"
                  @layout-updated="layoutUpdatedEvent"
                >
                  <grid-item v-for="(item, idx) in this.layout" :key="idx + item.layoutDate"
                    :x="item.x"
                    :y="item.y"
                    :w="item.w"
                    :h="item.h"
                    :i="item.i"
                    @moved="movedEvent"
                    >
                    <v-tooltip bottom class="eliminarComponente">
                      <v-btn icon slot="activator" @click.native="eliminarComponente(to.columns[idx], idx)" v-if="settings">
                        <v-icon color="red">delete_forever</v-icon>
                      </v-btn>
                      <span>Eliminar componente</span>
                    </v-tooltip>
                    <formly-form :id="`item-${idx}`" :form="form" :model="model" :fields="[to.columns[idx]]"></formly-form>
                  </grid-item>
                </grid-layout>
              </v-form>
              <v-layout row wrap class="grid-datos">
                <v-flex xs12 md12 class="grid-datos-tabla">
                  <table class="table table-hover mt-3">
                    <thead>
                      <tr>
                        <th>Nro.</th>
                        <th v-for="(r, index) in to.columns" :key="index" v-if="r.type !== 'total'">
                          <b v-if="r.type == 'calculo'">
                            {{r && r.templateOptions && r.templateOptions.label ? r.templateOptions.label : r.label ? r.label : 'Columna ' + (index + 1)}}
                            <v-btn icon slot="activator" @click.native="eliminarTotal(r, index)" v-if="settings">
                              <v-icon color="red">delete_forever</v-icon>
                            </v-btn>
                          </b>
                          <span v-if="r.type != 'calculo' && r.type != 'total'">
                            {{r && r.templateOptions && r.templateOptions.label ? r.templateOptions.label : r.label ? r.label : 'Columna ' + (index + 1)}}
                          </span>
                        </th>
                        <th v-if="!disabled">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(f, ix) in filas" :key="ix" v-if="!f.___totales">
                        <td>
                          {{ix + 1}}
                        </td>
                        <td v-for="(nameColumn, index) in to.columns" :key="index" v-if="nameColumn.type != 'total'">
                          {{f[nameColumn.name]}}
                        </td>
                        <td v-if="!disabled">
                          <v-layout row wrap>
                            <v-flex sm6 xs6 lg6 class="text-md-left">
                              <v-tooltip bottom>
                                <v-btn color="success" slot="activator" icon @click.native="editarFila(f, ix)">
                                  <v-icon>edit</v-icon>
                                </v-btn>
                                <span>Editar fila</span>
                              </v-tooltip>
                            </v-flex>
                            <v-flex sm6 xs6 lg6 class="text-md-right">
                              <v-tooltip bottom>
                                <v-btn color="error" slot="activator" icon @click.native="eliminarFila(f, ix)">
                                  <v-icon>delete_forever</v-icon>
                                </v-btn>
                                <span>Eliminar toda la fila</span>
                              </v-tooltip>
                            </v-flex>
                          </v-layout>
                        </td>
                      </tr>
                      <tr>
                        <td v-for="(tot, i) in totalesGrilla" :key="i" class="grey lighten-4">
                          <b class="bold blue-grey--text" v-if="tot.type">
                            <span v-if="filaTotales[tot.name]">{{filaTotales[tot.name]}}<br></span>
                            <span v-if="settings">{{ tot.operation + ' (' + tot.label + ')' }}</span>
                            <small class="grey--text" v-if="!settings">{{tot.label}}</small>
                            <v-btn icon slot="activator" @click.native="eliminarTotal(tot, i)" v-if="settings">
                              <v-icon color="red">delete_forever</v-icon>
                            </v-btn>
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </v-flex>
              </v-layout>
            </div>
          </v-flex>
          <div>
            <v-btn icon slot="activator" large class="botonApps" @click.native="mostrarDialogo" v-if="settings">
              <v-icon color="primary darken-1">settings</v-icon>
            </v-btn>
            <v-dialog v-model="dialog" persistent max-width="600" v-if="settings" scrollable>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Grilla</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Label" v-model="label" hint="Nombre descriptivo que aparecera encima de la tabla dinamica."></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-layout row wrap>
                          <v-flex sm10 xs10 lg10>
                            <label>Seleccione un elemento de la lista, y si desea mas de un campo presione el boton (+)</label>
                          </v-flex>
                          <v-flex sm2 xs2 lg2>
                            <v-tooltip bottom>
                              <v-btn slot="activator" icon color="success" @click.native="addField">
                                <v-icon>add</v-icon>
                              </v-btn>
                              <span>Agregar otro campo</span>
                            </v-tooltip>
                          </v-flex>
                        </v-layout>
                        <div v-for="(item, idx) in columnasPopup" :key="idx">
                          <v-layout row wrap v-if="!item.component || (item.component && item.component.type !== 'total' && item.component.type !== 'calculo')">
                            <v-flex sm10 xs10 lg10>
                              <v-divider></v-divider>
                              <p class="caption blue lighten-4  pa-1 ma-0" v-if="item.label">
                                {{item.label}}
                              </p>
                              <v-select
                              :items="componentesGrilla"
                              item-text="text"
                              item-value="key"
                              v-model="item.key"
                              label="Seleccione un campo"
                              autocomplete
                              required
                            ></v-select>
                            </v-flex>
                            <v-flex sm2 xs2 lg2>
                              <v-tooltip bottom>
                                <v-btn slot="activator" icon color="error" @click.native="deleteField(idx)">
                                  <v-icon>delete_forever</v-icon>
                                </v-btn>
                                <span>Eliminar campo seleccionado</span>
                              </v-tooltip>
                            </v-flex>
                          </v-layout>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click.native="dialog = false">Cancelar</v-btn>
                  <v-btn color="primary" @click.native="save">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
          <div>
            <v-btn icon slot="activator" large class="botonApps mr-5" @click.native="mostrarDialogoTotal()" v-if="settings">
              <v-icon color="primary darken-1">functions</v-icon>
            </v-btn>
            <!-- ---------- DIALOGO PARA OPERACIONES ---------- -->
            <v-dialog v-model="dialogOperaciones" persistent max-width="600" v-if="settings" scrollable>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Configuración de cálculos/totales</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-alert color="primary" icon="info" value="true">
                          <ol>
                            <li> Seleccione el tipo de operación que necesita.</li>
                            <li> <b>Adicione las columnas de cálculo después de haber agregado y configurado todas las demás columnas.</b></li>
                          </ol>
                        </v-alert>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-layout row wrap>
                          <v-flex sm12 xs12 lg12>
                            <v-select
                              :items="tiposCalculo"
                              v-model="operacion.type"
                              item-text="text"
                              item-value="key"
                              label="Tipo de cálculo"
                              @change="cambioTipoCalculo()"
                              autocomplete
                              required
                            ></v-select>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-layout row wrap>
                          <v-flex sm12 xs12 lg12 v-if="operacion.type === 'calculo'">
                            <v-select
                              :items="operacionesCalculo"
                              v-model="operacion.operation"
                              item-text="text"
                              item-value="key"
                              label="Seleccion una operación (Cálculo)"
                              autocomplete
                              required
                            ></v-select>
                          </v-flex>
                          <v-flex sm12 xs12 lg12 v-if="operacion.type === 'total'">
                            <v-select
                              :items="operacionesTotales"
                              v-model="operacion.operation"
                              item-text="text"
                              item-value="key"
                              label="Seleccion una operación (Total)"
                              autocomplete
                              required
                            ></v-select>
                          </v-flex>
                          <v-flex sm12 xs12 lg12>
                            <v-select
                              v-model="operacion.cols"
                              label="Columnas"
                              :multiple="operacion.type === 'calculo'"
                              :items="columnasDisponibles"
                              item-value="id"
                              item-text="label"
                              required
                              ></v-select>
                          </v-flex>
                          <v-flex sm12 xs12 lg12>
                            <v-text-field label="Label" v-model="operacion.label" required></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click.native="dialogOperaciones = false">Cancelar</v-btn>
                  <v-btn color="primary" @click.native="saveOperation">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </div>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
  import {GridLayout, GridItem} from 'vue-grid-layout';
  import slugify from 'slugify';
  import draggable from 'vuedraggable';
  import GridMixin from './mixins/grid';
  export default {
    props: ['form', 'field', 'model', 'to', 'all'],
    mixins: [GridMixin],
    data () {
      return {
        filas: [],
        filaTotales: {},
        filaSeleccionada: false,
        columnasDisponibles: [],
        componentesGrilla: [
          {key: 'input_html', text: 'entrada'},
          {key: 'autocompletado_html', text: 'autocompletado'},
          {key: 'parrafo_html', text: 'párrafo'},
          {key: 'lista_desplegable_html', text: 'lista desplegable'},
          {key: 'fecha_html', text: 'fecha'}
        ],
        operacionesCalculo: [{key: 'suma', text: 'Suma'}, {key: 'resta', text: 'Resta'}, {key: 'multiplicacion', text: 'Multiplicación'}, {key: 'division', text: 'División'}],
        operacionesTotales: [{key: 'suma', text: 'Suma'}, {key: 'promedio', text: 'Promedio'}],
        tiposCalculo: [{key: 'calculo', text: 'Cálculo entre columnas'}, {key: 'total', text: 'Total'}],
        totales: ['suma', 'promedio'],
        cambioEstructura: 0,
        dialog: null,
        dialogOperaciones: null,
        label: null,
        operacion: {
          type: null, operation: null, cols: null, label: null, name: null
        },
        settings: null,
        tipoCalculo: null,
        columnasPopup: [{
          key: 0,
          name: null,
          label: ''
        }],
        layout: [],
        totalesGrilla: [],
        disabled: null
      };
    },
    mounted () {
      this.$service.get('plugins/cliente')
      .then((res) => {
        if (res) {
          this.list = [];
          this.list = res.listado.reduce((a, b) => {
            a.push(b.component);
            this.model[b.nombre] = '';
            return a;
          }, []);
        }
      })
      .catch((err) => this.$message.error(err.message));
      this.$nextTick(() => {
        this.label = this.to.label;
        this.settings = this.to.settings;
        this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
        // Adicionando la opcion de que cuando sea comodin, este sea solo vista aunque tenga todos los permisos
        this.disabled = this.to.disabled;
        if (this.field.comodin) {
          this.disabled = this.to.disabled || !!this.field.comodin;
        }
        if (this.settings === false && this.to.columns) {
          this.to.columns.forEach(item => {
            if (item && item.templateOptions) {
              item.templateOptions.isgrid = true;
              item.templateOptions.settings = false;
            }
          });
        }
        this.armarEstructuraGrilla((this.to && this.to.columns) ? this.to.columns : []);
        if (this.to.value) {
          const filasAux = this.to.value.filter(item => !item.___totales);
          const totalesAux = this.to.value.filter(item => item.___totales);
          this.filas = filasAux;
          if (totalesAux && totalesAux.length) {
            this.filaTotales = totalesAux[0];
          }
        }
      });
    },
    methods: {
      mostrarDialogo () {
        this.dialog = true;
        this.columnasPopup = [];
        if (this.to && this.to.columns) {
          this.to.columns.forEach(r => {
            this.columnasPopup.push({
              key: r.type,
              name: r.name,
              label: r.templateOptions ? r.templateOptions.label : null,
              component: r
            });
          });
          // Procesar data para mostrar
        }
      },
      addField () {
        this.columnasPopup.push({
          key: this.columnasPopup.length - 1,
          name: null
        });
      },
      deleteField (idx) {
        this.columnasPopup.splice(idx, 1);
      },
      eliminarComponente (item, idx) {
        this.$confirm('¿Está seguro de eliminar el componente?', () => {
          const i = this.to.columns.indexOf(item);
          this.to.columns.splice(i, 1);
          this.armarColumnasGuardar(true, true);
        });
      },
      save () {
        this.dialog = false;
        this.armarColumnasGuardar(false, true);
      },
      /* Procesando operaciones */
      mostrarDialogoTotal () {
        this.operacion = {type: 'total', operation: null, cols: null, label: null, name: null};
        this.columnasDisponibles = this.devolverColumnas(this.to.columns);
        this.dialogOperaciones = true;
      },
      cambioTipoCalculo () {
        this.operacion.operation = null;
        this.operacion.cols = this.operacion.operation === 'calculo' ? [] : null;
      },
      saveOperation () {
        const faltantes = [];
        if (!this.operacion.type) faltantes.push('Tipo de Cálculo');
        if (!this.operacion.operation) faltantes.push('Operación');
        if ((this.operacion.type === 'calculo' && (!this.operacion.cols || (this.operacion.cols && !this.operacion.cols.length))) ||
            (this.operacion.type === 'total' && !this.operacion.cols)) faltantes.push('Columnas');
        if (!this.operacion.label) faltantes.push('Label');
        if (faltantes && faltantes.length > 0) {
          this.$message.error(`Los siguientes campos son obligatorios: ${faltantes.join(', ')}`);
          return;
        }
        this.armarColumnasGuardar(this.operacion, true);
        this.dialogOperaciones = false;
      },
      eliminarTotal (tot, idx) {
        this.$confirm('¿Está seguro de eliminar la operación?', () => {
          let indice = 0;
          this.to.columns.forEach((item, i) => {
            if (item.name === tot.name) indice = i;
          });
          this.to.columns.splice(indice, 1);
          this.armarColumnasGuardar(true, true);
        });
      },
      /* MÉTODOS FUNCIONALES */
      adicionarFila () {
        if (this.$refs.formTabla.validate()) {
          this.procesarValores(this.filaSeleccionada === false ? true : false, this.filaSeleccionada === false ? false : true);
          this.filaSeleccionada = false;
        }
      },
      editarFila (item, indice) {
        if (this.$refs.formTabla.validate()) {
          this.to.columns.forEach((c, idx) => {
            if (c.templateOptions) {
              c.templateOptions.value = item[c.name];
              this.filaSeleccionada = indice;
            }
          });
          this.armarColumnasGuardar(true, true);
        }
      },
      eliminarFila (item, indice) {
        this.$confirm('¿Está seguro de eliminar la fila?', () => {
          this.filas.splice(indice, 1);
          this.procesarValores(false, false, true);
        });
      },
      /**
     * @function layoutUpdatedEvent
     * @argument {newlayout} Array Array de todos los elementos que componen el lienzo
     * @description layout Actualizado cuando se realiza una accion con sus elementos internos
     */
      layoutUpdatedEvent (newlayout) {},
      /**
     * @function movedEvent
     * @argument {e} Event
     * @description Capturara el evento de mover de los elementos del formulario
     */
      movedEvent (e) {}
    },
    watch: {
      disabled (disabled) {
        this.to.disabled = disabled;
      },
      // COMENTADO, porque no afecta el orden de la tabla. se tendría que hacer otro proceso más.
      layout: {
        handler (layout, oldVal) {
          if (this.settings) {
            this.$nextTick(() => {
              layout.forEach(item => {
                const obj = this.to.columns.filter(it => it.posicion && it.posicion.i === item.i)[0];
                if (obj && obj.templateOptions) {
                  obj.posicion = item;
                }
              });
            });
          }
        },
        deep: true
      },
      label (label) {
        this.to.label = label;
        this.to.id = slugify(label, '_');
        this.to.id = this.to.id.replace('ñ', 'n');
      },
      filas () {
        this.to.value = this.filas;
      },
      'operacion.label' () {
        if (this.operacion && this.operacion.label) {
          this.operacion.name = slugify(this.operacion.label, '_');
        }
      }
    },
    components: {draggable, GridLayout, GridItem}
  };
</script>
<style lang="scss">
  .titleModified {
    font-weight: 700;
  }

  .botonAnadir {
    margin-top: -10px;
  }

  .grid-container {
    .card__text {
      padding: 0 15px 0 0;
      .container {
        padding: 0px;
      }
    }
    .grid-datos {
      width: 100%;
      table-layout: fixed;
      display: inline-table;
    }
    .grid-datos-tabla {
      overflow: auto;
    }
  }
</style>
