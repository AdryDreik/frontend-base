<template>
  <div id="mxgraph" class="mxgraph">
    <flujoModal
      ref="cmpFlujoModal"
      :valores="valores"
      v-on:updateFlowParams="updateFlowParams"
      />
    <interoperabilidad
      ref="cmpInteroperabilidad"
      :institucion="institucion"
      v-on:saveCellData="saveCellData"
      />
    <paso-config
      ref="cmpFormulario"
      :institucion="institucion"
      v-on:saveCellData="saveCellData"
      />
    <Ppte
      ref="cmpPagos"
      :institucion="institucion"
      v-on:saveCellData="saveCellData"
      />
    <decision
      ref="cmpDecision"
      :institucion="institucion"
      v-on:saveCellData="saveCellData"
      />
    <comodin
      ref="cmpComodin"
      :institucion="institucion"
      v-on:saveCellData="saveCellData"
      />
    <v-layout>

      <v-flex xs12 class="btn-container">

        <div class="iconosFormulario">
          <v-tooltip bottom>
            <v-btn icon dark large color="cyan darken-4" slot="activator" @click.stop="generarJson" v-show="true">
              <v-icon>code</v-icon>
            </v-btn>
            <span>Codigo Javascript</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn icon dark large color="cyan darken-4" slot="activator" @click.stop="abrirFlujoConfig" v-show="true">
              <v-icon>edit</v-icon>
            </v-btn>
            <span>Editar parametros de este flujo</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn icon dark large color="info darknet-3" slot="activator" @click.native="irFlujosPlantilla" v-show="true">
              <v-icon>subdirectory_arrow_left</v-icon>
            </v-btn>
            <span>Volver</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn icon dark large color="green darknet-3" slot="activator" @click.stop="saveFlow">
              <v-icon>save</v-icon>
            </v-btn>
            <span>Guardar Flujo</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn icon dark large color="green darknet-3" slot="activator" @click.stop="storeFlow">
              <v-icon>done_all</v-icon>
            </v-btn>
            <span>Guardar y validar Flujo</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn icon dark large color="info" slot="activator" @click.stop="vistaPreviaFormulario" v-show="false">
              <v-icon>remove_red_eye</v-icon>
            </v-btn>
            <span>Vista previa</span>
          </v-tooltip>
        </div>

        <v-card
          color="transparent"
          flat
          class="pa-2"
          >

          <h4 class="primary--text text-xs-center"><v-icon color="primary">directions</v-icon> Plantilla para crear flujos</h4>

          <v-toolbar
            dense
            class="fixtoolbar"
            color="white"
            flat
            style="padding-top:20px"
            >

            <v-btn flat icon color="green" id="xinicio" title="Inicio de flujo">
              <v-icon>radio_button_unchecked</v-icon>
            </v-btn>
            <v-btn flat icon color="pink" id="xfin" title="Fin de flujo">
              <v-icon>radio_button_checked</v-icon>
            </v-btn>
            <p>|</p>
            <v-btn flat icon color="primary" id="xformulario" title="Componente formulario">
              <v-icon>folder</v-icon>
            </v-btn>
            <v-btn flat icon color="primary" id="xinteroperabilidad" title="Componente delegación">
              <v-icon>cloud_upload</v-icon>
            </v-btn>
            <v-btn flat icon color="primary" id="xpagos" title="Componente pago">
              <v-icon>monetization_on</v-icon>
            </v-btn>
            <v-btn flat icon color="primary" id="xdecision" title="Componente decisión">
              <v-icon>call_split</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click.stop="reloadGraph()" title="Volver a cargar flujo">
              <v-icon>autorenew</v-icon>
            </v-btn>
            <v-btn icon @click.stop="printGraph()" title="Vista de impresión">
              <v-icon>print</v-icon>
            </v-btn>
            <p>|</p>
            <v-btn icon @click.stop="exportFlow()" title="Exportar flujo a un archivo JSON">
              <v-icon>file_download</v-icon>
            </v-btn>
            <!-- Upload file -->
            <input type="file" name="" id="myfile" @change="importFlow()" hidden>
            <v-btn icon @click.stop="chooseFile()" title="Importar flujo desde un archivo JSON">
              <v-icon>file_upload</v-icon>
            </v-btn>
            <div v-show="false">
              <v-btn icon @click.stop="getFlujoXML()" title="Ver codigo XML">
                <v-icon>code</v-icon>
              </v-btn>
              <v-btn icon @click.stop="getFlujoJSON()" title="Ver flujo JSON">
                <v-icon>folder</v-icon>
              </v-btn>
              <v-btn icon @click.stop="setFlujoJSON()" title="Cargar flujo JSON">
                <v-icon>send</v-icon>
              </v-btn>
              <v-btn icon @click.stop="cargarFlujoPlantilla('5ab84c8004540a2c4cbefaff', graph)" title="Cargar flujo">
                <v-icon>people</v-icon>
              </v-btn>
            </div>
            <!-- <p>|</p> -->
            <v-btn icon v-if="false" @click.stop="autoOrdenarFlujo(graph, 'jerarquico')" title="Ordenar flujo (jerarquicamente)">
              <v-icon>device_hub</v-icon>
            </v-btn>
            <v-btn icon v-if="false" @click.stop="autoOrdenarFlujo(graph)" title="Reordenar flujo">
              <v-icon>shuffle</v-icon>
            </v-btn>
            <!-- <p>|</p> -->
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

        </v-card>
        <v-card
          height="800px"
          color="transparent"
          flat
          >
          <div class="mxContainer">
            <div id="outlineContainer" class="outlineContainer"></div>
            <div id="graphContainer" class="graphContainer"></div>
            <div id="infoContainer" class="infoContainer"></div>
          </div>

        </v-card>

      </v-flex>

    </v-layout>
  </div>
</template>
<script>

/* eslint no-unused-vars:0 */
/* eslint no-new:0 */
/* eslint new-cap:0 */
import interoperabilidad from '@/common/util/componentes-basicos/interoperabilidad/interoperabilidad.vue';
import pasoConfig from '@/common/util/componentes-basicos/pasoConfig/pasoConfig.vue';
import Ppte from '@/common/util/componentes-basicos/ppte/ppte.vue';
import Decision from '@//common/util/componentes-basicos/decisionConfig/decisionConfig.vue';
import Comodin from '@//common/util/componentes-basicos/comodinConfig/comodinConfig.vue';
import flujoModal from '@/common/util/componentes-basicos/flujo/flujoModal.vue';
import { mapState } from 'vuex';
import {
mxMultiplicity,
mxLog,
mxEditor,
mxStackLayout,
mxVertexHandler,
mxFastOrganicLayout,
mxHierarchicalLayout,
mxMorphing,
mxPoint,
mxCellOverlay,
mxGraphHandler,
mxEdgeStyle,
mxImage,
mxConnectionHandler,
mxConstants,
mxPerimeter,
mxRectangle,
mxCell,
mxGeometry,
mxDragSource,
mxPrintPreview,
mxOutline,
mxUtils,
mxCodec,
mxEvent,
mxBasePath,
mxGraph,
mxClient,
mxGraphModel,
mxEventObject,
mxGraphLayout,
mxRubberband } from 'mxgraph-js';

const NAME_INICIO = 'inicio';
const NAME_FORMULARIO = 'formulario';
const NAME_INTEROPERABILIDAD = 'interoperabilidad';
const NAME_PAGOS = 'pagos';
const NAME_DECISION = 'decision';
const NAME_FIN = 'fin';

const { GRUPO_SOLICITANTE, GRUPO_SISTEMA } = require('../../../../config');

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
    interoperabilidad,
    pasoConfig,
    Ppte,
    Decision,
    Comodin,
    flujoModal
  },
  mounted: function () {
    const scope = this;
    mxUtils.alert = function (mensaje) {
      scope.$message.error(mensaje);
    };

    const container = document.getElementById('graphContainer');
    const infoContainer = document.getElementById('infoContainer');

    // Habilitando guia de movimiento a elementos
    mxGraphHandler.prototype.guidesEnabled = true;

    // Config MXGraph
    mxEvent.disableContextMenu(container);
    this.graph = new mxGraph(container);
    this.configGraph();
    this.configStyleBox(this.graph);
    this.configStyleEdge(this.graph);
    // this.loadPrevGraph(this.graph);
    // Para mostrar los labels
    this.graph.convertValueToString = function (cell) {
      if (cell.value) {
        if (cell.value.name) {
          return cell.value.name;
        }
      }
      return '';
    };
    new mxRubberband(this.graph);

    // Menu de navegacion
    const xcreatePopupMenu = this.createPopupMenu;
    this.graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
      return xcreatePopupMenu(this, menu, cell, evt);
    };

    // Extraendo tipo de value para la comparacion de validacion
    mxMultiplicity.prototype.checkType = function (graph, value, type, attr, attrValue) {
      if (value != null) {
        if (value.tipo) {
          return value.tipo === type;
        }
      }
      return false;
    };

    this.graph.multiplicities = this.validacionEdgeFlujo();

    // TODO: Cambiar por un icono material design
    mxConnectionHandler.prototype.connectImage = new mxImage('./static/mxgraph/examples/images/connector.gif', 16, 16);

    // this.graph.getTooltipForCell = function (cell) {
    //   // var label = this.convertValueToString(cell);
    //   return 'Tooltip for vertex';
    // };
    // this.graph.getTooltip = function (state) {
    //   return 'Test: 123';
    // };

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
          if (me.getState() && me.getState().cell &&
              me.getState().cell.vertex && me.getState().cell.style &&
              (me.getState().cell.style.split(';').pop(-1) === 'formulario' || me.getState().cell.style.split(';').pop(-1) === 'pagos')) {
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
          let values = state.cell && state.cell.value ? state.cell.value : {};
          // console.log('-------me-----------------------------');
          // console.log(state.cell);
          // console.log('------------------------------------');
          // scope.$message.success('In');
          // Creates a window
          // scope.showModalWindow(container, 'XML', tb, 800, 440);
          // var infoContainer = document.createElement('div');
          // infoContainer.setAttribute('id', 'infoContainer');
          // infoContainer.setAttribute('class', 'infoContainer');
          // scope.showConfig = true;
          let html = `<table>
            <tr><td>Grupo</td><td><strong>${scope.translateGroup(values.groupId)}</strong></td></tr>
            <tr><td>Documento</td><td><strong>${scope.translateDoc(values.docId) || values.name}</strong></td></tr>
            <tr><td>Opción de derivación</td><td><strong>${values.sendOption ? values.sendOption.tipo : ''}</strong></td></tr>
            <tr><td>Permisos</td><td>`;
          for (let row in values.permissions) {
            let permiso = values.permissions[row];
            html += `<strong>${scope.translateGroup(permiso.role)} - ${permiso.read}${permiso.write}${permiso.deny}${permiso.principal ? ' (Principal)' : ''}<strong><br/>`;
          }
          html += `</td></tr></table>`;
          infoContainer.innerHTML = html;
          infoContainer.style.backgroundColor = '#c8d9ea';
          infoContainer.style.padding = 10;
        }
      },
      dragLeave: function (evt, state) {
        if (state !== null) {
          // scope.$message.warning('Out');
          this.currentState = null;
          // scope.wnd.destroy;
          // var infoContainer = document.getElementById('infoContainer');
          // infoContainer.parentNode.removeChild(infoContainer);
          infoContainer.innerHTML = '';
          // scope.showConfig = false;
        }
      }
    });

    // TODO: cambiar por un icono material design Config DragImage
    this.dragImage = document.createElement('img');
    this.dragImage.setAttribute('src', './static/icons/ic_extension_24px.svg');
    this.dragImage.style.width = '48px';
    this.dragImage.style.height = '48px';
    this.dragImage.style.marginBottom = '5px';

    // Definiendo drag para componentes
    this.configStyleBox(this.graph);
    this.itemDraggable(document.getElementById('xinicio'), 'inicio');
    this.itemDraggable(document.getElementById('xfin'), 'fin');
    this.itemDraggable(document.getElementById('xformulario'), 'formulario');
    this.itemDraggable(document.getElementById('xinteroperabilidad'), 'interoperabilidad');
    this.itemDraggable(document.getElementById('xpagos'), 'pagos');
    this.itemDraggable(document.getElementById('xdecision'), 'decision');

    this.startWithGraph();
  },
  data () {
    return {
      graph: {},
      jsonXD: {},
      institucion: this.$storage.get('user').institucion._id, // '5aaac05667adf97ed4093eb5'
      docsWithComponents: [],
      validDocuments: [],
      prevUsedDocuments: [],
      valores: this.flowData
      // showConfig: false
    };
  },
  methods: {
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
     * @function startWithGraph
     * @description Prepara el editor de flujos para cargar un flujo limpiando el contenido actual
     * @description y carga el flujo a una variable temporal
     */
    startWithGraph () {
      // Eliminar componentes existentes
      this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()));
      if (this.flowData && this.flowData.estructura) {
        // console.log('------------------------------------');
        // console.log(this.flowData.estructura);
        // console.log('------------------------------------');
        this.jsonXD = this.flowData.estructura;
        this.setFlujoJSON();
      } else {
        console.log('------------------------------------');
        console.log('no flow was found');
        console.log('------------------------------------');
      }
    },
    /**
     * @function reloadGraph
     * @description Elimina los cambios en el editor actual y vuelve a cargar un flujo almacenado
     */
    reloadGraph () {
      this.$confirm('¿Esta seguro de que desea recargar el flujo inicial? Los cambios actuales se perderan', () => {
        this.startWithGraph();
      });
    },
    /**
     * @function printGraph
     * @description Genera una vista de impresion del grafico en el navegador
     */
    printGraph () {
      const preview = new mxPrintPreview(this.graph, 1);
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
      // this.graph.setAutoSizeCells(true);

      this.graph.setCellsResizable(false);
      // Para que los textos se muestren en multilinea con whiteSpace=wrap
      this.graph.setHtmlLabels(true);
      // Habilitar tootipos, para nuevas conecciones
      this.graph.setPanning(true);
      this.graph.setTooltips(true);
      this.graph.setConnectable(true);
      this.graph.setCellsDisconnectable(false);
      this.graph.setAllowDanglingEdges(false);

      // Habilitar zoom para outline
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
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
      style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'none';
      style[mxConstants.STYLE_FONTSIZE] = 11;
      style[mxConstants.STYLE_FONTCOLOR] = 'black';
      style[mxConstants.STYLE_STROKECOLOR] = '#CCC';
      // style[mxConstants.STYLE_SHADOW] = true;
      style[mxConstants.STYLE_FILLCOLOR] = '#F8F8F8';
      style[mxConstants.STYLE_GRADIENTCOLOR] = '#F0F0F0';
      style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_NORT;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
      delete style[mxConstants.STYLE_FILLCOLOR];
      graph.getStylesheet().putCellStyle('base', style);

      style = mxUtils.clone(style);
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
      style[mxConstants.STYLE_FONTSIZE] = 10;
      style[mxConstants.STYLE_ROUNDED] = true;
      graph.getStylesheet().putCellStyle('proceso', style);
    },
    /**
     * @function configStyleEdge
     * @argument {graph} Object Objecto que contiene toda la información del editor
     * @description Define los estilos específicos de las conexiones entre componentes
     */
    configStyleEdge (graph) {
      let style = this.graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_ROUNDED] = true;
      style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
      style[mxConstants.STYLE_STROKECOLOR] = '#445612';
      style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK;
      graph.alternateEdgeStyle = 'elbow=vertical';
      graph.getStylesheet().putCellStyle('enviar', style);

      style = mxUtils.clone(style);
      style[mxConstants.STYLE_STROKECOLOR] = '#e91e63';
      style[mxConstants.STYLE_DASHED] = true;
      style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_OPEN;
      style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_OVAL;
      graph.getStylesheet().putCellStyle('observar', style);
    },
    /**
     * @function createItem
     * @argument {graph} Object Objecto que contiene toda la información del editor
     * @argument {tipo} String Cadena que indica el nombre del componente a ser creado
     * @argument {x, y} Integer Enteros que indican la posición a partir de la cual se dibujará el componente
     * @argument {prevId} String Id de elemento en caso de cargar un gráfico existente
     * @description Crea un componente según el tipo especificado
     * @description Verifica existencia de puntos de inicio y fin de flujo
     */
    createItem (graph, tipo, x, y, prevId) {
      const setId = prevId ? prevId : null;
      const scope = this;
      const parent = graph.getDefaultParent();
      const model = graph.getModel();
      let v1 = {};
      if (tipo === 'inicio') {
        // Verifica si un punto de inicio ya existe
        const prevInitCell = model.getCell('Inicio');
        if (prevInitCell) {
          scope.$message.warning('Sólo puede agregar un punto de inicio!');
          return;
        }
      }
      if (tipo === 'fin') {
        // Verifica si un punto de fin ya existe
        const prevEndCell = model.getCell('Fin');
        if (prevEndCell) {
          scope.$message.warning('Sólo puede agregar un punto de fin!');
          return;
        }
      }
      model.beginUpdate();
      try {
        if (['formulario', 'interoperabilidad', 'pagos'].indexOf(tipo) >= 0) {
          const vstyle = `editable=0;whiteSpace=wrap;proceso;fillColor=#FFFFFF;gradientColor=#FFFFFF;strokeWidth=2;strokeColor=#3c6002;${tipo}`;
          v1 = graph.insertVertex(parent, setId, tipo, x, y, 120, 40, vstyle);
          if (tipo === 'formulario') {
            const vinit = {
              tipo: NAME_FORMULARIO,
              name: 'formulario',
              groupId: null,
              docId: null,
              type: null,
              sendOption: null,
              permissions: null,
              extras: null,
              temporizador: null,
              acciones: null,
              configComodin: null,
              repeticion: false,
              primerDocumentoPlantilla: null
            };
            v1.setValue(vinit);
            const overlay = new mxCellOverlay(
              new mxImage('./static/icons/ic_folder_24px.svg', 24, 24)
            );
            overlay.addListener(mxEvent.CLICK, function (sender, evt2) {
              scope.abrirConfigFormulario(evt2.properties.cell);
            });
            graph.addCellOverlay(v1, overlay);
            const recursividad = new mxCellOverlay(
              new mxImage(`./static/icons/retweet-${vinit.repeticion}.svg`, 20, 20), null, 'right', 'top', null, 'pointer'
            );
            recursividad.addListener(mxEvent.CLICK, function (sender, evt2) {
              // evt2.properties.cell.value.repeticion = true;
              // const cells = graph.getCellOverlays(evt2.getProperty('cell'));
              const cell = evt2.getProperty('cell');
              // console.log('----------EEEEEE-------------------------');
              // console.log(cells);
              // console.log('------------------------------------');
              // console.log('-------------CELSSSSSSSSs---------------------');
              // console.log(cells.getProperty('cell'));
              // console.log('------------------------------------');
              evt2.properties.cell.repeticion = !evt2.properties.cell.repeticion;
              this.image.src = `./static/icons/retweet-${evt2.properties.cell.repeticion}.svg`;
              // graph.removeCellOverlay(cell, recursividad);
              graph.setCellWarning(cell, '<b>Warning:</b>: Hello, World!', null, true);
            });
            // graph.addCellOverlay(v1, recursividad);

            // Adicionando icono para configurar componentes comodin
            // const comodin = new mxCellOverlay(
            //   new mxImage('./static/icons/comodin.svg', 20, 20), 'Configurar componentes comodin', 'left', 'left', null, 'pointer');
            // comodin.addListener(mxEvent.CLICK, function (sender, evt2) {
            //   scope.abrirConfigComodin(evt2.properties.cell);
            // });
            // graph.addCellOverlay(v1, comodin);
          } else if (tipo === 'interoperabilidad') {
            const vinit = {
              tipo: NAME_INTEROPERABILIDAD,
              name: 'interoperabilidad',
              groupId: GRUPO_SISTEMA, // '000000000000000000000555',
              docId: null
            };
            v1.setValue(vinit);
            const overlay = new mxCellOverlay(
              new mxImage('./static/icons/ic_cloud_upload_24px.svg', 24, 24));
            overlay.addListener(mxEvent.CLICK, function (sender, evt2) {
              scope.abrirConfigInteroperabilidad(evt2.properties.cell);
            });
            graph.addCellOverlay(v1, overlay);
          } else if (tipo === 'pagos') {
            const vinit = {
              tipo: NAME_PAGOS,
              name: 'pagos',
              groupId: GRUPO_SISTEMA, // '000000000000000000000555',
              docId: null
            };
            v1.setValue(vinit);
            const overlay = new mxCellOverlay(
              new mxImage('./static/icons/ic_monetization_on_24px.svg', 24, 24));
            overlay.addListener(mxEvent.CLICK, function (sender, evt2) {
              scope.abrirConfigPagos(evt2.properties.cell);
            });
            graph.addCellOverlay(v1, overlay);
          }
        }
        if (tipo === 'decision') {
          const vstyle = `editable=0;whiteSpace=wrap;base;shape=rhombus;fillColor=#FFFFFF;gradientColor=#FFFFFF;strokeWidth=2;strokeColor=#b0ed23;${tipo}`;
          v1 = graph.insertVertex(parent, setId, tipo, x, y, 80, 80, vstyle);
          const vinit = {
            tipo: NAME_DECISION,
            name: 'decision',
            groupId: GRUPO_SISTEMA, // '000000000000000000000555',
            docId: null
          };
          v1.setValue(vinit);
          const overlay = new mxCellOverlay(
            new mxImage('./static/icons/ic_call_split_24px.svg', 24, 24),
            'Overlay tooltip', mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM, new mxPoint(-10, -10));
          overlay.addListener(mxEvent.CLICK, function (sender, evt2) {
            scope.abrirConfigDecision(evt2.properties.cell);
          });
          graph.addCellOverlay(v1, overlay);
        }
        if (tipo === 'inicio') {
          v1 = graph.insertVertex(parent, 'Inicio', {tipo: NAME_INICIO, name: 'inicio'}, x, y, 50, 50, 'editable=0;base;fillColor=#86f745;gradientColor=#86f745;shape=ellipse;strokeWidth=2;strokeColor=#000000;inicio');
        }
        if (tipo === 'fin') {
          v1 = graph.insertVertex(parent, 'Fin', {tipo: NAME_FIN, name: 'fin'}, x, y, 50, 50, 'editable=0;base;fillColor=#FF0000;gradientColor=#FF0000;shape=ellipse;strokeWidth=2;strokeColor=#000000;fontColor=#FFFFFF;fin');
        }
      } finally {
        model.endUpdate();
      }
      return v1;
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
        scope.createItem(graph, tipo, x, y, null);
      }
      const ds = mxUtils.makeDraggable(item, this.graph, xdragAndDrop, this.dragImage);
    },
    /**
     * @function createPopupMenu
     * @argument {mx} Object
     * @argument {menu} Object
     * @argument {cell} Object Componente seleccionado
     * @argument {evt} Event
     * @description Abre un menú contextual sobreel componente seleccionado
     */
    createPopupMenu (mx, menu, cell, evt) {
      const scope = this;
      const model = mx.graph.getModel();
      if (cell != null) {
        // console.log('------------cell------------------------');
        // console.log(cell);
        // console.log('------------------------------------');
        const tipo = scope.getCellTipo(cell);
        menu.addItem('Borrar', './static/icons/ic_delete_24px.svg', function () {
          if (cell.value && cell.value.docId && (cell.value.tipo === NAME_INTEROPERABILIDAD || cell.value.tipo === NAME_PAGOS || cell.value.tipo === NAME_DECISION)) {
            scope.$confirm(`¿Desea borrar permanentemente el componente "${cell.value.name}"?`, function () {
              scope.eliminarObjetoConPlantilla(cell);
              // mx.graph.removeCells([cell]);
              // mxEvent.consume(evt);
            }, null);
          } else {
            scope.eliminarObjeto(cell);
          }
        });
        if (tipo !== 'inicio' && tipo !== 'fin') {
          menu.addSeparator();
          if (!model.isEdge(cell)) {
            menu.addItem('Editar', './static/icons/ic_create_24px.svg', function () {
              if (tipo === 'formulario') {
                scope.abrirConfigFormulario(cell);
              } else if (tipo === 'interoperabilidad') {
                scope.abrirConfigInteroperabilidad(cell);
              } else if (tipo === 'pagos') {
                scope.abrirConfigPagos(cell);
              } else if (tipo === 'decision') {
                scope.abrirConfigDecision(cell);
              }
            });
          } else {
            menu.addItem('Enviar', './static/icons/ic_send_24px.svg', function () {
              cell.setStyle('enviar');
              mx.graph.refresh();
            });
            menu.addItem('Observar', './static/icons/ic_feedback_24px.svg', function () {
              cell.setStyle('observar');
              mx.graph.refresh();
            });
          }
        }
      } else {
        menu.addItem('Objetos no seleccionados', '', null);
      }
    },
    /**
     * @function eliminarObjecto
     * @argument {cell} Object Componente seleccionado
     * @description Elimina un componente del flujo
     */
    eliminarObjeto (cell) {
      this.graph.removeCells([cell]);
    },
    /**
     * @function eliminarObjetoConPlantilla
     * @argument {cell} Object Componente seleccionado
     * @description Si el componente ha sido configurado: marca el documento plantilla generado
     * @description para ser borrado al guardar los cambios en el flujo
     * @description Elimina el componente del flujo
     */
    eliminarObjetoConPlantilla (cell) {
      if (cell.value && cell.value.docId) {
        // console.log('-------------configurado-----------------------');
        // console.log(cell.value.docId);
        // console.log('------------------------------------');
        /*
        const path = 'documentos_plantilla/diagrama/' + cell.value.docId;
        this.$service.delete(path)
        .then(response => {
          if (response) {
            console.log('-----------delete-response----------');
            console.log(response);
            console.log('------------------------------------');
            this.$message.success('El componente fue eliminado correctamente');
            this.removeDoc(cell);
            this.graph.removeCells([cell]);
          }
        });
        */
        this.markDocForRemoval(cell);
        this.graph.removeCells([cell]);
        this.$message.success('El componente fue eliminado correctamente');
      }
    },
    /**
     * @function abrirConfigComodin
     * @description Esta funcion esta encargada de abrir el configurador de componentes comodines
     */
    async abrirConfigComodin (cell) {
      try {
        this.getValidDocs();
        this.getPrevDocsOnly(cell);
        await this.prepareConfigData(cell);
        const xrefs = this.$refs;
        xrefs.cmpComodin.abrirConfiguracion();
      } catch (err) {
      }
    },
    /**
     * @function abrirConfigFormulario
     * @argument {cell} Object Componente seleccionado
     * @description Abre la ventana de configuración del componente formulario
     */
    abrirConfigFormulario: async function (cell) {
      this.clearTempDocVariables();
      this.getValidDocs();
      await this.prepareConfigData(cell);
      const xrefs = this.$refs;
      xrefs.cmpFormulario.abrirConfiguracion();
    },
    /**
     * @function abrirConfigInteroperabilidad
     * @argument {cell} Object Componente seleccionado
     * @description Abre la ventana de configuración del componente de interoperabilidad
     */
    abrirConfigInteroperabilidad: async function (cell) {
      this.clearTempDocVariables();
      this.getValidDocs();
      this.getPrevDocsOnly(cell);
      await this.getDocComponents();
      await this.prepareConfigData(cell);
      const xrefs = this.$refs;
      xrefs.cmpInteroperabilidad.abrirConfiguracion();
    },
    /**
     * @function abrirConfigPagos
     * @argument {cell} Object Componente seleccionado
     * @description Abre la ventana de configuración de la plataforma de pagos
     */
    abrirConfigPagos: async function (cell) {
      this.clearTempDocVariables();
      this.getValidDocs();
      await this.prepareConfigData(cell);
      const xrefs = this.$refs;
      xrefs.cmpPagos.abrirPlataformaPagos();
    },
    /**
     * @function abrirConfigDecision
     * @argument {cell} Object Componente seleccionado
     * @description Abre la ventana de configuración del componente de decision
     */
    abrirConfigDecision: async function (cell) {
      this.clearTempDocVariables();
      this.getValidDocs();
      this.getPrevDocsOnly(cell);
      await this.getDocComponents();
      await this.prepareConfigData(cell);
      const xrefs = this.$refs;
      xrefs.cmpDecision.abrirConfiguracion();
    },
    /**
     * @function clearTempDocVariables
     * @description Limpia los array auxiliares / temporales de documentos
     */
    clearTempDocVariables () {
      this.prevUsedDocuments = [];
      this.docsWithComponents = [];
    },
    /**
     * @function getValidDocs
     * @description Genera un array con los documentos que son válidos para ser utilizados en los
     * @description componentes de formulario e interoperabilidad
     */
    getValidDocs () {
      // this.validDocuments = this.flowData.documents.slice(0);
      this.validDocuments = this.flowData.documents.reduce((respuesta, doc) => {
        let valid = doc.hasOwnProperty('tipo') && (doc.tipo === 'F' || doc.tipo === 'I') && !doc.hasOwnProperty('eliminar');
        // let notValid = doc.hasOwnProperty('eliminar') || !doc.hasOwnProperty('tipo') || doc.tipo === null || doc.tipo === 'D' || doc.tipo === 'P';
        if (valid) {
          respuesta.push(doc);
        }
        return respuesta;
      }, []);
      console.log('---------------documentos validos---------------------');
      console.log(this.validDocuments);
      console.log('------------------------------------');
      // for (let doc in this.validDocuments) {
      //   let notValid = this.validDocuments[doc].hasOwnProperty('eliminar') || !this.validDocuments[doc].hasOwnProperty('tipo') || this.validDocuments[doc].tipo === null || this.validDocuments[doc].tipo === 'D' || this.validDocuments[doc].tipo === 'P';
      //   if (notValid) {
      //     this.validDocuments.splice(doc, 1);
      //   }
      // }
    },
    /**
     * @function getPrevDocsOnly
     * @argument {cell} Object Componente seleccionado
     * @description Genera un array con los documentos previos al componente seleccionado que son válidos en los
     * @description componentes de formulario e interoperabilidad
     */
    getPrevDocsOnly (cell) {
      let previousSteps = this.getPrevSteps(cell);
      let prevDocs = [];
      previousSteps.forEach(elem => {
        let auxCell = this.graph.model.getCell(elem);
        if (auxCell && auxCell.vertex && (auxCell.value.tipo === NAME_INTEROPERABILIDAD || auxCell.value.tipo === NAME_FORMULARIO) && auxCell.value.docId) {
          prevDocs.push(auxCell.value.docId);
        }
      });
      let uniquePrevDocs = [...new Set(prevDocs)]; // Removes any duplicate doc id
      let prevUsedDocs = this.validDocuments.reduce((respuesta, doc) => {
        let used = false;
        uniquePrevDocs.forEach(elem => {
          if (elem === doc.id) {
            used = true;
          }
        });
        if (used) {
          respuesta.push(doc);
        }
        return respuesta;
      }, []);
      this.prevUsedDocuments = prevUsedDocs.slice();
      console.log('---------documentos previos---------');
      console.log(this.prevUsedDocuments);
      console.log('------------------------------------');
    },
    /**
     * @function getPrevSteps
     * @argument {cell} Object Componente seleccionado
     * @description Genera un array con los ids de los pasos previos en el diagrama
     */
    getPrevSteps (cell) {
      let path = this.createPath();
      let current = {};
      let prevCells = [];
      for (let i in path) {
        if (path[i].current === cell.id) {
          current = path[i];
        }
      }
      let hasPreviousSteps = true;
      let aux = [];
      let aux1 = [];
      while (hasPreviousSteps) {
        if (aux1.length > 0) {
          aux = aux1.slice();
          aux1 = [];
        }
        if (aux.length > 0) {
          let prevArray = [];
          aux.forEach(elem => {
            for (let i in path) {
              if (path[i].current === elem) {
                prevArray = path[i].prev;
              }
            }
            prevArray.forEach(val => {
              if (val === 'SOF') {
                hasPreviousSteps = false;
              } else {
                prevCells.push(val);
                aux1.push(val);
              }
            });
          });
        } else {
          current.prev.forEach(el => {
            if (el === 'SOF') {
              hasPreviousSteps = false;
            } else {
              prevCells.push(el);
              aux.push(el);
            }
          });
        }
      }
      let unique = [...new Set(prevCells)]; // Remove duplicate ids
      return unique;
    },
    /**
     * @function prepareConfigData
     * @argument {cell} Object Componente seleccionado
     * @description Prepara un objeto con los valores del componente, que será usado
     * @description en la ventana de configuración respectiva
     */
    prepareConfigData: async function (cell) {
      console.log('-----------------------PREPARE CONFIG DATA--------------------------------------');
      console.log(cell);
      console.log('---------------------------------------------------------------------------');
      if (cell) {
        let type = await this.getCellTipo(cell);
        let connected = await this.getConnectedCells(cell);
        let roles = this.flowData.roles; // this.$store.state.groupsForFlow;
        let generalRoles = this.flowData.generalRoles; // Roles generales de la institución seleccionada
        let documents = [];
        if (this.docsWithComponents.length > 0 && (type === NAME_INTEROPERABILIDAD || type === NAME_DECISION)) {
          documents = this.docsWithComponents;
        } else {
          documents = this.validDocuments; // this.$store.state.documentsForFlow;
        }
        let configData = {
          'type': type,
          'cellId': cell.id,
          'value': cell.value,
          'currentGroup': '',
          'currentGroupId': 0,
          // 'primary': connected.onPrev && connected.onPrev.length === 0 ? true : false,
          'connected': connected,
          'groups': roles,
          'documents': documents,
          'generalRoles': generalRoles
        };
        this.$store.state.cellData = configData;
        console.log('----------------sending--------------------');
        console.log(configData);
        console.log('-------------------------------------------');
        return configData;
      } else {
        this.$message.error('No se pudo recuperar la información del componente seleccionado');
      }
    },
    /**
     * @function getCellTipo
     * @argument {cell} Object Componente seleccionado
     * @description Retorna una cadena con el tipo/nombre del componente
     */
    getCellTipo (cell) {
      if (cell.style) {
        return cell.style.split(';').pop(-1);
      } else {
        return '';
      }
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
    /*
    cargarFlujoPlantilla (id, graph) {
      this.$service.get(`flujos_plantilla/${id}`).then((res) => {
        console.log(res.base.xml);
        this.setFlujoXML(res.base.xml, graph);
        this.$message.success('Formulario exitosamente actualizado');
      });
    },
    */
    /**
     * @function validacionEdgeFlujo
     * @description Indica las reglas que deben seguir las conexiones entre componentes
     */
    validacionEdgeFlujo () {
      let validacion = [];
      validacion[0] = new mxMultiplicity(
        false, NAME_INICIO, null, null, 0, 0, null,
        `"${NAME_INICIO}" no puede tener un conector entrante`,
        null);
      validacion[1] = new mxMultiplicity(
        true, NAME_INICIO, null, null, 1, 1, [NAME_FORMULARIO],
        `"${NAME_INICIO}" solo puede tener un conector`,
        `"${NAME_INICIO}" solo puede estar conectado a un ${NAME_FORMULARIO}`);
      validacion[2] = new mxMultiplicity(
        true, NAME_INTEROPERABILIDAD, null, null, 0, 2, null,
        `"${NAME_INTEROPERABILIDAD}" solo puede tener dos conectores`,
        null);
      validacion[3] = new mxMultiplicity(
        true, NAME_PAGOS, null, null, 0, 1, null,
        `"${NAME_PAGOS}" solo puede tener un conector`,
        null);
      validacion[4] = new mxMultiplicity(
        true, NAME_FIN, null, null, 0, 0, null,
        `"${NAME_FIN}" no puede tener conectores salientes`,
        null);
      validacion[5] = new mxMultiplicity(
        false, NAME_FIN, null, null, 0, 0, [NAME_FORMULARIO, NAME_INTEROPERABILIDAD, NAME_PAGOS],
        null, `El flujo no puede terminar con un componente de decision`);
      return validacion;
    },
    /**
     * @function setFlujoXML
     * @argument {xml} String Cadena con la estructura del flujo en formato XML
     * @argument {graph} Object Objeto con toda la información del editor
     * @description Carga un flujo en el editor desde una estructura XML
     */
    setFlujoXML (xml, graph) {
      const doc = mxUtils.parseXml(xml);
      const codec = new mxCodec(doc);
      codec.decode(doc.documentElement, graph.getModel());
      // graph.refresh();
      console.log(graph.getModel());
    },
    /*
    guardarFlujoPlantilla (id, graph) {
      const request = new XMLHttpRequest();
      this.$service.put(`flujos_plantilla/${id}`, {'base.xml': this.getFlujoXML(graph)}).then((res) => {
        this.$message.success('Formulario exitosamente actualizado');
      });
    },
    */
    /**
     * @function getFlujoXML
     * @description Genera código XML del flujo en el editor
     */
    getFlujoXML () {
      const enc = new mxCodec(mxUtils.createXmlDocument());
      const node = enc.encode(this.graph.getModel());
      const xml = mxUtils.getXml(node);
      console.log('--------------xml----------------------');
      console.log(mxUtils.getPrettyXml(node));
      console.log('------------------------------------');
      return xml;
    },
    /**
     * @function setFLujoJSON
     * @description CArga un flujo en el editor desde una estructura JSON
     */
    setFlujoJSON () {
      // console.log(this.jsonXD);
      const scope = this;
      const graph = this.graph;
      const model = graph.getModel();
      const parent = graph.getDefaultParent();
      const jsx = JSON.parse(this.jsonXD);
      // console.log('-------------jsx-----------------------');
      // console.log(jsx);
      // console.log('------------------------------------');
      let vertices = [];
      graph.getModel().beginUpdate();
      try {
        jsx.vertex.forEach(function (ic) {
          const tipo = scope.getCellTipo(ic);
          vertices[ic.key] = scope.createItem(graph, tipo, ic.x, ic.y, ic.key);
          vertices[ic.key].setValue(JSON.parse(ic.value));
        });
        jsx.edges.forEach(function (ic) {
          const setId = ic.key ? ic.key : null;
          const e1 = graph.insertEdge(parent, setId, ic.value, vertices[ic.ki], vertices[ic.kf]);
          let points = [];
          ic.points.forEach(function (pt) {
            points.push(new mxPoint(pt.x, pt.y));
          });
          e1.getGeometry().points = points;
          e1.style = ic.style;
        });
      } finally {
        graph.getModel().endUpdate();
      }
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
      console.log('----------Flujo JSON----------------');
      console.log(xjson);
      console.log('------------------------------------');
    },
    /**
     * @function getConnectedCells
     * @argument {cell} Object Componente seleccionado
     * @description Retorna un objeto con los ids de las celdas conectadas al componente
     */
    getConnectedCells: async function (cell) {
      let connected = {
        'onPrev': [],
        'onNext': [],
        'onObserve': []
      };
      let links = await this.listLinks();
      for (let link in links) {
        let label = '';
        if (links[link]['from'] === cell.id) {
          if (links[link]['to'] !== 'EOF') {
            let tempCell = this.graph.model.getCell(links[link]['to']);
            label = tempCell.value.name;
            if (links[link]['type'] === 'enviar') {
              let nextSet = {
                'id': links[link]['to'],
                'label': label
              };
              connected.onNext.push(nextSet);
            } else if (links[link]['type'] === 'observar') {
              let observeSet = {
                'id': links[link]['to'],
                'label': label
              };
              connected.onObserve.push(observeSet);
            }
          }
        } else if (links[link]['to'] === cell.id && links[link]['type'] === 'enviar') {
          if (links[link]['from'] !== 'SOF') {
            let tempCell = this.graph.model.getCell(links[link]['from']);
            label = tempCell.value.name;
            let prevSet = {
              'id': links[link]['from'],
              'label': label
            };
            connected.onPrev.push(prevSet);
          }
        }
      }
      console.log('------------connected------------------------');
      console.log(connected);
      console.log('------------------------------------');
      return connected;
    },
    /**
     * @function listLinks
     * @description Coleccion con todas las conexiones del flujo
     */
    listLinks: function () {
      let links = {};
      let parent = this.graph.getDefaultParent();
      let childCount = this.graph.model.getChildCount(parent);
      let numLink = 0;
      for (let i = 0; i < childCount; i++) {
        let child = this.graph.model.getChildAt(parent, i);
        // console.log('--------------------------------------');
        // if (child.value) {
        //   console.log(JSON.stringify(child.value));
        // }
        // console.log('--------------------------------------');
        let currentStyle = child.style === 'observar' ? 'observar' : 'enviar';
        if (this.graph.model.isEdge(child)) {
          links['link' + numLink] = {
            from: child.source.id === 'Inicio' ? 'SOF' : child.source.id,
            to: child.target.id === 'Fin' ? 'EOF' : child.target.id,
            type: currentStyle
          };
          numLink++;
        }
      }
      console.log('-----------links-------------------------');
      console.log(links);
      console.log('------------------------------------');
      return links;
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
      // console.log('----------------data to save in cell--------------------');
      // console.log(data);
      // console.log('------------------------------------');
      clone.tipo = data.value.tipo;
      clone.name = data.value.name;
      clone.docId = data.value.docId;
      if (data.value.tipoInteroperabilidad) clone.tipoInteroperabilidad = data.value.tipoInteroperabilidad;
      if (data.type === 'formulario' || data.type === 'payment') {
        clone.groupId = data.value.groupId;
        clone.extras = data.value.extras;
        clone.permissions = data.value.permissions;
        clone.sendOption = data.value.sendOption;
        clone.acciones = data.value.acciones;
        clone.temporizador = data.value.temporizador;
        clone.configComodin = data.value.configComodin;
        clone.repeticion = data.value.repeticion;
        clone.primerDocumentoPlantilla = data.value.primerDocumentoPlantilla;
      } else {
        this.insertDoc(data);
      }
      this.graph.model.setValue(cell, clone);
      this.$store.state.cellData = {};
    },
    /**
     * @function insertDoc
     * @argument {data} Object Objecto con los valores configurados para el componente
     * @description Agrega los datos de un documento plantilla al array de documentos
     * @description y guarda el id del documento en el campo de valores del componente
     */
    insertDoc (data) {
      // console.log('--------------data to insert----------------------');
      // console.log(data);
      // console.log('------------------------------------');
      if (data.value.docId) {
        let tipo = null;
        if (data.value.tipo === NAME_FORMULARIO) {
          tipo = 'F';
        } else if (data.value.tipo === NAME_INTEROPERABILIDAD) {
          tipo = 'I';
        } else if (data.value.tipo === NAME_PAGOS) {
          tipo = 'P';
        } else if (data.value.tipo === NAME_DECISION) {
          tipo = 'D';
        }
        let exists = false;
        for (let j = 0; j < this.flowData.documents.length; j++) {
          if (this.flowData.documents[j].id === data.value.docId) {
            this.flowData.documents[j].name = data.value.name;
            this.flowData.documents[j].tipo = tipo;
            if (data.value.tipoInteroperabilidad) this.flowData.documents[j].tipoInteroperabilidad = data.value.tipoInteroperabilidad;
            exists = true;
          }
        }
        if (!exists) {
          const newDoc = {
            'id': data.value.docId,
            'name': data.value.name,
            'tipo': tipo
          };
          if (data.value.tipoInteroperabilidad) newDoc.tipoInteroperabilidad = data.value.tipoInteroperabilidad;
          this.flowData.documents.push(newDoc);
        }
      }
    },
    /*
    removeDoc (id) {
      if (id) {
        for (let j = 0; j < this.flowData.documents.length; j++) {
          if (this.flowData.documents[j].id === id) {
            this.flowData.documents.splice(j, 1);
          }
        }
      }
    },
    */
    /**
     * @function markDocForRemoval
     * @argument {cell} Object Componente seleccionado
     * @description Marca un documento con un flag de eliminar cuando se remueve su componente del editor
     */
    markDocForRemoval (cell) {
      if (cell.value && cell.value.docId) {
        for (let k = 0; k < this.flowData.documents.length; k++) {
          if (this.flowData.documents[k].id === cell.value.docId) {
            this.flowData.documents[k].eliminar = true;
          }
        }
      }
    },
    /*
    deleteMarkedTemplates: function () {
      const promises = [];
      let documents = this.flowData.documents;
      for (let k = 0; k < documents.length; k++) {
        if (documents[k].eliminar && documents[k].id) {
          promises.push(this.deleteTemplate(documents[k]));
        }
      }
      if (promises.length > 0) {
        Promise.all(promises)
        .then((res) => {
          if (res) {
            console.log('-----------delete-response----------');
            console.log(res);
            console.log('------------------------------------');
            // this.removeDoc(id);
          }
        });
      }
    },
    deleteTemplate: function (doc) {
      try {
        return new Promise((resolve, reject) => {
          const referenceId = doc.id;
          const path = 'documentos_plantilla/diagrama/' + referenceId;
          this.$service.delete(path)
          .then(response => {
            if (response) {
              console.log('-----------delete-response----------');
              console.log(response);
              console.log('------------------------------------');
              this.removeDoc(referenceId);
              resolve(referenceId);
            }
          });
        });
      } catch (err) {
        // this.$message.error(err.message);
      }
    },
    */
    /**
     * @function generarJson
     * @description Genera la estructura de datos del flujo plantilla que será almacenada en la base de datos
     */
    generarJson: async function () {
      const allComodines = [];
      // Object.keys(this.$store.state.objetoComodines).forEach((item) => {
      //   allComodines.push(...this.$store.state.objetoComodines[item]);
      // });
      let path = await this.createPath();
      // let xmlContent = await this.getFlujoXML();
      await this.getFlujoJSON();
      let estructura = this.jsonXD;
      let idDocInicial;
      // recuperando los valores de las reglas de comodin
      const allVertexComodin = JSON.parse(estructura);
      for (let vertex of allVertexComodin.vertex) {
        const values = JSON.parse(vertex.value);
        if (Array.isArray(values.configComodin) && values.configComodin.length > 0) {
          for (let item of values.configComodin) {
            allComodines.push({
              docOrigen: item.campoNormalSeleccionado.documento.id,
              docTipoOrigen: item.campoNormalSeleccionado.documento.tipoDocumentoPlantilla,
              type: item.campoNormalSeleccionado.documento.tipoDocumentoPlantilla === 'I' ? item.campoNormalSeleccionado.component.type : undefined,
              options: item.campoNormalSeleccionado.component.options,
              nameOrigen: item.campoNormalSeleccionado.component.name,
              docDestino: item.infoComodin.id,
              nameDestino: item.infoComodin.name
            });
          }
        }

        if (values.primerDocumentoPlantilla) {
          idDocInicial = values.primerDocumentoPlantilla;
        }
      }
      let flowName = this.flowData.name || '';
      let flowDescription = this.flowData.description || '';
      let flowInstitution = this.flowData.institucion || '5aaac05667adf97ed4093eb5';
      let roles = this.flowData.roles; // this.$store.state.groupsForFlow;
      let documents;
      documents = await this.removeComponents(this.flowData.documents); // this.$store.state.documentsForFlow;
      for (let k = 0; k < documents.length; k += 1) {
        if (documents[k].id === idDocInicial) {
          documents[k].template = true;
        } else {
          documents[k].template = false;
        }
      }
      let flow = {
        'titulo': flowName,
        'descripcion': flowDescription,
        'institucion': flowInstitution,
        'version': 0,
        'activo': false,
        'deleted': false,
        'permisos': [],
        'extras': [],
        'temporizador': [],
        'acciones': [],
        'pasos': [],
        'base': {
          'documentos': documents,
          'reemplazos': allComodines,
          'grupos': roles,
          'estructura': estructura
        },
        'decision': [],
        'vigencia': this.flowData.vigencia
      };
      let parent = this.graph.getDefaultParent();
      let childCount = this.graph.model.getChildCount(parent);
      let numStep = 0;
      let setAt = null;
      let notificaciones = [];
      for (let obj in path) {
        let currentCell = null;
        if (path[obj].current !== 'SOF' && path[obj].current !== 'EOF') {
          currentCell = this.graph.model.getCell(path[obj].current);
        }
        // Creation of step collections
        if (path[obj].current !== 'EOF') {
          let tipoDocPaso = 'INICIO';
          if (currentCell) {
            if (currentCell.value.tipo === NAME_INTEROPERABILIDAD) {
              tipoDocPaso = 'I';
            } else if (currentCell.value.tipo === NAME_PAGOS) {
              tipoDocPaso = 'P';
            } else if (currentCell.value.tipo === NAME_DECISION) {
              tipoDocPaso = 'D';
            } else if (currentCell.value.tipo === NAME_FORMULARIO) {
              tipoDocPaso = 'F';
            }
          }
          let paso = {
            'paso': path[obj].current,
            'tipoDocumentoPlantilla': tipoDocPaso,
            'grupoEnvio': '',
            'sig': [],
            'obs': []
          };
          for (let option in path[obj].next) {
            let filename = '';
            let grupoEnvio = '';
            let derivar = {
              'tipo': 'todos',
              'grupo': GRUPO_SISTEMA
            };
            // if (path[obj].next[option] === 'EOF' && currentCell) {
            grupoEnvio = currentCell && currentCell.value.groupId ? currentCell.value.groupId : GRUPO_SISTEMA; // '000000000000000000000555';
            // }
            if (path[obj].next[option] !== 'EOF' && path[obj].next[option] !== 'SOF') {
              let cell = this.graph.model.getCell(path[obj].next[option]);
              filename = cell.value.name;
              derivar = cell.value.sendOption ? cell.value.sendOption : derivar;
              // grupoEnvio = cell.value.groupId ? cell.value.groupId : '000000000000000000000555'; // Grupo sistema
              // if (currentCell) {
              //   let keyDerivar = path[obj].next[option];
              //   if (currentCell.value && currentCell.value.sendOption) {
              //     for (let m = 0; m < currentCell.value.sendOption.length; m++) {
              //       if (currentCell.value.sendOption[m].goTo === keyDerivar) {
              //         derivar = currentCell.value.sendOption[m].mode;
              //       }
              //     }
              //   }
              // }
            }
            let siguiente = {
              'paso': path[obj].next[option],
              'derivar': derivar,
              'documento_titulo': path[obj].next[option] === 'EOF' ? path[obj].next[option] : filename
            };
            paso.grupoEnvio = grupoEnvio;
            paso.sig.push(siguiente);
          }
          for (let option in path[obj].observe) {
            let filename = '';
            if (path[obj].observe[option] !== 'EOF' && path[obj].observe[option] !== 'SOF') {
              let cell = this.graph.model.getCell(path[obj].observe[option]);
              filename = cell.value.name;
            }
            let pasoObservado = {
              'paso': path[obj].observe[option],
              'documento_titulo': filename
            };
            paso.obs.push(pasoObservado);
          }
          flow.pasos.push(paso);
        }
        if (path[obj].current !== 'SOF' && path[obj].current !== 'EOF') {
          // creation of permissions collections
          var permiso = {
            'paso': path[obj].current,
            'permisos': []
          };
          if (currentCell) {
            if (currentCell.value.permissions) {
              let permisosArray = currentCell.value.permissions;
              // let toAddPermissions = [];
              for (let permit in permisosArray) {
                let readPermit = permisosArray[permit].read === 1 ? 1 : 0;
                let writePermit = permisosArray[permit].write === 1 ? 1 : 0;
                let denyPermit = permisosArray[permit].deny === 1 ? 1 : 0;
                let cellPermissions = {
                  'documentoPlantilla': permisosArray[permit].doc,
                  'tituloDocumentoPlantilla': permisosArray[permit].docTitle,
                  'tipoDocumentoPlantilla': permisosArray[permit].docType,
                  'grupo': permisosArray[permit].role,
                  'permiso': '' + readPermit + writePermit + denyPermit
                };
                // if (permisosArray[permit].primario) {
                //   cellPermissions.primario = true;
                // }
                // if (permisosArray[permit].principal) {
                //   cellPermissions.principal = true;
                // }
                cellPermissions.principal = permisosArray[permit].principal ? true : false;
                permiso.permisos.push(cellPermissions);
              }
            } else {
              let siglaTipo = null;
              if (currentCell.value.tipo === NAME_INTEROPERABILIDAD) {
                siglaTipo = 'I';
              } else if (currentCell.value.tipo === NAME_PAGOS) {
                siglaTipo = 'P';
              } else if (currentCell.value.tipo === NAME_DECISION) {
                siglaTipo = 'D';
              }
              let cellPermissions = {
                'documentoPlantilla': currentCell.value.docId,
                'tituloDocumentoPlantilla': currentCell.value.name,
                'tipoDocumentoPlantilla': siglaTipo,
                'grupo': currentCell && currentCell.value.groupId ? currentCell.value.groupId : GRUPO_SISTEMA,
                'permiso': '111',
                'principal': true
              };
              permiso.permisos.push(cellPermissions);
            }
            flow.permisos.push(permiso);
          }
          // creation of extras collections
          if (currentCell && currentCell.value.extras && currentCell.value.extras.length > 0) {
            let extrasArray = currentCell.value.extras;
            let extraPermissions = [];
            for (let set in extrasArray) {
              let read = extrasArray[set].readPermission === 1 ? 1 : 0;
              let write = extrasArray[set].writePermission === 1 ? 1 : 0;
              let deny = extrasArray[set].denyPermission === 1 ? 1 : 0;
              let addExtra = {
                'documentoPlantilla': extrasArray[set].doc,
                'tituloDocumentoPlantilla': extrasArray[set].docTitle,
                'tipoDocumentoPlantilla': extrasArray[set].docType,
                'grupo': extrasArray[set].role,
                'permiso': '' + read + write + deny
              };
              extraPermissions.push(addExtra);
            }
            let extra = {
              'paso': path[obj].current,
              'permisos': extraPermissions
            };
            flow.extras.push(extra);
          }
        }
        if (currentCell && currentCell.value) {
          // creation of acciones collections
          let actions = [];
          let accionInicio = {
            'nombre': 'inicio',
            'inicio': {
              'siguiente': 'derivar'
            }
          };
          let accionDerivar = {
            'nombre': 'derivar',
            'derivar': {
              'siguiente': 'fin'
            }
          };
          let tieneFirmar = false;
          let tieneNotificar = false;
          if (currentCell.value.tipo !== NAME_DECISION) {
            if (currentCell.value.acciones && currentCell.value.acciones.length > 0) {
              for (let i = 0; i < currentCell.value.acciones.length; i++) {
                let row = currentCell.value.acciones[i];
                if (row.hasOwnProperty('firmar')) {
                  tieneFirmar = true;
                } else if (row.hasOwnProperty('notificar')) {
                  const objNotificar = Object.assign({}, JSON.parse(JSON.stringify(row.notificar)));
                  objNotificar.paso = path[obj].current;
                  notificaciones.push(objNotificar);
                  // tieneNotificar = true;
                }
              }
              if (tieneFirmar) {
                accionInicio.inicio.siguiente = 'firmar';
              }
              /* else if (tieneNotificar) {
                accionInicio.inicio.siguiente = 'notificar';
              } */
              actions.push(accionInicio);
              for (let i = 0; i < currentCell.value.acciones.length; i++) {
                let row = currentCell.value.acciones[i];
                if (row.hasOwnProperty('firmar')) {
                  row.nombre = 'firmar';
                  // row.firmar.siguiente = tieneNotificar ? 'notificar' : 'derivar';
                  row.firmar.siguiente = 'derivar';
                }
                /* else if (row.hasOwnProperty('notificar')) {
                  row.nombre = 'notificar';
                  row.notificar.siguiente = 'derivar';
                } */
                actions.push(row);
              }
            } else {
              actions.push(accionInicio);
            }
          }
          if (currentCell.value.tipo === NAME_INTEROPERABILIDAD && currentCell.value.tipoInteroperabilidad === 'A') {
            actions.push({
              'nombre': 'derivar',
              'derivar': {
                'siguiente': 'recepcionar'
              }
            });
            actions.push({
              'nombre': 'recepcionar',
              'recepcionar': {
                'siguiente': 'fin'
              }
            });
          } else if (currentCell.value.tipo === NAME_PAGOS) {
            actions.push({
              'nombre': 'derivar',
              'derivar': {
                'siguiente': 'fin'
              }
            });
          } else {
            actions.push(accionDerivar);
          }
          let cellActions = {
            'paso': currentCell.id,
            'accion': actions // currentCell.value.acciones
          };
          flow.acciones.push(cellActions);
          // creation of temporizador collections
          if (currentCell.value.temporizador && currentCell.value.temporizador.length > 0) {
            let temporizadorObj = currentCell.value.temporizador;
            let cellTemp = {
              'paso': currentCell.id,
              'tiempo': temporizadorObj[0].dias + 'd ' + temporizadorObj[0].horas + 'h'
            };
            flow.temporizador.push(cellTemp);
          }
        }
        /* Decision (moved to a separate document)
        if (path[obj].next.length > 1) {
          // Creation of decision collections
          var decision = {
            'paso': path[obj].current,
            'sig': [],
            'default': ''
          };
          for(var option in path[obj].next){
            var filename = '';
            if(path[obj].next[option]!='EOF'&&path[obj].next[option]!='SOF'){
              var cell = graph.model.getCell(path[obj].next[option]);
              filename = cell.value.name;
            }
            var alternativa = {
              'documento': filename,
              'propiedad': '',
              'valor_esperado': '',
              'operador': '',
              'irPaso': path[obj].next[option],
            }
            decision.sig.push(alternativa);
          }
          flow.decision.push(decision);
        }
        */
      }
      flow.notificaciones = [];
      flow.notificaciones = notificaciones;
      console.log('----------json-of-flow--------------');
      console.log(flow);
      console.log('------------------------------------');
      return flow;
    },
    /*
    validarSolicitante (flow) {
      let valid = false;
      if (flow) {
        if (flow.pasos && flow.pasos.length > 0) {
          flow.pasos.forEach(paso => {
            if (paso.hasOwnProperty('grupoEnvio')) {
              if (paso.grupoEnvio === '000000000000000000000111') {
                valid = true;
              }
            }
          });
        }
      }
      return valid;
    },
    */
    /**
     * @function validarFlujo
     * @argument {flow} Object Objecto con la estructura del flujo graficado
     * @description Valida el contenido y configuración del flujo a ser guardado
     */
    validarFlujo (flow) {
      let validacionFLujo = {
        'estado': false,
        'mensaje': 'Error desconocido'
      };
      let usaSolicitante = false;
      let tieneInicio = false;
      let tieneFin = false;
      let pendienteConfig = false;
      if (flow === undefined) {
        validacionFLujo.mensaje = 'El flujo contiene uno o mas errores';
      } else if (!flow || !flow.hasOwnProperty('pasos') || flow.pasos.length === 0) {
        validacionFLujo.mensaje = 'Debe crear un flujo para poder usar esta función';
      } else {
        flow.pasos.forEach(opt => {
          if (opt.hasOwnProperty('grupoEnvio') && opt.grupoEnvio === GRUPO_SOLICITANTE) {
            usaSolicitante = true;
          }
          if (opt.hasOwnProperty('paso') && opt.paso === 'SOF') {
            tieneInicio = true;
          }
          if (opt.hasOwnProperty('sig') && opt.sig.length > 0) {
            opt.sig.forEach(subOpt => {
              if (subOpt.paso === 'EOF') {
                tieneFin = true;
              }
            });
          }
        });
        flow.permisos.forEach(elem => {
          elem.permisos.forEach(el => {
            if (!el.documentoPlantilla || el.documentoPlantilla === null || !el.tituloDocumentoPlantilla || el.tituloDocumentoPlantilla === null) {
              pendienteConfig = true;
            }
          });
        });
        if (!tieneInicio) {
          validacionFLujo.mensaje = 'El flujo debe tener un punto de Inicio';
        } else if (!tieneFin) {
          validacionFLujo.mensaje = 'El flujo debe tener un punto de Fin';
        } else if (pendienteConfig) {
          validacionFLujo.mensaje = 'Uno o mas pasos del flujo no han sido configurados';
        } else if (!usaSolicitante) {
          validacionFLujo.mensaje = 'Uno o mas pasos del flujo deben ser asignados a un solicitante';
        } else {
          validacionFLujo.estado = true;
          validacionFLujo.mensaje = 'El flujo es válido';
        }
      }
      return validacionFLujo;
    },
    /**
     * @function createPath
     * @description Retorna un objeto con la secuencia de pasos del flujo
     */
    createPath () {
      let links = this.listLinks();
      let path = {};
      for (let link in links) {
        if (!path.hasOwnProperty(links[link]['from'])) {
          path[links[link]['from']] = {
            current: links[link]['from'],
            prev: [],
            next: [],
            observe: []
          };
        }
        if (!path.hasOwnProperty(links[link]['to'])) {
          path[links[link]['to']] = {
            current: links[link]['to'],
            prev: [],
            next: [],
            observe: []
          };
        }
        if (links[link]['type'] === 'enviar') {
          path[links[link]['from']].next.push(links[link]['to']);
          path[links[link]['to']].prev.push(links[link]['from']); // Fuera de condición agrega ids de observar
        } else if (links[link]['type'] === 'observar') {
          path[links[link]['from']].observe.push(links[link]['to']);
        }
      }
      console.log('------------path------------------------');
      console.log(path);
      console.log('------------------------------------');
      return path;
    },
    /**
     * @function saveFlow
     * @description Guarda el flujo sin validaciones
    */
    saveFlow: function () {
      let messageAtPrompt = this.flowData.id ? '¿Esta seguro de que desea guardar los cambios realizados en este flujo?' : '¿Esta seguro de que desea guardar este flujo?';
      this.$confirm(messageAtPrompt, async () => {
        let flow = await this.generarJson();
        flow.pasos.forEach(item => {
          if (item.grupoEnvio === '') {
            item.grupoEnvio = null;
          }
        });
        const path = 'flujos_plantilla/';
        if (this.flowData.id) {
          this.$service.put(`${path}/${this.flowData.id}?validar=false`, flow)
          .then((res) => {
            if (res) {
              this.$message.success('El flujo ha sido actualizado');
              this.$router.push('lista_flujos');
            }
          })
          .catch((err) => this.$message.error(err.message));
        } else {
          this.$service.post(`${path}?validar=false`, flow)
          .then((res) => {
            if (res) {
              this.$message.success('El flujo ha sido guardado');
              this.$router.push('lista_flujos');
            }
          })
          .catch((err) => this.$message.error(err.message));
        }
      });
    },
    /**
     * @function storeFlow
     * @description Guarda el flujo graficado en la base de datos
     */
    storeFlow: function () {
      let messageAtPrompt = this.flowData.id ? '¿Esta seguro de que desea guardar los cambios realizados en este flujo?' : '¿Esta seguro de que desea guardar este flujo?';
      this.$confirm(messageAtPrompt, async () => {
        // await this.deleteMarkedTemplates();
        let flow = await this.generarJson();
        let respuestaValidacion = this.validarFlujo(flow);
        // console.log('------------resp val----------------');
        // console.log(respuestaValidacion);
        // console.log('------------------------------------');
        if (respuestaValidacion.estado === false) {
          this.$message.error(respuestaValidacion.mensaje);
        } else {
          const path = 'flujos_plantilla/';
          if (this.flowData.id) {
            this.$service.put(`${path}/${this.flowData.id}`, flow)
            .then((res) => {
              if (res) {
                if (this.flowData && this.flowData.documents) {
                  console.log('--------------se han enviado documentos a publicar----------------------');
                  console.log(this.flowData.documents);
                  console.log('------------------------------------');
                  return this.publishDocs(this.flowData.documents);
                }
              }
            })
            .then(res => {
              var url = path + this.flowData.id + '/publicar';
              return this.$service.put(url);
            })
            .then(response => {
              if (response) {
                this.$message.success('El flujo ha sido actualizado y publicado correctamente.');
                this.$router.push('lista_flujos');
              }
            })
            .catch((err) => this.$message.error(err.message));
          } else { // deprecated
            this.$service.post(`${path}`, flow)
            .then((res) => {
              if (res) {
                if (res.base && res.base.documentos) {
                  console.log('--------------se han enviado documentos a publicar----------------------');
                  console.log(res.base.documentos);
                  console.log('------------------------------------');
                  this.publishDocs(res.base.documentos);
                }
                this.$message.success('El flujo ha sido guardado');
                this.$router.push('lista_flujos');
              }
            })
            .catch((err) => this.$message.error(err.message));
          }
        }
        //   if (this.validarSolicitante(flow)) {
        //   } else {
        //     this.$message.info('Uno o mas pasos del flujo deben ser asignados a un solicitante');
        //   }
      });
    },
    /**
     * @function getDocComponents
     * @description Prepara una promesa para recuperar los componentes de los documentos seleccionados para el flujo
     */
    getDocComponents () {
      const promises = [];
      let documents = this.prevUsedDocuments.length > 0 ? this.prevUsedDocuments.slice() : this.validDocuments.slice(); // this.flowData.documents;
      for (let option in documents) {
        promises.push(this.getComponents(documents[option]));
      }
      if (promises.length > 0) {
        Promise.all(promises)
        .then((res) => {
          if (res) {
            if (res.length === documents.length) {
              for (let j = 0; j < documents.length; j++) {
                documents[j].componentes = res[j];
              }
            }
          }
        });
      }
      this.docsWithComponents = documents;
    },
    /**
     * @function getComponents
     * @argument {docArray} Array Array con los documentos seleccionados
     * @description Recupera los componentes de cada documento dentro del array
     */
    getComponents: function (docArray) {
      try {
        return new Promise((resolve, reject) => {
          let url = 'documentos_plantilla/' + docArray.id;
          let componentes = [];
          this.$service.get(url)
          .then((res) => {
            if (res) {
              if (res.tipo === 'F') {
                if (res.body && res.body.componentes && res.body.componentes.length > 0) {
                  componentes = res.body.componentes;
                }
              } else if (res.tipo === 'I') {
                if (res.body && res.body.envio && res.body.envio.respuesta && res.body.envio.respuesta.length > 0) {
                  componentes['envio'] = res.body.envio.respuesta;
                }
                if (res.body && res.body.retorno && res.body.retorno.esquema && res.body.retorno.esquema.length > 0) {
                  componentes['retorno'] = res.body.retorno.esquema;
                }
              }
            }
            resolve(componentes);
          }).catch((err) => this.$message.error(err.message));
        });
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    /**
     * @function removeComponents
     * @argument {docArray} Array Array con los documentos seleccionados
     * @description Remueve la coleccion de componentes de cada Documento
     */
    removeComponents (docArray) {
      for (let document in docArray) {
        if (docArray[document].hasOwnProperty('componentes')) {
          delete docArray[document].componentes;
        }
      }
      return docArray;
    },
    /**
     * @function publishDocs
     * @argument {docs} Array Array con lo documentos seleccionados
     * @description Prepara una promse con los documentos seleccionados
     */
    publishDocs (docs) {
      const promises = [];
      for (let option in docs) {
        if (docs[option].id && !docs[option].eliminar) {
          promises.push(this.publicarDocumentoPlantilla(docs[option]));
        }
      }
      if (promises.length > 0) {
        Promise.all(promises)
        .then((res) => {
          console.log('----resolved docs-------------------');
          console.log(res);
          console.log('------------------------------------');
        }, (err) => {
          console.log('-----rejected docs------------------');
          console.log(err);
          console.log('------------------------------------');
        });
      }
    },
    /**
     * @function publicarDocumentoPlantilla
     * @argument {doc} Object
     * @description Marca el documento indicado como publicado
     */
    publicarDocumentoPlantilla: function (doc) {
      try {
        return new Promise((resolve, reject) => {
          let url = 'documentos_plantilla/' + doc.id + '/publicar_con_flujo';
          this.$service.put(url)
          .then((res) => {
            if (res) {
              resolve(res);
            } else {
              reject(Error(res));
            }
          });
        });
      } catch (err) {
        // console.log(err.message, doc.id);
        // this.$message.error(err.message);
      }
    },
    /**
     * @function exportFlow
     * @description Exporta la estructura del flujo graficado sin valores a un archivo JSON
     */
    exportFlow: async function () {
      const filename = this.flowData.name ? this.flowData.name.replace(' ', '_') : 'Flujo';
      await this.getFlujoJSON();
      let estructura = this.jsonXD;
      estructura = JSON.parse(estructura);
      for (let i = 0; i < estructura.vertex.length; i++) {
        estructura.vertex[i].value = JSON.parse(estructura.vertex[i].value);
        let valor = {
          'tipo': estructura.vertex[i].value.tipo,
          'name': estructura.vertex[i].value.name
        };
        estructura.vertex[i].value = JSON.stringify(valor);
        // delete estructura.vertex[i].value;
      }
      // mxUtils.popup(JSON.stringify(estructura), false);
      let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(estructura));
      let downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', filename + '.json');
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },
    /**
     * @function chooseFile
     * @description Seleccion de un archivo para importacion
     */
    chooseFile () {
      document.getElementById('myfile').click();
    },
    /**
     * @function importFlow
     * @description Carga una estructura de flujo al editor desde un archivo JSON
     */
    importFlow: async function () {
      // const path = 'file:///home/nromero/Downloads/Test_179.json';
      /*
      fetch(path)
        .then(response => response.json())
        .then(json => console.log(json));
      */
      let scope = this;
      let file = document.getElementById('myfile').files[0];
      if (file.type === 'application/json') {
        let messageAtPrompt = '¿Esta seguro de que desea importar el archivo seleccionado? Los cambios realizamos en la pantalla actual serán reemplazados';
        this.$confirm(messageAtPrompt, async () => {
          await this.readFileSelected(file, scope);
        });
      } else {
        this.$message.error('Debe seleccionar un archivo tipo json');
      }
    },
    /**
     * @function readFileSelected
     * @argument {file} File Archivo seleccionado del equipo local
     * @argument {scope} Scope
     * @description Lee una estructura de flujo desde un archivo JSON
     */
    readFileSelected (file, scope) {
      // console.log('-----------file-------------------------');
      // console.log(file);
      // console.log('------------------------------------');
      let reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = function (evt) {
        console.log('----------------file contents--------------------');
        console.log(JSON.parse(evt.target.result));
        console.log('------------------------------------');
        // scope.flowData.estructura = evt.target.result;
        // scope.startWithGraph();
        scope.graph.removeCells(scope.graph.getChildVertices(scope.graph.getDefaultParent()));
        scope.jsonXD = evt.target.result;
        scope.setFlujoJSON();
      };
    },
    /**
     * @function abrirFlujoConfig
     * @description Abre un modal de configuración del flujo
     */
    abrirFlujoConfig () {
      this.$refs.cmpFlujoModal.abrirConfiguracion();
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
        this.flowData.vigencia = data.vigencia;
        this.flowData.generalRoles = data.generalRoles || []; // Roles generales de la institución seleccionada
      }
      // console.log('-----new flowData in graph----------');
      // console.log(this.flowData);
      // console.log('------------------------------------');
    },
    // showModalWindow (graph, title, content, width, height) {
    //   var x = Math.max(0, document.body.scrollWidth / 2 - width / 2);
    //   var y = Math.max(10, (document.body.scrollHeight || document.documentElement.scrollHeight) / 2 - height * 2 / 3);
    //   this.wnd = new mxWindow(title, content, 0, 0, width, height, false, true);
    //   this.wnd.closeImg.src = '../../../../static/images/close.gif';
    //   this.wnd.maximize.src = '../../../../static/images/maximize.gif';
    //   this.wnd.minimize.src = '../../../../static/images/minimize.gif';
    //   this.wnd.setLocation = function (x, y) {
    //     x = 0;
    //     y = 0;
    //     mxWindow.prototype.setLocation.apply(this, arguments);
    //   };
    //   this.wnd.setScrollable(true);
    //   this.wnd.setClosable(true);
    //   // Fades the background out after the window has been closed
    //   this.wnd.setVisible(true);
    //   console.log('-------------wnd-----------------------');
    //   console.log(this.wnd);
    //   console.log('------------------------------------');
    //   return this.wnd;
    // }
    /**
     * @function translateGroup
     * @argument {id} String Id del grupo del que se requiere el nombre
     * @description Retorna el nombre del grupo solicitado mediante su Id
     */
    translateGroup (id) {
      let groupName = '';
      for (let i in this.flowData.roles) {
        if (this.flowData.roles[i].id === id) {
          groupName = this.flowData.roles[i].role;
        }
      }
      return groupName;
    },
    /**
     * @function translateDoc
     * @argument {id} String Id del documento del que se requiere el nombre
     * @description Retorna el nombre del documento solicitado mediante su Id
     */
    translateDoc (id) {
      let docName = '';
      for (let i in this.flowData.documents) {
        if (this.flowData.documents[i].id === id) {
          docName = this.flowData.documents[i].name;
        }
      }
      return docName;
    }
  }
};
</script>

<style lang="scss">
.mxCellEditor, .mxPopupMenu {
  position: absolute;
}
.mxgraph {
  background: url(../../../../static/images/wires-grid.gif);
}
.mxgraph .mxContainer, .mxgraph .graphContainer {
  width: 100%;
  height: 100%;
}
.iconosFormulario {
  position: absolute;
  right: 0;
  margin-top: -5px;
  z-index: 2;
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
    position: relative !important;
  }
  .infoContainer{
    z-index: 1;
    position: absolute;
    overflow: hidden;
    bottom: 220px;
    left: 0px;
    // width: 350px;
    // height: 220px;
    opacity: 50%;
    // background: transparent;
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
</style>
