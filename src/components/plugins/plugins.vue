<template>
  <section>
    <uploader :options="optionsCreate" @file-complete="fileComplete" @complete="complete">
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <uploader-btn :attrs="attrs"><v-icon class="white--text">file_upload</v-icon> Seleccionar plugin</uploader-btn>
      </uploader-drop>
      <uploader-list></uploader-list>
    </uploader> 
    <!-- VENTANA EMERGENTE PARA MODIFICAR EL PLUGIN A NIVEL DATOS -->
     <v-dialog v-model="dialog" persistent max-width="700px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar plugin</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs8 sm8 md8 lg8>
                <v-text-field
                label="Nombre del Plugin" 
                required 
                v-model="nombre_plugin"
                prepend-icon="edit"
                ></v-text-field>
              </v-flex>
              <v-flex xs4 sm4 md4 lg4>
               <v-switch
                color="primary"
                :label="(activado) ? 'Plugin activado' : 'Plugin desactivado'"
                v-model="activado"
                hint="Solo si esta activado se podra utilizar en el diseñador de formularios."
                persistent-hint
              ></v-switch>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-select
                  :items="instituciones"
                  label="Instituciones"
                  v-model="institucionesSeleccionadas"
                  multiple
                  item-text="nombre"
                  item-value="_id"
                  autocomplete
                  chips
                  prepend-icon="domain"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="default" @click.native="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click.native="guardar()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="listPlugins">
      <div class="bloquePlugin" v-for="(plugin, idx) in plugins" :key="idx" :class="`height-tmp-${heightTmp && plugin._id==tmpPlugin._id} bloque-${plugin.estado}`">
          <div class="opciones">
            <ul class="actionsPlugins">
              <li>
                <v-tooltip class="editPlugin" top>
                  <v-btn color="info" @click.prevent="editarPlugin(plugin)" icon slot="activator">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <span>Editar plugin</span>
                </v-tooltip>
              </li>
              <li>
                <v-tooltip class="editPlugin" top>
                  <v-btn color="success" @click.prevent="mostrarDetalle(plugin)" icon slot="activator">
                    <v-icon>remove_red_eyes</v-icon>
                  </v-btn>
                  <span>Ver detalle</span>
                </v-tooltip>
              </li>
              <li>
                <v-tooltip class="deletePlugin" bottom>
                  <v-btn color="error" @click.prevent="eliminarPlugin(plugin)" icon slot="activator">
                    <v-icon>delete_forever</v-icon>
                  </v-btn>
                  <span>Eliminar plugin</span>
                </v-tooltip>
              </li>
            </ul>
          </div>
          <v-icon class="iconosPlugin">{{plugin.component.templateOptions.icon}}</v-icon>
          <!-- <img :src="plugin.avatar" alt="error en la ruta de assets" class="avatarPlugin"> -->
          <div class="nombre text-md-left"><span class="nnombre">{{plugin.nombre}}</span> <span class="nversion">Version: {{plugin.version}}</span></div>
          <div class="autor text-md-center">{{plugin.author}}</div>
          <div class="descripcion text-md-justify" v-show="view && plugin._id==tmpPlugin._id">
            {{plugin.descripcion}}
          </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  async created () {
    try {
      this.$service.get('plugins?filter=all')
        .then((res) => {
          this.plugins = res.listado;
        })
        .catch((err) => this.$message.error(err.message));
      const respuesta = await this.$service.get('instituciones?campos=sigla,nombre');
      if (respuesta.listado) {
        this.instituciones = respuesta.listado;
      }
    } catch (error) {
    }
  },
  data () {
    return {
      heightTmp: false,
      view: false,
      dialog: false,
      idPlugin: '',
      nombre_plugin: '',
      activado: false,
      instituciones: [],
      institucionesSeleccionadas: [],
      tmpPlugin: null,
      plugins: [],
      optionsCreate: {
        target: `${this.$apiUrl}plugins/validar-manifest`,
        testChunks: false, // permite reanudar los archivos que se subiran,
        withCredentials: false,
        headers: {'Authorization': `${this.$authToken} ${this.$storage.get('token')}`}
      },
      attrs: {
        accept: 'application/zip,application/x-zip,application/x-zip-compressed,application/octet-stream'
      },
      statusText: {
        success: 'success',
        error: 'error',
        uploading: 'uploading',
        paused: 'paused',
        waiting: 'waiting'
      },
      pluginSelected: {},
      tmpValues: []
    };
  },
  methods: {
    fileComplete () {
    },
    complete () {
    },
    editarPlugin (plugin) {
      this.dialog = true;
      this.idPlugin = plugin._id;
      this.nombre_plugin = plugin.nombre;
      this.activado = plugin.estado === 'ACTIVO' ? true : false;
      this.institucionesSeleccionadas = plugin.institucion;
    },
    guardar () {
      const body = {
        nombre: this.nombre_plugin,
        institucion: this.institucionesSeleccionadas,
        estado: this.activado ? 'ACTIVO' : 'DESACTIVADO'
      };
      this.$service.put(`plugins/${this.idPlugin}`, body)
        .then((res) => {
          if (res) {
            if (res.finalizado) {
              this.$store.commit('setMain', false);
              this.$nextTick(function () {
                this.$store.commit('setMain', true);
              });
              this.dialog = false;
              this.$message.success('Se actualizo el plugin satisfactoriamente.');
            }
          }
        })
        .catch((err) => this.$message.error(err.message));
    },
    eliminarPlugin (plugin) {
      if (plugin) {
        this.$confirm(`Esta seguro de eliminar el plugin <strong>"${plugin.nombre}"</strong>,<br/><hr><strong>Descripción:</strong> ${plugin.descripcion}`, () => {
          this.$service.delete(`plugins/${plugin._id}`)
            .then((res) => {
              this.$store.commit('setMain', false);
              this.$nextTick(function () {
                this.$store.commit('setMain', true);
              });
              this.$message.success('Se elimino el plugin satisfactoriamente');
            })
            .catch((err) => this.$message.error(err.message));
        });
      }
    },
    mostrarDetalle (plugin) {
      this.heightTmp = !this.heightTmp;
      this.view = !this.view;
      this.tmpPlugin = plugin;
    }
  }
};
</script>
<style src="./plugins.scss" lang="scss"></style>
