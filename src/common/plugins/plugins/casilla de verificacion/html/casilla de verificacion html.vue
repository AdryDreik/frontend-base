<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12 class="subheaderModified" v-if="(label) ? label.length > 0 : false">
            <v-subheader class="quitarEspacio">{{label}}</v-subheader>
          </v-flex>
          <v-flex xs12 md12>
            <v-card flat :class="(posicion == 'vertical') ? '' : 'horizontalOptions'">
              <v-checkbox v-for="(list, index) in chips" :key="index"
                color="primary"
                :label="list"
                :value="list"
                v-model="checkbox"
                :rules="customRules"
                :disabled="disabled"
                :required="requiredComponent"
                :input-value="checkbox"
                hide-details>
              </v-checkbox>
            </v-card>
          </v-flex>
        </v-layout>
        <div>
          <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
              <v-btn icon slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Checkbox</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Label" v-model="label" hint="Nombre descriptivo que aparecera encima de la opciones"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <label>Posicion de las opciones:</label>
                        <v-radio-group v-model="posicion" row>
                          <v-radio color="primary" label="Vertical" value="vertical" ></v-radio>
                          <v-radio color="primary" label="Horizontal" value="horizontal"></v-radio>
                        </v-radio-group>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-checkbox color="primary" label="Permitir elegir múltiples opciones ?" v-model="multiple"></v-checkbox>
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
const COMPONENT_NAME = 'check-button';
export default {
  mixins: [validate],
  name: COMPONENT_NAME,
  props: [ 'form', 'field', 'model', 'to', 'all' ],
  data () {
    return {
      chips: [],
      multiple: null,
      checkbox: null,
      label: null,
      dialog: null,
      settings: null,
      disabled: null,
      posicion: null,
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
    multiple (multiple) {
      if (multiple) {
        this.to.multiple = true;
        this.checkbox = [];
      } else {
        this.to.multiple = false;
        this.checkbox = null;
      }
    },
    disabled (disabled) {
      this.to.disabled = disabled;
    },
    label (label) {
      this.to.label = label;
      this.to.id = slugify(label, '_');
    },
    chips () {
      this.to.options = this.chips;
    },
    checkbox (newVal) {
      this.to.value = newVal;
    },
    posicion (newVal) {
      this.to.position = newVal;
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
      this.chips = this.to.options;
      if (!this.to.value) {
        this.multiple = (this.to.multiple) ? this.to.multiple : false;
      }
      this.label = this.to.label;
      this.settings = this.to.settings;
      // Adicionando la opcion de que cuando sea comodin, este sea solo vista aunque tenga todos los permisos
      this.disabled = this.to.disabled;
      if (this.field.comodin) {
        this.disabled = this.to.disabled || !!this.field.comodin;
      }
      this.posicion = (this.to.position) ? this.to.position : 'vertical';
      this.checkbox = (this.to.value) ? this.to.value : [];
      this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
    });
  }
};
</script>
<style lang="scss">
  .titleModified {
    font-weight: 700;
  }
  .horizontalOptions {
    text-align: center;
    align-content: center;
    width: 100%;
    & > div {
      float: left;
      width: calc(100% / 5);
    }
  }
  .quitarEspacio {
    margin-left: -15px;
  }
</style>

