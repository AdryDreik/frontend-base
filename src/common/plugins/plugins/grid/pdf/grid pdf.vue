<template>
  <v-card flat style="background: transparent">
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12 class="subheaderModified">
            <v-subheader>{{ label }}</v-subheader>
          </v-flex>
          <v-flex xs12 md12>
            <div v-if="!value || value.length === 0 || !headers || headers.length === 0">
              <div class="text-md-center">No eisten registros para esta tabla.</div>
            </div>
            <div v-else>
              <table class="table table-hover" style="background: transparent">
                <thead>
                  <tr>
                    <th>Nro.</th>
                    <th v-for="(head, index) in headers" :key="index">
                      {{ head }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(f, ix) in value" :key="ix" v-if="Object.keys(f)[0] !== '___totales'">
                    <td>
                      {{ix + 1}}
                    </td>
                    <td v-for="(column, index) in f" :key="index">
                      <i>{{ column }}</i>
                    </td>
                  </tr>
                </tbody>
              </table>
              <v-flex v-if="totales && totales.length > 0" xs6 md6 offset-xs6>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th colspan="2" align="left">
                        Totales
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(total, idx) in totales[0]" :key="idx" v-if="Object.keys(totales[0]).find(key => totales[0][key] === total) !== '___totales'">
                      <td>{{ Object.keys(totales[0]).find(key => totales[0][key] === total).replace(/_/g, ' ') }}</td>
                      <td>{{ total }}</td>
                    </tr>
                  </tbody>
                </table>
              </v-flex>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
  export default {
    props: ['form', 'field', 'model', 'to'],
    data () {
      return {
        // operacionesCalculo: [{key: 'suma', text: 'Suma'}, {key: 'resta', text: 'Resta'}, {key: 'multiplicacion', text: 'Multiplicación'}, {key: 'division', text: 'División'}],
        // operacionesTotales: [{key: 'suma', text: 'Suma'}, {key: 'promedio', text: 'Promedio'}],
        identificador: null,
        label: null,
        value: null,
        headers: null,
        totales: null,
        testValue: [
          {
            nombres: 'JUAN',
            apellidos: 'PEREZ',
            edad: '40',
            sueldo: '1500',
            antiguedad: '4',
            cargo: 'PROF Y',
            total_ganado: '6000'
          },
          {
            nombres: 'MARIA',
            apellidos: 'RODRIGUEZ',
            edad: '30',
            sueldo: '1000',
            antiguedad: '2',
            cargo: 'PROF X',
            total_ganado: '2000'
          },
          {
            nombres: 'ROBERTO',
            apellidos: 'MARTINEZ',
            edad: '34',
            sueldo: '1200',
            antiguedad: '6',
            cargo: 'PROF Z',
            total_ganado: '7200'
          },
          {
            ___totales: true,
            suma_de_sueldos: 3700,
            promedio_de_edades: 34.6
          }
        ]
      };
    },
    mounted () {
      this.$nextTick(() => {
        this.identificador = this.to.id ? this.to.id : 'Default grid identifier';
        this.label = this.to.label ? this.to.label : 'Default grid label';
        this.value = this.to.value ? this.to.value : this.testValue;
        if (this.value && this.value.length > 0) {
          let forHeaders = this.value[0];
          if (Object.keys(forHeaders)[0] !== '___totales') {
            this.headers = Object.keys(forHeaders);
          }
          this.totales = this.value.reduce((a, b) => {
            if (Object.keys(b)[0] === '___totales') {
              a.push(b);
            }
            return a;
          }, []);
        }
      });
    }
  };
</script>
<style lang="scss">
  .titleModified {
    font-weight: 700;
  }

  .botonAnadir {
    margin-top: -10px;
  }
</style>
