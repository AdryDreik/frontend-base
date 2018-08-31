<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs2 md2 lg2 class="pr-3 pt-5">
            <span style="display:block; font-size: 14px">
              <b>DEPARTAMENTO: </b> {{this.to.value.departamento.valor}}
            </span>
            <span style="display:block; font-size: 14px">
              <b>PROVINCIA: </b> {{this.to.value.provincia.valor}}
            </span>
            <span style="display:block; font-size: 14px">
              <b>MUNICIPIO: </b> {{this.to.value.municipio.valor}}
            </span>
            <span style="display:block; font-size: 14px">
              <b>{{this.to.value.zona_barrio_uv_otro.toUpperCase()}}: </b> {{this.to.value.nombreZonaBarrio}}
            </span>
            <span style="display:block; font-size: 14px">
              <b>{{this.to.value.calle_avenida_pasaje_callejón.toUpperCase()}}: </b> {{this.to.value.nombreCalleAvenida}}
            </span>
            <span style="display:block; font-size: 14px">
              <b>DIRECCIÓN REFERENCIAL: </b> {{this.to.value.direccion_referencial}}
            </span>
            <span style="display:block; font-size: 14px">
              <b>NÚMERO DE DOMICILIO: </b> {{this.to.value.número_de_domicilio}}
            </span>
            <span style="display:block; font-size: 14px">
              <b>NOMBRE DEL EDIFICIO: </b> {{this.to.value.nombre_del_edificio}}
            </span>
            <span style="display:block; font-size: 14px">
              <b>PISO: </b> {{this.to.value.piso}}
            </span>
            <span style="display:block; font-size: 14px">
              <b>{{this.to.value.departamento_local_oficina.toUpperCase()}}: </b> {{this.to.value.NombreOficinaLocal}}
            </span>
          </v-flex>
          <v-flex xs10 md10 lg10>
            <v-flex xs12 md12 class="subheaderModified">
              <v-subheader>{{ label }}</v-subheader>
            </v-flex>
            <div class="mapa">
              <l-map ref="map" id="ubicacion" :zoom="14" :center="center">
                <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                  <!-- <v-geosearch :options="geosearchOptions"></v-geosearch> -->
                <l-marker 
                  v-for="item in markers"  
                  :key="item.id"
                  :lat-lng="item.position" 
                  :visible="item.visible" 
                >
                  <!-- <l-popup content="Lugar seleccionado"></l-popup> -->
                </l-marker>
              </l-map>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
/* global L */
/* eslint new-cap:0 */
/* eslint no-undef:0 */
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import config from '../../../../../../config';
L.Icon.Default.imagePath = (process.env.NODE_ENV === 'development') ? `../../../..${config.dev.assetsPublicPath}static/images/` : `../../../..${config.build.assetsPublicPath}static/images/`;
const COMPONENT_NAME = 'map';
export default {
  name: COMPONENT_NAME,
  props: [ 'form', 'field', 'model', 'to' ],
  data () {
    return {
      item: null,
      numMarkets: null,
      markers: [],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      center: [-16.486831, -68.138838],
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      label: null
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.markers = this.to.value.markers ? this.to.value.markers : []; // this.to.position
      if (this.markers && this.markers.length > 0) {
        this.center = [
          this.markers[0].position.lat,
          this.markers[0].position.lng
        ];
      }
      this.label = this.to.label;
    });
  },
  components: {
    LMap,
    LTileLayer,
    LMarker
    // VGeosearch
  }
};
</script>
<style lang="scss">
  // @import "~leaflet/dist/leaflet.css";
  .mapa {
    width: auto;
    height: 300px;
    border: 2px solid black;
    .vue2leaflet-map {
      z-index: 1 !important;
    }
  }
</style>
