<template>
  <section>
    <v-dialog v-model="mostrarConfiguracion" max-width="900" persistent scrollable>
      <v-card class="dialog-token">   
          <v-card-title class="headline">
            <v-icon>shuffle</v-icon> Configuración de la decision
            <v-btn icon @click.native="cerrarConfiguracion()">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-layout row wrap class="ml-4">
            <v-flex xs10 sm10 lg10>
              <v-text-field
                label="Descripcion"
                v-model="label"
              ></v-text-field>
            </v-flex>
          </v-layout>
        
          <v-card-text flat>
            <!--
            <v-stepper v-model="e1" v-if="items.length>0" class="ml-4 mr-4" v-show="false">
              <v-stepper-header>
                <template v-for="item in items">
                  <v-stepper-step
                    :key="`${item.id}-step`"
                    :step="item.id"
                    :complete="e1 > item.id"
                    editable
                  >
                    <v-tooltip top>
                      <span slot="activator">{{item.label.substring(0,15)}}</span>
                      <span>{{item.label}}</span>
                    </v-tooltip>
                  </v-stepper-step>
                </template>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content
                  :step="n.id"
                  v-for="n in items"
                  :key="`${n.id}-content`"
                >
                  <v-card height="auto">
                    <decision :paso="n" :documentos="documentos" :prevConfig="prevConfig" ref="decision"></decision>
                  </v-card>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
            -->
          
            <v-stepper v-model="e1" v-if="items.length>0" class="ml-4 mr-4" vertical>
              <template v-for="item in items">
                <v-stepper-step
                  :key="`${item.id}-step`"
                  :step="item.id"
                  :complete="e1 > item.id"
                  editable
                >
                  {{item.label}}
                </v-stepper-step>
                <v-stepper-content
                  :step="item.id"
                  :key="`${item.id}-content`"
                >
                  <v-card height="auto">
                    <decision :paso="item" :documentos="documentos" :prevConfig="prevConfig" ref="decision"></decision>
                  </v-card>
                </v-stepper-content>
              </template>
            </v-stepper>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click.native="cerrarConfiguracion()"><v-icon>cancel</v-icon> Cancelar</v-btn>
            <v-btn color="primary" @click.native="guardarConfiguracion()"><v-icon dark>check</v-icon> Guardar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>

  </section>
</template>
<script>
  /* eslint no-useless-escape: 0 */
  /* eslint no-unneeded-ternary:0 */
  import decision from './decision';
  export default {
    components: { decision },
    props: {
      institucion: {
        required: true
      },
      id: {
        required: false
      }
    },
    data () {
      return {
        label: null,
        data: null,
        mostrarConfiguracion: false,
        e1: null,
        items: [],
        documentos: [],
        prevConfig: null
      };
    },
    methods: {
      abrirConfiguracion: async function () {
        this.data = this.$store.state.cellData;
        if (this.data && this.data.connected && this.data.connected.onNext && this.data.connected.onNext.length > 0) {
          this.items = this.data.connected.onNext.reduce((a, b) => {
            a.push({
              id: a.length + 1,
              idOriginal: b.id,
              label: b.label
            });
            return a;
          }, []);
          if (this.data && this.data.value && this.data.value.docId) {
            await this.$service.get(`decisiones/`, this.data.value.docId)
            .then(response => {
              if (response) {
                // Only rules with valid doc ids will be shown
                this.prevConfig = null;
                let body = response.body.reduce((a, b) => {
                  let newRules = b.rules.reduce((c, d) => {
                    let isInDocArray = false;
                    this.data.documents.forEach(element => {
                      if (d.documentoPlantilla === element.id) {
                        isInDocArray = true;
                      }
                    });
                    if (isInDocArray) {
                      c.push(d);
                    }
                    return c;
                  }, []);
                  let set = {
                    'paso': b.paso,
                    'opcion': b.opcion,
                    'rules': newRules
                  };
                  a.push(set);
                  return a;
                }, []);
                this.prevConfig = body; // response.body;
              }
            });
          }
          this.documentos = this.data.documents;
          setTimeout(() => {
            this.e1 = 1;
          }, 100);
          if (this.data.value && this.data.value.name) {
            this.label = this.data.value.name;
          }
          this.mostrarConfiguracion = true;
        } else {
          this.$message.warning('Conecte esta celda a uno o mas procesos para poder configurarla!');
        }
      },
      cerrarConfiguracion () {
        this.mostrarConfiguracion = false;
      },
      guardarConfiguracion () {
        // const rules = this.$refs.decision.map((obj) => obj.queryFormStatus().decision[0]);
        const rules = this.$refs.decision.map((obj) => obj.queryFormStatus().decision[0]);
        console.log('--------------storing rules----------------------');
        console.log(rules);
        console.log('------------------------------------');
        // /*
        const params = {
          institucion: this.institucion,
          titulo: this.label,
          tipo: 'D',
          body: rules
        };
        if (this.data.value && this.data.value.docId) {
          const currentDocId = this.data.value.docId;
          console.log('------------------------------------');
          console.log('edit ' + currentDocId);
          console.log('------------------------------------');
          this.$service.put('decisiones/' + currentDocId, params)
          .then((response) => {
            this.data.value.name = this.label;
            this.$emit('saveCellData', this.data);
            this.cerrarConfiguracion();
            this.$message.success('El componente de decision ha sido modificado');
          })
          .catch((err) => this.$message.error(err.message));
        } else {
          const tipoCell = this.data.value.tipo;
          console.log('------------------------------------');
          console.log('create new');
          console.log('------------------------------------');
          this.$service.post('decisiones', params)
          .then((response) => {
            this.data.value = {
              tipo: tipoCell,
              name: this.label,
              docId: response._id
            };
            // this.$parent.$options.methods.updateGraphCell(this.data);
            this.$emit('saveCellData', this.data);
            this.cerrarConfiguracion();
            this.$message.success('El componente de decision ha sido configurado');
          })
          .catch((err) => this.$message.error(err.message));
        }
        // */
      }
    }
  };

</script>

<style lang="scss">
  .p-interoperabilidad {
    width: 80px;
    height: 80px;
    .material-icons {
      font-size: 55px;      
    }
  }

  .seccionConf {
    width: auto;
    height: 100%;
    margin-left: 20px;
    border: 2px solid rgba(0,0,0, .2);
    background: rgb(255, 255, 255);
    background: -moz-linear-gradient(top, rgba(255, 255, 255, 1) 0%, rgba(246, 246, 246, 1) 47%, rgba(237, 237, 237, 1) 100%);
    background: -webkit-linear-gradient(top, rgba(255, 255, 255, 1) 0%, rgba(246, 246, 246, 1) 47%, rgba(237, 237, 237, 1) 100%);
    background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(246, 246, 246, 1) 47%, rgba(237, 237, 237, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#ededed', GradientType=0);
    color: rgb(58, 53, 53);
  }

  .interoperabilidadDraggable {
    border: 1px solid rgb(199, 199, 199);
    padding: 0px 5px;

    .detalle {
      padding: 10px 5px;
    }

  }

  .interoperabilidadDraggableAtributo {
    padding: 0px 30px;
  }

</style>

