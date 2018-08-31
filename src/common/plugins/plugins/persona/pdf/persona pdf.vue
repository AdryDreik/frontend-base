<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid grid-list-md grid-list-xs>
        <v-layout row wrap class="borderDashed ml-0">
          <v-flex sm6 xs6 lg6>
            <v-subheader color="primary" class="tituloComponentePersona" v-text="label"></v-subheader>
          </v-flex>
        </v-layout>
        <v-layout flat row wrap class="pt-2 borderDashed ml-0" v-for="(object, index) in objects" :key="index" >
           <v-flex xs6 md6 v-for="(prop, index) in object" :key="prop">
              <div v-if="index==='tipoPersona'">
                <span class="labelStyled">{{ persona[index].label }}: </span>
                <span class="labelValue">{{ recuperarTipoDocumento(prop) }} </span>
              </div>
              <div v-else-if="index!=='idRespuesta'">
                <span class="labelStyled">{{ persona[index].label }}: </span>
                <span class="labelValue">{{ prop }} </span>
              </div>
              <br/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
  export default {
    props: [ 'form', 'field', 'model', 'to' ],
    data () {
      return {
        label: null,
        objects: [],
        tiposDocumento: [
          { id: 1, tipoDocumento: 'Carnet de identidad C.I.', interoperabilidad: true },
          { id: 2, tipoDocumento: 'Carnet de extranjeria', interoperabilidad: true },
          { id: 3, tipoDocumento: 'Pasaporte', interoperabilidad: false }
        ],
        persona: {
          tipoPersona: {
            name: 'tipoPersona',
            label: 'Tipo de documento'
          },
          numeroDocumento: {
            name: 'numeroDocumento',
            label: 'Documento de identidad'
          },
          fechaNacimiento: {
            name: 'fechaNacimiento',
            label: 'Fecha de nacimiento'
          },
          nombres: {
            name: 'nombres',
            label: 'Nombres'
          },
          primerApellido: {
            name: 'primerApellido',
            label: 'Primer Apellido'
          },
          segundoApellido: {
            name: 'segundoApellido',
            label: 'Segundo Apellido'
          },
          ocupacion: {
            name: 'ocupacion',
            label: 'Ocupación'
          },
          direccion: {
            name: 'direccion',
            label: 'Dirección'
          },
          estadoCivil: {
            name: 'estadoCivil',
            label: 'Estado Civil'
          },
          sexo: {
            name: 'sexo',
            label: 'Sexo'
          },
          idRespuesta: {
            name: 'idRespuesta',
            label: ''
          }
        }
      };
    },
    methods: {
      recuperarTipoDocumento (id) {
        const tipoDocumnto = this.tiposDocumento.filter(tipo => tipo.id === id);
        if (tipoDocumnto.length > 0) {
          return tipoDocumnto[0].tipoDocumento;
        } else {
          return 'Sin tipo.';
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        console.log('-------------------------------------------------------------------------');
        console.log(this.to.value);
        console.log('-------------------------------------------------------------------------');
        this.label = this.to.label ? this.to.label : 'Persona';
        this.objects = this.to.value ? this.to.value : [];
      });
    }
  };
</script>

<style lang="scss">
.tituloComponentePersona {
  margin-left: -21px;
  color: #006fba !important;
  font-weight: 700;
}
.borderDashed {
  border-bottom: 1px dashed #006fba;
}
.tabla {
  font-size: 13px;
  td {
    padding: 0.2rem;
    border-bottom: 1px solid rgba($color: #000, $alpha: .2);
  }
}
.ediciones {
  cursor: pointer;
}
.labelStyled {
  color: grey;
  margin-bottom: -25px;
}
.labelValue {
  color: black;
  margin-bottom: -25px;
  font-weight: bold;
}
</style>
