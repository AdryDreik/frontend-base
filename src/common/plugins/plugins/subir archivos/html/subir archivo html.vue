<template>
  <v-card flat>
    <v-card-text>
        <v-container>
          <div class="file-upload">
            <label for="file-upload" class="tituloArchivos" v-if="titulo">{{titulo}}</label>
            <div v-if="uploadsDocuments.length > 0">
              <v-layout row wrap class="mt-2">
                <label for="uploadsDocuments" class="uploadsDocuments">{{(!disabled) ? 'Lista de documentos adjuntados previamente:' : 'Lista de documentos adjuntos'}}</label>
                <template v-for="(document, idx) in uploadsDocuments">
                  <v-flex xs12 sm12 md10 lg10 :key="idx + 1 * Math.random() * 10000" class="pt-3"><small>{{idx + 1}}.</small>&nbsp; {{document.label}}</v-flex>
                  <v-flex xs12 sm12 md2 lg2 :key="idx + 3 * Math.random() * 10000" class="text-md-right text-lg-right">
                    <v-tooltip color="error" bottom v-if="!disabled">
                      <v-btn slot="activator" icon color="error" flat @click.prevent="removeListFile(document.label)">
                        <v-icon>delete_forever</v-icon>
                      </v-btn>
                      <span>Eliminar {{document.label}}</span>
                    </v-tooltip>
                    <v-tooltip color="primary" bottom>
                      <v-btn slot="activator" icon color="primary" flat @click.prevent="downloadFile(document.label)">
                        <v-icon>cloud_download</v-icon>
                      </v-btn>
                      <span>Descargar {{document.label}}</span>
                    </v-tooltip>
                  </v-flex>
                </template>
              </v-layout>
            </div>
            <div v-if="!disabled" v-for="(item, idx) in listDropzone" :key="idx">
              <!-- @vdropzone-removed-file="removeFile" -->
              <vue-dropzone
                :key="Math.random() * (1000) + 1"
                ref="myVueDropzone"
                id="dropzone"
                @vdropzone-success="vdropzoneSuccess"
                @vdropzone-error="vdropzoneError"
                @vdropzone-sending="sendingEvent"
                @vdropzone-complete="uploadComplete"
                @vdropzone-sending-multiple="vsendingMuliple"
                @vdropzone-file-added-manually="addFileManually"
                @vdropzone-total-upload-progress="vprogress"
                @vdropzone-queue-complete="vqueueComplete"
                @vdropzone-drop="vdrop"
                @vdropzone-drag-start="vdstart" 
                @vdropzone-drag-end="vdend" 
                @vdropzone-drag-enter="vdenter" 
                @vdropzone-drag-over="vdover" 
                @vdropzone-drag-leave="vdleave" 
                :options="dropzoneOptions">
              </vue-dropzone>
            </div>
          </div>
          <div>
            <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
              <v-btn icon slot="activator" large class="botonApps">
                <v-icon color="primary darken-1">settings</v-icon>
              </v-btn>
              <v-card>
                <v-card-title class="bloqueTituloCabecera">
                  <span class="headline">Subir archivos</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12 sm12 md12>
                        <v-text-field label="Label" v-model="titulo" placeholder="Ejemplo: Nombre(s)" hint="Nombre descriptivo que aparecera encima de los archivos"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <label for="limiteArcivos">Cantidad de archivos a subirse</label>
                        <v-card-text>
                          <v-slider v-model="maxFiles" prepend-icon="attach_file" :persistent-hint="true" max="25" min="1" :hint="`Se permitiran subir <b>${maxFiles}</b> archivos como máximo`"></v-slider>
                        </v-card-text>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <v-layout row wrap>
                          <v-flex xs12 sm12 md12 lg12>
                            <label for="limiteArcivos">Como se visualizaran graficamente los archivos</label>
                          </v-flex>
                          <v-flex xs12 sm12 md12 lg12 class="text-sm-center text-xs-center text-md-center text-lg-center">
                            <v-btn-toggle v-model="avatarSize" color="primary" mandatory>
                              <v-btn flat>
                                <v-icon>photo_size_select_small</v-icon>
                                <span>&nbsp;PEQUEÑO</span>
                              </v-btn>
                              <v-btn flat>
                                <v-icon>flip_to_front</v-icon>
                                <span>&nbsp;MEDIANO</span>
                              </v-btn>
                              <v-btn flat>
                                <v-icon>photo_size_select_large</v-icon>
                                <span>&nbsp;GRANDE</span>
                              </v-btn>
                            </v-btn-toggle>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <label for="limiteArcivos">Tamaño del archivo (Mb)</label>
                        <v-card-text>
                          <v-slider v-model="sizeFile" prepend-icon="work_outline" :persistent-hint="true" max="25" min="1" :hint="`Tamaño máximo permitido es <b>${sizeFile}</b> Mb`"></v-slider>
                        </v-card-text>
                      </v-flex>
                      <v-flex xs12 sm12 md12>
                        <label for="tiposArchivos">Seleccionar los tipos de archivos permitidos</label>
                        <v-checkbox color="primary" class="mt-3" v-model="types" label="Permitir todos los archivos" value="application/*, text/*, image/*, audio/*, video/*"></v-checkbox>
                        <v-checkbox color="primary" v-model="types" label="pdf" value="application/pdf"></v-checkbox>
                        <v-checkbox color="primary" v-model="types" label="imagenes" value="image/*"></v-checkbox>
                        <v-checkbox color="primary" v-model="types" label="audio" value="audio/*"></v-checkbox>
                      </v-flex>
                      <v-flex xs12 sm12 md12 v-if="listValidations.length > 0">
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
  import vue2Dropzone from 'vue2-dropzone';
  import 'vue2-dropzone/dist/vue2Dropzone.min.css';
  import validate from '../../validate.js';
  import slugify from 'slugify';
  const COMPONENT_NAME = 'upload';
  export default {
    mixins: [validate],
    props: ['form', 'field', 'model', 'all', 'to', 'label', 'name', 'onSuccess', 'onError'],
    name: COMPONENT_NAME,
    data () {
      return {
        settings: null,
        dialog: null,
        titulo: null,
        types: [],
        maxFiles: null,
        sizeFile: null,
        avatarSize: null,
        disabled: null,
        listDropzone: [0],
        uploadsDocuments: [],
        dropzoneOptions: {
          url: `${process.env.SERVER}/api/v1/documentos/uploads/${this.$storage.get('idFlujo')}/${this.$storage.get('idDocumentoPlantilla')}/${this.field.name}`,
          maxFilesize: null, // Mb
          paramName: this.name,
          uploadMultiple: true,
          acceptedFiles: null,
          parallelUploads: null,
          autoProcessQueue: true,
          maxFiles: null,
          thumbnailWidth: null,
          addRemoveLinks: true,
          dictDefaultMessage: `<i aria-hidden="true" class="material-icons icon primary--text">cloud_upload</i> ${(this.label) ? this.label : 'Arrastra y suelta tus archivos aquí'}`,
          dictFallbackMessage: 'Tu navegador no soporta drag and drop.',
          dictFallbackText: 'Usa el formulario de abajo para subir tus archivos como en los viejos tiempos.',
          dictFileTooBig: 'Archivo muy grande ({{filesize}}MiB). Máximo permitido: {{maxFilesize}}MiB.',
          dictInvalidFileType: 'Formato de archivo no permitido',
          dictResponseError: 'Error al tratar de subir el/los archivo(s).',
          dictCancelUpload: 'Cancelar subida.',
          dictCancelUploadConfirmation: 'Esta seguro que quiere cancelar?',
          dictRemoveFile: 'Eliminar archivo',
          dictMaxFilesExceeded: 'No puede subir mas archivos.',
          headers: {
            Authorization: `${this.$authToken} ${this.$storage.get('token')}`
          }
        }
      };
    },
    watch: {
      titulo (titulo) {
        this.to.label = titulo;
        this.to.id = slugify(titulo, '_');
      },
      types (types) {
        this.to.types = types;
        this.dropzoneOptions.acceptedFiles = types.join(',');
      },
      maxFiles (maxFiles) {
        this.to.maxFiles = maxFiles;
        this.dropzoneOptions.maxFiles = maxFiles;
        this.dropzoneOptions.parallelUploads = maxFiles;
      },
      avatarSize (avatarSize) {
        this.to.avatarSize = avatarSize;
        if (avatarSize === 0) { // pequeño
          this.dropzoneOptions.thumbnailWidth = 200;
        } else if (avatarSize === 1) { // mediano
          this.dropzoneOptions.thumbnailWidth = 300;
        } else { // grande
          this.dropzoneOptions.thumbnailWidth = 400;
        }
      },
      sizeFile (sizeFile) {
        this.to.sizeFile = sizeFile;
        this.dropzoneOptions.maxFilesize = sizeFile;
      }
    },
    methods: {
      async removeListFile (document) {
        try {
          this.$confirm(`Esta seguro de eliminar el documento <b>${document}</b>`, async () => {
            await this.$service.delete(`documentos/delete/${this.$storage.get('idFlujo')}/${this.$storage.get('idDocumentoPlantilla')}/${this.field.name}/${document}`);
            this.$message.success('Documento eliminado satisfactoriamente');
            this.listDocuments();
          });
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      async listDocuments () {
        try {
          if (this.$storage.get('idFlujo') && this.$storage.get('idDocumentoPlantilla')) {
            const documents = await this.$service.get(`documentos/file_list/${this.$storage.get('idFlujo')}/${this.$storage.get('idDocumentoPlantilla')}/${this.field.name}`);
            if (documents) {
              this.uploadsDocuments = [];
              if (Array.isArray(documents) && documents.length > 0) {
                this.uploadsDocuments = documents.map((doc) => {
                  const obj = {};
                  obj.label = doc.label;
                  obj.url = doc;
                  return obj;
                });
                this.to.value = this.uploadsDocuments;
              }
            }
          }
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      async downloadFile (documento) {
        try {
          window.open(`${process.env.SERVER}/api/v1/documentos/download/${this.$storage.get('idFlujo')}/${this.$storage.get('idDocumentoPlantilla')}/${documento}`);
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      restartConfiguration () {
        this.listDropzone = [];
        this.listDropzone.push(Math.random() * (1000) + 1);
      },
      vdstart () {},
      vdend () {},
      vdenter () {},
      vdover () {},
      vdleave () {},
      vdrop (e) {},
      vqueueComplete (file, xhr, formData) {},
      vprogress (totalProgress, totalBytes, totalBytesSent) {},
      vsendingMuliple (file, xhr, formData) {},
      addFileManually (file) {},
      async uploadComplete (file) {
        try {
          if (file && file.status === 'error') {
            file._removeLink.click();
          }
          this.listDocuments();
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      async removeFile (file, error, xhr) {
        try {
          await this.$service.delete(`documentos/delete/${this.$storage.get('idFlujo')}/${this.$storage.get('idDocumentoPlantilla')}/${this.field.name}/${file.name}`);
          this.$message.success('Documento exitosamente eliminado');
        } catch (err) {
          this.$message.error(err.message);
        }
      },
      vdropzoneSuccess (file, response) {
        if (typeof this.onSuccess === 'function') {
          this.onSuccess(file, response);
        }
      },
      vdropzoneError (file, message, xhr) {
        if (this.$storage.get('idFlujo') && this.$storage.get('idDocumentoPlantilla')) {
          this.$message.error(message.error || message);
          if (typeof this.onError === 'function') {
            this.onError(file, message, xhr);
          }
        } else {
          this.$message.info('No puede probar esta opción al diseñar el formulario.');
        }
      },
      sendingEvent (file, xhr, formData) {
        if (this.form) {
          for (let key in this.form) {
            formData.append(key, this.form[key]);
          }
        }
      },
      saveInput () {
        this.restartConfiguration();
        this.dialog = false;
      },
      cancelar () {
        this.dialog = false;
      }
    },
    components: {
      vueDropzone: vue2Dropzone
    },
    mounted () {
      this.$nextTick(() => {
        this.titulo = this.to.label;
        this.settings = this.to.settings;
        this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
        // Adicionando la opcion de que cuando sea comodin, este sea solo vista aunque tenga todos los permisos
        this.disabled = this.to.disabled;
        if (this.field.comodin) {
          this.disabled = this.to.disabled || !!this.field.comodin;
        }
        if (this.to.types) {
          this.types = this.to.types;
          this.dropzoneOptions.acceptedFiles = this.types.join(',');
        } else {
          this.types = ['application/*, text/*, image/*, audio/*, video/*'];
        }
        if (this.to.maxFiles) {
          this.maxFiles = this.to.maxFiles;
        } else {
          this.maxFiles = 1;
        }
        if (this.to.sizeFile) {
          this.sizeFile = this.to.sizeFile;
        } else {
          this.sizeFile = 5;
        }
        if (this.to.avatarSize) {
          this.avatarSize = this.to.avatarSize;
        } else {
          this.avatarSize = 0;
        }
        this.listDocuments();
      });
    }
  };
</script>
<style lang="scss" src="./main.scss"></style>
<style lang="scss" scoped>
  .uploadsDocuments {
    width: 100%;
    margin-bottom: 10px;
    font-weight: 700;
    border-bottom: 1px dashed rgba($color: #000, $alpha: .4);
  }
  .file-upload {
    margin-bottom: 20px;
    .tituloArchivos {
      padding-bottom: 10px;
    }
    #dropzone {
      margin-top: 10px;
    }
  }
</style>
