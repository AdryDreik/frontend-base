<template>
  <section>
    <v-dialog v-model="mostrarConfiguracion" max-width="720" persistent scrollable>
      <v-card class="dialog-token">
        <v-card-title class="headline">
          <v-layout row wrap>
            <v-flex xs10 sm10 md10 lg10 mt-2>
              <v-icon>directions</v-icon> Agregar Flujo Plantilla
            </v-flex>
            <v-flex xs2 sm2 md2 lg2 class="text-md-right text-lg-right text-xs-right text-sm-right">
              <v-tooltip bottom>
                <v-btn color="primary" icon slot="activator" @click.native="cerrarConfiguracion()">
                  <v-icon class="ml-1" color="white">close</v-icon>
                </v-btn>
                <span>Cerrar ventana</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-form
          v-model="valid"
          ref="formFlujo"
          lazy-validation
          >
          <v-card-text style="background: white">
            <v-container grid-list-md>
              <h4>Datos generales del proceso</h4>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    label="Nombre del flujo"
                    v-model="nombre"
                    :rules="$validate(['requerido'])"
                    :counter="40"
                    required
                    ></v-text-field>
                </v-flex>
                <v-flex xs12 v-if="esSuperAdmin && !valores">
                  <v-select
                    :items="instituciones"
                    v-model="institucionSelect"
                    label="Institución"
                    item-text="text"
                    item-value="value"
                    autocomplete
                    noDataText="No hay resultados"
                    :rules="$validate(['requerido'])"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="Descripción"
                    v-model="descripcion"
                    :counter="200"
                    :rules="$validate(['requerido'])"
                    ></v-text-field>
                </v-flex>
              </v-layout>
              <h4>Actores que intervienen en el trámite</h4>
              <v-layout wrap>
     
                <v-flex xs12>
                  <v-select
                    v-model="roles"
                    label="Seleccione o agregue nuevos grupos para este flujo"
                    chips
                    multiple
                    autocomplete
                    :items="generalRoles"
                    item-text="role"
                    required
                    :rules="$validate(['requerido'])"
                    prepend-icon="people"
                    >
										<template slot="selection" slot-scope="data">
											<v-chip
												close
												@input="data.parent.selectItem(data.item)"
												:selected="data.selected"
												class="chip--select-multi"
												:key="JSON.stringify(data.item)"
												>
                        <v-icon>assignment_ind</v-icon>
												{{ data.item.role }}
											</v-chip>
										</template>
									</v-select>
                </v-flex>
              </v-layout>
              <h4>Formularios requeridos en el trámite</h4>
              <v-layout wrap>
                <v-flex xs12>
                  <v-select
                    v-model="documents"
                    label="Seleccione los documentos que utilizará el flujo"
                    chips
                    multiple
                    autocomplete
                    :items="documentOptions"
                    item-text='name'
                    required
                    :rules="$validate(['requerido'])"
                    no-data-text="No existen formularios publicados para esta institucion"
                    prepend-icon="folder"
                    >
										<template slot="selection" slot-scope="data">
											<v-chip
												close
												@input="data.parent.selectItem(data.item)"
												:selected="data.selected"
												class="chip--select-multi"
												:key="JSON.stringify(data.item)"
												>
                        <v-icon>assignment</v-icon>
												{{ data.item.name }}
											</v-chip>
										</template>
									</v-select>
                </v-flex>
              </v-layout>
              <h4>Vigencia del flujo</h4>

                <div>
                  <v-tabs
                    slot="extension"
                    v-model="tabsVigencia"
                    color="white"
                    grow
                  >
                    <v-tabs-slider color="primary"></v-tabs-slider>
                    <v-tab key="0">
                      TIEMPO
                    </v-tab>
                    <v-tab key="1">
                      USO
                    </v-tab>
                  </v-tabs>
                  <v-tabs-items v-model="tabsVigencia">
                    <v-tab-item key="0">
                      <v-card flat>
                        <v-card-text>
                          <v-slider v-model="vigencia" prepend-icon="date_range" min="1" max="24" required :hint="`Vigencia de <b>${vigencia}</b> meses`" persistent-hint></v-slider>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                    <v-tab-item key="1">
                      <v-card flat>
                        <v-card-text>
                          <v-radio-group v-model="uso" row :mandatory="false">
                            <v-radio label="Una vez" value="1"></v-radio>
                            <v-radio label="Dos veces" value="2"></v-radio>
                            <v-radio label="Tres veces" value="3"></v-radio>
                            <v-radio label="N veces" value="0"></v-radio>
                          </v-radio-group>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>
                </div>
            </v-container>
          </v-card-text>
          <v-card-actions style="background-color: white">
            <v-layout row wrap>
              <v-flex xs12 sm12 md8 lg8>
                <small class="error--text text-required">* Los campos son obligatorios</small>
              </v-flex>
              <v-flex xs12 sm12 md2 lg2>
                <v-btn
                  block
                  @click.native="cerrarConfiguracion">
                  <v-icon>cancel</v-icon> {{$t('common.cancel') }}
                </v-btn>
              </v-flex>
              <v-flex xs12 sm12 md2 lg2>
                <v-btn
                  block
                  @click.prevent="dibujarFlujo"
                  color="primary"
                  type="submit"
                  :disabled="!valid">
                  <v-icon>check</v-icon> Siguiente
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
// import Flujo from 'flujo';
import validate from '@/common/mixins/validate';
const { SUPER_ADMIN, GRUPO_SOLICITANTE } = require('../../../../../config');
export default {
  props: {
    valores: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [validate],
  created () {
    this.instituciones = [];
    this.getInstituciones();
    this.user = this.$storage.getUser();
    // this.rolUsuario = this.user && this.user.roles ? this.user.roles.titulo : '';
    this.esSuperAdmin = this.user.roles._id === SUPER_ADMIN;
    this.institucion = this.user && typeof this.user.institucion === 'object' && !this.esSuperAdmin ? this.user.institucion._id : '';
    this.getGroups();
    this.getDocs();
  },
  data () {
    return {
      mostrarConfiguracion: false,
      id: null,
      nombre: null,
      roles: null,
      generalRoles: [],
      documents: null,
      documentOptions: [],
      descripcion: null,
      estructura: null,
      valid: false,
      vigencia: null,
      uso: null,
      tabsVigencia: null,
      validGroup: false,
      institucionSelect: null
    };
  },
  watch: {
    valid: function () {
      this.checkValidSelect();
    },
    roles: function () {
      this.checkValidSelect();
    },
    documents: function () {
      this.checkValidSelect();
    },
    institucionSelect: function () {
      this.roles = [];
      this.documents = [];
      this.getGroups();
      this.getDocs();
    }
  },
  methods: {
    async dibujarFlujo () {
      try {
        let existeSolicitante = false;
        for (let rol in this.roles) {
          if (this.roles[rol].role === 'solicitante') {
            existeSolicitante = true;
          }
        }
        if (!existeSolicitante) {
          const grupoSolicitante = {
            'role': 'solicitante',
            'id': GRUPO_SOLICITANTE // '000000000000000000000111'
          };
          this.roles.push(grupoSolicitante);
          // this.$message.error('El grupo solicitante es requerido en el flujo!');
        }
        if (this.$refs.formFlujo.validate()) {
          // const rolesNormalizados = await this.normalizeObj('grupos', this.roles);
          // const documentosNormalizados = await this.normalizeObj('documentos', this.documents);
          // if (rolesNormalizados && documentosNormalizados) {
          let formData = {
            'id': this.id,
            'flowName': this.nombre,
            'description': this.descripcion,
            'roles': this.roles,
            'documents': this.documents,
            'estructura': this.estructura,
            'institucion': this.esSuperAdmin ? this.institucionSelect : this.institucion,
            'vigencia': this.tabsVigencia === '0' ? { tipo: 'tiempo', cantidad: this.vigencia } : { tipo: 'uso', cantidad: this.uso },
            'generalRoles': this.generalRoles // para pasarle la lista de roles generales de la institución
          };
          if (this.valores) {
            this.$emit('updateFlowParams', formData);
            this.cerrarConfiguracion();
          } else {
            const path = 'flujos_plantilla/';
            let flow = {
              'titulo': formData.flowName,
              'descripcion': formData.description,
              'institucion': formData.institucion,
              'version': 0,
              'activo': false,
              'deleted': false,
              'permisos': [],
              'extras': [],
              'temporizador': [],
              'acciones': [],
              'pasos': [],
              'base': {
                'documentos': formData.documents,
                'reemplazos': [],
                'grupos': formData.roles,
                'estructura': formData.estructura
              },
              'decision': [],
              'vigencia': formData.vigencia
            };
            this.$service.post(`${path}?validar=false`, flow)
            .then((res) => {
              if (res) {
                formData.id = res._id;
                this.$router.push({ name: 'Editor de Flujo', params: formData });
              }
            });
          }
        }
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    clear () {
      this.$refs.Flujo.reset();
    },
    getGroups () {
      let query = '';
      // if (this.id && (this.institucion || this.institucionSelect)) {
      //   query = '/institucion/' + (this.institucionSelect ? this.institucionSelect : this.institucion) + '/' + this.id + '/?campos=_id,titulo';
      // }
      if (this.institucionSelect) {
        query = '/institucion/' + this.institucionSelect + '/?campos=_id,titulo';
      } else if (this.institucion) {
        query = '/institucion/' + this.institucion + '/?campos=_id,titulo';
      } else {
        query = '/?campos=_id,titulo';
      }
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

          if (this.valores && this.valores.roles && this.valores.roles.length > 0) {
            for (let i in this.valores.roles) {
              if (this.valores.roles[i].hasOwnProperty('crear')) {
                this.generalRoles.push(this.valores.roles[i]);
              }
            }
          }
          // this.generalRoles = [{'role': 'Rol 1', 'id': '507f1f77bcf86cd799439011'}, {'role': 'Rol 2', 'id': '507f1f77bcf86cd799439012'}, {'role': 'Rol 3', 'id': '507f1f77bcf86cd799439013'}];
        }
      })
      .catch((err) => this.$message.error(err.message));
    },
    getDocs () {
      let query = '/?campos=_id,titulo,tipo,tipoComponentes,template,&publicado=true';
      if (this.institucionSelect) {
        query = query + '&institucion=' + this.institucionSelect;
      } else if (this.institucion) {
        query = query + '&institucion=' + this.institucion;
      }
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
            doc.template = (doc.template) ? doc.template : false;
            this.documentOptions.push(doc);
          });
          // this.documentOptions = [{'name': 'ABC', 'id': '5349b4ddd2781d08c09890f4'}, {'name': '461535', 'id': '5349b4ddd2781d08c09890f5'}, {'name': 'DOC7485', 'id': '5349b4ddd2781d08c09890f6'}];
        }
      })
      .catch((err) => this.$message.error(err.message));
    },
    abrirConfiguracion: async function () {
      // this.$refs.Flujo.reset();
      if (this.valores) {
        this.id = this.valores.id;
        this.nombre = this.valores.name;
        this.descripcion = this.valores.description;
        this.tabsVigencia = (this.valores.vigencia.tipo === 'uso') ? 1 : 0;
        if (this.tabsVigencia === 0) {
          this.vigencia = this.valores.vigencia.cantidad;
        } else {
          this.uso = this.valores.vigencia.cantidad;
        }
        // this.institucionSelect = this.valores.institucion;
        this.institucion = this.valores.institucion;
        await this.getGroups();
        await this.getDocs();
        this.roles = this.valores.roles;
        for (let element in this.valores.documents) {
          if (this.valores.documents[element].hasOwnProperty('componentes')) {
            delete this.valores.documents[element].componentes;
          }
        }
        this.documents = this.valores.documents;
      }
      this.mostrarConfiguracion = true;
    },
    cerrarConfiguracion () {
      this.$refs.formFlujo.reset();
      this.mostrarConfiguracion = false;
    },
    checkValidSelect () {
      if (!this.roles || this.roles.length === 0 || !this.documents || this.documents.length === 0 || !this.$refs.formFlujo.validate()) {
        this.valid = false;
      } else {
        this.valid = true;
      }
    },
    getInstituciones () {
      this.$service.get('instituciones?campos=sigla,nombre,activo')
      .then(response => {
        if (response) {
          let items = response.listado;
          let instituciones = [];
          items.map(inst => {
            if (inst.activo) {
              instituciones.push({ value: inst._id, text: (inst.sigla ? `${inst.sigla} - ` : '') + inst.nombre });
            }
          });
          this.instituciones = instituciones;
        }
      });
    }
  }
};
</script>
<style lang="scss"></style>
