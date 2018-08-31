<template>
  <div id="mxgraph" class="mxgraph">
    <flujoModal
      ref="cmpFlujoModal"
      :valores="valores"
      v-on:updateFlowParams="updateFlowParams"
      />
    <paso-config
      ref="cmpFormulario"
      :institucion="institucion"
      v-on:saveCellData="saveCellData"
      />
    <v-layout>
      <v-flex xs12 class="btn-container">
        <div class="iconosFormulario">
          <v-tooltip bottom>
            <v-btn icon large color="info darknet-3" slot="activator" @click.native="irFlujosPlantilla" v-show="true">
              <v-icon>subdirectory_arrow_left</v-icon>
            </v-btn>
            <span>Volver</span>
          </v-tooltip>
        </div>
        <v-card
          color="transparent"
          flat
          class="pa-2"
          >
          <h4 class="primary--text text-xs-center"><v-icon color="primary">compare_arrows</v-icon> Diagramador de Flujos</h4>
        <v-toolbar
            dense
            class="fixtoolbar"
            color="white"
            flat
            style="padding-top:20px"
            >
            <v-spacer></v-spacer>
            <v-btn icon @click.stop="printGraph()" title="Vista de impresión">
              <v-icon>print</v-icon>
            </v-btn>
            <p>|</p>
            <v-btn icon @click.stop="exportFlow()" title="Exportar diagrama a un archivo JSON">
              <v-icon>file_download</v-icon>
            </v-btn>
            <p>|</p>
            <v-btn icon @click.stop="getFlujoXML()" title="Exportar diagrama a un archivo XML">
              <v-icon>file_download</v-icon>
            </v-btn>
            <p>|</p>
            <v-btn icon @click.stop="autoOrdenarFlujo(graph, 'jerarquico')" title="Ordenar flujo (jerarquicamente)">
              <v-icon>device_hub</v-icon>
            </v-btn>
            <v-btn icon @click.stop="autoOrdenarFlujo(graph)" title="Reordenar flujo">
              <v-icon>shuffle</v-icon>
            </v-btn>
            <p>|</p>
            <v-btn icon @click.stop="graph.zoomIn()" title="Zoom in">
              <v-icon>zoom_in</v-icon>
            </v-btn>
            <v-btn icon @click.stop="graph.zoomOut()" title="Zoom out">
              <v-icon>zoom_out</v-icon>
            </v-btn>
            <v-btn icon @click.stop="graph.zoomActual()" title="Ajustar Zoom">
              <v-icon>youtube_searched_for</v-icon>
            </v-btn>
          </v-toolbar>

          <v-card>
            <v-card-actions>
              <v-flex xs12 sm6>
                <v-text-field id="search" name="search" label="Buscar flujo..." v-model="filtro" autocomplete="off"  prepend-icon="find_in_page" @keyup="filtrarFlujos" clearable></v-text-field>
                <span v-if="filtro==='' || filtro===null"> {{filtrarFlujosReiniciar()}} </span>
              </v-flex>
            </v-card-actions>
            <v-container fluid>
                  <v-card flat tile>
                    <v-card-media>
                      <div class="text-xs-center panel-flujos">
                        <v-btn  v-for="item in itemsFlujos"
                                v-bind:data="item"
                                v-bind:key="item.id"
                                :id="item.id"
                                v-bind:class="item.id"
                                v-show="item.show && item.visibleOnFilter"
                                flat
                                color="primary"
                                :title="item.descripcion"
                                style="margin-left: 20px;cursor: move;">
                          <v-icon>folder</v-icon> &nbsp; {{item.nombre}}
                        </v-btn>
                      </div>
                    </v-card-media>
                  </v-card>
            </v-container>
          </v-card>
        </v-card>
        <v-card
          height="800px"
          color="transparent"
          flat
          >
          <div class="mxContainer">
            <div id="outlineContainer" class="outlineContainer"></div>
            <div id="graphContainer" class="graphContainer panel-instanciador">
              <!-- <span>Texto a</span>
              <v-btn icon @click.stop="elementos()" title="Elementos del DIV">
                <v-icon>print</v-icon>
              </v-btn> -->
            </div>
            <div id="informacionFlujo" class="informacionFlujo"></div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>

/* eslint no-new:0 */
/* eslint new-cap:0 */

import pasoConfig from '@/common/util/componentes-basicos/pasoConfig/pasoConfig.vue';
import flujoModal from '@/common/util/componentes-basicos/flujo/flujoModal.vue';

import {
mxMultiplicity,
mxFastOrganicLayout,
mxHierarchicalLayout,
mxMorphing,
mxGraphHandler,
mxEdgeStyle,
mxImage,
mxConnectionHandler,
mxConstants,
mxPrintPreview,
mxOutline,
mxUtils,
mxCodec,
mxEvent,
mxGraph,
mxRubberband
} from 'mxgraph-js';

const NODO_TIPO_FLUJO = 'flujo';
const NODO_TIPO_CATEGORIA = 'categoria';
const VERTEX_ANCHO = 100;
const VERTEX_ALTO = 60;
const LONGITUD_MAXIMA_NOMBRE_FLUJO = 40;

export default {
  props: {
    widthModal: {
      type: Number,
      default: 480
    },
    flowData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    pasoConfig,
    flujoModal
  },
  mounted: function () {
    console.log('Mounted---> ', this.$storage.get('token'));
    this.$http.get(`${this.$instanciadorUrl}/bpm/flujosPlantilla`, {
      headers: {'Authorization': `Bearer ${this.$storage.get('token')}`}
    })
        .then((res) => {
          // this.$message.success('Se han cargado los flujos plantilla correctamente');
          if (res) {
            this.itemsFlujos = res.data.flujos.map((flujo) => ({
              ...flujo,
              disabled: false,
              show: true,
              visibleOnFilter: true
            }));
            const scope = this;
            mxUtils.alert = function (mensaje) {
              scope.$message.error(mensaje);
            };
            const container = document.getElementById('graphContainer');
            const informacionFlujo = document.getElementById('informacionFlujo');

            // Habilitando guia de movimiento a elementos
            mxGraphHandler.prototype.guidesEnabled = true;

            // Config MXGraph
            mxEvent.disableContextMenu(container);
            this.graph = new mxGraph(container);
            this.graph.connectionHandler.addListener(mxEvent.CONNECT, this.registrarRelacion);
            this.configGraph();
            this.configStyleBox(this.graph);
            this.configStyleEdge(this.graph);
            this.graph.convertValueToString = function (cell) {
              if (cell.value && cell.value.name) {
                return cell.value.name;
              }
              return '';
            };
            new mxRubberband(this.graph);
            const xcreatePopupMenu = this.createPopupMenu;
            this.graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
              return xcreatePopupMenu(this, menu, cell, evt);
            };
            // Extraendo tipo de value para la comparacion de validacion
            mxMultiplicity.prototype.checkType = function (graph, value, type, attr, attrValue) {
              if (value && value.tipo) {
                return value.tipo === type;
              }
              return false;
            };
            // TODO: Cambiar por un icono material design
            mxConnectionHandler.prototype.connectImage = new mxImage('./static/mxgraph/examples/images/connector.gif', 16, 16);
            this.graph.addMouseListener({
              currentState: null,
              previousStyle: null,
              mouseDown: function (sender, me) {
                if (this.currentState !== null) {
                  this.dragLeave(me.getEvent(), this.currentState);
                }
              },
              mouseMove: function (sender, me) {
                if (this.currentState === null) {
                  if (me.getState() && me.getState().cell && me.getState().cell.vertex && me.getState().cell.style && me.getState().cell.style.split(';').pop(-1) === NODO_TIPO_FLUJO) {
                    this.currentState = me.getState();
                    this.dragEnter(me.getEvent(), this.currentState);
                  }
                } else {
                  if (this.currentState !== null && me.getState() === this.currentState) {
                    return;
                  } else {
                    this.dragLeave(me.getEvent(), this.currentState);
                  }
                }
              },
              mouseUp: function (sender, me) { },
              dragEnter: function (evt, state) {
                if (state !== null) {
                  let html = `
                    <table>
                    <tr><td>Tipo: </td><td><strong>${state.cell.value.tipo}</strong></td></tr>
                    <tr><td>Nombre: </td><td><strong>${state.cell.value.fullName}</strong></td></tr>
                    </table>`;
                  informacionFlujo.innerHTML = html;
                }
              },
              dragLeave: function (evt, state) {
                if (state !== null) {
                  this.currentState = null;
                  informacionFlujo.innerHTML = '';
                }
              }
            });
            this.createDragImage();
            this.$nextTick(this.createDraggableItemsAndStart);
          } else {
            this.$message.error('No se ha recibido una respuesta correcta del servidor');
          }
        })
      .catch((err) => {
        this.$message.error(err.message);
      });
  },
  data () {
    return {
      graph: {},
      jsonXD: {},
      institucion: this.$storage.get('user').institucion._id,
      valores: this.flowData,
      itemsFlujos: [],
      flujosDraggable: [],
      filtro: ''
    };
  },
  created () {
  },
  methods: {
    filtrarFlujos (valor) {
      const filtro = valor.target.value;
      const regex = new RegExp(`.*${filtro}.*`, 'i');
      this.itemsFlujos.forEach(flujo => {
        flujo.visibleOnFilter = regex.test(flujo.descripcion) || regex.test(flujo.nombre);
      });
    },
    filtrarFlujosReiniciar () {
      const filtro = '';
      const regex = new RegExp(`.*${filtro}.*`, 'i');
      this.itemsFlujos.forEach(flujo => {
        flujo.visibleOnFilter = regex.test(flujo.descripcion) || regex.test(flujo.nombre);
      });
      return '';
    },
    makeItemsDraggable () {
      for (var i = 0; i < this.itemsFlujos.length; i++) {
        this.itemDraggable(document.getElementById(this.itemsFlujos[i].id), NODO_TIPO_FLUJO);
      }
    },
    createDraggableItemsAndStart () {
      this.configStyleBox(this.graph);
      this.makeItemsDraggable();
      this.cargarFlujoCompletoyFiltrarFlujosPlantilla(this.graph);
    },
    createDragImage () {
      // TODO: cambiar por un icono material design Config DragImage
      this.dragImage = document.createElement('img');
      this.dragImage.setAttribute('src', './static/icons/ic_extension_24px.svg');
      this.dragImage.style.width = '48px';
      this.dragImage.style.height = '48px';
      this.dragImage.style.marginBottom = '5px';
    },
    registrarRelacion (enviador, evento) {
      const edge = evento.getProperty('cell');
      const origen = this.graph.getModel().getTerminal(edge, true);
      const destino = this.graph.getModel().getTerminal(edge, false);
      const flujos = {
        idFlujo1: origen.value.nameIdFlujo,
        idFlujo2: destino.value.nameIdFlujo
      };
      this.$http.post(`${this.$instanciadorUrl}/relaciones`, flujos, {headers: {'Authorization': `Bearer ${this.$storage.get('token')}`}})
        .then((response) => {
          this.$message.success('Relación registrada correctamente');
        })
        .catch(err => {
          this.graph.removeCells([edge]);
          const mensajeParcial = 'No se ha podido registrar la relación en el servidor.';
          this.$message.error(err && err.response && err.response.data ? `${mensajeParcial} ${err.response.data.mensaje}` : mensajeParcial);
        });
    },
    //  metodo de creacion de nodo
    dibujarVertice (graph, vinit, x, y, style) {
      const parent = graph.getDefaultParent();
      const vstyle = style || 'flujo';
      let v = graph.insertVertex(parent, null, '', x, y, VERTEX_ANCHO, VERTEX_ALTO, vstyle);
      v.setValue(vinit);
    },
    dibujarCategoria (graph, idCategoria, nombreCategoria, icono, x, y, objCategoria) {
      const categoria = {
        tipo: NODO_TIPO_CATEGORIA,
        nameOnly: nombreCategoria,
        name: `${nombreCategoria}  <i aria-hidden="true" class="icon material-icons iconoCategoria">${icono}</i>`,
        nameIdFlujo: idCategoria,
        icono,
        type: null,
        siguiente: objCategoria.siguiente || [],
        documentos: objCategoria.documentos || []
      };
      this.dibujarVertice(graph, categoria, x, y, 'fillColor=#350028;flujo');
    },
    dibujarFlujo (graph, id, nombre, x, y) {
      const vinit = {
        tipo: NODO_TIPO_FLUJO,
        name: nombre.slice(0, LONGITUD_MAXIMA_NOMBRE_FLUJO).length < nombre.length ? `${nombre.slice(0, LONGITUD_MAXIMA_NOMBRE_FLUJO)}...` : nombre,
        // name: nombre,
        fullName: nombre,
        nameIdFlujo: id,
        type: null
      };
      this.dibujarVertice(graph, vinit, x, y, 'fillColor=#43698F;flujo');
    },
    dibujarRelacion (graph, vertice1, vertice2) {
      const parent = graph.getDefaultParent();
      graph.insertEdge(parent, null, '', this.getNodoPorIdflujo(vertice1), this.getNodoPorIdflujo(vertice2));
    },
    getNodoPorIdflujo (idFlujo) {
      let retornaNodo = null;
      let parent = this.graph.getDefaultParent();
      let childCount = this.graph.model.getChildCount(parent);
      for (let i = 0; i < childCount; i++) {
        let child = this.graph.model.getChildAt(parent, i);
        if (!this.graph.model.isEdge(child)) {
          if (child.value.nameIdFlujo === idFlujo) {
            retornaNodo = child;
            break;
          }
        }
      }
      return retornaNodo;
    },
    cargarFlujoCompletoyFiltrarFlujosPlantilla (graph) {
      let jsonFlujo = null;
      this.$http.get(`${this.$instanciadorUrl}/flujos`, {
        headers: {'Authorization': `Bearer ${this.$storage.get('token')}`}
      })
       .then((response) => {
        //  this.$message.success('Categorías, flujos plantilla y relaciones obtenidas correctamente');
         jsonFlujo = response.data;
         const model = graph.getModel();
         model.beginUpdate();
         for (let i = 0; i < jsonFlujo.length; i++) {
           if (jsonFlujo[i].tipo === 'Categoria') {
             this.dibujarCategoria(graph, jsonFlujo[i].id, jsonFlujo[i].nombre, jsonFlujo[i].icono, 20, 20, jsonFlujo[i]);
           } else {
             const flujo = this.itemsFlujos.find((item) => item.id === jsonFlujo[i].id);
             flujo.show = false;
             this.dibujarFlujo(graph, jsonFlujo[i].id, jsonFlujo[i].nombre, 20, 20);
           }
         }
         for (let i = 0; i < jsonFlujo.length; i++) {
           let idActual = jsonFlujo[i].id;
           for (let j = 0; j < jsonFlujo[i].siguiente.length; j++) {
             let idDestino = jsonFlujo[i].siguiente[j];
             this.dibujarRelacion(this.graph, idActual, idDestino);
           }
         }
         model.endUpdate();
         this.autoOrdenarFlujo(graph, 'jerarquico');
       })
        .catch(err => {
          const mensajeParcial = 'No se ha podido obtener los flujos del servidor.' + err;
          this.$message.error(err && err.response && err.response.data ? `${mensajeParcial} ${err.response.data.mensaje}` : mensajeParcial);
        });
    },
    crearCategoria (graph, nombreCategoria, iconoCategoria, idFlujoSiguiente, documentosSeleccion, multiple, posX = 40, posY = 40) {
      const categoria = {
        nombre: nombreCategoria,
        idFlujo: idFlujoSiguiente,
        icono: iconoCategoria,
        documentos: documentosSeleccion,
        multiple
      };
      this.$http.post(`${this.$instanciadorUrl}/categorias`, categoria, {headers: {'Authorization': `Bearer ${this.$storage.get('token')}`}})
        .then((response) => {
          this.$message.success('Se ha creado la categoría correctamente');
          const idCategoria = response.data[0]._fields[0].segments[1].start.properties.id;
          graph.getModel().beginUpdate();
          this.dibujarCategoria(graph, idCategoria, nombreCategoria, iconoCategoria, posX, posY, {});
          this.dibujarRelacion(graph, idCategoria, idFlujoSiguiente);
          this.autoOrdenarFlujo(graph, 'jerarquico');
          graph.getModel().endUpdate();
        })
        .catch(err => {
          const mensajeParcial = 'No se ha podido registrar la categoría en el servidor.';
          this.$message.error(err && err.response && err.response.data ? `${mensajeParcial} ${err.response.data.mensaje}` : mensajeParcial);
        });
    },
    eliminarRelacion (cell) {
      const flujos = { data: {
        idFlujo1: cell.source.value.nameIdFlujo,
        idFlujo2: cell.target.value.nameIdFlujo
      }};
      this.$http.delete(`${this.$instanciadorUrl}/relaciones`, flujos, {headers: {'Authorization': `Bearer ${this.$storage.get('token')}`}})
        .then((response) => {
          this.graph.removeCells([cell]);
        })
        .catch((err) => {
          const mensajeParcial = 'No se ha podido eliminar la relación.';
          this.$message.error(err && err.response && err.response.data ? `${mensajeParcial} ${err.response.data.mensaje}` : mensajeParcial);
        });
    },
    obtenerPosicionRelativa (posicion, anchoCelda) {
      return posicion <= anchoCelda ? posicion + anchoCelda + 10 : posicion - anchoCelda - 10;
    },
    createPopupMenu (mx, menu, cell, evt) {
      const scope = this;
      if (cell != null) {
        if (cell.isVertex()) {
          let existeCategoriaAnterior = false;
          if (cell.edges) {
            existeCategoriaAnterior = cell.edges.map(item => {
              if (item.source.value.tipo === 'categoria') {
                return true;
              }
            }).filter(n => n)[0];
          }
          // Creación de categoría en un flujo que no tenga una categoría asociada
          if (cell.value.tipo === 'flujo' && !existeCategoriaAnterior) {
            menu.addItem('Agregar Categoria', './static/icons/add_24px.svg', () => {
              this.$http.get(`${this.$instanciadorUrl}/bpm/flujosPlantilla/${cell.value.nameIdFlujo}/documentos`, {
                headers: {'Authorization': `Bearer ${this.$storage.get('token')}`}
              })
                .then((response) => {
                  if (response) {
                    scope.$prompt(`¿Desea asignar una categoria al flujo <b>'${cell.value.name}'</b>?`, '', '', this.ordenarJsonDocumentos(response.data.documentos), [], function (icono, nombreCategoria, documentosSeleccion, multiple) {
                      let iconoMostrar = icono;
                      if (icono.icono) {
                        iconoMostrar = icono.icono;
                      }
                      scope.crearCategoria(mx.graph, nombreCategoria, iconoMostrar, cell.value.nameIdFlujo, documentosSeleccion, multiple, scope.obtenerPosicionRelativa(cell.geometry.x, VERTEX_ANCHO + 10), scope.obtenerPosicionRelativa(cell.geometry.y, VERTEX_ALTO + 10));
                    }, null);
                  }
                }
              );
            });
          }
          //  Menu para editar una categoría
          if (cell.value.tipo === 'categoria') {
            menu.addItem('Editar la categoría', './static/icons/ic_create_24px.svg', () => {
              const selectedCell = mx.graph.getSelectionCell();
              if (selectedCell.value.siguiente && selectedCell.value.siguiente.length > 0) {
                // //  *******
                this.$http.get(`${this.$instanciadorUrl}/bpm/flujosPlantilla/${selectedCell.value.siguiente[0]}/documentos`, {
                  headers: {'Authorization': `Bearer ${this.$storage.get('token')}`}
                })
                  .then((response) => {
                    if (response) {
                      let documentosTodos = this.ordenarJsonDocumentos(response.data.documentos);
                      scope.$prompt(`Modifique los valores que necesite.`, selectedCell.value.nameOnly, selectedCell.value.icono, documentosTodos, this.obtieneDocumentosSeleccionados(documentosTodos, selectedCell.value.documentos), (icono, nombreCategoria, documentosSeleccion, multiple) => {
                        const currentValues = selectedCell.getValue();
                        const idFlujo = selectedCell.edges[0].target.value.nameIdFlujo;
                        scope.$http.patch(`${this.$instanciadorUrl}/categorias/${currentValues.nameIdFlujo}`, {
                          nombre: nombreCategoria,
                          icono: icono.icono || icono,
                          documentos: documentosSeleccion,
                          multiple,
                          idFlujo
                        })
                          .then((response) => {
                            scope.$message.success('Categoría modificada correctamente');
                            mx.graph.getModel().beginUpdate();
                            currentValues.icono = icono.icono || icono;
                            currentValues.nameOnly = nombreCategoria;
                            currentValues.name = `${nombreCategoria}  <i aria-hidden="true" class="icon material-icons iconoCategoria">${icono.icono || icono}</i>`;
                            currentValues.documentos = documentosSeleccion;
                            selectedCell.setValue(currentValues);
                            mx.graph.refresh();
                            mx.graph.getModel().endUpdate();
                          })
                          .catch((err) => {
                            console.log('LOG: error', err);
                            const mensajeParcial = 'No se ha podido modificar la categoria.';
                            scope.$message.error(err && err.response && err.response.data ? `${mensajeParcial} ${err.response.data.mensaje}` : mensajeParcial);
                          });
                      }, null, 'Modificar Categoría');
                    }
                  }
                );
                // // *******
              } else {
                console.log('ERROR - No hay siguiente');
              }
            });
            menu.addItem('Borrar la categoría', './static/icons/ic_delete_24px.svg', function () {
              scope.$confirm('Esta seguro de eliminar la categoria', () => {
                scope.$http.delete(`${scope.$instanciadorUrl}/categorias/${cell.value.nameIdFlujo}`)
                  .then((response) => {
                    scope.$message.success('Categoría eliminada correctamente');
                    scope.graph.removeCells([cell]);
                  })
                  .catch((err) => {
                    const mensajeParcial = 'No se ha podido eliminar la categoria.';
                    scope.$message.error(err && err.response && err.response.data ? `${mensajeParcial} ${err.response.data.mensaje}` : mensajeParcial);
                  });
              }, null);
            });
          }
          // Menu para borrar un flujo
          if (cell.value.tipo === 'flujo') {
            menu.addItem('Borrar flujo', './static/icons/ic_delete_24px.svg', function () {
              scope.$confirm(`Esta seguro de eliminar el flujo`, () => {
                scope.$http.delete(`${scope.$instanciadorUrl}/flujos/${cell.value.nameIdFlujo}`)
                  .then((response) => {
                    scope.$message.success('Flujo eliminado correctamente');
                    scope.activarDesactivarItemFlujo(cell.value.nameIdFlujo, false);
                    scope.graph.removeCells([cell]);
                  })
                  .catch((err) => {
                    const mensajeParcial = 'No se ha podido eliminar el flujo.';
                    scope.$message.error(err && err.response && err.response.data ? `${mensajeParcial} ${err.response.data.mensaje}` : mensajeParcial);
                  });
              }, null);
            });
          }
        } else {
          if (cell.source.value.tipo !== 'categoria') {
            menu.addItem(`Borrar relación`, './static/icons/ic_delete_24px.svg', function () {
              scope.$confirm(`Desea eliminar la relación`, function () {
                scope.eliminarRelacion(cell);
              }, null);
            });
          }
        }
      } else {
        menu.addItem('Objeto no seleccionado.', '', null);
      }
    },
    /**
     * @function irFlujosPlantilla
     * @description Redirecciona a la tabla de flujos plantilla saliendo del editor de flujo
     */
    irFlujosPlantilla () {
      this.$confirm('¿Esta seguro de que desea volver a la página anterior? Todo cambio no guardado se perderá', () => {
        this.$router.push('lista_flujos');
      });
    },
    /**
     * @function printGraph
     * @description Genera una vista de impresion del grafico en el navegador
     */
    printGraph () {
      const preview = new mxPrintPreview(this.graph);
      preview.open();
    },
    /**
     * @function configGraph
     * @description Configura los parámetros básicos para la generación del gráfico
     */
    configGraph () {
      const outline = document.getElementById('outlineContainer');
      this.graph.setCellsMovable(true);
      this.gridSize = 30;
      this.graph.setCellsResizable(false);
      this.graph.setHtmlLabels(true);
      this.graph.setPanning(true);
      this.graph.setTooltips(true);
      this.graph.setConnectable(true);
      this.graph.setCellsDisconnectable(false);
      this.graph.setAllowDanglingEdges(false);
      this.graph.centerZoom = false;
      new mxOutline(this.graph, outline);
    },
    /**
     * @function configStyleBox
     * @argument {graph} Object Objecto que contiene toda la información del editor
     * @description Define los estilos generales para los componentes del gráfico
     */
    configStyleBox (graph) {
      let style = graph.getStylesheet().getDefaultVertexStyle();
      style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
      style[mxConstants.STYLE_FONTSIZE] = 11;
      style[mxConstants.STYLE_FONTCOLOR] = 'white';
      style[mxConstants.STYLE_STROKECOLOR] = '#CCC';
      style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_NORT;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
      style[mxConstants.STYLE_EDITABLE] = 0;
      style[mxConstants.STYLE_SPACING] = 5;
      style[mxConstants.STYLE_WHITE_SPACE] = 'wrap';
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
      style[mxConstants.STYLE_ROUNDED] = true;
      delete style[mxConstants.STYLE_FILLCOLOR];
      graph.getStylesheet().putCellStyle('flujo', style);
    },
    /**
     * @function configStyleEdge
     * @argument {graph} Object Objecto que contiene toda la información del editor
     * @description Define los estilos específicos de las conexiones entre componentes
     */
    configStyleEdge (graph) {
      let style = this.graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
      style[mxConstants.STYLE_STROKECOLOR] = '#006fba';
      style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
      graph.alternateEdgeStyle = 'elbow=vertical';
      graph.getStylesheet().putCellStyle('enviar', style);
    },
    /**
     * @function createItem
     * @argument {graph} Object Objecto que contiene toda la información del editor
     * @argument {tipo} String Cadena que indica el nombre del componente a ser creado
     * @argument {x, y} Integer Enteros que indican la posición a partir de la cual se dibujará el componente
     */
    createItem (graph, tipo, x, y, item) {
      if (tipo === NODO_TIPO_FLUJO) {
        const model = graph.getModel();
        model.beginUpdate();
        const flujo = {
          nombre: item.title,
          id: item.id
        };
        this.$http.post(`${this.$instanciadorUrl}/flujos`, flujo, {headers: {'Authorization': `Bearer ${this.$storage.get('token')}`}})
          .then((response) => {
            // this.$message.success('Flujo registrado correctamente');
            this.dibujarFlujo(graph, item.id, item.title, x, y);
            this.activarDesactivarItemFlujo(item.id, true);
            model.endUpdate();
          })
          .catch(err => {
            model.endUpdate();
            const mensajeParcial = 'No se ha podido registrar el flujo en el servidor.';
            this.$message.error(err && err.response && err.response.data ? `${mensajeParcial} ${err.response.data.mensaje}` : mensajeParcial);
          });
      } else {
        this.$message.error('Solamente pueden cargarse flujos');
      }
    },
    /**
     * @function itemDraggable
     * @argument {item} Object
     * @argument {tipo} String
     * @description Permite que un componente sea desplazado dentro del editor
     */
    itemDraggable (item, tipo) {
      const scope = this;
      function xdragAndDrop (graph, evt, cell, x, y) {
        scope.createItem(graph, tipo, evt.offsetX, evt.offsetY, item);
      }
      this.flujosDraggable.push(mxUtils.makeDraggable(item, this.graph, xdragAndDrop, this.dragImage));
    },
    /**
     * @function autoOrdenarFlujo
     * @argument {graph} Object Objecto con toda la información del editor
     * @argument {tipo} String Cadena que indica el tipo de ordenamiento
     * @description Ordena los componentes dibujados en el editor de forma jerárquica o aleatoria
     * @description según el tipo especificado
     */
    autoOrdenarFlujo (graph, tipo = 'default') {
      graph = this.graph;
      const parent = graph.getDefaultParent();
      graph.getModel().beginUpdate();
      try {
        let layout = new mxFastOrganicLayout(graph);
        layout.forceConstant = 120;
        if (tipo === 'jerarquico') {
          layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
        }
        layout.execute(parent);
      } catch (e) {
        throw e;
      } finally {
        const morph = new mxMorphing(graph);
        morph.addListener(mxEvent.DONE, function () {
          graph.getModel().endUpdate();
        });
        morph.startAnimation();
      }
    },
    /**
     * @function getFlujoXML
     * @description Genera código XML del flujo en el editor
     */
    getFlujoXML () {
      const enc = new mxCodec(mxUtils.createXmlDocument());
      const node = enc.encode(this.graph.getModel());
      const xml = mxUtils.getXml(node);
      this.guardarDatos(xml, 'Flujos.xml');
      return xml;
    },
    guardarDatos (datos, nombreArchivo) {
      let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(datos);
      let downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', nombreArchivo);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },
    /**
     * @function getFlujoJSON
     * @description Genera un objeto JSON a partir del flujo graficado
     */
    getFlujoJSON () {
      let parent = this.graph.getDefaultParent();
      let childCount = this.graph.model.getChildCount(parent);
      let xjson = {
        vertex: [],
        edges: []
      };
      for (let i = 0; i < childCount; i++) {
        let child = this.graph.model.getChildAt(parent, i);
        let points = [];
        if (this.graph.model.isEdge(child)) {
          if (child.geometry.points) {
            child.geometry.points.forEach(function (pt) {
              points.push({x: pt.x, y: pt.y});
            });
          }
          xjson.edges.push({
            key: child.id,
            ki: child.source.id,
            kf: child.target.id,
            style: child.style,
            points
          });
        } else {
          if (child.style) {
            xjson.vertex.push({
              key: child.id,
              value: JSON.stringify(child.value),
              x: child.geometry.x,
              y: child.geometry.y,
              style: child.style
            });
          }
        }
      }
      this.jsonXD = JSON.stringify(xjson);
    },
    /**
     * @function saveCellData
     * @argument {data} Object Objecto con los valores configurados para el componente
     * @description Guarda los valores configurados para el componente
     */
    saveCellData (data) {
      // TODO: analizar funcion asincrona se genera en algunos casos a destiempo this.$on('foo', (foo, done) => {});
      let cell = this.graph.model.getCell(data.cellId);
      let clone = {};
      clone.tipo = data.value.tipo;
      clone.name = data.value.name;
      this.graph.model.setValue(cell, clone);
      this.$store.state.cellData = {};
    },
    /**
     * @function exportFlow
     * @description Exporta la estructura del flujo graficado sin valores a un archivo JSON
     */
    exportFlow: async function () {
      //  const filename = this.flowData.name ? this.flowData.name.replace(' ', '_') : NODO_TIPO_FLUJO;
      await this.getFlujoJSON();
      let estructura = this.jsonXD;
      estructura = JSON.parse(estructura);
      for (let i = 0; i < estructura.vertex.length; i++) {
        estructura.vertex[i].value = JSON.parse(estructura.vertex[i].value);
        let valor = {
          'tipo': estructura.vertex[i].value.tipo,
          'name': estructura.vertex[i].value.name
        };
        estructura.vertex[i].value = valor;
        // delete estructura.vertex[i].value;
      }
      this.guardarDatos(JSON.stringify(estructura), 'Flujos.json');
    },
    /**
     * @function updateFlowParams
     * @argument {data} Object Objecto con los datos de configuración del flujo
     * @description Actualiza los valores de configuración de un flujo
     */
    updateFlowParams (data) {
      if (data) {
        this.flowData.name = data.flowName;
        this.flowData.description = data.description;
        this.flowData.documents = data.documents;
        this.flowData.roles = data.roles;
      }
    },
    activarDesactivarItemFlujo (idItem, valor) {
      for (var i = 0; i < this.itemsFlujos.length; i++) {
        if (this.itemsFlujos[i].id === idItem) {
          this.itemsFlujos[i].show = !valor;
          break;
        }
      }
    },
    ordenarJsonDocumentos (arrayDocumentos) { // Arma el JSON de todos los documentos del Select
      let array = [];
      for (let i = 0; i < arrayDocumentos.length; i++) {
        // Adicionando cabeceras
        array.push({ divider: true });
        array.push({ header: '' + arrayDocumentos[i].tituloDocumentoPlantilla });
        // Adicionando data
        for (let j = 0; j < arrayDocumentos[i].campos.length; j++) {
          arrayDocumentos[i].campos[j].documentoPlantilla = arrayDocumentos[i].documentoPlantilla;
          array.push(arrayDocumentos[i].campos[j]);
        }
      }
      return array;
    },
    obtieneDocumentosSeleccionados (arrayJsonDocumentos, arrayDocumentosSeleleccionados) {
      let arrayRespuesta = [];
      let arrayNames = [];
      // Obtenemos todos los names
      for (let i = 0; i < arrayDocumentosSeleleccionados.length; i++) {
        for (let j = 0; j < arrayDocumentosSeleleccionados[i].atributos.length; j++) {
          arrayNames.push(arrayDocumentosSeleleccionados[i].atributos[j].nombre);
        }
      }
      // iteramos los nombres para obtener la lista de OBJETOS seleccionados
      for (let i = 0; i < arrayNames.length; i++) {
        for (let j = 0; j < arrayJsonDocumentos.length; j++) {
          if (arrayJsonDocumentos[j].name && (arrayJsonDocumentos[j].name === arrayNames[i])) {
            arrayRespuesta.push(arrayJsonDocumentos[j]);
          }
        }
      }
      return arrayRespuesta;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/_variables.scss';
.mxCellEditor, .mxPopupMenu {
  position: absolute;
}
.mxgraph {
  background: url(../../../../static/images/wires-grid.gif);
}
.mxgraph .mxContainer, .mxgraph .graphContainer {
  width: 100%;
  height: 100%;
  background-color: transparent;
}
.iconosFormulario {
  position: absolute;
  right: 0;
  margin-top: -5px;
  z-index: 2;
  color: #43698F !important;
}
.mxgraph {
  .mxContainer{
    position: relative;
  }
  .outlineContainer{
    z-index: 1;
    position: absolute;
    overflow: hidden;
    top: 0px;
    right: 0px;
    width: 160px;
    height: 120px;
    background: transparent;
    border-style: solid;
    border-color: lightgray;
  }
  .graphContainer{
    background-color: rgba(255, 255, 255, 0.7);
    overflow: hidden;
    cursor: default;
  }
  .fixtoolbar {
    position: relative;
  }
  .informacionFlujo{
    z-index: 1;
    position: fixed;
    overflow: hidden;
    bottom: 10px;
    right: 0px;
    opacity: 70%;
    background-color: #c8d9ea;
    padding: 10px;
    border-radius: 5px;
  }
}
table.mxPopupMenu {
    width: 200px;
    font-size: 11px;
    color: black;
    box-shadow: 3px 3px 6px #C0C0C0;
    background: white;
    position: absolute;
    border: 1px solid #e9e9e9;
    padding: 4px 0;
    border-spacing: 0;

    td{
      padding: 4px 6px;
    }
    .mxPopupMenuIcon{
      width: 30px;
    }
    hr {
      margin: 6px 0;
      padding: 0;
      border-top: 1px solid #e9e9e9;
    }
    .mxPopupMenuItemHover {
      background: #eee;
    }
}
.botonOculto {
      display: none;
}
.iconoCategoria {
  color: white !important;
}
.fixtoolbar i{
  color: #43698F !important;
}
.panel-instanciador {
  overflow-y: auto!important; overflow-x: auto!important; background-color:#e9e9e9!important; padding: 20px!important;border:1px solid $primary;

}
.panel-flujos {
  // height: 166px;overflow-y:auto;overflow-x:auto; width: auto;
}
.list__tile--active{
  background-color:$success;
}
</style>
