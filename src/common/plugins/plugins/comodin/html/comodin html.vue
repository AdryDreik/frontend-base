<template>
  <v-card flat>
    <v-card-text>
      <v-container class="text-md-center">
        <img :src="img" alt="Plugin comodin" class="imagen">
        <div class="description">
          <div>Componente encargado de reemplazar cualquier componente</div>
          <small><b>La configuración de este componente se lo hace en la creación de flujo</b></small>
        </div>
        <div>
            <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
              <v-btn icon slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Componente comodin</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Label" persistent-hint v-model="label" placeholder="Ejemplo: comodin para fecha de nacimiento" hint="Nombre descriptivo con la cual sera mostrado cuando se creen flujos"></v-text-field>
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
  import slugify from 'slugify';
  import imagen from './assets/image1.js';
  const COMPONENT_NAME = 'sample';
  export default {
    name: COMPONENT_NAME,
    mixins: [validate],
    props: ['form', 'field', 'model', 'to'],
    created () {
      this.img = imagen;
    },
    data () {
      return {
        dialog: null,
        label: null,
        settings: null
      };
    },
    methods: {
      saveInput () {
        this.dialog = false;
      },
      cancelar () {
        this.dialog = false;
      }
    },
    watch: {
      label (label) {
        this.to.label = label;
        this.to.id = slugify(label, '_');
      }
    },
    components: {},
    mounted () {
      this.$nextTick(() => {
        this.label = this.to.label;
        this.settings = this.to.settings;
        this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
      });
    }
  };
</script>
<style lang="scss" scoped>
  .imagen {
    position: absolute;
    margin: auto;
    margin-left: -100px;
    width: 20vh;
    z-index: -1;
  }
  .description {
    margin-top: 100px;
    vertical-align: middle;
  }
  div, small {
    z-index: 0;
  }
</style>
