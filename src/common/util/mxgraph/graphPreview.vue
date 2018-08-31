<template>
  <v-dialog v-model="mostrarConfiguracion" height="640px" width="1200px" persistent scrollable>
    <v-card class="dialog-token">
        <v-card-title class="headline">
            <div>
                <div>
                    <!--
                    <v-btn icon @click.stop="startWithGraph()" title="Volver a cargar flujo">
                        <v-icon>autorenew</v-icon>
                    </v-btn>
                    -->
                    Flujo
                </div>
                <span class="grey--text" v-if="flowData.titulo">{{ flowData.titulo }}</span>
            </div>
            <v-btn icon @click.native="cerrarConfiguracion()" title="Cerrar ventana">
                <v-icon>close</v-icon>
            </v-btn>
        </v-card-title>
        <div id="graphPreview" class="mxgraph">
            <v-layout>
                <v-flex xs12 class="btn-container">
                    <v-card
                        height="640px"
                        flat
                    >
                        <div class="mxContainer">
                            <div id="graphContainer" class="graphContainer"></div>
                        </div>
                    </v-card>
                </v-flex>
            </v-layout>
        </div>
    </v-card>
  </v-dialog>
</template>
<script>
/* eslint no-unused-vars:0 */
/* eslint no-new:0 */
/* eslint new-cap:0 */
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
mxUtils,
mxCodec,
mxEvent,
mxBasePath,
mxGraph,
mxClient,
mxGraphModel,
mxEventObject,
mxGraphLayout } from 'mxgraph-js';
const NAME_INICIO = 'inicio';
const NAME_FORMULARIO = 'formulario';
const NAME_INTEROPERABILIDAD = 'interoperabilidad';
const NAME_PAGOS = 'pagos';
const NAME_DECISION = 'decision';
const NAME_FIN = 'fin';

export default {
  props: {
    widthModal: {
      type: Number,
      default: 640
    },
    flowData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    flowData: function () {
      this.startWithGraph();
    }
  },
  mounted: function () {
    const container = document.getElementById('graphContainer');

    // Config MXGraph
    mxEvent.disableContextMenu(container);
    this.graph = new mxGraph(container);
    this.configGraph();
    this.configStyleBox(this.graph);
    this.configStyleEdge(this.graph);
    // Para mostrar los labels
    this.graph.convertValueToString = function (cell) {
      if (cell.value) {
        if (cell.value.name) {
          return cell.value.name;
        }
      }
      return '';
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

    this.startWithGraph();
  },
  data () {
    return {
      graph: {},
      jsonXD: {},
      institucion: this.$storage.get('user').institucion,
      docsWithComponents: [],
      mostrarConfiguracion: false
    };
  },
  methods: {
    startWithGraph () {
      // Eliminar componentes existentes
      this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()));
      if (this.flowData && this.flowData.estructura) {
        console.log('------------------------------------');
        console.log('A flow was found');
        // console.log(this.flowData.estructura);
        console.log('------------------------------------');
        this.jsonXD = this.flowData.estructura;
        this.setFlujoJSON();
      } else {
        console.log('------------------------------------');
        console.log('No flow was found');
        console.log('------------------------------------');
      }
    },
    configGraph () {
      const outline = document.getElementById('outlineContainer');
      this.graph.setCellsSelectable(false);
      this.graph.setCellsMovable(false);
      this.gridSize = 30;
      this.graph.setCellsResizable(false);
      // Habilitar tootipos, para nuevas conecciones
      this.graph.setPanning(false);
      this.graph.setTooltips(false);
      this.graph.setConnectable(false);
      this.graph.setCellsDisconnectable(false);
      this.graph.setAllowDanglingEdges(false);
    },
    configStyleBox (graph) {
      let style = graph.getStylesheet().getDefaultVertexStyle();
      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
      style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'none';
      style[mxConstants.STYLE_FONTSIZE] = 11;
      style[mxConstants.STYLE_FONTCOLOR] = 'black';
      style[mxConstants.STYLE_STROKECOLOR] = '#CCC';
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
    configStyleEdge (graph) {
      let style = this.graph.getStylesheet().getDefaultEdgeStyle();
      style[mxConstants.STYLE_ROUNDED] = true;
      style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
      style[mxConstants.STYLE_STROKECOLOR] = '#006fba';
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
    createItem (graph, tipo, x, y, prevId) {
      const setId = prevId ? prevId : null;
      const scope = this;
      const parent = graph.getDefaultParent();
      const model = graph.getModel();
      let v1 = {};

      model.beginUpdate();
      try {
        if (['formulario', 'interoperabilidad', 'pagos'].indexOf(tipo) >= 0) {
          const vstyle = `editable=0;proceso;${tipo}`;
          v1 = graph.insertVertex(parent, setId, tipo, x, y, 120, 40, vstyle);
          if (tipo === 'formulario') {
            const vinit = {
              tipo: NAME_FORMULARIO,
              name: 'formulario'
            };
            v1.setValue(vinit);
            const overlay = new mxCellOverlay(
              new mxImage('./static/icons/ic_folder_24px.svg', 24, 24));
            graph.addCellOverlay(v1, overlay);
          } else if (tipo === 'interoperabilidad') {
            const vinit = {
              tipo: NAME_INTEROPERABILIDAD,
              name: 'interoperabilidad'
            };
            v1.setValue(vinit);
            const overlay = new mxCellOverlay(
              new mxImage('./static/icons/ic_cloud_upload_24px.svg', 24, 24));
            graph.addCellOverlay(v1, overlay);
          } else if (tipo === 'pagos') {
            const vinit = {
              tipo: NAME_PAGOS,
              name: 'pagos'
            };
            v1.setValue(vinit);
            const overlay = new mxCellOverlay(
              new mxImage('./static/icons/ic_monetization_on_24px.svg', 24, 24));
            graph.addCellOverlay(v1, overlay);
          }
        }
        if (tipo === 'decision') {
          const vstyle = `editable=0;base;shape=rhombus;${tipo}`;
          v1 = graph.insertVertex(parent, setId, tipo, x, y, 80, 80, vstyle);
          const vinit = {
            tipo: NAME_DECISION,
            name: 'decision'
          };
          v1.setValue(vinit);
          const overlay = new mxCellOverlay(
            new mxImage('./static/icons/ic_call_split_24px.svg', 24, 24),
            'Overlay tooltip fsadfasdf', mxConstants.ALIGN_RIGHT, mxConstants.ALIGN_BOTTOM, new mxPoint(-10, -10));
          graph.addCellOverlay(v1, overlay);
        }
        if (tipo === 'inicio') {
          v1 = graph.insertVertex(parent, 'Inicio', {tipo: NAME_INICIO, name: 'inicio'}, x, y, 40, 40, 'editable=0;base;shape=ellipse;inicio');
        }
        if (tipo === 'fin') {
          v1 = graph.insertVertex(parent, 'Fin', {tipo: NAME_FIN, name: 'fin'}, x, y, 40, 40, 'editable=0;base;shape=doubleEllipse;fin');
        }
      } finally {
        model.endUpdate();
      }
      return v1;
    },
    getCellTipo (cell) {
      if (cell.style) {
        return cell.style.split(';').pop(-1);
      } else {
        return '';
      }
    },
    setFlujoJSON () {
      // console.log(this.jsonXD);
      const scope = this;
      const graph = this.graph;
      const model = graph.getModel();
      const parent = graph.getDefaultParent();
      const jsx = JSON.parse(this.jsonXD);
      console.log('-------------jsx-----------------------');
      console.log(jsx);
      console.log('------------------------------------');
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
    abrirConfiguracion () {
      this.mostrarConfiguracion = true;
    },
    cerrarConfiguracion () {
      this.mostrarConfiguracion = false;
    }
  }
};
</script>

<style lang="scss">
.mxgraph {
  background: url(../../../../static/images/wires-grid.gif);
}
.mxgraph .mxContainer, .mxgraph .graphContainer {
  width: 100%;
  height: 100%;
}
.mxgraph {
  .mxContainer{
    position: relative;
  }
  .graphContainer{
    background-color: rgba(255, 255, 255, 0.7);
    overflow: scroll;
    cursor: default;
  }
}
</style>
