<template>
  <v-card flat>
    <div v-if="settings">
      <interoperabilidad ref="cmpInteroperabilidad" :institucion="institucion" :esComponenteFormulario="settings" :fieldsDoc="all" :options="options" @actualizarOptions="actualizarOptions"/>
    </div>
    <v-card-text class="interoperabilidad-container">
      <v-layout row wrap class="mr-2" v-if="to && to.options && to.options.body && !disabled">
        <v-flex sm12 xs12 lg12 class="text-md-right" :id="idBoton">
          <small class="error--text" v-if="!to.idConfiguracion">Ocurrieron errores al guardar la configuración en el microservicio. Por favor intente guardar la configuración nuevamente.</small>
          <v-tooltip top>
            <v-btn color="info" slot="activator" @click.prevent="consultarMicroservicio" :disabled="!to.idConfiguracion">
              <v-icon>keyboard_arrow_right</v-icon>
              CONSULTAR
            </v-btn>
            <span>Se realizará una consulta.</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="mr-2" v-if="to.value && to.value.documentoPlantilla && to.value.documentoPlantilla._id && to.value.documento && to.value.documento._id && !seleccionables && !disabled && esSeleccionable">
        <v-flex sm12 xs12 lg12 class="text-md-right">
          <v-tooltip top>
            <v-btn color="info" slot="activator" @click.prevent="deshacerSeleccion">
              <v-icon>undo</v-icon>
              DESHACER SELECCIÓN
            </v-btn>
            <span>Se realizará una consulta.</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="mr-2" v-if="((to && to.options) || !disabled) && seleccionables">
        <v-flex sm12 xs12 lg12 class="text-md-right">
          <v-tooltip top>
            <v-btn color="info" slot="activator" @click.prevent="seleccionarGuardar">
              <v-icon>check</v-icon>
              SELECCIONAR
            </v-btn>
            <span>Se realizará una consulta.</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
      <v-container fluid>
        <v-card class="pa-2 mt-2" flat>
          <div>
            <div class="primary--text text-md-center title">{{documentoPlantilla.titulo}}</div>
            <div class="text-md-center body-1"><small>Documento de Interoperabilidad</small></div>
          </div>
          <v-list three-line expand class="lista-interoperabilidad">
            <template v-for="(seleccionable, index) in seleccionables">
              <v-list-tile :key="seleccionable.title" avatar ripple @click="seleccionar(index)" :class="seleccionados.indexOf(index) >= 0 ? 'seleccionado' : ''">
                <v-list-tile-content>
                  <v-layout row wrap v-for="(val, idx) in seleccionable" v-bind:key="idx" class="mt-3" v-bind:class="[val.profundidad >= 0 ? 'profundidad profundidad-' + val.profundidad : '']">
                    <v-flex xs12 v-if="val.type === 'titulo'" class="form-int-titulo pa-1 blue-grey lighten-5">
                    </v-flex>
                    <v-flex xs12 v-if="val.type === 'titulo'" class="form-int-titulo pa-1 blue-grey lighten-5">
                      <strong>{{val.label}}</strong>
                    </v-flex>
                    {{val.indice}}<br>
                    <v-flex xs4 v-if="val.type !== 'titulo'">
                      <label><strong>{{val.label}}:</strong></label>
                    </v-flex>
                    <v-flex xs8 v-if="val.type === 'json'">
                      <v-layout row wrap v-for="(x, i) in val.value" v-bind:key="i">
                        <v-flex xs6>
                          <small><strong>{{formatear(i)}}</strong></small>
                        </v-flex>
                        <v-flex xs6>
                          <label>{{x}}</label>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs8 v-if="val.type === 'url'">
                      <v-layout row wrap>
                        <v-flex xs6 v-if="val.value">
                          <v-btn depressed small :href="val.value" target="_blank"><v-icon>call_made</v-icon>{{val.value}}</v-btn>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs8 v-if="val.type.includes('base64')">
                      <v-layout row wrap>
                        <v-flex xs6 v-if="val.value">
                          <v-btn depressed small @click.prevent="mostrarBase64(val.value, val.mime, val.extension)"><v-icon>call_made</v-icon>Visualizar</v-btn>
                        </v-flex>
                        <v-flex xs6 v-if="!val.value">
                          <small>El archivo no fue enviado.</small>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs8 v-if="val.type != 'json' && val.type !== 'titulo' && !val.type.includes('base64') && val.type !== 'url'">
                      <label>{{val.value}}</label>
                    </v-flex>
                  </v-layout>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>{{ seleccionable.action }}</v-list-tile-action-text>
                  <v-icon v-if="seleccionados.indexOf(index) < 0" color="grey lighten-1">check_circle</v-icon>
                  <v-icon v-else color="success darken-2">check_circle_outline</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < seleccionables.length" :key="index"></v-divider>
            </template>
          </v-list>

          <v-card-text v-if="!seleccionables">
            <v-layout row wrap v-if="error">
              <p class="text-md-center error--text subheading">
                <strong>SE DIERON ERRORES</strong>
              </p>
              <v-layout row wrap>
                <v-flex xs12 v-if="error.status">
                  <strong>Estado del error: </strong>{{error.status}}
                </v-flex>
                <v-flex xs12 v-if="error.error" class="scroll-hidden">
                  <p><strong>Descripción del error: </strong></p>
                  <pre><small>{{error.error}}</small></pre>
                </v-flex>
                <v-flex xs12 v-if="error.esquema" class="scroll-hidden">
                  <p><strong>Esquema de la solicitud: </strong></p>
                  <pre><small>{{error.esquema}}</small></pre>
                </v-flex>
              </v-layout>
            </v-layout>
            <p class="text-md-center primary--text subheading" v-if="(documentoPlantilla.body && documentoPlantilla.body.tipo === 'A') || (valores && valores_retorno && valores_retorno.length)">
              <strong>RESPUESTA INMEDIATA</strong>
            </p>
            <v-layout row wrap v-for="(val, idx) in valores" v-bind:key="idx" class="mt-3" v-bind:class="[val.profundidad >= 0 ? 'profundidad profundidad-' + val.profundidad : '']" v-if="valores && valores.length">
              <v-flex xs12 v-if="val.type === 'titulo'" class="form-int-titulo pa-1 blue-grey lighten-5">
                <strong>{{val.label}}</strong>
              </v-flex>
              <v-flex xs4 v-if="val.type !== 'titulo'">
                <label><strong>{{val.label}}:</strong></label>
              </v-flex>
              <v-flex xs8 v-if="val.type === 'json'">
                <v-layout row wrap v-for="(x, i) in val.value" v-bind:key="i">
                  <v-flex xs6>
                    <small><strong>{{formatear(i)}}</strong></small>
                  </v-flex>
                  <v-flex xs6>
                    <label>{{x}}</label>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs8 v-if="val.type === 'url'">
                <v-layout row wrap>
                  <v-flex xs6 v-if="val.value">
                    <v-btn depressed small :href="val.value" target="_blank"><v-icon>call_made</v-icon>{{val.value}}</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs8 v-if="val.type.includes('base64')">
                <v-layout row wrap>
                  <v-flex xs6 v-if="val.value">
                    <v-btn depressed small @click.prevent="mostrarBase64(val.value, val.mime, val.extension)"><v-icon>call_made</v-icon>Visualizar</v-btn>
                  </v-flex>
                  <v-flex xs6 v-if="!val.value">
                    <small>El archivo no fue enviado.</small>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs8 v-if="val.type != 'json' && val.type !== 'titulo' && !val.type.includes('base64') && val.type !== 'url'">
                <div class="interoperabilidad-component" v-if="val.component && !disabled">
                  <formly-form :id="`item-${val.component.name}`" :form="formLista" :model="modelLista" :fields="[val.component]" v-if="val.component"></formly-form>
                </div>
                <label v-if="!val.component || disabled">{{val.value}}</label>
              </v-flex>
            </v-layout>
            <v-layout v-if="valores && !valores.length">
              <v-flex xs12 class="body-2">
                La información no fue procesada (ENVÍO).
              </v-flex>
            </v-layout>
            <p class="mt-5 text-md-center primary--text subheading" v-if="(documentoPlantilla.body && documentoPlantilla.body.tipo === 'A') || (valores_retorno && valores_retorno.length)">
              <strong>RETORNO</strong>
            </p>
            <v-layout row wrap v-for="(ret, idr) in valores_retorno" v-bind:key="'x' + idr" class="mt-3" v-bind:class="[ret.profundidad >= 0 ? 'profundidad profundidad-' + ret.profundidad : '']" v-if="valores_retorno && valores_retorno.length">
              <v-flex xs12 v-if="ret.type === 'titulo'" class="form-int-titulo pa-1 blue-grey lighten-5">
                <strong>{{ret.label}}</strong>
              </v-flex>
              <v-flex xs4 v-if="ret.type !== 'titulo'">
                <label><strong>{{ret.label}}:</strong></label>
              </v-flex>
              <v-flex xs8 v-if="ret.type === 'json'">
                <v-layout row wrap v-for="(y, j) in ret.value" v-bind:key="j">
                  <v-flex xs6>
                    <small><strong>{{formatear(j)}}</strong></small>
                  </v-flex>
                  <v-flex xs6>
                    <label>{{y}}</label>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs8 v-if="ret.type === 'url'">
                <v-layout row wrap>
                  <v-flex xs6 v-if="ret.value">
                    <v-btn depressed small :href="ret.value" target="_blank"><v-icon>call_made</v-icon>{{ret.value}}</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs8 v-if="ret.type.includes('base64')">
                <v-layout row wrap>
                  <v-flex xs6 v-if="ret.value">
                    <v-btn depressed small @click.prevent="mostrarBase64(ret.value, ret.mime, ret.extension)"><v-icon>call_made</v-icon>Visualizar</v-btn>
                  </v-flex>
                  <v-flex xs6 v-if="!ret.value">
                    <small>El archivo no fue enviado.</small>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs8 v-if="ret.type != 'json' && ret.type !== 'titulo' && !ret.type.includes('base64') && ret.type !== 'url'">
                <div class="interoperabilidad-component" v-if="ret.component && !disabled">
                  <formly-form :id="`item-${ret.component.name}`" :form="formLista" :model="modelLista" :fields="[ret.component]" v-if="ret.component"></formly-form>
                </div>
                <label v-if="!ret.component || disabled">{{ret.value}}</label>
              </v-flex>
            </v-layout>
            <v-layout v-if="documentoPlantilla.body && documentoPlantilla.body.tipo === 'A' && documento.valores && ((documento.valores.retorno && documento.valores.retorno.pendiente) || documento.valores.error)">
              <v-flex xs12 class="body-2">
                La información aún no fue procesada (RETORNO).
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
  import Interoperabilidad from '@/common/util/componentes-basicos/interoperabilidad/interoperabilidad.vue';
  import {GridLayout, GridItem} from 'vue-grid-layout';
  import slugify from 'slugify';
  import draggable from 'vuedraggable';
  import InteroperabilidadMixin from './mixins/interoperabilidad';
  import axios from 'axios';
  export default {
    props: ['form', 'field', 'model', 'to', 'all'],
    mixins: [InteroperabilidadMixin],
    data () {
      return {
        dialog: null,
        label: null,
        settings: null,
        layout: [],
        disabled: null,
        documento: {},
        documentoPlantilla: {},
        valores: null,
        valores_retorno: null,
        error: false,
        modelLista: {},
        formLista: {},
        institucion: true,
        options: {},
        idBoton: null,
        seleccionables: null,
        seleccionados: [],
        esSeleccionable: false
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
        this.field.name = (this.field && this.field.name && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
        this.disabled = this.to.disabled;
        // Tiene datos de configuracion
        if (this.to && this.to.options) {
          this.options = this.to.options;
        }
        this.settings = this.to.settings;

        this.actualizarValue();
      });
    },
    methods: {
      formatear (texto) {
        return texto.replace(/([a-z])([A-Z])/g, '$1 $2');
      },
      seleccionar (index) {
        const i = this.seleccionados.indexOf(index);
        if (i > -1) {
          this.seleccionados.splice(i, 1);
        } else {
          this.seleccionados.push(index);
        }
      },
      async deshacerSeleccion () {
        if (this.to.value.documentoPlantilla && this.to.value.documentoPlantilla._id && this.to.value.documento && this.to.value.documento._id) {
          console.log('>> abc', this.to);
          const respuesta = await this.$service.post(`interoperabilidad/ejecucion/seleccionables/${this.to.value.documentoPlantilla._id}/${this.to.value.documento._id}`, this.to.value);
          if (respuesta && respuesta.formateado && respuesta.seleccionables) {
            this.to.value.documento.valores.seleccionables = respuesta.seleccionables;
            this.to.value.documento.valores.formateado = respuesta.formateado;
            this.actualizarValue();
          }
        }
      },
      seleccionarGuardar () {
        console.log('yeahh');
        if (!this.seleccionados || (this.seleccionados && !this.seleccionados.length)) {
          this.$message.error('Debe seleccionar los datos para proseguir.');
          return;
        }
        if (this.to.value && this.to.value.documento && this.to.value.documento.valores && this.to.value.documento.valores.formateado) {
          let seleccionadosAux = [];
          let seleccionablesAux = [];
          const formateadoAux = [];
          this.seleccionados.forEach(idx => {
            seleccionadosAux = seleccionadosAux.concat(this.seleccionables[idx].map(item => item));
          });
          this.seleccionables.forEach((itemS, idx) => {
            seleccionablesAux = seleccionablesAux.concat(itemS.map(item => item));
          });
          console.log('seleccionablesAux');
          console.log(seleccionablesAux);
          this.to.value.documento.valores.formateado.forEach(valor => {
            const existeSeleccionado = seleccionadosAux.filter(itemS => itemS.nombreOrigen === valor.nombreOrigen)[0];
            const existeSeleccionable = seleccionablesAux.filter(itemS => itemS.nombreOrigen === valor.nombreOrigen)[0];
            console.log('existeSeleccionado: ', existeSeleccionado, 'existeSeleccionable', existeSeleccionable);
            if (!existeSeleccionable || (existeSeleccionable && existeSeleccionado)) {
              formateadoAux.push(valor);
              console.log('es seleccionable y seleccionado');
            } else if (!existeSeleccionable) {
              formateadoAux.push(valor);
              console.log('no es seleccionable');
            }
          });
          this.to.value.documento.valores.formateado = formateadoAux;
          delete this.to.value.documento.valores.seleccionables;
          this.actualizarValue();
        }
      },
      async consultarMicroservicio () {
        console.log('consultando microservicio....');
        this.seleccionados = [];
        this.to.value = null;
        this.documentoPlantilla = {};
        this.valores = [];
        this.valores_retorno = [];
        if (this.options) {
          if (!this.to.idConfiguracion) {
            this.$message.error('No se guardó la configuración de interoperabilidad en el microservicio. Por favor intente guardar la configuración nuevamente.');
          }
          this.$waiting(true, 'Consultando los datos...');
          console.log(this.getComponentValue(this, 'aaa'));
          const data = {
            options: this.options,
            documentos: [this.obtenerValoresDocumento()]
          };
          const req = {
            url: `${process.env.SERVER}/proxy/${this.to.proxy.idPlugin}/configuraciones/consultarInteroperabilidad/${this.to.idConfiguracion}`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$storage.get('token')}`
            },
            json: true,
            data: data
          };
          let respuesta;
          try {
            respuesta = await axios(req);
            // const respuesta = await this.$service.post('interoperabilidad/ejecucion/componente', data);
            if (respuesta && respuesta.data && respuesta.data.datos && respuesta.data.datos.idRespuesta) {
              console.log('>>>>>>>>>>>>>>>>>> respuesta');
              console.log(respuesta);
              this.to.value = respuesta.data.datos;
              this.actualizarValue();
            } else {
              this.$message.error('La consulta no se hizo correctamente, por favor intente nuevamente.');
            }
            this.$waiting(false);
          } catch (error) {
            if (error.response && error.response.data) {
              respuesta = error.response.data;
              this.$message.error(respuesta.mensaje || 'La consulta no se hizo correctamente, por favor intente nuevamente.');
            }
            this.$waiting(false);
          }
        } else {
          this.$message.error('La configuración del componente es incorrecta.');
        }
      },
      actualizarValue () {
        // Tiene datos en value
        console.log('>>>>>>>>>>>>>>>>>>>>>> this.to');
        console.log(this.to);
        if (this.to.value && this.to.value.documentoPlantilla) {
          this.documentoPlantilla = this.to.value.documentoPlantilla;
          if (this.documentoPlantilla.body && this.documentoPlantilla.body.envio && this.documentoPlantilla.body.envio.respuesta) {
            this.esSeleccionable = this.documentoPlantilla.body.envio.respuesta.filter(item => item.tipo === 'array_seleccionable')[0];
          }
        }
        if (this.to.value && this.to.value.documento) {
          this.documento = this.to.value.documento;
        }
        // Tiene data de interoperabilidad "Síncrona"
        if (this.to.value && this.to.value.documento && this.to.value.documento.valores && this.to.value.documento.valores.formateado) {
          this.valores = this.to.value.documento.valores.formateado;
        }
        // Tiene data de interoperabilidad "Seleccionable"
        if (this.to.value && this.to.value.documento && this.to.value.documento.valores && this.to.value.documento.valores.seleccionables && this.to.value.documento.valores.seleccionables.length) {
          this.seleccionables = this.to.value.documento.valores.seleccionables;
          this.seleccionados = [];
        } else {
          this.seleccionables = null;
          this.seleccionados = [];
        }
        // Tiene data de interoperabilidad "Asíncrona"
        if (this.to.value && this.to.value.documento && this.to.value.documento.valores && this.to.value.documento.valores.retorno_formateado) {
          this.valores_retorno = this.to.value.documento.valores.retorno_formateado;
        }
        if (this.to.value && this.to.value.documento && this.to.value.documento.valores && this.to.value.documento.valores.error) {
          this.error = this.to.value.documento.valores;
        }
        if (this.settings) {
          this.to.value = null;
        }
      },
      obtenerValoresDocumento () {
        const documentoAux = {
          valores: []
        };
        console.log('this.all', this.all);
        if (this.options && this.options.body && this.options.body.envio && this.options.body.envio.esquema) {
          this.options.body.envio.esquema.forEach(comp => {
            documentoAux.valores.push({
              key: comp.name,
              value: this.getComponentValue(this, comp.name)
            });
          });
        }
        return documentoAux;
      },
      actualizarOptions (data) {
        console.log('actualizando options', data);
        this.label = data.titulo;
        this.to.options = data;
        this.guardarConfiguracion(data, this.to.idConfiguracion);
        delete this.to.options.nombreDocumento;
        delete this.to.options.idDocumento;
        this.options = data;
      },
      async guardarConfiguracion (data, idConfiguracion) {
        let urlEnvio = '';
        if (idConfiguracion) {
          urlEnvio = `${process.env.SERVER}/proxy/${this.to.proxy.idPlugin}/configuraciones/${idConfiguracion}`;
        } else {
          urlEnvio = `${process.env.SERVER}/proxy/${this.to.proxy.idPlugin}/configuraciones/`;
        }
        const req = {
          url: urlEnvio,
          method: idConfiguracion ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.$storage.get('token')}`
          },
          json: true,
          data: {origen: 'BPM', esquema: data}
        };
        let respuesta;
        try {
          respuesta = await axios(req);
          if (respuesta && respuesta.data && respuesta.data.datos && respuesta.data.datos._id) {
            this.to.idConfiguracion = respuesta.data.datos._id;
          } else if (respuesta && respuesta.data && !respuesta.data.datos) {
            delete this.to.idConfiguracion;
            this.$message.error('La configuración no se guardó correctamente, por favor intente nuevamente.');
          }
          this.idBoton = `id${new Date()}`;
          this.to.validations = [{validar: true}];
          this.$waiting(false);
        } catch (error) {
          if (error.response && error.response.data) {
            respuesta = error.response.data;
            this.$message.error(respuesta.mensaje || 'La configuración no se guardó correctamente, por favor intente nuevamente.');
          } else {
            this.$message.error('La configuración no se guardó correctamente, por favor intente nuevamente.');
          }
          delete this.to.idConfiguracion;
          this.idBoton = `id${new Date()}`;
          this.$waiting(false);
        }
      },
      mostrarBase64 (valor, mime, extension) {
        if (valor.includes('data')) {
          valor = valor.split(',')[1];
        }
        const archivoBlob = this.crearBlobDeBase64(valor, mime);
        const fileURL = URL.createObjectURL(archivoBlob);
        window.open(fileURL, '_blank');
        // window.location.href = fileURL;//'data:application/octet-stream;base64,' + valor;
      },
      crearBlobDeBase64 (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(b64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);
          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {
          type: contentType
        });
        return blob;
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
      label (label) {
        this.to.label = label;
        this.to.id = slugify(label, '_');
        this.to.id = this.to.id.replace('ñ', 'n');
      }
    },
    components: {draggable, GridLayout, GridItem, Interoperabilidad}
  };
</script>
<style lang="scss">
  .lista-interoperabilidad {
    .list__tile {
      height: auto;
    }
    .seleccionado {
      background: #E8F5E9;
    }
  }
  .interoperabilidad-component{
    .container {
      padding: 0px;
    }
    .card__text {
      padding: 0px;
    }
  }
  .scroll-hidden {
    overflow: auto;
  }
  .interoperabilidad-container {
    width: 100%;
    table-layout: fixed;
    display: inline-table;
    margin-top: 20px;
  }
  .profundidad {
    width: 100%;
  }
  .profundidad-0 {
    margin-left: 0px;
  }
  .profundidad-1 {
    margin-left: 10px;
  }
  .profundidad-2 {
    margin-left: 20px;
    font-size: 15px;
  }
  .profundidad-3 {
    margin-left: 30px;
    font-size: 14px;
  }
  .profundidad-4 {
    margin-left: 40px;
    font-size: 12px;
  }
  .profundidad-5 {
    margin-left: 50px;
    font-size: 12px;
  }
  .profundidad-6 {
    margin-left: 60px;
    font-size: 12px;
  }
  .profundidad-7 {
    margin-left: 70px;
    font-size: 12px;
  }
  .profundidad-8 {
    margin-left: 80px;
    font-size: 12px;
  }
  .profundidad-9 {
    margin-left: 90px;
    font-size: 12px;
  }
</style>
