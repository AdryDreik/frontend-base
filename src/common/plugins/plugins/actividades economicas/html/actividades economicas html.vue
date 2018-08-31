<template>
  <v-card flat>
    <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12 class="text-md-left" v-if="multiple">
            <v-tooltip bottom>
              <v-btn icon slot="activator" color="success" @click.prevent="addActivities">
                <v-icon>add</v-icon>
              </v-btn>
              <span>Añadir otra actividad económica</span>
            </v-tooltip>
          </v-flex>
        </v-layout>
        <v-layout row wrap v-for="(elem, idx) in actividadesEconomicas" :key="idx" class="bloqueActividadSeleccionada">
          <v-flex xs12 sm12 md12 lg12>
              <v-select
                :ref="`actividad_economica_${idx}`"
                v-model="elem.actividad"
                :class="(multiple) ? 'pr-5':''"
                id="suggest-homonimia"
                :placeholder="placeholder"
                :label="label"
                autocomplete
                :loading="loading"
                :required="(requerido) ? true : false"
                :max-height=500
                no-data-text="No existen actividades económicas que listar"
                item-text="name"
                :items="items[idx]"
                @keyup="setIndex(idx)"
                @keyup.enter="selectItem(idx)"
                :rules="(requerido) ? [(val) => !!val || 'Tiene que seleccionar una actividad económica'] : []"
                :search-input.sync="search"
                @input="selectItem(idx)"
              ></v-select>
            </v-flex>
            <v-tooltip left class="eliminarActividadEconomica" v-if="multiple" color="error¿">
              <v-btn icon slot="activator" color="error" @click.prevent="removeActivities(idx)">
                <v-icon>delete_forever</v-icon>
              </v-btn>
              <span>Eliminar ctividad económica</span>
            </v-tooltip>
            <v-flex xs12 sm12 md12 lg12 v-if="elem.actividad" :class="(multiple) ? 'pr-5' : ''">
              <v-alert
                class="successAlert"
                outline
                :value="true"
                type="info"
              >
                {{elem.actividad.incluye}}
              </v-alert>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 v-if="elem.actividad" :class="(multiple) ? 'pb-4 pr-5' : ''">
              <v-alert v-if="elem.actividad.excluye.length > 5"
                outline
                :value="true"
                type="error"
              >
                {{elem.actividad.excluye}}
              </v-alert>
            </v-flex>
        </v-layout>
    </v-card-text>
    <!-- VENTANA PARA LAS CONFIGURACIONES -->
    <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
      <v-btn icon slot="activator" large class="botonApps">
        <v-icon color="primary darken-1">settings</v-icon>
      </v-btn>
      <v-card>
        <v-card-title class="bloqueTituloCabecera">
          <span class="headline">Clasificador de actividades</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12 lg12>
                <strong>Configuración del clasificador:</strong>
                <v-checkbox class="mt-3" color="primary" label="¿Permitir ser mútiple al clasificador de actividades?" v-model="multiple"></v-checkbox>
                <v-checkbox class="" color="primary" label="Requerido" v-model="requerido"></v-checkbox>
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
  </v-card>
</template>
<script>
  import axios from 'axios';
  import validate from '../../validate.js';
  const COMPONENT_NAME = 'sample';
  export default {
    name: COMPONENT_NAME,
    mixins: [validate],
    props: ['form', 'field', 'model', 'to', 'all'],
    created () {
      this.actividadesEconomicas.push({
        actividad: null
      });
    },
    data () {
      return {
        label: 'Seleccione una actividad economica',
        placeholder: 'Seleccione una actividad economica',
        query: '',
        loading: false,
        items: [],
        search: null,
        select: null,
        searchWord: null,
        activate: false,
        dialog: false,
        settings: true,
        multiple: false,
        actividadesEconomicas: [],
        indexActive: null,
        requerido: false
      };
    },
    methods: {
      /**
       * @function setIndex
       * @description Esta funcion esta encargada de setear el index correcto del combo que se esta utilizando
       * @param idx index
       */
      setIndex (idx) {
        this.indexActive = idx;
      },
      /**
       * @function removeActivities
       * @description Esta funcion esta encargada de eliminar del array
       * @param index index
       */
      removeActivities (index) {
        this.actividadesEconomicas.splice(index, 1);
        this.items.splice(index, 1);
        this.to.items.splice(index, 1);
        this.to.value.splice(index, 1);
      },
      /**
       * @function addEventKeydown
       * @description Esta funcion esta implementada nativamente, porque vue no reconoce el keydown solo el jeyup
       * @link  https://vuejs.org/v2/guide/events.html
       * @param index index
       */
      addEventKeydown (index) {
        setTimeout(() => {
          const name = `actividad_economica_${index}`;
          const element = this.$refs[name][0].$el;
          let typingTimer;
          let doneTypingInterval = 1000;
          element.onkeydown = () => {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
              this.activate = true;
            }, doneTypingInterval);
            this.activate = false;
            return true;
          };
        }, 200);
      },
      /**
       * @function addActivities
       * @description Esta funcion esta encargada de adicionar actividades al array general
       */
      addActivities () {
        this.actividadesEconomicas.push({
          actividad: null
        });
        this.addEventKeydown(this.actividadesEconomicas.length - 1);
      },
      /**
       * @function selectItem
       * @description Esta funcion esta encargada de capturar cuando se selecciona la actividad economica
       * @param idx index
       */
      async selectItem (idx) {
        try {
          this.to.value[idx] = this.actividadesEconomicas[idx].actividad;
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      /**
       * @function querySelections
       * @description Esta funcion esta encargada de generar de almacenar la palabra que dese buscar
       * @param v palabra a buscar
       */
      async querySelections (v) {
        try {
          this.searchWord = v;
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      /**
       * @function loadData
       * @description Esta funcion es la encargada de cargar los datos de acuerdo al filtro
       * @param query Palabra de busqueda
       */
      async loadData (query) {
        try {
          // const url = 'http://www.miempresa.gob.bo/registro/api/v1/parametro/fundempresa/ciiu?search=';
          const url = 'https://test.agetic.gob.bo/miempresa-backend/api/v1/parametro/fundempresa/ciiu?search=';
          let sw = true;
          let resultados = [];
          this.loading = true;
          return await axios.get(`${url}${query}`)
            .then((res) => {
              const response = res.data.datos;
              for (let element of response.grupoDos) {
                sw = true;
                for (let elementUno of response.grupoUno) {
                  if (element.clave === elementUno.clave) {
                    sw = false;
                    break;
                  }
                }
                if (sw) {
                  response.grupoUno.push(element);
                }
              }
              resultados = response.grupoUno;
              return resultados;
            })
            .catch((err) => {
              this.$message.error(err.message);
            });
        } catch (err) {
          this.$message.error(err.message);
        }
      }
    },
    watch: {
      requerido (requerido) {
        this.to.required = requerido;
      },
      multiple (multiple) {
        this.to.multiple = multiple;
      },
      async activate (option) {
        if (option) {
          const items = await this.loadData(this.searchWord);
          this.items[this.indexActive] = items;
          this.to.items[this.indexActive] = items;
          this.loading = false;
        }
      },
      async search (val) {
        try {
          val && await this.querySelections(val);
        } catch (err) {
          this.$message.error(err.message);
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        // this.select = (this.to.value) ? this.to.value : null;
        if (!this.to.value) {
          this.to.value = [];
        }
        if (!this.to.items) {
          this.to.items = [];
        }
        this.requerido = (this.to.required) ? this.to.required : false;
        this.settings = this.to.settings;
        this.multiple = (this.to.multiple) ? this.to.multiple : false;
        setTimeout(() => {
          const name = 'actividad_economica_0';
          const element = this.$refs[name][0].$el;
          let typingTimer;
          let doneTypingInterval = 1000;
          element.onkeydown = () => {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
              this.activate = true;
            }, doneTypingInterval);
            this.activate = false;
            return true;
          };
        }, 200);
      });
    }
  };
</script>
<style lang="scss" scoped>
  .eliminarActividadEconomica {
    position: absolute;
    right: 20px;
    margin-top: 15px;
  }
  .bloqueActividadSeleccionada {
    margin-top: 15px;
    border-radius: 10px;
    padding: 10px;
    margin-right: 8px;
    border: 1.5px solid #003366;
    margin-bottom: 15px;
  }
</style>
