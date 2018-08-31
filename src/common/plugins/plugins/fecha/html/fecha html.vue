<template>
  <v-card flat>
    <v-card-text>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12 md12 sm12>
            <v-menu
              lazy
              :close-on-content-click="false"
              v-model="menu"
              transition="scale-transition"
              offset-y
              full-width
              :nudge-right="40"
              max-width="290px"
              min-width="290px"
              :disabled="disabled"
            >
              <v-text-field
                slot="activator"
                :label="label"
                v-model="dateFormatted"
                :required="requiredComponent"
                :rules="customRules"
                prepend-icon="event"
                @blur="parseDate(dateFormatted)"
                :disabled="disabled"
              ></v-text-field>

              <v-date-picker 
                v-model="date" 
                @input="dateFormatted = formatDate($event)" 
                no-title 
                scrollable
                locale="es"
                :disabled="disabled"
              >
              </v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
        <div>
            <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
              <v-btn icon absolute slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Calendario</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Nombre" v-model="label" hint="Nombre descriptivo que aparecera encima del calendario."></v-text-field>
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
const COMPONENT_NAME = 'map';
export default {
  name: COMPONENT_NAME,
  props: [ 'form', 'field', 'model', 'to', 'all' ],
  mixins: [ validate ],
  data () {
    return {
      menu: null,
      dateFormatted: null,
      date: null,
      settings: null,
      placeholder: null,
      dialog: null,
      label: null,
      disabled: null,
      requiredComponent: null
    };
  },
  methods: {
    formatDate (date) {
      if (!date) {
        return null;
      }
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    parseDate (date) {
      if (!date) {
        return null;
      }
      const [month, day, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
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
    label (label) {
      this.to.label = label;
      this.to.id = slugify(label, '_');
    },
    placeholder (placeholder) {
      this.to.placeholder = placeholder;
    },
    dateFormatted (newVal) {
      this.to.value = newVal;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.label = this.to.label;
      this.settings = this.to.settings;
      this.placeholder = this.to.placeholder;
      // Adicionando la opcion de que cuando sea comodin, este sea solo vista aunque tenga todos los permisos
      this.disabled = this.to.disabled;
      if (this.field.comodin) {
        this.disabled = this.to.disabled || !!this.field.comodin;
      }
      this.dateFormatted = (this.to.value) ? this.to.value : null;
      this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
      setTimeout(() => {
        if (this.to.isgrid) {
          this.customRules = [];
          this.requiredComponent = false;
        } else {
          this.customRules = this.customRules;
          this.requiredComponent = false;
        }
      }, 1000);
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
</style>
