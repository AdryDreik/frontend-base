<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-card flat>
              <v-text-field
                id="auto-grow"
                v-model="texto"
                :label="label"
                color="primary darken-2"
                :placeholder="placeholder"
                :required="requiredComponent"
                :rules="customRules"
                :disabled="disabled"
                multi-line
                @keyup.enter="calculateHeight"
                @keyup.delete="calculateHeight"
                @keyup="calculateHeight"
                @keydown="calculateHeight"
                :rows="numeroFilas"
                @change="calculateHeight"
              >
              </v-text-field>
            </v-card>
          </v-flex>
        </v-layout>
        <div>
          <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
              <v-btn icon absolute slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Texto</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs6 sm6 md6>
                        <label for="numeroFilas">Numero de filas: </label>
                        <v-slider prepend-icon="text_format" thumb-label max="50" v-model="numeroFilas" step="1" persistent-hint :hint="`Este texto tendra ${numeroFilas} filas.`" ticks></v-slider>
                      </v-flex>
                      <v-flex xs6 sm6 md6>
                        <label for="alineacion">Alineación:</label><br>
                        <v-tooltip bottom>
                          <v-btn slot="activator" icon :class="(idxActivate === 1) ? 'primary' : 'default'" @click.prevent="align(1)">
                            <v-icon>format_align_center</v-icon>
                          </v-btn>
                          <span>Texto centrado</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <v-btn slot="activator" icon :class="(idxActivate === 2) ? 'primary' : 'default'" @click.prevent="align(2)">
                            <v-icon>format_align_justify</v-icon>
                          </v-btn>
                          <span>Texto justificado</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <v-btn slot="activator" icon :class="(idxActivate === 3) ? 'primary' : 'default'" @click.prevent="align(3)">
                            <v-icon>format_align_right</v-icon>
                          </v-btn>
                          <span>Texto a la derecha</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <v-btn slot="activator" icon :class="(idxActivate === 4) ? 'primary' : 'default'" @click.prevent="align(4)">
                            <v-icon>format_align_left</v-icon>
                          </v-btn>
                          <span>Texto a la izquierda</span>
                        </v-tooltip>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Nombre" v-model="label" hint="Nombre descriptivo que aparecera encima del area de texto."></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field textarea multi-line type="textarea" :rows="5" v-model="texto" hint="Puede escribir una descripcion o un texto grande."></v-text-field>
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
import validate from '../../validate.js';
import slugify from 'slugify';
const COMPONENT_NAME = 'textarea';
export default {
  props: [ 'form', 'field', 'model', 'to', 'all' ],
  mixins: [validate],
  name: COMPONENT_NAME,
  data () {
    return {
      required: null,
      placeholder: null,
      alineacion: null,
      label: null,
      dialog: null,
      settings: null,
      numeroFilas: null,
      texto: null,
      disabled: null,
      idxActivate: null,
      temp: null,
      requiredComponent: null
    };
  },
  methods: {
    calculateHeight () {
      const ta = document.getElementById('auto-grow');
      const style = (window.getComputedStyle) ? window.getComputedStyle(ta) : ta.currentStyle;
      const taLineHeight = parseInt(style.lineHeight, 10);
      const taHeight = this.calculateContentHeight(ta, taLineHeight);
      const numberOfLines = Math.ceil(taHeight / taLineHeight);
      this.numeroFilas = numberOfLines;
      this.to.numberRows = numberOfLines;
    },
    calculateContentHeight (ta, scanAmount) {
      const origHeight = ta.style.height;
      let height = ta.offsetHeight;
      const scrollHeight = ta.scrollHeight;
      const overflow = ta.style.overflow;
      if (height >= scrollHeight) {
        ta.style.height = (height + scanAmount) + 'px';
        ta.style.overflow = 'hidden';
        if (scrollHeight < ta.scrollHeight) {
          while (ta.offsetHeight >= ta.scrollHeight) {
            ta.style.height = (height -= scanAmount) + 'px';
          }
          while (ta.offsetHeight < ta.scrollHeight) {
            ta.style.height = (height++) + 'px';
          }
          ta.style.height = origHeight;
          ta.style.overflow = overflow;
          return height;
        }
      } else {
        return scrollHeight;
      }
    },
    align (option) {
      this.idxActivate = option;
      this.to.idxActivate = option;
      if (option === 1) {
        document.querySelector('#auto-grow').style.textAlign = 'center';
      } else if (option === 2) {
        document.querySelector('#auto-grow').style.textAlign = 'justify';
      } else if (option === 3) {
        document.querySelector('#auto-grow').style.textAlign = 'right';
      } else {
        document.querySelector('#auto-grow').style.textAlign = 'left';
      }
    },
    detectRows () {
      if (document.querySelector('#auto-grow')) {
        const height = document.querySelector('#auto-grow').scrollHeight;
        const minHeight = parseInt(this.numeroFilas, 10) * 24;
        this.numeroFilas = parseInt(Math.max(minHeight, height) / 24);
        this.to.numberRows = parseInt(Math.max(minHeight, height) / 24);
      }
    }
  },
  watch: {
    selected (val) {
      if (val.length > 0) {
        this.requiredComponent = true;
      } else {
        this.requiredComponent = false;
      }
    },
    disabled (disabled) {
      this.to.disabled = disabled;
    },
    numberRows (filas) {
      this.to.numberRows = filas;
    },
    label (label) {
      this.to.label = label;
      this.to.id = slugify(label, '_');
    },
    placeholder (placeholder) {
      this.to.placeholder = placeholder;
    },
    texto (newVal) {
      this.to.value = newVal;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.texto = (this.to.value) ? this.to.value : '';
      this.label = this.to.label;
      this.placeholder = this.to.placeholder;
      // Adicionando la opcion de que cuando sea comodin, este sea solo vista aunque tenga todos los permisos
      this.disabled = this.to.disabled;
      if (this.field.comodin) {
        this.disabled = this.to.disabled || !!this.field.comodin;
      }
      setTimeout(() => {
        if (this.to.isgrid) {
          this.customRules = [];
          this.requiredComponent = false;
        }
      }, 1000);
      this.settings = this.to.settings;
      this.alineacion = this.to.alineacion ? this.to.alineacion : 'center';
      this.idxActivate = this.to.idxActivate ? this.to.idxActivate : 2;
      this.numeroFilas = (this.to.numberRows > 5) ? this.to.numberRows : 5;
      this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
      setTimeout(() => {
        this.align(this.idxActivate);
        this.detectRows();
      }, 100);
    });
  }
};
</script>
<style lang="scss">
  .titleModified {
    font-weight: 700;
  }
</style>

