<template>
  <div class="comodinConfig">
    <v-dialog v-model="mostrarConfiguracion" persistent max-width="900">
      <v-card>
        <v-card-title class="headline">
          <v-icon>description</v-icon> Configuración para asignar a los componentes comodin
          <v-btn icon @click.native="cerrarConfiguracion()">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <!-- INICIO DE LA GRAFICA DE N-COMODINES -->
            <v-card height="auto">{{items}}
              <decision :paso="items" :documentos="documentos" :prevConfig="prevConfig" ref="decisionComodin"></decision>
            </v-card>
          <!-- TERMINA AQUI LA LISTA DE COMODINES -->
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click.native="cerrarConfiguracion()"><v-icon>cancel</v-icon> Cancelar</v-btn>
          <v-btn color="primary" @click.native="guardarConfiguracion()"> Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import decision from './DecisionComodin';
export default {
  data () {
    return {
      mostrarConfiguracion: false,
      data: null,
      items: [],
      documentos: null,
      prevConfig: null
    };
  },
  methods: {
    async abrirConfiguracion () {
      try {
        this.data = this.$store.state.cellData;
        console.log('---------DATA---------------------------');
        console.log(this.data);
        console.log('------------------------------------');
        const listaComodines = await this.$service.get(`documentos_plantilla/comodines/${this.data.value.docId}`);
        console.log('------------LISTA COMODINES------------------------');
        console.log(listaComodines);
        console.log('------------------------------------');
        if (this.data && this.data.documents) {
          this.items = this.data.documents;
        } else {
          this.$message.warning('Error al tratar de listar componentes');
        }
        this.mostrarConfiguracion = true;
      } catch (err) {
        this.$message.error(err.message);
      }
    },
    cerrarConfiguracion () {
      this.mostrarConfiguracion = false;
    },
    guardarConfiguracion () {
      this.mostrarConfiguracion = false;
    }
  },
  components: {
    decision
  }
};
</script>
<style scoped lang="scss"></style>
