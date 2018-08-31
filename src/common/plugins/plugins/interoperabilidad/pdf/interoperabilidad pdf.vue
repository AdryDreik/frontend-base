<template>
  <v-card flat>
    <v-card-text class="grid-container">
      <v-container fluid>
        <v-card class="pa-2 mt-2" flat>
          <div>
            <div class="primary--text text-md-center title">{{documentoPlantilla.titulo}}</div>
            <div class="text-md-center body-1"><small>Documento de Interoperabilidad</small></div>
          </div>
          <v-card-text>
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
            <p class="text-md-center primary--text subheading" v-if="(documentoPlantilla.body && documentoPlantilla.body.tipo === 'A') || (valores_retorno && valores_retorno.length)">
              <strong>RESPUESTA INMEDIATA</strong>
            </p>
            <v-layout row wrap v-for="(val, idx) in valores" v-bind:key="idx" class="mt-3" v-bind:class="[val.profundidad >= 0 ? 'profundidad-' + val.profundidad : '']" v-if="valores && valores.length">
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
              <v-flex xs8 v-if="val.type.includes('base64')">
                <v-layout row wrap>
                  <v-flex xs6 v-if="val.value">
                    <small>El archivo fue enviado.</small>
                  </v-flex>
                  <v-flex xs6 v-if="!val.value">
                    <small>El archivo no fue enviado.</small>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs8 v-if="val.type != 'json' && val.type !== 'titulo' && !val.type.includes('base64')">
                <label>{{val.value}}</label>
              </v-flex>
            </v-layout>
            <v-layout v-if="valores && !valores.length">
              <v-flex xs12 class="body-2">
                La información aún no fue procesada (ENVÍO).
              </v-flex>
            </v-layout>
            <p class="mt-5 text-md-center primary--text subheading" v-if="(documentoPlantilla.body && documentoPlantilla.body.tipo === 'A') || (valores_retorno && valores_retorno.length)">
              <strong>RETORNO</strong>
            </p>
            <v-layout row wrap v-for="(ret, idr) in valores_retorno" v-bind:key="'x' + idr" class="mt-3" v-bind:class="[ret.profundidad >= 0 ? 'profundidad-' + ret.profundidad : '']" v-if="valores_retorno && valores_retorno.length">
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
              <v-flex xs8 v-if="ret.type.includes('base64')">
                <v-layout row wrap>
                  <v-flex xs6 v-if="ret.value">
                    <small>El archivo fue enviado.</small>
                  </v-flex>
                  <v-flex xs6 v-if="!ret.value">
                    <small>El archivo no fue enviado.</small>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs8 v-if="ret.type != 'json' && ret.type !== 'titulo' && !ret.type.includes('base64')">
                <label>{{ret.value}}</label>
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
  export default {
    props: ['form', 'field', 'model', 'to'],
    data () {
      return {
        dialog: null,
        label: null,
        settings: null,
        layout: [],
        disabled: null,
        documento: {},
        documentoPlantilla: {},
        valores: [],
        valores_retorno: [],
        error: false
      };
    },
    mounted () {
      this.$nextTick(() => {
        this.label = this.to.label;
        this.settings = this.to.settings;
        this.disabled = true;
        if (this.to.value && this.to.value.documentoPlantilla) {
          this.documentoPlantilla = this.to.value.documentoPlantilla;
        }
        // Tiene data de interoperabilidad "Síncrona"
        if (this.to.value && this.to.value.documento && this.to.value.documento.valores && this.to.value.documento.valores.formateado) {
          this.valores = this.to.value.documento.valores.formateado;
        }
        // Tiene data de interoperabilidad "Asíncrona"
        if (this.to.value && this.to.value.documento && this.to.value.documento.valores && this.to.value.documento.valores.retorno_formateado) {
          this.valores_retorno = this.to.value.documento.valores.retorno_formateado;
        }
      });
    },
    methods: {
      formatear (texto) {
        return texto.replace(/([a-z])([A-Z])/g, '$1 $2');
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
    }
  };
</script>
<style lang="scss">
  .interoperabilidad-component{
    .container {
      padding: 0px;
    }
    .card__text {
      padding: 0px;
    }
  }
</style>
