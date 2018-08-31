<template>
  <section>
      <v-card class="dialog-token">
        <h4 class="primary--text text-xs-center"><v-icon color="primary">format_strikethrough</v-icon> Crear flujo</h4>
        <v-form ref="Flujo" v-model="valid">
          <v-layout row>
            <v-flex class="mr-3" xs6 sm6 md6 lg6 offset-xs3>
              <h5 class="primary--text" sm6 md6 lg6 xs6 offset-xs3>1. Datos generales</h5>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex class="mr-3" xs6 sm6 md6 lg6 offset-xs3>
              <v-text-field
                label="Nombre"
                v-model="nombre"
                :rules="[rules.required]"
                :counter="40"
                required
                ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs6 sm6 md6 lg6 offset-xs3>
              <v-text-field
                label="Descripción"
                v-model="descripcion"
                :counter="200"
                :rules="[rules.required]"
                value=""
                multi-line
                ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs6 sm6 md6 lg6 offset-xs3>
              <v-select
                v-model="roles"
                label="Seleccione o agregue nuevos grupos para este flujo"
                chips
                tags
                :items="generalRoles"
                item-text="role"
                required
                :rules="[rules.required]"
                ></v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs6 sm6 md6 lg6 offset-xs3>
              <v-select
                v-model="documents"
                label="Seleccione los documentos que utilizará el flujo"
                chips
                tags
                :items="documentOptions"
                item-text='name'
                required
                multiple
                :rules="[(v) => !!v || 'Item is required']"
                ></v-select>
      
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs6 sm6 md6 lg6 offset-xs3>
              <v-btn
                @click="dibujarFlujo"
                color="primary"
                round
                :disabled="!valid"
                >Siguiente (Dibujar flujo)</v-btn>
              <v-btn
                @click="clear"
                round
                >Limpiar formulario</v-btn>
              <!-- router-link :to="{ name: 'Editor de Flujo', params: { roles: [123, 456, 798], documents: ['ADT46846', 'TH7945'] }}">Prueba</router-link -->
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
  </section>
</template>

<script>
// import validate from 'validate.js';
// import Flujo from 'flujo';
export default {
  /*
  created () {
    this.$bus.$on('Hola', (value) => {
      console.log('fdsfasdf');
    });
    if (this.$route && this.$route.query && this.$route.query.id) {
      this.$service.get(`flujos_plantilla/${this.$route.query.id}`)
      .then((res) => {
        if (res) {
          var queryData = res;
          this.id = this.$route.query.id;
          this.nombre = queryData.titulo;
          this.descripcion = queryData.descripcion;
          this.roles = queryData.base.grupos;
          this.documents = queryData.base.documentos;
          this.xml = queryData.base.xml;
        }
      })
      .catch((err) => this.$message.error(err.message));
    }
  },
  */
  mounted () {
    this.getGroups();
    this.getDocs();
  },
  data () {
    return {
      mostrarConfiguracion: false,
      parametros: [{
        field: 'nombre',
        match: 'nombre'
      }, {
        field: 'roles',
        match: 'roles'
      }, {
        field: 'descripcion',
        match: 'descripcion'
      }, {
        field: 'documents',
        match: 'documents'
      }],
      id: null,
      nombre: null,
      roles: null,
      generalRoles: [],
      documents: null,
      documentOptions: [],
      descripcion: null,
      institucion: '5aaac05667adf97ed4093eb5', // this.$storage.get('user').institucion
      estructura: null,
      valid: false,
      rules: {
        required: (value) => !!value || 'El campo es requerido'
      }
    };
  },
  /*
  watch: {
    roles (val) {
      console.log('------------------------------------');
      console.log(val);
      console.log('------------------------------------');
    }
  },
  */
  methods: {
    dibujarFlujo: async function () {
      var rolesNormalizados = await this.normalizeObj('grupos', this.roles);
      var documentosNormalizados = await this.normalizeObj('documentos', this.documents);
      // alert(this.documents);
      if (rolesNormalizados && documentosNormalizados) {
        console.log('----------------roles normalizados--------------------');
        console.log(rolesNormalizados);
        console.log('----------------docs normalizados--------------------');
        console.log(documentosNormalizados);
        console.log('------------------------------------');
        let formData = {
          'id': this.id,
          'flowName': this.nombre,
          'description': this.descripcion,
          'roles': this.roles,
          'documents': this.documents,
          'institucion': this.institucion,
          'estructura': this.estructura
        };
        console.log('----------------form Data--------------------');
        console.log(formData);
        console.log('------------------------------------');
        if (this.$refs.Flujo.validate()) {
          this.$router.push({ name: 'Editor de Flujo', params: formData });
        }
      }
    },
    clear () {
      this.$refs.Flujo.reset();
    },
    normalizeObj (type, obj) {
      var valido = true;
      const promises = [];
      for (var option in obj) {
        if (!obj[option].hasOwnProperty('id')) {
          if (type === 'grupos') {
            // Se crea un grupo si una opcion ha sido agregada en el combo grupos
            promises.push(this.createGroup(obj[option]));
            /*
            var newRole = {
              'role': grupoCreado.titulo,
              'id': grupoCreado._id
            };
            */
            // obj[option] = newRole;
          } else if (type === 'documentos') {
            this.$message.error('Debe seleccionar los documentos disponibles en la lista, no puede crear nuevos!');
            valido = false;
          }
        }
      }
      if (promises.length > 0) {
        Promise.all(promises)
        .then((res) => {
          if (res) {
            res.forEach(row => {
              if (obj.includes(row.role)) {
                for (var i = 0; i < obj.length; i++) {
                  if (obj[i] === row.role) {
                    obj[i] = row;
                  }
                }
              }
            });
          }
        });
        return valido;
      } else {
        return valido;
      }
    },
    createGroup (nombreGrupo) {
      try {
        return new Promise((resolve, reject) => {
          if (nombreGrupo === '') {
            this.$message.info('Un grupo agregado no pudo ser creado para el flujo!');
          } else {
            const path = 'grupos/';
            // Obtener Id de institucion dinamicamente...
            var data = {
              'titulo': nombreGrupo,
              'descripcion': 'Nuevo grupo',
              'institucion': '5aa92b644a13aa2b59d9e728'
            };
            this.$service.post(`${path}`, data)
            .then((res) => {
              var grupoCreado = res;
              var newRole = {
                'role': grupoCreado.titulo,
                'id': grupoCreado._id
              };
              resolve(newRole);
            }).catch((err) => this.$message.error(err.message));
          }
        });
      } catch (err) {
        // throw new Error(err.message);
        this.$message.error(err.message);
      }
    },
    randomId () {
      var text = '';
      var possible = 'abcdef0123456789';

      for (var i = 0; i < 24; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    },
    getGroups () {
      var query = '/?campos=_id,titulo';
      this.$service.get(`grupos` + query)
      .then((res) => {
        if (res) {
          this.generalRoles = [];
          let gruposObtenidos = res.listado;

          gruposObtenidos.forEach(grupo => {
            let institucionId = grupo.institucion._id;
            grupo.id = grupo._id;
            delete grupo._id;
            grupo.role = grupo.titulo;
            delete grupo.titulo;
            delete grupo.institucion;
            grupo.institucion = institucionId;
            this.generalRoles.push(grupo);
          });
          // this.generalRoles = [{'role': 'Rol 1', 'id': '507f1f77bcf86cd799439011'}, {'role': 'Rol 2', 'id': '507f1f77bcf86cd799439012'}, {'role': 'Rol 3', 'id': '507f1f77bcf86cd799439013'}];
        }
      })
      .catch((err) => this.$message.error(err.message));
    },
    getDocs () {
      var query = '/?campos=_id,titulo';
      this.$service.get('documentos_plantilla' + query)
      .then((res) => {
        if (res) {
          this.documentOptions = [];
          let documentosObtenidos = res.listado;

          documentosObtenidos.forEach(doc => {
            let institucionId = doc.institucion._id;
            doc.id = doc._id;
            delete doc._id;
            doc.name = doc.titulo;
            delete doc.titulo;
            delete doc.institucion;
            doc.institucion = institucionId;
            this.documentOptions.push(doc);
          });
          // this.documentOptions = [{'name': 'ABC', 'id': '5349b4ddd2781d08c09890f4'}, {'name': '461535', 'id': '5349b4ddd2781d08c09890f5'}, {'name': 'DOC7485', 'id': '5349b4ddd2781d08c09890f6'}];
        }
      })
      .catch((err) => this.$message.error(err.message));
    },
    abrirConfiguracion () {
      const datos = this.$store.state.cellData;
      if (datos) {
        if (datos && datos.connected && datos.connected.onNext) {
          this.items = datos.connected.onNext.reduce((a, b) => {
            a.push({
              id: a.length + 1,
              idOriginal: b.id,
              label: b.label
            });
            return a;
          }, []);
          this.documentos = datos.documents;
          setTimeout(() => {
            this.e1 = 1;
            // this.$bus.$emit('FORMULARIOS', datos.documents);
          }, 100);
        }
      }
      this.mostrarConfiguracion = true;
    },
    cerrarConfiguracion () {
      this.mostrarConfiguracion = false;
    },
    guardarConfiguracion () {
      console.log('------------aaaaaaa------------------------');
      console.log(this);
      console.log('------------------------------------');
      // this.$emit('test');
      // var respuestaPaso = {
      //   'type': 'document',
      //   'cellId': this.data.cellId,
      //   'value': {
      //     'name': this.data.value.name,
      //     'docId': this.data.value.docID
      //   }
      // };
      // this.$parent.$options.methods.updateGraphCell(respuestaPaso);
      // this.cerrarConfiguracion();
    }
  }
};
</script>
<style lang="scss"></style>
