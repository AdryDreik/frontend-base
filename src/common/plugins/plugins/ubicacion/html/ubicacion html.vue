<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-layout row wrap>
              <v-flex xs12 md12 class="subheaderModified" v-if="label">
                <v-subheader class="quitarEspacio">{{label}}</v-subheader>
              <!-- ADICIONANDO LAS OPCIONES DE VALERIA  -->
              </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-layout row wrap>
                          <v-flex xs12 sm12 md4 lg4 class="pr-3">
                            <!-- DEPARTAMENTOS -->
                            <v-select
                              name="departamento"
                              :items="departamentos"
                              v-model="departamento"
                              item-value="departamento"
                              item-text="valor"
                              label="Departamento"
                              @input="dibujarDepartamento"
                              chips
                              max-height="auto"
                              autocomplete
                              :disabled="disabled"
                              :required="true"
                              :rules="[(dep) => !!dep || 'Por favor debe seleccionar un departamento']"
                            >
                              <template slot="selection" slot-scope="data">
                                  <v-chip
                                    :selected="data.selected"
                                    :key="JSON.stringify(data.item)"
                                    close
                                    class="chip--select-multi"
                                    @input="data.parent.selectItem(data.item)"
                                  >
                                    <v-avatar>
                                      <img :src="data.item.avatar" style="">
                                      <!-- <v-icon>add</v-icon> -->
                                    </v-avatar>
                                    {{ data.item.valor }}
                                  </v-chip>
                                </template>
                                <template slot="item" slot-scope="data">
                                  <template v-if="typeof data.item !== 'object'">
                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                  </template>
                                  <template v-else>
                                    <v-list-tile-avatar>
                                      <template v-if="isDev !== null && path !== null">
                                        <img :src="isDev ? `${data.item.avatar}` : `${path}${data.item.avatar}`">
                                      </template>
                                      <!-- <v-icon>add</v-icon> -->
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                      <v-list-tile-title v-html="data.item.valor"></v-list-tile-title>
                                    </v-list-tile-content>
                                  </template>
                                </template>
                            </v-select>
                          </v-flex>
                          <v-flex xs12 sm12 md4 lg4 class="pr-3">
                            <!-- PROVINCIAS -->
                            <v-select
                              name="provincia"
                              :items="provincias"
                              v-model="provincia"
                              item-value="provincia"
                              item-text="valor"
                              label="Provincia"
                              @input="dibujarProvincia"
                              autocomplete
                              :disabled="disabled"
                              :required="true"
                              :rules="[(prov) => !!prov || 'Por favor debe seleccionar una provincia']"
                            ></v-select>
                          </v-flex>
                          <v-flex xs12 sm12 md4 lg4>
                            <!-- MUNICIPIOS -->
                            <v-select
                              name="Municipio"
                              :items="municipios"
                              v-model="municipio"
                              item-value="municipio"
                              item-text="valor"
                              label="Municipio"
                              @input="dibujarMunicipio"
                              autocomplete
                              :disabled="disabled"
                              :required="true"
                              :rules="[(mun) => !!mun || 'Por favor debe seleccionar un municipio']"
                            ></v-select>
                          </v-flex>
                          <!-- ZONA BARRIO -->
                          <v-flex xs12 sm12 md6 lg6 v-if="configurationElements.zona">
                            <v-radio-group 
                              row 
                              v-model="zonaBarrio"
                              :required="true"
                              :rules="[(val) => !!val || 'Por favor debe seleccionar una opción']"
                              >
                              <v-radio
                                :disabled="disabled"
                                key="1"
                                color="primary"
                                label="Zona"
                                value="zona"
                              ></v-radio>
                              <v-radio
                                :disabled="disabled"
                                key="2"
                                color="primary"
                                label="Barrio"
                                value="barrio"
                              ></v-radio>
                              <v-radio
                                :disabled="disabled"
                                key="3"
                                color="primary"
                                label="Unidad Vecinal"
                                value="unidad vecinal"
                              ></v-radio>
                              <v-radio
                                :disabled="disabled"
                                key="4"
                                color="primary"
                                label="Otro"
                                value="otro"
                              ></v-radio>
                            </v-radio-group>
                          </v-flex>
                          <v-flex xs12 sm12 md6 lg6 v-if="configurationElements.zona">
                            <v-text-field
                              class="pr-3"
                              :label="`Nombre (de la/del) ${(zonaBarrio) ? zonaBarrio : ''}`"
                              v-model="nombreZonaBarrio"
                              :disabled="disabled"
                              placeholder="Por ejemplo: San Miguel"
                              hint="Tiene que escribir el nombre completo de la opcion seleccionada"
                              :required="true"
                              :rules="[(val) => !!val || 'El campo no puede estar vacio']"
                              persistent-hint
                            >
                            </v-text-field>
                          </v-flex>
                          <!-- FIN ZONA BARRIO-->
                          <!-- CALLE AVENIDA -->
                          <v-flex xs12 sm12 md6 lg6 v-if="configurationElements.calle">
                            <v-radio-group 
                              row 
                              v-model="calleAvenida"
                              :required="true"
                              :rules="[(val) => !!val || 'Por favor debe seleccionar una opción']"
                              >
                              <v-radio
                                :disabled="disabled"
                                key="1"
                                color="primary"
                                label="Calle"
                                value="calle"
                              ></v-radio>
                              <v-radio
                                :disabled="disabled"
                                key="2"
                                color="primary"
                                label="Avenida"
                                value="avenida"
                              ></v-radio>
                              <v-radio
                                :disabled="disabled"
                                key="3"
                                color="primary"
                                label="Pasaje"
                                value="pasaje"
                              ></v-radio>
                              <v-radio
                                :disabled="disabled"
                                key="4"
                                color="primary"
                                label="Callejón"
                                value="callejón"
                              ></v-radio>
                              <v-radio
                                :disabled="disabled"
                                key="5"
                                color="primary"
                                label="Otro"
                                value="otro"
                              ></v-radio>
                            </v-radio-group>
                          </v-flex>
                          <v-flex xs12 sm12 md6 lg6 v-if="configurationElements.calle">
                            <v-text-field
                              :disabled="disabled"
                              :label="`Nombre (de la/del) ${(calleAvenida) ? calleAvenida : ''}`"
                              placeholder="Por ejemplo: Montes"
                              hint="Tiene que escribir el nombre completo de la opcion seleccionada"
                              persistent-hint
                              v-model="nombreCalleAvenida"
                              :required="true"
                              :rules="[(val) => !!val || 'El campo no puede estar vacio']"
                            >
                            </v-text-field>
                          </v-flex>
                          <!-- FIN CALLE -->
                        </v-layout>
                      </v-flex>
                      <v-flex xs12 sm12 md6 lg6 v-if="configurationElements.direccionRefencial">
                        <v-text-field
                          :disabled="disabled"
                          label="Dirección Referencial"
                          v-model="nombreDireccionReferencial"
                          vuetplaceholder="Por ejemplo: Calacoto, calle 15"
                          class="pr-3"
                          :required="true"
                          :rules="[(val) => !!val || 'El campo no puede estar vacio']"
                        >
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md6 lg6 v-if="configurationElements.numeroDomicilio">
                        <v-text-field
                          :disabled="disabled"
                          label="Número de domicilio"
                          v-model="nombreNumeroDomicilio"
                          placeholder="Por ejemplo: 1540"
                          :required="true"
                          :rules="[(val) => !!val || 'El campo no puede estar vacio']"
                        >
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md6 lg6 v-if="configurationElements.nombreEdificio">
                        <v-text-field
                          :disabled="disabled"
                          class="pr-3"
                          label="Nombre del Edificio"
                          v-model="nombreNombreEdificio"
                          placeholder="Por ejemplo: San Miguel"
                        >
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md6 lg6 v-if="configurationElements.pisoEdificio">
                        <v-text-field
                          :disabled="disabled"
                          label="Piso"
                          v-model="nombrePiso"
                          class="pr-3"
                          placeholder="Por ejemplo: 5"
                        >
                        </v-text-field>
                      </v-flex>
                      <!-- INICIO OFICINA -->
                      <v-flex xs12 sm12 md6 lg6 v-if="configurationElements.oficina">
                        <v-radio-group 
                          row 
                          v-model="oficinaLocal"
                          >
                          <v-radio
                            :disabled="disabled"
                            key="1"
                            color="primary"
                            label="Departamento"
                            value="departamento"
                          ></v-radio>
                          <v-radio
                            :disabled="disabled"
                            key="2"
                            color="primary"
                            label="Local"
                            value="local"
                          ></v-radio>
                          <v-radio
                            :disabled="disabled"
                            key="3"
                            color="primary"
                            label="Oficina"
                            value="oficina"
                          ></v-radio>
                        </v-radio-group>
                    </v-flex>
                    <v-flex xs12 sm12 md6 lg6 v-if="configurationElements.oficina">
                        <v-text-field
                          :disabled="disabled"
                          :label="`Nombre (de la/del) ${(oficinaLocal) ? oficinaLocal : ''}`"
                          v-model="NombreOficinaLocal"
                          placeholder="Por ejemplo: Recursos"
                          hint="Tiene que escribir el nombre completo de la opcion seleccionada"
                          persistent-hint
                        >
                      </v-text-field>
                    </v-flex>
                  <!-- FIN OFICINA -->
                <!-- ADICIONANDO LAS OPCIONES DE VALERIA  -->
                <v-flex xs12 sm12 md12 lg12>
                <div class="mapa">
                  <!-- <div id="ubicacion"></div> -->
                  <l-map ref="map" id="ubicacion" :zoom="15" :center="center" v-on:click="clickOnMap($event)">
                    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                     <!-- <v-geosearch :options="geosearchOptions"></v-geosearch> -->
                    <l-marker 
                      v-for="item in markers"  
                      :key="item.id"
                      :lat-lng="item.position" 
                      :visible="item.visible" 
                      :draggable="item.draggable"
                      v-on:click="clickOnMarker($event, item, item.id)"
                      v-on:move="markerMoved($event, item)"
                    >
                     <!-- <l-popup content="Lugar seleccionado"></l-popup> -->
                    </l-marker>
                  </l-map>
                  <v-text-field
                    class="bloqueOculto"
                    v-model="isValid"
                    :rules="[ v => !!v || 'Tiene que seleccionar una ubicacion ']"
                    label=""
                    required
                  ></v-text-field>
                </div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <div>
          <v-dialog v-model="dialog" persistent max-width="700" v-if="settings">
              <v-btn icon slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Direccion</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-text-field label="Nombre" v-model="label" hint="Nombre descriptivo que aparecera encima del mapa."></v-text-field>
                        <div class="black--text mb-3">Campos que seran visibles en el formulario:</div>
                      </v-flex>
                      <v-flex xs12 sm12 md6 lg6>
                        <table>
                          <tr>
                            <td>Departamento</td>
                            <td>
                              <v-tooltip bottom>
                                <v-btn slot="activator" icon color="success">
                                  <v-icon>check</v-icon>
                                </v-btn>
                                <span>Mostrar departamento</span>
                              </v-tooltip>
                            </td>
                          </tr>
                          <tr>
                            <td>Provincia</td>
                            <td>
                              <v-tooltip bottom>
                                <v-btn slot="activator" icon color="success">
                                  <v-icon>check</v-icon>
                                </v-btn>
                                <span>Mostrar provincia</span>
                              </v-tooltip>
                            </td>
                          </tr>
                          <tr>
                            <td>Municipio</td>
                            <td>
                              <v-tooltip bottom>
                                <v-btn slot="activator" icon color="success">
                                  <v-icon>check</v-icon>
                                </v-btn>
                                <span>Mostrar municipio</span>
                              </v-tooltip>
                            </td>
                          </tr>
                          <tr>
                            <td>Zona/Barrio/Unidad Vecinal u otro</td>
                            <td>
                              <v-tooltip bottom>
                                <v-btn slot="activator" icon :color="(configurationElements.zona) ? 'success' : 'error'" @click.prevent="showAndHide(4)">
                                  <v-icon>{{(configurationElements.zona) ? 'check' : 'close'}}</v-icon>
                                </v-btn>
                                <span>{{(configurationElements.zona) ? 'Mostrar zona, barrio, unidad vecinal o utro' : 'No mostrar zona, barrio, unidad vecinal o utro'}}</span>
                              </v-tooltip>
                            </td>
                          </tr>
                          <tr>
                            <td>Calle/Avenida/Pasaje/Callejón u otro</td>
                            <td>
                              <v-tooltip bottom>
                                <v-btn slot="activator" icon :color="(configurationElements.calle) ? 'success' : 'error'" @click.prevent="showAndHide(5)">
                                  <v-icon>{{(configurationElements.calle) ? 'check' : 'close'}}</v-icon>
                                </v-btn>
                                <span>{{(configurationElements.calle) ? 'Mostrar calle, avenida, pasaje, callejón u utro' : 'No mostrar calle, avenida, pasaje, callejón u utro'}}</span>
                              </v-tooltip>
                            </td>
                          </tr>
                          </table>
                      </v-flex>
                      <v-flex xs12 sm12 md6 lg6>
                          <table>
                          <tr>
                            <td>Dirección referencial</td>
                            <td>
                              <v-tooltip bottom>
                                <v-btn slot="activator" icon :color="(configurationElements.direccionRefencial) ? 'success' : 'error'" @click.prevent="showAndHide(6)">
                                  <v-icon>{{(configurationElements.direccionRefencial) ? 'check' : 'close'}}</v-icon>
                                </v-btn>
                                <span>{{(configurationElements.direccionRefencial) ? 'Mostrar dirección referencial' : 'No mostrar dirección referencial'}}</span>
                              </v-tooltip>
                            </td>
                          </tr>
                          <tr>
                            <td>Número de domicilio</td>
                            <td>
                              <v-tooltip bottom>
                                <v-btn slot="activator" icon :color="(configurationElements.numeroDomicilio) ?  'success' : 'error'" @click.prevent="showAndHide(7)">
                                  <v-icon>{{(configurationElements.numeroDomicilio) ? 'check' : 'close'}}</v-icon>
                                </v-btn>
                                <span>{{(configurationElements.numeroDomicilio) ? 'Mostrar número de domicilio' : 'No mostrar número de domicilio'}}</span>
                              </v-tooltip>
                            </td>
                          </tr>
                          <tr>
                            <td>Nombre del edificio</td>
                            <td>
                              <v-tooltip bottom>
                                <v-btn slot="activator" icon :color="(configurationElements.nombreEdificio) ? 'success' : 'error'" @click.prevent="showAndHide(8)">
                                  <v-icon>{{(configurationElements.nombreEdificio) ? 'check' : 'close'}}</v-icon>
                                </v-btn>
                                <span>{{(configurationElements.nombreEdificio) ? 'Mostrar nombre del edificio' : 'No mostrar nombre del edificio'}}</span>
                              </v-tooltip>
                            </td>
                          </tr>
                          <tr>
                            <td>Piso del edificio</td>
                            <td>
                              <v-tooltip bottom>
                                <v-btn slot="activator" icon :color="(configurationElements.pisoEdificio) ? 'success' : 'error'" @click.prevent="showAndHide(9)">
                                  <v-icon>{{(configurationElements.pisoEdificio) ? 'check' : 'close'}}</v-icon>
                                </v-btn>
                                <span>{{(configurationElements.pisoEdificio) ? 'Mostrar el piso del edificio' : 'No mostrar el piso del edificio'}}</span>
                              </v-tooltip>
                            </td>
                          </tr>
                          <tr>
                            <td>Departemento/Local/Oficina</td>
                            <td>
                              <v-tooltip bottom>
                                <v-btn slot="activator" icon :color="(configurationElements.oficina) ? 'success' : 'error'" @click.prevent="showAndHide(10)">
                                  <v-icon>{{(configurationElements.oficina) ? 'check' : 'close'}}</v-icon>
                                </v-btn>
                                <span>{{(configurationElements.oficina) ? 'Mostrar departamento, local u oficina' : 'No mostrar departamento, local u oficina'}}</span>
                              </v-tooltip>
                            </td>
                          </tr>
                        </table>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-checkbox color="primary" label="Desea que puedan marcar varios puntos en el mapa?" 
                        v-model="multipleMarkers" 
                        hint="Nota: Si esta activado permitira muchos marcadores o puntos en el mapa, caso contrario permitira solamente un punto." persistent-hint></v-checkbox>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                    <label for="validations">Validaciones</label>
                    <div class="listaValidaciones">
                      <div v-for="(item, idx) in listValidations" :key="idx">
                        <v-checkbox :label="item.titulo" color="primary" v-model="selected" :value="item.titulo"></v-checkbox>
                      </div>
                    </div>
                  </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click.native="dialog = false">Cancelar</v-btn>
                  <v-btn color="primary" @click.native="dialog = false">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
/* global L */
/* eslint new-cap:0 */
/* eslint no-undef:0 */
import validate from '../../validate.js';
import crypto from 'crypto';
import slugify from 'slugify';
import dpa from './dpa.json';
import config from '../../../../../../config';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
// import { OpenStreetMapProvider } from 'leaflet-geosearch';
// import VGeosearch from 'vue2-leaflet-geosearch';
// import 'leaflet-geosearch/assets/css/leaflet.css';
// L.Icon.Default.imagePath = (process.env.NODE_ENV === 'development') ? `../../../../../..${config.dev.assetsPublicPath}static/images/` : `../../../../../..${config.build.assetsPublicPath}static/images/`;
L.Icon.Default.imagePath = (process.env.NODE_ENV === 'development') ? `${config.dev.assetsPublicPath}static/images/` : `${config.build.assetsPublicPath}static/images/`;
const COMPONENT_NAME = 'map';
export default {
  name: COMPONENT_NAME,
  mixins: [validate],
  props: [ 'form', 'field', 'model', 'to', 'all' ],
  data () {
    return {
      isDev: false,
      path: null,
      item: null,
      disabled: false,
      isValid: null,
      departamentos: [],
      departamento: null,
      provincias: [],
      provincia: null,
      municipios: [],
      municipio: null,
      numMarkets: null,
      multipleMarkers: false,
      markers: [],
      // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      label: null,
      dialog: null,
      settings: null,
      intance: null,
      // geosearchOptions: { // Important part Here
      //   provider: new OpenStreetMapProvider()
      // },
      zoom: 13,
      center: L.latLng(-16.494608212524277, -68.13416796511032),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // http://c.tile.stamen.com/toner/{z}/{x}/{y}.png
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      marker: null,
      zonaBarrio: null,
      calleAvenida: null,
      oficinaLocal: null,
      nombreZonaBarrio: null,
      nombreCalleAvenida: null,
      nombreDireccionReferencial: null,
      nombreNumeroDomicilio: null,
      nombreNombreEdificio: null,
      nombrePiso: null,
      NombreOficinaLocal: null,
      configurationElements: {
        departamento: true,
        provincia: true,
        municipio: true,
        zona: true,
        calle: false,
        direccionRefencial: true,
        numeroDomicilio: false,
        nombreEdificio: false,
        pisoEdificio: false,
        oficina: false
      }
    };
  },
  watch: {
    zonaBarrio (zonaBarrio) {
      if (zonaBarrio) {
        this.to.value.zona_barrio_uv_otro = zonaBarrio;
        this.to.zonaBarrio = zonaBarrio;
      }
    },
    nombreZonaBarrio (nombreZonaBarrio) {
      if (nombreZonaBarrio) {
        this.to.value.nombreZonaBarrio = nombreZonaBarrio;
        this.to.nombreZonaBarrio = nombreZonaBarrio;
      }
    },
    calleAvenida (calleAvenida) {
      if (calleAvenida) {
        this.to.value.calle_avenida_pasaje_callejón = calleAvenida;
        this.to.calleAvenida = calleAvenida;
      }
    },
    nombreCalleAvenida (nombreCalleAvenida) {
      if (nombreCalleAvenida) {
        this.to.value.nombreCalleAvenida = nombreCalleAvenida;
        this.to.nombreCalleAvenida = nombreCalleAvenida;
      }
    },
    nombreDireccionReferencial (nombreDireccionReferencial) {
      if (nombreDireccionReferencial) {
        this.to.value.direccion_referencial = nombreDireccionReferencial;
        this.to.nombreDireccionReferencial = nombreDireccionReferencial;
      }
    },
    nombreNumeroDomicilio (nombreNumeroDomicilio) {
      if (nombreNumeroDomicilio) {
        this.to.value.número_de_domicilio = nombreNumeroDomicilio;
        this.to.nombreNumeroDomicilio = nombreNumeroDomicilio;
      }
    },
    nombreNombreEdificio (nombreNombreEdificio) {
      if (nombreNombreEdificio) {
        this.to.value.nombre_del_edificio = nombreNombreEdificio;
        this.to.nombreNombreEdificio = nombreNombreEdificio;
      }
    },
    nombrePiso (nombrePiso) {
      if (nombrePiso) {
        this.to.value.piso = nombrePiso;
        this.to.nombrePiso = nombrePiso;
      }
    },
    oficinaLocal (oficinaLocal) {
      if (oficinaLocal) {
        this.to.value.departamento_local_oficina = oficinaLocal;
        this.to.oficinaLocal = oficinaLocal;
      }
    },
    NombreOficinaLocal (NombreOficinaLocal) {
      if (NombreOficinaLocal) {
        this.to.value.NombreOficinaLocal = NombreOficinaLocal;
        this.to.NombreOficinaLocal = NombreOficinaLocal;
      }
    },
    disabled (disabled) {
      this.to.disabled = disabled;
      if (this.disabled) {
        this.$refs.map.mapObject._handlers.forEach((handler) => { handler.disable(); });
        this.$refs.map.mapObject.zoomControl.disable();
        // this.$refs.map.mapObject.dragging.disable();
        // this.$refs.map.mapObject.touchZoom.disable();
        // this.$refs.map.mapObject.doubleClickZoom.disable();
        // this.$refs.map.mapObject.scrollWheelZoom.disable();
        // this.$refs.map.mapObject.boxZoom.disable();
        // this.$refs.map.mapObject.keyboard.disable();
      }
    },
    multipleMarkers (multiple) {
      this.to.multiple = multiple;
      if (multiple) {
        if (this.markers.length > 0) {
          const ultimoElemento = this.markers.pop();
          this.markers = [];
          this.markers.push(ultimoElemento);
          this.to.position = [];
          this.to.position.push(ultimoElemento.position);
        } else {
          this.markers = [];
        }
      } else {
        this.markers = [];
      }
    },
    label (label) {
      this.to.label = label;
      this.to.id = slugify(label, '_');
    },
    markers (markers) {
      this.to.value.markers = markers;
    }
  },
  methods: {
    showAndHide (positionElement) {
      this.to.configurationElements = this.configurationElements;
      if (positionElement === 4) {
        this.configurationElements.zona = !this.configurationElements.zona;
      } else if (positionElement === 5) {
        this.configurationElements.calle = !this.configurationElements.calle;
      } else if (positionElement === 6) {
        this.configurationElements.direccionRefencial = !this.configurationElements.direccionRefencial;
      } else if (positionElement === 7) {
        this.configurationElements.numeroDomicilio = !this.configurationElements.numeroDomicilio;
      } else if (positionElement === 8) {
        this.configurationElements.nombreEdificio = !this.configurationElements.nombreEdificio;
      } else if (positionElement === 9) {
        this.configurationElements.pisoEdificio = !this.configurationElements.pisoEdificio;
      } else if (positionElement === 10) {
        this.configurationElements.oficina = !this.configurationElements.oficina;
      }
    },
    cargarMunicipios () {
      const dpaProvincia = this.provincia.dpa;
      const municipios = dpa.filter((item) => {
        if (dpaProvincia === item.dpa.substring(0, 4) && item.clave === 'municipio') {
          return item;
        }
      });
      this.municipios = municipios;
    },
    dibujarMunicipio () {
      this.intance = this.municipio;
      if (!this.to.dpa) {
        this.to.dpa = {};
      }
      this.to.dpa.municipio = this.intance;
      this.to.value.municipio = this.intance;
    },
    cargarProvincias () {
      const dpaDepartamento = this.departamento.dpa;
      const provincias = dpa.filter((item) => {
        if (dpaDepartamento === item.dpa.substring(0, 2) && item.clave === 'provincia') {
          return item;
        }
      });
      this.provincias = provincias;
    },
    dibujarProvincia () {
      this.intance = this.provincia;
      this.markers = [];
      this.markers.push({
        id: this.generateId(5),
        position: L.latLng(this.intance.geohash.longitud, this.intance.geohash.latitud),
        visible: true,
        draggable: true
      });
      this.to.position = this.markers;
      this.center = L.latLng(this.intance.geohash.longitud, this.intance.geohash.latitud);
      this.isValid = true;
      if (!this.to.dpa) {
        this.to.dpa = {};
      }
      this.to.dpa.provincia = this.intance;
      this.cargarMunicipios();
      this.to.value.provincia = this.intance;
    },
    dibujarDepartamento () {
      this.provincias = [];
      this.municipios = [];
      this.provincia = null;
      this.municipio = null;
      this.intance = this.departamento;
      this.markers = [];
      this.markers.push({
        id: this.generateId(5),
        position: L.latLng(this.intance.geohash.longitud, this.intance.geohash.latitud),
        visible: true,
        draggable: true
      });
      this.to.position = this.markers;
      this.center = L.latLng(this.intance.geohash.longitud, this.intance.geohash.latitud);
      this.isValid = true;
      if (!this.to.dpa) {
        this.to.dpa = {};
      }
      this.to.dpa.departamento = this.intance;
      this.cargarProvincias();
      this.to.value.departamento = this.intance;
    },
    /**
     * @function clickOnMap
     * @description Esta funcion esta encargada de capturar el evento click dentro del mapa
     * @param {Object} Event
     * @description Este parametro contiene la informacion como ser lat, lng, etc
     */
    clickOnMap (event) {
      if (!this.disabled) {
        if (!this.multipleMarkers) {
          if (this.markers.length > 1) {
            const ultimoElemento = this.markers.pop();
            this.markers = [];
            this.markers.push(ultimoElemento);
            this.to.position = [];
            this.to.position.push(ultimoElemento.position);
          } else {
            this.markers = [];
            this.to.position = [];
          }
        }
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;
        this.markers.push({
          id: this.generateId(5),
          position: L.latLng(lat, lng),
          visible: true,
          draggable: true
        });
        this.isValid = true;
        this.to.position = this.markers;
      }
    },
    clickOnMarker ($event, item, idGenerated) {
      if (!this.disabled) {
        this.markers = this.markers.filter((el) => {
          return el.id !== idGenerated;
        });
        this.markers = [...this.markers];
      }
    },
    markerMoved (event, item) {
    },
    generateId (len) {
      const uuid = crypto.randomBytes(20).toString('hex');
      return uuid;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.isValid = false;
      if (this.to.value) {
        const markers = [];
        if (this.to.value.markers[0]) {
          this.center = L.latLng(this.to.value.markers[0].position.lat, this.to.value.markers[0].position.lng);
          this.to.value.markers.forEach((marker) => {
            markers.push({
              id: this.generateId(5),
              position: L.latLng(marker.position.lat, marker.position.lng),
              visible: true,
              draggable: true
            });
          });
        }
        setTimeout(() => {
          this.markers = [...markers];
          this.isValid = true;
        }, 2000);
      } else {
        this.to.value = {
          zona_barrio_uv_otro: '',
          nombreZonaBarrio: '',
          calle_avenida_pasaje_callejón: '',
          nombreCalleAvenida: '',
          direccion_referencial: '',
          número_de_domicilio: '',
          nombre_del_edificio: '',
          piso: '',
          departamento_local_oficina: '',
          NombreOficinaLocal: '',
          latitud: '',
          longitud: '',
          markers: []
        };
      }
      this.label = this.to.label;
      this.settings = this.to.settings;
      this.multipleMarkers = (this.to.multiple) ? this.to.multiple : false;
      this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
      // Adicionando la opcion de que cuando sea comodin, este sea solo vista aunque tenga todos los permisos
      this.disabled = this.to.disabled;
      if (this.field.comodin) {
        this.disabled = this.to.disabled || !!this.field.comodin;
      }
      const departamentos = dpa.filter((item) => {
        if (item.clave === 'departamento') {
          return item;
        }
      });
      this.departamentos = departamentos;
      if (this.to.value.departamento) {
        const dep = this.departamentos.filter((item, pos) => {
          if (item.dpa === this.to.value.departamento.dpa) {
            return item;
          }
        });
        this.departamento = dep[0];
        this.cargarProvincias();
      }
      if (this.to.value.provincia) {
        const prov = this.provincias.filter((item, pos) => {
          if (item.dpa === this.to.value.provincia.dpa) {
            return item;
          }
        });
        this.provincia = (prov[0]) ? prov[0] : null;
        this.cargarMunicipios();
      }
      if (this.to.value.municipio) {
        const mun = this.municipios.filter((item, pos) => {
          if (item.dpa === this.to.value.municipio.dpa) {
            return item;
          }
        });
        this.municipio = (mun[0]) ? mun[0] : null;
      }
      if (this.to.value.zona_barrio_uv_otro) {
        this.zonaBarrio = this.to.value.zona_barrio_uv_otro;
      }
      if (this.to.value.nombreZonaBarrio) {
        this.nombreZonaBarrio = this.to.value.nombreZonaBarrio;
      }
      if (this.to.value.calle_avenida_pasaje_callejón) {
        this.calleAvenida = this.to.value.calle_avenida_pasaje_callejón;
      }
      if (this.to.value.nombreCalleAvenida) {
        this.nombreCalleAvenida = this.to.value.nombreCalleAvenida;
      }
      if (this.to.value.direccion_referencial) {
        this.nombreDireccionReferencial = this.to.value.direccion_referencial;
      }
      if (this.to.value.número_de_domicilio) {
        this.nombreNumeroDomicilio = this.to.value.número_de_domicilio;
      }
      if (this.to.value.nombre_del_edificio) {
        this.nombreNombreEdificio = this.to.value.nombre_del_edificio;
      }
      if (this.to.value.piso) {
        this.nombrePiso = this.to.value.piso;
      }
      if (this.to.value.departamento_local_oficina) {
        this.oficinaLocal = this.to.value.departamento_local_oficina;
      }
      if (this.to.value.NombreOficinaLocal) {
        this.NombreOficinaLocal = this.to.value.NombreOficinaLocal;
      }
      this.isDev = (process.env.NODE_ENV === 'development') ? true : false;
      this.path = (process.env.NODE_ENV === 'development') ? '/' : config.build.assetsPublicPath;
      this.configurationElements = this.to.configurationElements ? this.to.configurationElements : this.configurationElements;
      this.to.init = [
        'departamento',
        'provincia',
        'municipio',
        'zona_barrio_uv_otro',
        'calle_avenida_pasaje_callejón',
        'direccion_referencial',
        'número_de_domicilio',
        'nombre_del_edificio',
        'piso',
        'departamento_local_oficina',
        'longitud',
        'latitud'
      ];
      // setTimeout(() => {
      //   const map = L.map('ubicacion').setView([52, 4], 3);
      //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{test}', {
      //     test: function () {
      //       return Math.random();
      //     }
      //   }).addTo(map);
      // }, 1000);
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
  .quitarEspacio {
    margin-left: -16px;
  }
  .bloqueOculto {
    // display: none;
    margin-top: 0;
    padding-top: 0;
    label {
      display: none;
    }
    .input-group__input {
      display: none;
      input[type="text"] {
        display: none !important;
      }
      &::before {
        background-color: none !important;
      }
    }
    .input-group__details {
      &::before {
        background-color: none !important;
      }
      &:before {
        background-color: none !important;
      }
    }
  }
  #ubicacion {
    width: 100%;
    height: 100%;
  }
</style>
