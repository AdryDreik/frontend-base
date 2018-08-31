<template>
  <v-card flat>
    <v-card-text>
        <v-container>
          <v-layout row wrap>
            <!-- <v-flex xs12 md12 :class="`pt-${espacioSuperior}`">
              <v-text-field
                v-model="input"
                :label="label" 
                color="primary darken-2"
                :required="required"
                :rules="customRules"
                :disabled="disabled"
                :placeholder="placeholder">
                </v-text-field>

            </v-flex> -->
            <v-flex xs12 md12 :class="`pt-${espacioSuperior}`">
              <v-card flat>
                <div :class="[alineacionCentro]">
                <div  class="primary--text" :class="[alineacionConsecutivo, 'letra','tamanio']" >{{numeroCorrelativo}}</div>
                <div  class="primary--text" :class="[alineacionFecha, 'letra','tamanio']" >{{fecha}}</div>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
          <div>
            <v-dialog v-model="dialog" persistent max-width="700" v-if="settings">
              <v-btn icon slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Número de CITE</span>
                </v-card-title>
                <v-card-title>
                  <v-layout row wrap v-show="false">
                    <v-flex xs12 md12 lg12 class="text-md-right">
                      <v-switch label="Deshabilitado ?" color="primary" v-model="disabled"></v-switch>
                    </v-flex>
                  </v-layout>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout row wrap >
                      <v-flex xs12 sm12 md12>
                        <label for="espacioArriba">Espacio superior</label>
                        <v-slider prepend-icon="text_format" thumb-label max="5" v-model="espacioSuperior" step="1" persistent-hint :hint="`${espacioSuperior} espacios.`" ticks></v-slider>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <label for="alignment">Alineación</label>
                        <v-btn-toggle v-model="alignment">
                          <v-btn flat value="extremos">
                            <span>Extremos</span>
                            <v-icon>compare_arrows</v-icon>
                          </v-btn>
                          <v-btn flat value="centro">
                            <span>Centro</span>
                            <v-icon>format_align_center</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </v-flex>
                      <v-layout raw wrap>
                  <v-flex xs12 sm12 md12 lg12 v-droppable.list="agregarComponente">
                      <div class="iconosComponentes">
                      <v-toolbar>
                        <div v-for="element in opciones" :key="element.tipo" v-draggable.list="element">
                          <v-tooltip max-width="200" color="primary" bottom>
                            <v-btn color="primary" icon slot="activator">
                              <v-icon>{{element.icon}}</v-icon>
                            </v-btn>
                            <span>
                              <div class="tituloIconosComponentes">
                                {{ element.tipo.replace(/_/ig, ' ') }}
                              </div>
                              <div class="descripcionIconosComponentes">
                                 {{ element.descripcion }}
                              </div>
                            </span>
                          </v-tooltip>
                        </div>
                      </v-toolbar>
                    </div>
                     <v-card class="gestorFormulario">
                      <grid-layout
                          :layout="layout"
                          :col-num="12"
                          :row-height="30"
                          :is-draggable="true"
                          :is-resizable="true"
                          :vertical-compact="true"
                          :auto-size="true"
                          :margin="[10, 10]"
                          :use-css-transforms="true"
                          @layout-updated="layoutUpdatedEvent"
                        >
                          <grid-item v-for="(item, idx) in this.layout" :key="idx"
                            :x="item.x"
                            :y="item.y"
                            :w="item.w"
                            :h="item.h"
                            :i="item.i"
                            @moved="movedEvent"
                            >
                            <div v-if="item.tipo==='estatica'">
                              <v-flex xs12 md12>
                              <v-text-field
                                v-model="texto"
                                label="Texto"
                                color="primary darken-2"
                                required="required"
                                placeholder="texto">
                                </v-text-field>
                              </v-flex>
                            </div>
                            <div v-else-if="item.tipo==='consecutivo'">
                              <v-flex xs12 md12>
                                <span><strong>{consecutivo}</strong></span>
                              </v-flex>
                            </div>
                            <div v-else-if="item.tipo==='gestion'">
                              <v-flex xs12 md12>
                                <v-icon>date_range</v-icon>
                                  <span>
                                    <div class="tituloIconosComponentes">
                                      Gestión
                                    </div>
                                    <div class="descripcionIconosComponentes">
                                    </div>
                                  </span>
                              </v-flex>
                            </div>
                            <div v-else-if="item.tipo==='documento'">
                              <v-flex xs12 md12>
                                <v-icon>assignment</v-icon>
                                  <span>
                                    <div class="tituloIconosComponentes">
                                      Documento
                                    </div>
                                    <div class="descripcionIconosComponentes">
                                      Sigla del documento
                                    </div>
                                  </span>
                              </v-flex>
                            </div>
                            <div v-else-if="item.tipo==='institucion'">
                                <v-flex xs12 md12>
                                <v-icon>business</v-icon>
                                <span>
                                  <div class="tituloIconosComponentes">
                                    institución
                                </div>
                                  <div class="descripcionIconosComponentes">
                                    Sigla de la institución
                                  </div>
                                </span>
                              </v-flex>
                            </div>
                          <!-- <formly-form :id="`item-${idx}`" :form="form" :model="model" :fields="[fields[parseInt(idx)]]"></formly-form> -->
                          </grid-item>
                        </grid-layout>
                      </v-card>
                      </v-flex>
                      </v-layout>
                    </v-layout>
                  </v-container>
                  <v-container>
                    <strong>{{numeroCorrelativo}}</strong>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click.native="cancelar">Cancelar</v-btn>
                  <v-btn color="primary" @click.native="saveInput">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
  import validate from '../../validate.js';
  import {GridLayout, GridItem} from 'vue-grid-layout';
  import slugify from 'slugify';
  const COMPONENT_NAME = 'numero_cite';
  export default {
    mixins: [validate],
    name: COMPONENT_NAME,
    props: ['form', 'field', 'model', 'to', 'all'],
    data () {
      return {
        disabled: null,
        numeroCorrelativo: 'AGETIC/BPM/1/2018',
        fecha: '12/06/2018',
        dialog: null,
        settings: null,
        espacioSuperior: null,
        alignment: 'centro',
        alineacionConsecutivo: null,
        alineacionFecha: null,
        alineacionCentro: null,
        texto: null,
        fields: [],
        layout: [],
        opciones: [
          {
            tipo: 'institucion',
            icon: 'business',
            descripcion: 'Sigla de la institución'
          },
          {
            tipo: 'documento',
            icon: 'assignment',
            descripcion: 'Sigla del documento'
          },
          {
            tipo: 'gestion',
            icon: 'date_range',
            descripcion: 'Gestión'
          },
          {
            tipo: 'consecutivo',
            icon: 'filter_1',
            descripcion: 'Número correlativo para el documento'
          },
          {
            tipo: 'estatica',
            icon: 'text_format',
            descripcion: 'Entrada estática de tipo texto'
          }
        ]
      };
    },
    watch: {
      label (label) {
        this.to.label = label;
        this.to.id = slugify(label, '_');
      },
      disabled (disabled) {
        this.to.disabled = disabled;
      },
      placeholder (placeholder) {
        this.to.placeholder = placeholder;
      },
      espacioSuperior (padding) {
        this.to.paddingTop = padding;
      },
      alignment (alignment) {
        if (alignment === 'centro') {
          this.alineacionCentro = 'alineacionCentro';
        } else if (alignment === 'extremos') {
          this.alineacionConsecutivo = 'alineacionIzquierda';
          this.alineacionFecha = 'alineacionDerecha';
          this.alineacionCentro = '';
        }
      }
    },
    methods: {
      saveInput () {
        this.dialog = false;
      },
      cancelar () {
        this.dialog = false;
      },
      /**
     * @function layoutUpdatedEvent
     * @argument {newlayout} Array Array de todos los elementos que componen el lienzo
     * @description layout Actualizado cuando se realiza una accion con sus elementos internos
     */
      layoutUpdatedEvent (newLayout) {
        console.log(newLayout);
        this.armarCorrelativo(newLayout);
      },
      /**
       * @function movedEvent
       * @argument {e} Event
       * @description Capturara el evento de mover de los elementos del formulario
       */
      movedEvent (i, newX, newY) {
        console.log('MOVE i=' + i + ', X=' + newX + ', Y=' + newY);
      },
      armarCorrelativo (layout) {
        let array = [];
        for (let i = 0; i < layout.length; i++) {
          switch (layout[i].tipo) {
            case 'institucion':
              array.push('AGETICOS');
              break;
            case 'documento':
              array.push('DP-A');
              break;
            case 'gestion':
              array.push(new Date().getFullYear());
              break;
            case 'consecutivo':
              array.push('0156');
              break;
            case 'estatica':
              array.push(this.texto);
              break;
          }
        }
        this.numeroCorrelativo = '';
        for (let i = 0; i < array.length; i++) {
          this.numeroCorrelativo += `${array[i]}/`;
        }
      },
      agregarComponente (comp) {
        if (comp && this.layout.length <= 5) {
          comp = JSON.parse(comp);
          this.fields.push(comp);
          let calculandoRestante = 0;
          if (this.layout.length > 0) {
            calculandoRestante = parseInt(this.layout[this.layout.length - 1].x) + parseInt(this.layout[this.layout.length - 1].w);
          } else {
            calculandoRestante = 0;
          }
          this.layout.push({
            x: calculandoRestante,
            y: 0,
            w: 2,
            h: 3,
            i: (this.layout.length === 0) ? '0' : (parseInt(this.layout[this.layout.length - 1].i) + 1).toString(),
            tipo: comp.tipo,
            template: comp.template
          });
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.label = this.to.label;
        this.settings = this.to.settings;
        this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
        this.placeholder = this.to.placeholder;
        // Adicionando la opcion de que cuando sea comodin, este sea solo vista aunque tenga todos los permisos
        this.disabled = this.to.disabled;
        if (this.field.comodin) {
          this.disabled = this.to.disabled || !!this.field.comodin;
        }
        this.espacioSuperior = (this.to.paddingTop) ? this.to.paddingTop : 0;
        if (this.to && this.to.value) {
          this.input = this.to.value;
        }
      });
    },
    components: {
      GridLayout,
      GridItem
    }
  };
</script>
<style lang="scss">
    .alineacionDerecha {
    float: right;
    text-align: right;
  }
  .alineacionIzquierda {
    float: left;
    text-align: left;
  }
  .alineacionCentro {
    width: 50%;
    margin: 0 auto;
  }
  .gestorFormulario {
  padding: 1mm;
  margin: 1mm;
  border: 1px solid #d3d3d3;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, .1);
  fieldset {
    padding-left: 3px; 
    border: none;
  }
}

</style>
