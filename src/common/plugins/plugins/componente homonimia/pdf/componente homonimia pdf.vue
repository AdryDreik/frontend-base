<template>
  <v-card flat>
    <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Unidad Económica:</strong> {{to.value.tipo_empresa.valor}}
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Pais de origen:</strong> {{to.value.paisOrigen}}
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Origen de capital:</strong> {{to.value.origenCapital.name}}
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Página web:</strong> {{to.value.paginaWeb}}
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Duración de la sociedad:</strong> {{to.value.duracionSociedad}}
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Actividades Económicas:</strong> <br>
              <ul>
                <li v-for="(elem, idx) in to.value.unidadesEconomicasSeleccionadas" :key="idx">
                  {{elem.name}}
                </li>
              </ul>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Ambito de acción:</strong> {{to.value.ambitoAccion.name}}
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Participación en otras sociedades comerciales:</strong> {{to.value.participacionSociedadesComerciales ? 'si' : 'no'}}
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Objeto Social :</strong> {{to.value.objetoSocial}}
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Fecha cierre de gestión fiscal :</strong> {{to.value.fechaCierreFiscal}}
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Nombre, Razón Social o denominación :</strong> {{to.value.razonSocial}} {{to.value.terminacion ? to.value.terminacion.name : ''}}
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Rótulo Comercial :</strong> {{to.value.rotuloComercial}}
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <strong>Sigla :</strong> {{to.value.sigla}}
            </v-flex>
          </v-layout>
        </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
  const COMPONENT_NAME = 'sample-render';
  export default {
    name: COMPONENT_NAME,
    props: ['form', 'field', 'model', 'to', 'all'],
    data () {
      return {
      };
    },
    mounted () {
      this.$nextTick(() => {});
    }
  };
</script>
<style lang="scss" scoped></style>
