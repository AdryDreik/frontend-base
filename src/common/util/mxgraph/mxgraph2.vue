<template>
  <div id="mxgraph" class="mxgraph">
    <div id="graphContainer"
      style="position:relative;overflow:hidden;width:321px;height:241px;background:url('editors/images/grid.gif');cursor:default;"></div>
    <v-layout row wrap>
      <v-flex xs8 class="btn-container">
        <!-- <div id="xdiv" style="width:100px;height:100px;background-color:#F00">fdsfa</div> -->
        <v-icon id="xdiv3">home</v-icon>
        <v-btn color="primary" dark id="xdiv">Arrastrame</v-btn>
        <v-btn color="primary" dark @click.stop="graph.zoomIn()">Zoom In</v-btn>
        <v-btn color="primary" dark @click.stop="graph.zoomOut()">Zoom Out</v-btn>
        <v-btn color="primary" dark @click.stop="modal = true">Open Dialog 2</v-btn>
        <!-- Modal Add/Edit -->
        <v-dialog v-model="modal" :max-width="500">
          <v-card class="crud-dialog">
            <slot name="form">Agregue su formulario aquí</slot>
          </v-card>
        </v-dialog>
        <!-- END Modal Add/Edit -->
      </v-flex>
      <!-- END Section Filter -->
    </v-layout>
  </div>
</template>
<script>
/* eslint no-unused-vars:0 */
/* eslint no-new:0 */
/* eslint new-cap:0 */
import { mapState } from 'vuex';
import { mxEvent, mxPoint, mxConstants, mxPerimeter, mxUtils, mxCodec, mxBasePath, mxGraph, mxClient, mxRubberband } from 'mxgraph-js';

export default {
  props: {
    widthModal: {
      type: Number,
      default: 480
    }
  },
  computed: {
    ...mapState(['modal'])
  },
  mounted: function () {
    // console.log('hola a todos');
    const container = document.getElementById('graphContainer');
    const padre = document.getElementById('mxgraph');
    mxEvent.disableContextMenu(container);
    this.graph = new mxGraph(container);
    new mxRubberband(this.graph);
    var parent = this.graph.getDefaultParent();
    this.configStyleBox(this.graph);
    this.graph.getModel().beginUpdate();
    try {
      var v1 = this.graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
      var v2 = this.graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
      var e1 = this.graph.insertEdge(parent, null, 'Datos', v1, v2);
    } finally {
      this.graph.getModel().endUpdate();
    }

    var ximg = document.getElementById('xdiv');
    var dragImage = ximg.cloneNode(true);
    var ds = mxUtils.makeDraggable(ximg, this.graph, this.dragAndDrop, dragImage);
    // var ds = mxUtils.makeDraggable(ximg, this.graph, funct, dragImage);
  },
  data () {
    return {
      modal: false,
      graph: {},
      totalItems: 0,
      items: [],
      loading: true,
      pagination: {
        rowsPerPage: 10
      },
      load: false,
      // rowsPerPageItems: [5, 10, 25, { text: 'Todos', value: -1 }]
      rowsPerPageItems: [50, 100, 200]
    };
  },
  methods: {
    openDocument () {
      this.$emit('openDocument', false);
    },
    dragAndDrop (graph, evt, cell, x, y) {
      this.configStyleBox(graph);
      const parent = graph.getDefaultParent();
      const model = graph.getModel();
      model.beginUpdate();
      try {
        console.log('datos : ' + x);
        var v1 = graph.insertVertex(parent, null, 'Hello,', x, y, 120, 40, 'image');

        var port = graph.insertVertex(v1, null, 'Trigger', 0, 0.25, 16, 16,
          'port;image=images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18', true);
        port.geometry.offset = new mxPoint(-6, -8);
        port = graph.insertVertex(v1, null, 'Entrada', 0, 0.75, 16, 16,
          'port;image=images/overlays/arrow-right-green.png;align=right;imageAlign=right;spacingRight=18', true);
        port.geometry.offset = new mxPoint(-6, -4);
        port = graph.insertVertex(v1, null, 'Error', 1, 0.25, 16, 16,
          'port;image=images/overlays/error.png;spacingLeft=18', true);
        port.geometry.offset = new mxPoint(-8, -8);
        port = graph.insertVertex(v1, null, 'Resultado', 1, 0.75, 16, 16,
          'port;image=images/overlays/arrow-right-blue.png;spacingLeft=18', true);
        port.geometry.offset = new mxPoint(-8, -4);
      } finally {
        model.endUpdate();
      }
      graph.setSelectionCell(v1);
      // var v1 = null;
    },
    configStyleBox (graph) {
      const style = {};

      // style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_LABEL;
      // style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
      // style[mxConstants.STYLE_IMAGE] = './static/mxgraph/examples/images/icons48/keys.png';
      // style[mxConstants.STYLE_FONTCOLOR] = '#FFFFFF';
      // style[mxConstants.STYLE_FILLCOLOR] = '#F00';

      style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
      style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
      style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
      // style[mxConstants.STYLE_GRADIENTCOLOR] = '#41B9F5';
      style[mxConstants.STYLE_FILLCOLOR] = '#006fba';
      // style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = '#ffffff';
      // style[mxConstants.STYLE_STROKECOLOR] = '#1B78C8';
      style[mxConstants.STYLE_ROUNDED] = true;
      style[mxConstants.STYLE_FONTCOLOR] = '#FFF';
      style[mxConstants.STYLE_STROKEWIDTH] = '2';
      style[mxConstants.STYLE_STARTSIZE] = '28';
      style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
      style[mxConstants.STYLE_FONTSIZE] = '12';
      style[mxConstants.STYLE_FONTSTYLE] = 1;
      style[mxConstants.STYLE_IMAGE] = './static/mxgraph/examples/images/icons48/keys.png';
      style[mxConstants.STYLE_SHADOW] = 0;
      style[mxConstants.STYLE_OPACITY] = '100';

      graph.getStylesheet().putCellStyle('image', style);
    }
  }
};
</script>

<style type='text/css'>
.mxCellEditor{
  position: absolute;
}
</style>
