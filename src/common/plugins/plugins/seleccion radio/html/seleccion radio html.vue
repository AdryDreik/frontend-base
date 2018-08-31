<template>
  <v-card flat class="overflow">
    <v-card-text>
        <v-container>
          <v-layout>
            <v-flex xs12 md12 class="subheaderModified">
              <v-subheader>{{label}}</v-subheader>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 md12>
              <v-radio-group v-model="radio" :mandatory="false" :required="requiredComponent" :rules="customRules" :row="booleanOrientation">
                <v-radio color="primary" v-for="list in chips" :key="list.value" :disabled="disabled" :input-value="true" :label="list" :value="list"></v-radio>
              </v-radio-group>
            </v-flex>
          </v-layout>
          <div>
            <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
              <v-btn icon slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Selección simple</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Label" v-model="label" hint="Nombre descriptivo que aparecera encima de las opciones añadidas."></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <label>Adicionar opciones</label>
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
                        <label>Posicion de las opciones:</label>
                        <v-radio-group v-model="booleanOrientation" row>
                          <v-radio color="primary" label="Vertical" :value="false" ></v-radio>
                          <v-radio color="primary" label="Horizontal" :value="true"></v-radio>
                        </v-radio-group>
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
const COMPONENT_NAME = 'radio-button';
export default {
  props: [ 'form', 'field', 'model', 'to', 'all' ],
  mixins: [validate],
  name: COMPONENT_NAME,
  data () {
    return {
      dialog: null,
      label: null,
      radio: null,
      settings: '',
      chips: [],
      disabled: null,
      booleanOrientation: false,
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
    booleanOrientation (orientation) {
      this.to.booleanOrientation = orientation;
    },
    disabled (disabled) {
      this.to.disabled = disabled;
    },
    chips () {
      this.to.options = this.chips;
    },
    label (label) {
      this.to.label = label;
      this.to.id = slugify(label, '_');
    },
    radio (newVal) {
      this.to.value = newVal;
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
      this.options = this.to.options;
      this.settings = this.to.settings;
      this.booleanOrientation = (this.to.booleanOrientation) ? this.to.booleanOrientation : false;
      // Adicionando la opcion de que cuando sea comodin, este sea solo vista aunque tenga todos los permisos
      this.disabled = this.to.disabled;
      if (this.field.comodin) {
        this.disabled = this.to.disabled || !!this.field.comodin;
      }
      this.radio = this.to.value;
      this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
    });
  }
};
</script>
<style lang="scss">
  .subheaderModified {
    li {
      padding: 0;
    }
  }
  .overflow {
    overflow: hidden !important;
  }
</style>

