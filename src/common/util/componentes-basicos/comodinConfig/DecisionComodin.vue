<template>
  <v-layout row wrap>
    <v-flex sm12 xs12 md12 lg12>
      <rule
        ref="configuracionComodin" 
        v-for="(comodin, index) in comodines" 
        :normal="componentesNormales"
        :comodin="[comodin]"
        :configData="configData"
        :key="index">
      </rule>
    </v-flex>
  </v-layout>
</template>

<script>
  import Rule from './RuleComodin';
  export default {
    name: 'decision',
    props: {
      configData: {
        type: Object,
        default: null
      }
    },
    components: {
      Rule
    },
    watch: {
      async documentoComodin (documentoComodin) {
        try {
          if (documentoComodin[0].id.length > 1) {
            const allDocuments = [];
            const comodines = await this.$service.get(`documentos_plantilla/componentes/${documentoComodin[0].id}?tipo=comodin_html`);
            this.comodines = comodines.listado.map((item) => {
              item.id = documentoComodin[0].id;
              return item;
            });
            for (let item of this.configData.documents) {
              const response = await this.$service.get(`documentos_plantilla/componentes/${item.id}`);
              const objDocument = {
                components: response.listado,
                nombre: item.name,
                tipoDocumento: item.tipoComponentes,
                institucion: item.institucion,
                id: response._id,
                tipo: response.tipo
              };
              allDocuments.push(objDocument);
            }
            this.componentesNormales = allDocuments;
          }
        } catch (err) {
          this.$message.error(err.message);
        }
      }
    },
    data () {
      return {
        comodines: null,
        documentoComodin: null,
        componentesNormales: null
      };
    },
    methods: {
      obtenerConfigComodin () {
        const allConfig = [];
        if (Array.isArray(this.$refs.configuracionComodin)) {
          for (let config of this.$refs.configuracionComodin) {
            allConfig.push(config.configuracionReglaComodin());
          }
        }
        return allConfig;
      },
      asignarConfigComodin () {
        let index = 0;
        if (Array.isArray(this.configData.value.configComodin) && this.configData.value.configComodin.length > 0) {
          for (let config of this.$refs.configuracionComodin) {
            config.asignarConfiguracionReglaComodin(this.configData.value.configComodin[index].campoNormalSeleccionado, this.configData.value.configComodin[index].campoComodinSeleccionado, this.configData.value.configComodin[index].infoComodin);
            index++;
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped></style>

