<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-card flat>
              <v-select
                name="select"
                :items="chips"
                v-model="select"
                :label="label"
                :placeholder="placeholder"
                :rules="(requiredElement) ? rules : []"
                :required="requiredElement"
                :disabled="disabled"
                :value="select"
                autocomplete
               ></v-select>
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
                  <span class="headline">Lista desplegable</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Nombre" v-model="label" hint="Nombre descriptivo que aparecera encima de la lista de opciones"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Placeholder" v-model="placeholder"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <div class="mb-2">
                          <label>Adicionar opciones:</label>
                        </div>
                        <v-select
                          color="primary"
                          chips
                          tags
                          solo
                          append-icon=""
                          clearable
                          v-model="chips"
                          placeholder="Escriba palabras y luego presione la tecla enter."
                        >
                          <template slot="selection" slot-scope="data">
                            <v-chip
                              close
                              @input="remove(data.item)"
                              :selected="data.selected"
                              color="primary"
                              text-color="white"
                            >
                              <strong>{{ data.item }}</strong> 
                            </v-chip>
                          </template>
                        </v-select>
                        <small>Nota. Para adicionar mas de una opcion solo tiene que escribir la o las palabras y presionar la tecla enter.</small>
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
/* eslint no-unneeded-ternary:0 */
import validate from '../../validate.js';
import slugify from 'slugify';
const COMPONENT_NAME = 'dropdown';
export default {
  mixins: [validate],
  name: COMPONENT_NAME,
  props: [ 'form', 'field', 'model', 'to', 'all' ],
  data () {
    return {
      required: false,
      select: [],
      label: null,
      dialog: null,
      settings: null,
      placeholder: null,
      chips: [],
      disabled: null,
      rules: [],
      requiredElement: false
    };
  },
  watch: {
    disabled (disabled) {
      this.to.disabled = disabled;
    },
    label (label) {
      this.to.label = label;
      this.to.id = slugify(label, '_');
    },
    placeholder (placeholder) {
      this.to.placeholder = placeholder;
    },
    chips () {
      this.to.options = this.chips;
    },
    select (newVal) {
      this.to.value = newVal;
    },
    selected (rule) {
      if (Array.isArray(rule) && rule.includes('requerido')) {
        this.requiredElement = true;
      } else {
        this.requiredElement = false;
      }
    }
  },
  methods: {
    remove (item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.label = this.to.label;
      this.chips = this.to.options;
      this.placeholder = this.to.placeholder;
      this.settings = this.to.settings;
      // Adicionando la opcion de que cuando sea comodin, este sea solo vista aunque tenga todos los permisos
      this.disabled = this.to.disabled;
      if (this.field.comodin) {
        this.disabled = this.to.disabled || !!this.field.comodin;
      }
      this.select = (this.to.value) ? this.to.value : null;
      this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
      setTimeout(() => {
        if (this.to.isgrid) {
          this.rules = [];
          this.requiredElement = false;
        } else {
          this.rules = [() => (this.select && this.select.length > 0) || 'El campo no pueder estar vacio'];
          this.requiredElement = true;
        }
      }, 1000);
    });
  }
};
</script>
<style lang="scss">
  .titleModified {
    font-weight: 700;
  }
</style>

