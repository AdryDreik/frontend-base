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
          <v-flex sm6 xs6 lg6>
             <div>
                <span class="labelStyled">{{persona.tipoComponentePersona.label}}: </span>
                <span class="labelValue">{{ recuperartipoComponentePersona(object.tipoComponentePersona) }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6>
              <div>
                <span class="labelStyled">{{persona.tipoPersona.label}}: </span>
                <span class="labelValue">{{ recuperarTipoDocumento(object.tipoPersona) }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6>
              <div>
                <span class="labelStyled">{{persona.numeroDocumento.label}}: </span>
                <span class="labelValue">{{ object.numeroDocumento}} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.tipoComponentePersona === 2">
              <div>
                <span class="labelStyled">{{persona.razonSocial.label}}: </span>
                <span class="labelValue">{{ object.razonSocial }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.tipoComponentePersona === 1">
              <div>
                <span class="labelStyled">{{persona.fechaNacimiento.label}}: </span>
                <span class="labelValue">{{ object.fechaNacimiento }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.tipoComponentePersona === 1">
              <div>
                <span class="labelStyled">{{persona.nombres.label}}: </span>
                <span class="labelValue">{{ object.nombres }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.tipoComponentePersona === 1">
              <div>
                <span class="labelStyled">{{persona.primerApellido.label}}: </span>
                <span class="labelValue">{{ object.primerApellido }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.tipoComponentePersona === 1">
              <div>
                <span class="labelStyled">{{persona.segundoApellido.label}}: </span>
                <span class="labelValue">{{ object.segundoApellido }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.tipoComponentePersona === 1">
              <div>
                <span class="labelStyled">{{persona.ocupacion.label}}: </span>
                <span class="labelValue">{{ object.ocupacion }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 >
              <div>
                <span class="labelStyled">{{persona.direccion.label}}: </span>
                <span class="labelValue">{{ object.direccion }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.tipoComponentePersona === 1">
              <div>
                <span class="labelStyled">{{persona.estadoCivil.label}}: </span>
                <span class="labelValue">{{ object.estadoCivil }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.tipoComponentePersona === 1">
              <div>
                <span class="labelStyled">{{persona.sexo.label}}: </span>
                <span class="labelValue">{{ object.sexo }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6>
              <div>
                <span class="labelStyled">{{persona.paisOrigen.label}}: </span>
                <span class="labelValue">{{ object.paisOrigen }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.tipoComponentePersona === 1">
              <div>
                <span class="labelStyled">{{persona.nacionalidad.label}}: </span>
                <span class="labelValue">{{ object.nacionalidad }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.tipoAporte">
              <div>
                <span class="labelStyled">{{persona.tipoAporte.label}}: </span>
                <span class="labelValue">{{ recuperarTipoAporte(object.tipoAporte) }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.aporteCapital">
              <div>
                <span class="labelStyled">{{persona.aporteCapital.label}}: </span>
                <span class="labelValue">{{ object.aporteCapital }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.numeroCuotas">
              <div>
                <span class="labelStyled">{{persona.numeroCuotas.label}}: </span>
                <span class="labelValue">{{ object.numeroCuotas }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.participacionPorcentual">
              <div>
                <span class="labelStyled">{{persona.participacionPorcentual.label}}: </span>
                <span class="labelValue">{{ object.participacionPorcentual }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.capitalSuscrito">
              <div>
                <span class="labelStyled">{{persona.capitalSuscrito.label}}: </span>
                <span class="labelValue">{{ object.capitalSuscrito }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.numeroAcciones">
              <div>
                <span class="labelStyled">{{persona.numeroAcciones.label}}: </span>
                <span class="labelValue">{{ object.numeroAcciones }} </span>
              </div>
          </v-flex>
          <v-flex sm6 xs6 lg6 v-if="object.capitalPagado">
              <div>
                <span class="labelStyled">{{persona.capitalPagado.label}}: </span>
                <span class="labelValue">{{ object.capitalPagado }} </span>
              </div>
          </v-flex>
              <br/>
        </v-layout>
        <v-layout  row wrap v-if="totalCapital>0 && totalCapitalPagado>0 &&totalCuotas > 0 && totalCapitalSuscrito > 0">
            <v-flex xs6 md6 class="pa-0 pr-2">
               <div>
                <span class="labelStyled">Total Capital (Bs.): </span>
                <span class="labelValue">{{ totalCapital }} </span>
              </div>
            </v-flex>
            <v-flex xs6 md6 class="pa-0 pr-2">
              <div>
                <span class="labelStyled">Total Cuotas: </span>
                <span class="labelValue">{{ totalCuotas }} </span>
              </div>
            </v-flex>
            <v-flex xs6 md6 class="pa-0 pr-2">
              <div>
                <span class="labelStyled">Total Participación: </span>
                <span class="labelValue">{{ totalParticipacion }} </span>
              </div>
            </v-flex>
            <v-flex xs6 md6 class="pa-0 pr-2">
              <div>
                <span class="labelStyled">Total Número de Acciones: </span>
                <span class="labelValue">{{ totalNumeroAcciones }} </span>
              </div>
            </v-flex>
            <v-flex xs6 md6 class="pa-0 pr-2">
              <div>
                <span class="labelStyled">Total Capital Suscrito (Bs.): </span>
                <span class="labelValue">{{ totalCapitalSuscrito }} </span>
              </div>
          </v-flex>
            <v-flex xs6 md6 class="pa-0 pr-2">
              <div>
                <span class="labelStyled">Total Capital Pagado (Bs.): </span>
                <span class="labelValue">{{ totalCapitalPagado }} </span>
              </div>
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
        totalCapital: 0,
        totalCapitalPagado: 0,
        totalCuotas: 0,
        totalNumeroAcciones: 0,
        totalParticipacion: 0,
        totalCapitalSuscrito: 0,
        objects: [],
        listaTipoComponentePersona: [
          { id: 1, descripcion: 'Persona Natural' },
          { id: 2, descripcion: 'Persona Jurídica' }
        ],
        tiposDocumento: [
          { id: 1, tipoDocumento: 'Carnet de identidad C.I.', interoperabilidad: true, natural: true, juridica: false },
          { id: 2, tipoDocumento: 'Carnet de extranjeria', interoperabilidad: true, natural: true, juridica: false },
          { id: 3, tipoDocumento: 'Pasaporte', interoperabilidad: false, natural: true, juridica: false },
          { id: 4, tipoDocumento: 'Número de Identificación Tributaria NIT', interoperabilidad: false, natural: false, juridica: true },
          { id: 5, tipoDocumento: 'Número de Identificación Tributaria NIT Extranjera', interoperabilidad: false, natural: false, juridica: true }
        ],
        tiposAporte: [
          {id: 1, aporte: 'Dinero'},
          {id: 2, aporte: 'Cosas de género o de cuerpo cierto'},
          {id: 3, aporte: 'Usufructos'},
          {id: 4, aporte: 'Aportes de crédito'},
          {id: 5, aporte: 'Aportes de contratos'}
        ],
        persona: {
          tipoComponentePersona: {
            name: 'tipoComponentePersona',
            label: 'Tipo de persona'
          },
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
          },
          paisOrigen: {
            name: 'pasiOrigen',
            label: 'País de Origen'
          },
          nacionalidad: {
            name: 'nacionalidad',
            label: 'Nacionalidad'
          },
          razonSocial: {
            name: 'razonSocial',
            label: 'Razón Social'
          },
          tipoAporte: {
            name: 'tipoAporte',
            label: 'Tipo Aporte'
          },
          aporteCapital: {
            name: 'aporteCapital',
            label: 'Aporte Capital (Bs.)'
          },
          numeroCuotas: {
            name: 'numeroCuotas',
            label: 'Número de Cuotas'
          },
          participacionPorcentual: {
            name: 'participacionPorcentual',
            label: 'Participación Porcentual'
          },
          capitalSuscrito: {
            name: 'capitalSuscrito',
            label: 'Capital Suscrito (Bs.)'
          },
          numeroAcciones: {
            name: 'numeroAcciones',
            label: 'Número de Acciones'
          },
          capitalPagado: {
            name: 'capitalPagado',
            label: 'Capital Pagado (Bs.)'
          }
        }
      };
    },
    methods: {
      actualizarTotales () {
        this.totalCapital = 0;
        this.totalCapitalPagado = 0;
        this.totalCuotas = 0;
        this.totalNumeroAcciones = 0;
        this.totalParticipacion = 0;
        this.totalCapitalSuscrito = 0;
        this.objects.forEach(object => {
          this.totalCapital += (object.aporteCapital && parseFloat(object.aporteCapital)) || 0;
          this.totalCapitalPagado += (object.capitalPagado && parseFloat(object.capitalPagado)) || 0;
          this.totalCuotas += (object.numeroCuotas && parseFloat(object.numeroCuotas)) || 0;
          this.totalNumeroAcciones += (object.numeroAcciones && parseFloat(object.numeroAcciones)) || 0;
          this.totalParticipacion += (object.participacionPorcentual && parseFloat(object.participacionPorcentual)) || 0;
          this.totalCapitalSuscrito += (object.capitalSuscrito && parseFloat(object.capitalSuscrito)) || 0;
        });
      },
      recuperarTipoDocumento (id) {
        const tipoDocumnto = this.tiposDocumento.filter(tipo => tipo.id === id);
        if (tipoDocumnto.length > 0) {
          return tipoDocumnto[0].tipoDocumento;
        } else {
          return 'Sin tipo.';
        }
      },
      recuperartipoComponentePersona (id) {
        const tipo = this.listaTipoComponentePersona.filter(tipo => tipo.id === id);
        if (tipo.length > 0) {
          return tipo[0].descripcion;
        } else {
          return 'Sin tipo.';
        }
      },
      recuperarTipoAporte (id) {
        const tipo = this.tiposAporte.filter(tipo => tipo.id === id);
        if (tipo.length > 0) {
          return tipo[0].aporte;
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
        this.label = this.to.label ? this.to.label : 'Societario';
        this.objects = this.to.value ? this.to.value : [];
        this.actualizarTotales();
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
