<template>
    <section>
      <!--
        <graph-preview :flowData="flowData"></graph-preview>
      -->
      <mxgraph :flowData="flowData"></mxgraph>
    </section>
</template>
<script>
/* eslint no-unused-vars:0 */
import Mxgraph from '@/common/util/mxgraph/mxgraphInstanciador.vue';
// import graphPreview from '@/common/util/mxgraph/graphPreview.vue';
export default {
  data () {
    return {
      valid: null,
      datos: null,
      documentsReceived: this.$route.params.documents,
      dataInterOp: null,
      dataConfigPaso: null,
      dataPpte: null,
      dataDecision: null,
      received: 'Get data from graph',
      institucion: '5aaac05667adf97ed4093eb5', // this.$storage.get('user').institucion
      flowData: {}
    };
  },
  created () {
    if (this.$route && this.$route.params) {
      console.log('------------------params------------------');
      console.log(this.$route.params);
      console.log('------------------------------------');
      if (this.$route.params.hasOwnProperty('id')) {
        console.log('------------------------------------');
        console.log('Data received from Modal of flow');
        console.log('------------------------------------');
        const parametros = this.$route.params;
        this.flowData = {
          id: parametros.id || null,
          name: parametros.flowName || '',
          description: parametros.description || '',
          roles: parametros.roles || [],
          documents: parametros.documents || [],
          estructura: parametros.estructura || '',
          institucion: parametros.institucion || ''
        };
      } else if (this.$route.params.hasOwnProperty('_id')) {
        console.log('--------------------------------------');
        console.log('Data received from item on list (Edit)');
        console.log('--------------------------------------');
        const content = this.$route.params;
        this.flowData = {
          id: content._id,
          name: content.titulo || '',
          description: content.descripcion || '',
          roles: content.base.grupos || [],
          documents: content.base.documentos || [],
          estructura: content.base.estructura || '',
          institucion: content.institucion || ''
        };
      }
      /*
      if (this.$route.query && this.$route.query.id) {
        this.$service.get(`flujos_plantilla/${this.$route.query.id}`)
        .then((res) => {
          if (res) {
            let queryData = res;
            this.flowData = {
              id: this.$route.query.id,
              name: queryData.titulo || '',
              description: queryData.descripcion || '',
              roles: queryData.base.grupos || [],
              documents: queryData.base.documentos || [],
              estructura: queryData.base.estructura || '',
              institucion: queryData.institucion || ''
            };
          }
        })
        .catch((err) => this.$message.error(err.message));
      }
      */
      // var xmlReceived = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="Rol 1" style="swimlane;fillColor=#310725;strokeColor=#310725;gradientColor=#FFFFFF" vertex="1" connectable="0" parent="1"><mxGeometry x="20" y="20" width="250" height="750" as="geometry"/></mxCell><mxCell id="Inicio" value="Inicio" style="endpoint;image=images/icons48/start.png" vertex="1" parent="2"><mxGeometry x="72" y="75" width="50" height="50" as="geometry"/></mxCell><mxCell id="4" style="paper" vertex="1" connectable="0" parent="2"><Paper name="Llenar documento" filename="5349b4ddd2781d08c09890f4" type="" owner="" mandatory="0" as="value"><Object as="sendOption"><add value="Todos"/><add value="Todos"/></Object><Array as="permissions"><add value="1"/><add value="1"/><add value="1"/></Array><Array as="extras"><Object role="507f1f77bcf86cd799439012" readPermission="0" writePermission="0" denyPermission="1"/></Array></Paper><mxGeometry x="55" y="179" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="5" value="Trigger" style="port;image=images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="4"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="6" value="Entrada" style="port;image=images/overlays/arrow-right-green.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="4"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="7" value="Error" style="port;image=images/overlays/error.png;spacingLeft=18" vertex="1" parent="4"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="8" value="Resultado" style="port;image=images/overlays/arrow-right-blue.png;spacingLeft=18" vertex="1" parent="4"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="9" style="paper" vertex="1" connectable="0" parent="2"><Paper name="Llenar documento" filename="5349b4ddd2781d08c09890f4" type="" owner="" mandatory="0" as="value"><Object as="sendOption"><add value="Todos"/></Object><Array as="permissions"><add value="1"/><add value="0"/><add value="0"/></Array><Array as="extras"/></Paper><mxGeometry x="73" y="281" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="10" value="Trigger" style="port;image=images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="9"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="11" value="Entrada" style="port;image=images/overlays/arrow-right-green.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="9"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="12" value="Error" style="port;image=images/overlays/error.png;spacingLeft=18" vertex="1" parent="9"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="13" value="Resultado" style="port;image=images/overlays/arrow-right-blue.png;spacingLeft=18" vertex="1" parent="9"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="19" value="" edge="1" parent="2" source="Inicio" target="6"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="20" value="" edge="1" parent="2" source="8" target="11"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="3" value="Rol 2" style="swimlane;fillColor=#615B1C;strokeColor=#615B1C;gradientColor=#FFFFFF" vertex="1" connectable="0" parent="1"><mxGeometry x="270" y="20" width="250" height="750" as="geometry"/></mxCell><mxCell id="Fin" value="Fin" style="endpoint;image=images/icons48/stop.png" vertex="1" parent="3"><mxGeometry x="130" y="310" width="50" height="50" as="geometry"/></mxCell><mxCell id="14" style="paper" vertex="1" connectable="0" parent="3"><Paper name="Llenar documento" filename="5349b4ddd2781d08c09890f4" type="" owner="" mandatory="0" as="value"><Object as="sendOption"/><Array as="permissions"><add value="1"/><add value="0"/><add value="0"/></Array><Array as="extras"/></Paper><mxGeometry x="80" y="154" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="15" value="Trigger" style="port;image=images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="14"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="16" value="Entrada" style="port;image=images/overlays/arrow-right-green.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="14"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="17" value="Error" style="port;image=images/overlays/error.png;spacingLeft=18" vertex="1" parent="14"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="18" value="Resultado" style="port;image=images/overlays/arrow-right-blue.png;spacingLeft=18" vertex="1" parent="14"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="23" value="" edge="1" parent="3" source="18" target="Fin"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="21" value="" edge="1" parent="1" source="13" target="16"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="22" value="" edge="1" parent="1" source="8" target="16"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>';
    }
    console.log('---------------flow data---------------------');
    console.log(this.flowData);
    console.log('------------------------------------');
  },
  mounted () {
    this.$nextTick(() => {
      // window.addEventListener('message', this.handleMessage);
    });
  },
  destroyed () {
    // window.removeEventListener('message', this.handleMessage);
  },
  methods: {
    setUpFrame: function () {
      console.log('---------------loaded---------------------');
      console.log('loaded');
      console.log('------------------------------------');
      var frame = window.frames['graph'];
      var parametros = this.$route.params;
      // var xmlReceived = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="14" value="Rol" style="swimlane;fillColor=#A0BF88;strokeColor=#A0BF88;gradientColor=#FFFFFF" vertex="1" connectable="0" parent="1"><mxGeometry x="20" y="20" width="272" height="550" as="geometry"/></mxCell><mxCell id="18" style="paper" vertex="1" connectable="0" parent="14"><Paper name="Documento" as="value"/><mxGeometry x="38" y="170" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="19" value="Trigger" style="port;image=editors/images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="18"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="20" value="Entrada" style="port;image=editors/images/overlays/check.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="18"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="21" value="Error" style="port;image=editors/images/overlays/error.png;spacingLeft=18" vertex="1" parent="18"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="22" value="Resultado" style="port;image=editors/images/overlays/information.png;spacingLeft=18" vertex="1" parent="18"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="30" value="Inicio" style="endpoint;image=images/icons48/start.png" vertex="1" parent="14"><mxGeometry x="48" y="56" width="50" height="50" as="geometry"/></mxCell><mxCell id="39" value="" edge="1" parent="14" source="30" target="20"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="15" value="Rol" style="swimlane;fillColor=#876B10;strokeColor=#876B10;gradientColor=#FFFFFF" vertex="1" connectable="0" parent="1"><mxGeometry x="292" y="20" width="250" height="550" as="geometry"/></mxCell><mxCell id="23" style="delegation" vertex="1" connectable="0" parent="15"><Delegation name="Delegación" as="value"/><mxGeometry x="58" y="170" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="24" value="Entrada" style="port;image=editors/images/overlays/check.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="23"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="25" value="Resultado" style="port;image=editors/images/overlays/information.png;spacingLeft=18" vertex="1" parent="23"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="34" style="paper" vertex="1" connectable="0" parent="15"><Paper name="Documento" as="value"/><mxGeometry x="58" y="297" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="35" value="Trigger" style="port;image=editors/images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="34"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="36" value="Entrada" style="port;image=editors/images/overlays/check.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="34"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="37" value="Error" style="port;image=editors/images/overlays/error.png;spacingLeft=18" vertex="1" parent="34"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="38" value="Resultado" style="port;image=editors/images/overlays/information.png;spacingLeft=18" vertex="1" parent="34"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="41" value="" edge="1" parent="15" source="25" target="36"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="16" value="Rol" style="swimlane;fillColor=#DB1D47;strokeColor=#DB1D47;gradientColor=#FFFFFF" vertex="1" connectable="0" parent="1"><mxGeometry x="542" y="20" width="250" height="550" as="geometry"/></mxCell><mxCell id="26" style="payment" vertex="1" connectable="0" parent="16"><Payment name="Plataforma &#xa;de pagos" as="value"/><mxGeometry x="58" y="190" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="27" value="Entrada" style="port;image=editors/images/overlays/check.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="26"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="28" value="Error" style="port;image=editors/images/overlays/error.png;spacingLeft=18" vertex="1" parent="26"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="29" value="Resultado" style="port;image=editors/images/overlays/information.png;spacingLeft=18" vertex="1" parent="26"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="44" value="&lt;h3 style=&quot;margin:0px;&quot;&gt;Notificar&lt;/h3&gt;&lt;br&gt;&lt;img src=&quot;images/icons48/mail_new.png&quot; width=&quot;32&quot; height=&quot;32&quot;&gt;" vertex="1" connectable="0" parent="16"><mxGeometry x="65" y="395" width="120" height="80" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="45" value="Trigger" style="port;image=editors/images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="44"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="17" value="Rol" style="swimlane;fillColor=#865042;strokeColor=#865042;gradientColor=#FFFFFF" vertex="1" connectable="0" parent="1"><mxGeometry x="792" y="20" width="250" height="550" as="geometry"/></mxCell><mxCell id="31" value="Fin" style="endpoint;image=images/icons48/stop.png" vertex="1" parent="17"><mxGeometry x="125" y="410" width="50" height="50" as="geometry"/></mxCell><mxCell id="32" value="&lt;h3 style=&quot;margin:0px;&quot;&gt;Notificar&lt;/h3&gt;&lt;br&gt;&lt;img src=&quot;images/icons48/mail_new.png&quot; width=&quot;32&quot; height=&quot;32&quot;&gt;" vertex="1" connectable="0" parent="17"><mxGeometry x="55" y="150" width="120" height="80" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="33" value="Trigger" style="port;image=editors/images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="32"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="40" value="" edge="1" parent="1" source="22" target="24"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="42" value="" edge="1" parent="1" source="38" target="27"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="43" value="" edge="1" parent="1" source="29" target="33"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="46" value="" edge="1" parent="1" source="38" target="45"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="47" value="" edge="1" parent="1" source="29" target="31"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>';
      // var xmlReceived = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="Rol 1" style="swimlane;fillColor=#310725;strokeColor=#310725;gradientColor=#FFFFFF" vertex="1" connectable="0" parent="1"><mxGeometry x="20" y="20" width="250" height="750" as="geometry"/></mxCell><mxCell id="Inicio" value="Inicio" style="endpoint;image=images/icons48/start.png" vertex="1" parent="2"><mxGeometry x="72" y="75" width="50" height="50" as="geometry"/></mxCell><mxCell id="4" style="paper" vertex="1" connectable="0" parent="2"><Paper name="Llenar documento" filename="5349b4ddd2781d08c09890f4" type="" owner="" mandatory="0" as="value"><Object as="sendOption"><add value="Todos"/><add value="Todos"/></Object><Array as="permissions"><add value="1"/><add value="1"/><add value="1"/></Array><Array as="extras"><Object role="507f1f77bcf86cd799439012" readPermission="0" writePermission="0" denyPermission="1"/></Array></Paper><mxGeometry x="55" y="179" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="5" value="Trigger" style="port;image=images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="4"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="6" value="Entrada" style="port;image=images/overlays/arrow-right-green.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="4"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="7" value="Error" style="port;image=images/overlays/error.png;spacingLeft=18" vertex="1" parent="4"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="8" value="Resultado" style="port;image=images/overlays/arrow-right-blue.png;spacingLeft=18" vertex="1" parent="4"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="9" style="paper" vertex="1" connectable="0" parent="2"><Paper name="Llenar documento" filename="5349b4ddd2781d08c09890f4" type="" owner="" mandatory="0" as="value"><Object as="sendOption"><add value="Todos"/></Object><Array as="permissions"><add value="1"/><add value="0"/><add value="0"/></Array><Array as="extras"/></Paper><mxGeometry x="73" y="281" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="10" value="Trigger" style="port;image=images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="9"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="11" value="Entrada" style="port;image=images/overlays/arrow-right-green.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="9"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="12" value="Error" style="port;image=images/overlays/error.png;spacingLeft=18" vertex="1" parent="9"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="13" value="Resultado" style="port;image=images/overlays/arrow-right-blue.png;spacingLeft=18" vertex="1" parent="9"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="19" value="" edge="1" parent="2" source="Inicio" target="6"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="20" value="" edge="1" parent="2" source="8" target="11"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="3" value="Rol 2" style="swimlane;fillColor=#615B1C;strokeColor=#615B1C;gradientColor=#FFFFFF" vertex="1" connectable="0" parent="1"><mxGeometry x="270" y="20" width="250" height="750" as="geometry"/></mxCell><mxCell id="Fin" value="Fin" style="endpoint;image=images/icons48/stop.png" vertex="1" parent="3"><mxGeometry x="130" y="310" width="50" height="50" as="geometry"/></mxCell><mxCell id="14" style="paper" vertex="1" connectable="0" parent="3"><Paper name="Llenar documento" filename="5349b4ddd2781d08c09890f4" type="" owner="" mandatory="0" as="value"><Object as="sendOption"/><Array as="permissions"><add value="1"/><add value="0"/><add value="0"/></Array><Array as="extras"/></Paper><mxGeometry x="80" y="154" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="15" value="Trigger" style="port;image=images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="14"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="16" value="Entrada" style="port;image=images/overlays/arrow-right-green.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="14"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="17" value="Error" style="port;image=images/overlays/error.png;spacingLeft=18" vertex="1" parent="14"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="18" value="Resultado" style="port;image=images/overlays/arrow-right-blue.png;spacingLeft=18" vertex="1" parent="14"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="23" value="" edge="1" parent="3" source="18" target="Fin"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="21" value="" edge="1" parent="1" source="13" target="16"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="22" value="" edge="1" parent="1" source="8" target="16"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>';
      // var xmlReceived = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="Rol 1" style="swimlane;fillColor=#310725;strokeColor=#310725;gradientColor=#FFFFFF" vertex="1" connectable="0" parent="1"><mxGeometry x="20" y="20" width="250" height="750" as="geometry"/></mxCell><mxCell id="Inicio" value="Inicio" style="endpoint;image=images/icons48/start.png" vertex="1" parent="2"><mxGeometry x="72" y="75" width="50" height="50" as="geometry"/></mxCell><mxCell id="4" style="paper" vertex="1" connectable="0" parent="2"><Paper name="Llenar documento" filename="5349b4ddd2781d08c09890f4" type="" owner="" mandatory="0" as="value"><Array as="permissions"><add value="1"/><add value="1"/><add value="1"/></Array><Array as="extras"><Object role="507f1f77bcf86cd799439012" readPermission="0" writePermission="0" denyPermission="1"/></Array></Paper><mxGeometry x="55" y="179" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="5" value="Trigger" style="port;image=images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="4"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="6" value="Entrada" style="port;image=images/overlays/arrow-right-green.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="4"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="7" value="Error" style="port;image=images/overlays/error.png;spacingLeft=18" vertex="1" parent="4"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="8" value="Resultado" style="port;image=images/overlays/arrow-right-blue.png;spacingLeft=18" vertex="1" parent="4"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="9" style="paper" vertex="1" connectable="0" parent="2"><Paper name="Llenar documento" filename="5349b4ddd2781d08c09890f4" type="" owner="" mandatory="0" as="value"><Array as="permissions"><add value="1"/><add value="0"/><add value="0"/></Array><Array as="extras"/></Paper><mxGeometry x="73" y="281" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="10" value="Trigger" style="port;image=images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="9"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="11" value="Entrada" style="port;image=images/overlays/arrow-right-green.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="9"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="12" value="Error" style="port;image=images/overlays/error.png;spacingLeft=18" vertex="1" parent="9"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="13" value="Resultado" style="port;image=images/overlays/arrow-right-blue.png;spacingLeft=18" vertex="1" parent="9"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="19" value="" edge="1" parent="2" source="Inicio" target="6"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="20" value="" edge="1" parent="2" source="8" target="11"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="3" value="Rol 2" style="swimlane;fillColor=#615B1C;strokeColor=#615B1C;gradientColor=#FFFFFF" vertex="1" connectable="0" parent="1"><mxGeometry x="270" y="20" width="250" height="750" as="geometry"/></mxCell><mxCell id="Fin" value="Fin" style="endpoint;image=images/icons48/stop.png" vertex="1" parent="3"><mxGeometry x="130" y="310" width="50" height="50" as="geometry"/></mxCell><mxCell id="14" style="paper" vertex="1" connectable="0" parent="3"><Paper name="Llenar documento" filename="5349b4ddd2781d08c09890f4" type="" owner="" mandatory="0" as="value"><Object as="sendOption"/><Array as="permissions"><add value="1"/><add value="0"/><add value="0"/></Array><Array as="extras"/></Paper><mxGeometry x="80" y="154" width="120" height="50" as="geometry"><mxRectangle width="120" height="40" as="alternateBounds"/></mxGeometry></mxCell><mxCell id="15" value="Trigger" style="port;image=images/overlays/flash.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="14"><mxGeometry y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="16" value="Entrada" style="port;image=images/overlays/arrow-right-green.png;align=right;imageAlign=right;spacingRight=18" vertex="1" parent="14"><mxGeometry y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-6" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="17" value="Error" style="port;image=images/overlays/error.png;spacingLeft=18" vertex="1" parent="14"><mxGeometry x="1" y="0.25" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-8" as="offset"/></mxGeometry></mxCell><mxCell id="18" value="Resultado" style="port;image=images/overlays/arrow-right-blue.png;spacingLeft=18" vertex="1" parent="14"><mxGeometry x="1" y="0.75" width="16" height="16" relative="1" as="geometry"><mxPoint x="-8" y="-4" as="offset"/></mxGeometry></mxCell><mxCell id="23" value="" edge="1" parent="3" source="18" target="Fin"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="21" value="" edge="1" parent="1" source="13" target="16"><mxGeometry relative="1" as="geometry"/></mxCell><mxCell id="22" value="" edge="1" parent="1" source="8" target="16"><mxGeometry relative="1" as="geometry"/></mxCell></root></mxGraphModel>';
      var data = {
        name: parametros.flowName || '',
        description: parametros.description || '',
        roles: parametros.roles || [],
        documents: parametros.documents || [],
        xmlFlow: parametros.xml || '',
        institucion: parametros.institucion || ''
      };

      frame.loadParentData(data);
    },
    /*
    getJson: function () {
      var frame = window.frames['graph'];
      var data = frame.createJson();
      return data;
    },
    handleMessage: function (event) {
      if (event) {
        var cellData = JSON.parse(event.data);

        if (cellData.type === 'delegation' || cellData.type === 'decision') {
          const promises = [];
          for (var option in cellData.documents) {
            promises.push(this.getDocComponents(cellData.documents[option]));
          }
          if (promises.length > 0) {
            Promise.all(promises)
            .then((res) => {
              if (res) {
                if (res.length === cellData.documents.length) {
                  for (var j = 0; j < cellData.documents.length; j++) {
                    cellData.documents[j].componentes = res[j];
                  }
                }
              }
            });
          }
        }

        this.$store.state.cellData = cellData;
        console.log('----------------cell data--------------------');
        console.log(this.$store.state.cellData);
        console.log('------------------------------------');
        if (cellData.type === 'document') {
          // this.dataConfigPaso = cellData;
          // if (this.$refs.pasoConfig) {
          this.$refs.pasoConfig.abrirConfiguracion();
          // }
        } else if (cellData.type === 'delegation') {
          // this.dataInterOp = cellData;
          // if (this.$refs.interOp) {
          this.$refs.interOp.abrirConfiguracion();
          // }
        } else if (cellData.type === 'payment') {
          // this.dataPpte = cellData;
          // if (this.$refs.componentePpte) {
          this.$refs.componentePpte.abrirPlataformaPagos();
          // }
        } else if (cellData.type === 'decision') {
          // this.dataDecision = cellData;
          // if (this.$refs.componenteDecision) {
          this.$refs.componenteDecision.abrirConfiguracion();
          // }
        }
      }
    },
    showModal (template) {
      if (template === 'delegation') {
        this.isDelegationVisible = true;
        this.$refs.interOp.abrirConfiguracion();
      }
    },
    closeModal (template) {
      if (template === 'delegation') {
        this.isDelegationVisible = false;
      }
    },
    */
    updateGraphCell: function (payload) {
      console.log('-----------data-received------------');
      console.log(payload);
      console.log('------------------------------------');
      // if (payload.type === 'document') {
      var frame = window.frames['graph'];
      frame.setCellParameters(payload);
      // }
    },
    storeFlow () {
      var messageAtPrompt = this.$route.params.id ? '¿Esta seguro de que desea guardar los cambios realizados en este flujo?' : '¿Esta seguro de que desea guardar este flujo?';
      this.$confirm(messageAtPrompt, () => {
        /*
        // var frame = window.frames['graph'];
        var data = this.graphFrame.createJson();
        */
        var data = this.getJson();
        if (data === '') {
          this.$message.info('Tiene que crear un flujo para poder guardar');
        } else if (data === undefined) {
          this.$message.error('Una o mas celdas no estan asociadas a un grupo!');
        } else {
          const path = 'flujos_plantilla/';
          // if (this.$route && this.$route.query && this.$route.query.id) {
          if (this.$route.params.id) {
            this.$service.put(`${path}/${this.$route.params.id}`, JSON.parse(data))
            .then((res) => {
              this.$message.success('El flujo ha sido actualizado');
            })
            .catch((err) => this.$message.error(err.message));
          } else {
            this.$service.post(`${path}`, JSON.parse(data))
            .then((res) => {
              this.$message.success('El flujo ha sido guardado');
            })
            .catch((err) => this.$message.error(err.message));
          }
        }
      });
    },
    getDocComponents: function (docArray) {
      try {
        return new Promise((resolve, reject) => {
          var url = 'documentos_plantilla/' + docArray.id;
          var componentes = [];
          this.$service.get(url)
          .then((res) => {
            if (res) {
              if (res.componentes.length > 0) {
                componentes = res.componentes;
              }
            }
            resolve(componentes);
          }).catch((err) => this.$message.error(err.message));
        });
      } catch (err) {
        // throw new Error(err.message);
        this.$message.error(err.message);
      }
    }
  },
  components: {
    Mxgraph
  }
};
</script>
<style lang="scss"></style>
