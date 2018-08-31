<template>
  <v-card flat>
    <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 md12 :class="`pt-${espacioSuperior}`">
              <v-text-field
                v-model="input"
                :label="label" 
                color="primary darken-2"
                :required="requiredComponent"
                :rules="customRules"
                :disabled="disabled"
                :placeholder="placeholder">
                </v-text-field>
            </v-flex>
          </v-layout>
          <div>
            <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
              <v-btn icon slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Campo de texto</span>
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
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <label for="espacioArriba">Espacio superior</label>
                        <v-slider prepend-icon="text_format" thumb-label max="5" v-model="espacioSuperior" step="1" persistent-hint :hint="`${espacioSuperior} espacios.`" ticks></v-slider>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Label" v-model="label" placeholder="Ejemplo: Nombre(s)" hint="Nombre descriptivo que aparecera encima del campo de texto."></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Placeholder" v-model="placeholder"></v-text-field>
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
  import fn from '../../functions.js';
  import slugify from 'slugify';
  const COMPONENT_NAME = 'input';
  export default {
    mixins: [validate, fn],
    name: COMPONENT_NAME,
    props: ['form', 'field', 'model', 'to', 'all'],
    data () {
      return {
        disabled: null,
        input: null,
        dialog: null,
        dialog2: null,
        required: null,
        placeholder: null,
        label: null,
        settings: null,
        espacioSuperior: null,
        requiredComponent: null
      };
    },
    watch: {
      selected (val) {
        if (val.length > 0) {
          this.requiredComponent = true;
        } else {
          this.requiredComponent = false;
        }
      },
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
      input (newVal) {
        this.to.value = newVal;
      },
      espacioSuperior (padding) {
        this.to.paddingTop = padding;
      }
    },
    methods: {
      saveInput () {
        this.dialog = false;
      },
      cancelar () {
        this.dialog = false;
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
        setTimeout(() => {
          if (this.to.isgrid) {
            this.customRules = [];
            this.requiredComponent = false;
          }
        }, 1000);
      });
    }
  };
</script>
