<template>
  <div id="mxgraph" class="mxgraph">

    <v-layout>

      <v-flex xs12 class="btn-container">

        <div class="verFormulario">
          <v-tooltip bottom>
            <v-btn icon dark fab top right color="cyan darken-4" slot="activator" @click.stop="generarJson" v-show="true">
              <v-icon>code</v-icon>
            </v-btn>
            <span>Codigo Javascript</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn icon dark fab top right color="info darknet-3" slot="activator" @click.native="irDocumentosPlantilla" v-show="true">
              <v-icon>subdirectory_arrow_left</v-icon>
            </v-btn>
            <span>Volver</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn icon dark fab top right color="green darknet-3" slot="activator" @click.stop="storeFlow">
              <v-icon>save</v-icon>
            </v-btn>
            <span>Guardar Flujo</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-btn icon dark fab top right color="info" slot="activator" @click.stop="vistaPreviaFormulario" v-show="false">
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
            <v-btn icon @click.stop="getFlujoXML(graph, './static/fileio.xml')" title="Ver XML">
              <v-icon>folder</v-icon>
            </v-btn>
            <v-btn icon @click.stop="parse(graph, '')" title="Ver XML">
              <v-icon>people</v-icon>
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

        </v-card>
        <v-card
          height="800px"
          color="transparent"
          flat
          >
          <div class="mxContainer">
            <div id="outlineContainer" class="outlineContainer"></div>
            <div id="graphContainer" class="graphContainer"></div>
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
/* eslint no-undef:0 */

const NAME_INICIO = 'inicio';
const NAME_FORMULARIO = 'formulario';
const NAME_INTEROPERABILIDAD = 'interoperabilidad';
const NAME_PAGOS = 'pagos';
const NAME_DECISION = 'decision';
const NAME_FIN = 'fin';

import {
mxLog,
mxObjectIdentity,
mxDictionary,
mxResources,
mxPoint,
mxRectangle,
mxEffects,
mxUtils,
mxConstants,
mxEventObject,
mxMouseEvent,
mxEventSource,
mxEvent,
mxXmlRequest,
mxClipboard,
mxWindow,
mxForm,
mxImage,
mxDivResizer,
mxDragSource,
mxToolbar,
mxUndoableEdit,
mxUndoManager,
mxUrlConverter,
mxPanningManager,
mxPopupMenu,
mxAutoSaveManager,
mxAnimation,
mxMorphing,
mxImageBundle,
mxImageExport,
mxAbstractCanvas2D,
mxXmlCanvas2D,
mxSvgCanvas2D,
mxVmlCanvas2D,
mxGuide,
mxStencil,
mxShape,
mxStencilRegistry,
mxMarker,
mxActor,
mxCloud,
mxRectangleShape,
mxEllipse,
mxDoubleEllipse,
mxRhombus,
mxPolyline,
mxArrow,
mxArrowConnector,
mxText,
mxTriangle,
mxHexagon,
mxLine,
mxImageShape,
mxLabel,
mxCylinder,
mxConnector,
mxSwimlane,
mxGraphLayout,
mxStackLayout,
mxPartitionLayout,
mxCompactTreeLayout,
mxRadialTreeLayout,
mxFastOrganicLayout,
mxCircleLayout,
mxParallelEdgeLayout,
mxCompositeLayout,
mxEdgeLabelLayout,
mxGraphAbstractHierarchyCell,
mxGraphHierarchyNode,
mxGraphHierarchyEdge,
mxGraphHierarchyModel,
mxSwimlaneModel,
mxHierarchicalLayoutStage,
mxMedianHybridCrossingReduction,
mxMinimumCycleRemover,
mxCoordinateAssignment,
mxSwimlaneOrdering,
mxHierarchicalLayout,
mxSwimlaneLayout,
mxGraphModel,
mxCell,
mxGeometry,
mxCellPath,
mxPerimeter,
mxPrintPreview,
mxStylesheet,
mxCellState,
mxGraphSelectionModel,
mxCellEditor,
mxCellRenderer,
mxEdgeStyle,
mxStyleRegistry,
mxGraphView,
mxGraph,
mxCellOverlay,
mxOutline,
mxMultiplicity,
mxLayoutManager,
mxSwimlaneManager,
mxTemporaryCellStates,
mxCellStatePreview,
mxConnectionConstraint,
mxGraphHandler,
mxPanningHandler,
mxPopupMenuHandler,
mxCellMarker,
mxSelectionCellsHandler,
mxConnectionHandler,
mxConstraintHandler,
mxRubberband,
mxHandle,
mxVertexHandler,
mxEdgeHandler,
mxElbowEdgeHandler,
mxEdgeSegmentHandler,
mxKeyHandler,
mxTooltipHandler,
mxCellTracker,
mxCellHighlight,
mxDefaultKeyHandler,
mxDefaultPopupMenu,
mxDefaultToolbar,
mxEditor,
mxCodecRegistry,
mxCodec,
mxObjectCodec,
mxCellCodec,
mxModelCodec,
mxRootChangeCodec,
mxChildChangeCodec,
mxTerminalChangeCodec,
mxGenericChangeCodec,
mxGraphCodec,
mxGraphViewCodec,
mxStylesheetCodec,
mxDefaultKeyHandlerCodec,
mxDefaultToolbarCodec,
mxDefaultPopupMenuCodec,
mxEditorCodec,
mxClient
} from 'mxgraph-js';

var mxBasePath = './static/mxgraph/src';
mxClient.basePath = './static/mxgraph/src';

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
  mounted: function () {
    const container = document.getElementById('graphContainer');
    this.graph = new mxGraph(container);
    new mxRubberband(this.graph);
    var parent = this.graph.getDefaultParent();
    this.graph.getModel().beginUpdate();
    try {
      var v1 = this.graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30, 'xd');
      var v2 = this.graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
      var e1 = this.graph.insertEdge(parent, null, '', v1, v2);
    } finally {
      this.graph.getModel().endUpdate();
    }
  },
  methods: {
    getFlujoXML (graph, filename) {
      console.log(graph);
      var req = mxUtils.load(filename);
      var root = req.getDocumentElement();
      var dec = new mxCodec(root.ownerDocument);
      dec.decode(root, graph.getModel());
    },
    getDemo (graph) {
      var xml = '<root><mxCell id="2" value="World!Vishal" vertex="1"><mxGeometry x="200" y="150" width="80" height="30" as="geometry"/></mxCell><mxCell id="3" edge="1" source="2"><mxGeometry relative="1" as="geometry"><mxPoint x="440" y="90" as="targetPoint"/></mxGeometry></mxCell></root>';
      var doc = mxUtils.parseXml(xml);
      var codec = new mxCodec(doc);
      var elt = doc.documentElement.firstChild;
      var cells = [];
      while (elt != null) {
        cells.push(codec.decodeCell(elt));
        graph.refresh();
        elt = elt.nextSibling;
      }
      graph.addCells(cells);
    },
    parse (graph, filename) {
      var model = graph.getModel();
      var parent = graph.getDefaultParent();
      var req = mxUtils.load(filename);
      var text = req.getText();
      var lines = text.split('\n');
      var vertices = [];
      graph.getModel().beginUpdate();
      try {
        for (var i = 0; i < lines.length; i++) {
          var colon = lines[i].indexOf(':');
          if (lines[i].substring(0, 1) !== '#' ||
            colon === -1) {
            var comma = lines[i].indexOf(',');
            var value = lines[i].substring(colon + 2, lines[i].length);
            if (comma === -1 || comma > colon) {
              var key = lines[i].substring(0, colon);
              if (key.length > 0) {
                vertices[key] = graph.insertVertex(parent, null, value, 0, 0, 80, 70);
              }
            } else if (comma < colon) {
              var source = vertices[lines[i].substring(0, comma)];
              var target = vertices[lines[i].substring(comma + 1, colon)];
              if (source != null && target != null) {
                var e = graph.insertEdge(parent, null, value, source, target);
                if (value.indexOf('2-Way') >= 0) {
                  e.style = '2way';
                }
              }
            }
          }
        }
      } finally {
        graph.getModel().endUpdate();
      }
    }
  },
  data () {
    return {
      graph: {},
      institucion: '5aaac05667adf97ed4093eb5', // this.$storage.get('user').institucion
      docsWithComponents: []
    };
  }
};
</script>

<style lang="scss" scoped>
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
