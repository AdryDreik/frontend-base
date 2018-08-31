<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-card flat>
              <h3 class="primary--text titleModified" :class="[alignment, fontTransform, option]">{{label}}</h3>
            </v-card>
          </v-flex>
        </v-layout>
        <div>
          <v-dialog v-model="dialog" persistent max-width="600" v-if="settings">
              <v-btn icon slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">{{option}}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field :label="option" v-model="label" hint="Nombre descriptivo que aparecera como título o subtítulo." :placeholder="placeholder"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md7>
                        <v-radio-group v-model="option" :mandatory="false" class="quitarAltura">
                          <v-radio color="primary" label="Titulo" value="Titulo"></v-radio>
                          <v-radio color="primary" label="Subtítulo" value="Subtitulo"></v-radio>
                          <v-radio color="primary" label="Texto Informativo" value="Texto"></v-radio>
                          <v-radio color="primary" label="Texto Simple" value="TextoSecundario"></v-radio>
                        </v-radio-group>
                      </v-flex>
                      <v-flex xs12 sm12 md5 class="text-md-center">
                        <v-btn-toggle v-model="fontTransform">
                          <v-btn flat value="italic">
                            <span>Cursiva</span>
                            <v-icon>format_italic</v-icon>
                          </v-btn>
                          <v-btn flat value="underline">
                            <span>Subrayado</span>
                            <v-icon>format_underlined</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <label for="alignment">Alineación</label>
                        <v-btn-toggle v-model="alignment">
                          <v-btn flat value="text-md-left">
                            <span>Izquierda</span>
                            <v-icon>format_align_left</v-icon>
                          </v-btn>
                          <v-btn flat value="text-md-center">
                            <span>Centro</span>
                            <v-icon>format_align_center</v-icon>
                          </v-btn>
                          <v-btn flat value="text-md-right">
                            <span>Derecha</span>
                            <v-icon>format_align_right</v-icon>
                          </v-btn>
                          <v-btn flat value="text-md-justify">
                            <span>Justificado</span>
                            <v-icon>format_align_justify</v-icon>
                          </v-btn>
                        </v-btn-toggle>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click.native="dialog = false">Cancelar</v-btn>
                  <v-btn color="primary" @click.native="saveTitle">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
import validate from 'validate.js';
export default {
  props: [ 'form', 'field', 'model', 'to', 'all' ],
  data () {
    return {
      option: 'Titulo',
      placeholder: null,
      fontTransform: null,
      alignment: null,
      size: 0,
      label: null,
      dialog: null,
      settings: null
    };
  },
  methods: {
    async saveTitle () {
      const constraints = {
        titulo: {
          presence: true
        }
      };
      const verificando = await validate({titulo: this.label || null}, constraints);
      if (verificando) {
        this.dialog = true;
        this.$message.error(`El campo ${this.option.toLowerCase()} no puede estar vacio`);
      } else {
        this.dialog = false;
      }
    }
  },
  watch: {
    label (label) {
      this.to.label = label;
      this.to.value = label;
    },
    alignment (alignment) {
      this.to.alignment = alignment;
    },
    option (option) {
      this.to.option = option;
    },
    fontTransform (transform) {
      this.to.fontTransform = transform;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.alignment = (this.to.alignment) ? this.to.alignment : 'text-md-left';
      this.placeholder = this.to.placeholder;
      this.label = this.to.label;
      this.settings = this.to.settings;
      this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
      this.option = (this.to.option) ? this.to.option : null;
      this.fontTransform = (this.to.fontTransform) ? this.to.fontTransform : null;
      this.to.id = 'titulo';
    });
  }
};
</script>
<style lang="scss">
  @import '../../../../../assets/scss/_variables.scss';
  
  .titleModified {
    font-weight: 700;
  }
  .underline {
    text-decoration: underline;
  }
  .italic {
    font-style: italic;
  }
  .Titulo {
    font-size: 2em;
  }
  .Texto {
    margin:10px 10px 10px 0px;
    padding: 10px;
    border-left: 4px solid lighten($color: $primary, $amount: 20%);
    border-right: 1px solid lighten($color: $primary, $amount: 20%);
    border-top: 1px solid lighten($color: $primary, $amount: 20%);
    border-bottom: 1px solid lighten($color: $primary, $amount: 20%);
    font-weight: 100 !important;
    font-size: 1em;
    color: lighten($color: $primary, $amount: 20%);
    background: rgba($color: lighten($color: $primary, $amount: 40%), $alpha: .1); 
    &::before {
      content: '';
      width: 20px;
      height: 20px;
      float: left;
      filter: opacity(.8);
      margin-right: 10px;
      background: url('../../../../../../static/images/infoicon.png') no-repeat;
      background-position: center center;
      background-size: 100%;
    }
  }
  .TextoSecundario {
    margin:10px 10px 10px 0px;
    padding: 10px;
    font-weight: 1 !important;
    font-size: 1em;
    color: lighten($color: $primary, $amount: 20%);
  }
  .Subtitulo {
    font-size: 1.3em;
    border-bottom: 1px dashed rgba(116, 115, 115, 0.5);
  }
  .quitarAltura {
    margin-top: -15px;
  }
  .titleModified {
    font-weight: 700;
  }
  .bloqueTituloCabecera {
    background: rgb(96,108,136);
    background: -moz-linear-gradient(top, rgba(96,108,136,1) 0%, rgba(63,76,107,1) 100%); 
    background: -webkit-linear-gradient(top, rgba(96,108,136,1) 0%,rgba(63,76,107,1) 100%);
    background: linear-gradient(to bottom, rgba(96,108,136,1) 0%,rgba(63,76,107,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#606c88', endColorstr='#3f4c6b',GradientType=0 );
    .headline {
      color: #FFF;
      text-transform: uppercase;
      font-weight: 700;
      font-size: 1em !important;
      margin-top: -10px;
    }
  }
</style>

