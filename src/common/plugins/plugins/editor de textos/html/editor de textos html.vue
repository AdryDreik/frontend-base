<template>
  <v-card flat>
    <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md12 lg12  class="mt-2">
              <v-subheader class="labelEditor" v-show="label && loading">{{label}}</v-subheader>
                <template v-if="loadingImage">
                  <v-layout row wrap>
                    <v-flex xs12 sm12 md12 lg12 class="text-md-center text-lg-center imageLoading">
                      <img :src="`${this.$storage.get('path')}/static/images/ajax-loading.gif`" width="100" height="100">
                      <center class="textLoading"><small>Cargando editor de texto...</small></center>
                    </v-flex>
                  </v-layout>
                </template>
                <template v-if="loading">
                  <editor :api-key="apiKey" :key="key" @onSelectionChange="editorChanges" v-model="mEditor" :init="initTinyMCE"></editor>
                </template>
            </v-flex>
          </v-layout>
          <!-- MODAL PARA LACONFIGURACION -->
          <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
              <v-btn icon slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Editor de texto</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout row wrap>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-text-field label="Label" v-model="label" placeholder="Ejemplo: Campo de texto para adicionar mas elementos..." hint="Nombre descriptivo que aparecera encima del editor de texto."></v-text-field>
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
        </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
  import Editor from '../../../../util/tinymce/tinymce-vue';
  import validate from '../../validate.js';
  import slugify from 'slugify';
  const COMPONENT_NAME = 'editor-de-textos';
  const API_KEY = 'p443b4kee4q62mhj5yezb7j9irenpvhwr3o1brxll9u0axqt';
  export default {
    name: COMPONENT_NAME,
    mixins: [validate],
    props: ['form', 'field', 'model', 'to', 'all'],
    created () {},
    data () {
      return {
        apiKey: API_KEY,
        disabled: null,
        settings: null,
        dialog: null,
        initTinyMCE: null,
        label: null,
        mEditor: null,
        loading: false,
        loadingImage: true,
        key: null,
        toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons'
      };
    },
    methods: {
      async createConfigurationTinyMCE (disabled) {
        try {
          this.initTinyMCE = {
            min_height: 400,
            language: 'es',
            language_url: `${this.$storage.get('path')}/static/tinymce/langs/es.js`,
            skin_url: `${this.$storage.get('path')}/static/tinymce/skins/bpm-skin-editor`,
            theme: 'modern',
            plugins: `autoresize print preview fullpage powerpaste searchreplace autolink directionality 
                      advcode visualblocks visualchars fullscreen image link media template 
                      codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime 
                      advlist lists textcolor wordcount a11ychecker imagetools 
                      mediaembed  linkchecker contextmenu colorpicker textpattern help`, // tinymcespellchecker, para habilitar el autocorrector de tinymce
            toolbar: (disabled) ? false : this.toolbar,
            init_instance_callback: (editor) => {
              this.loadingImage = false;
            },
            browser_spellcheck: false,
            gecko_spellcheck: false,
            branding: false,
            // color_picker_callback: (callback, value) => {},
            elementpath: false,
            fixed_toolbar_container: '#topToolbar',
            menubar: (disabled) ? false : true,
            readonly: (disabled) ? 1 : 0,
            menu: {
              // para modificar mas opciones https://www.tiny.cloud/docs/advanced/editor-control-identifiers/#menucontrols
              file: {title: 'File', items: 'newdocument | preview | print'}, // fullpage 'Propiedades de los documentos'
              edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace'},
              view: {title: 'View', items: 'preview'}, // code (codigo fuente codigo), visualaid, fullscreen (pantalla completas)
              insert: {title: 'Insert', items: 'image link media | hr charmap | pagebreak insertdatetime'}, // template (Plantilla o template), anchor (anclaje)
              format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
              table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
              tools: {title: 'Tools', items: ''}, // spellchecker code
              help: {title: 'help', items: ''}
            },
            mobile: {
              theme: 'mobile',
              plugins: [ 'autosave', 'lists', 'autolink' ],
              toolbar: [ 'undo', 'bold', 'italic', 'styleselect' ]
            },
            resize: false,
            statusbar: false
          };
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      editorChanges (e) {
      }
    },
    watch: {
      label (label) {
        this.to.label = label;
        this.to.id = slugify(label, '_');
      },
      mEditor (value) {
        this.to.value = value;
      },
      async disabled (disabled) {
        this.to.disabled = disabled;
        await this.createConfigurationTinyMCE(disabled);
        this.key = Math.random() * 1000000;
        this.loading = true;
      }
    },
    components: {
      editor: Editor
    },
    mounted () {
      this.$nextTick(() => {
        this.tmpEditor = [];
        this.loading = false;
        this.mEditor = this.to.value;
        this.disabled = this.to.disabled;
        this.settings = this.to.settings;
        this.label = this.to.label;
        this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
      });
    }
  };
</script>
<style lang="scss" scoped>
  .labelEditor {
    margin-left: -15px;
  }
  #topToolbar {
    position: absolute;
  }
  .imageLoading {
    margin-top: -50px;
    .textLoading {
      margin-top: -25px;
    }
  }
</style>
