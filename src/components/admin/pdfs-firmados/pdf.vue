<template>
  <section>
    <v-layout row wrap align-content-start>
      <!-- ESTE SERA LA SECCION PARA EL BUSCADOR DE CODIGOS DE DOCUMENTO -->
      <v-flex xs12 sm12 md4 lg4 class="text-md-left text-lg-left">
        <v-layout row wrap>
          <v-flex xs12 sm12 md8 lg8>
            <v-text-field
              color="primary"
              label="Ingrese código del documento"
              placeholder="YY-ABCDEFGHIGKJF-2018"
              v-model="codigoDocumento"
              @keyup.enter="verPdf"
              @click.native="resetField"
              required
              hint="Presione la tecla enter para realizar su búsqueda o puede presionar el boton buscar"
              persistent-hint
              :rules="[(val) => !!val || 'Tiene que ingresar un codigo de documento']"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4>
            <v-btn @click.prevent="verPdf" :disabled="!codigoDocumento" color="primary" class="mt-4">
              <v-icon>search</v-icon>
              BUSCAR
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm12 md8 lg8></v-flex>
      <!-- ESTA SERA LA SECCION DONDE SE MUESTRA EL PDF FIRMADO Y QUIENES LO FIRMARON -->
      <template v-if="showSection">
        <v-flex xs12 sm12 md9 lg9 class="text-md-center text-lg-center">
          <div v-if="show">
            <iframe id="pdf-signed" :src="`data:application/pdf;base64,${this.pdfBase64}`" type="application/pdf"></iframe>
          </div>
          <div v-else>
            <v-card>
              <v-flex xs12 sm12 md12 lg12>
                <v-alert type="error" :value="true">
                  {{ errorMessage }}
                </v-alert>
              </v-flex>
            </v-card>
          </div>
        </v-flex>
        <v-flex xs12 sm12 md3 lg3 class="text-md-left text-lg-left">
          <v-list subheader>
            <v-subheader>Firmantes del documento</v-subheader>
            <v-list-tile
              v-for="item in firmantes"
              :key="item.nombreComunSubject"
              avatar
              @click="showInfoUser(item)"
            >
              <v-list-tile-avatar>
                <img :src="item.avatar">
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title v-html="item.nombreComunSubject"></v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon :color="item.vigencia ? 'teal' : 'error'">fingerprint</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-flex>
      </template>
      <template v-else>
        <v-flex xs12 sm12 md12 lg12>
          <v-alert
            :value="true"
            type="info"
          >
            No hay documentos que mostrar
          </v-alert>
        </v-flex>
      </template>
    </v-layout>
    <v-dialog origin="center" v-model="dialog" persistent max-width="600px" class="dialogCustom">
      <v-card>
        <v-card-title>
          <span class="fontSize14 primary--text"><strong>Información de la firma digital:</strong></span>
        </v-card-title>
        <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12 lg12>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md5 lg5 class="fontSize14">
                    <v-icon color="success">account_balance</v-icon> <strong>Entidad Certificadora</strong>
                  </v-flex>
                  <v-flex xs12 sm12 md7 lg7 class="fontSize14">
                    {{selectUser.nombreComunIssuer}}
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md5 lg5 class="fontSize14">
                    <v-icon color="success">account_circle</v-icon> <strong>Documento de identidad del propietario</strong>
                  </v-flex>
                  <v-flex xs12 sm12 md7 lg7 class="fontSize14">
                     {{selectUser.nombreComunSubjectIdentificador}} {{(selectUser.nombreComunSubjectIdentificadorComplemento !== 'null' || selectUser.nombreComunSubjectIdentificadorComplemento !== null) ? selectUser.nombreComunSubjectIdentificadorComplemento: ''}}
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md5 lg5 class="fontSize14">
                    <v-icon color="success">today</v-icon> <strong>Fecha de la firma del documento</strong>
                  </v-flex>
                  <v-flex xs12 sm12 md7 lg7 class="fontSize14">
                    {{selectUser.fechaFirma}}
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md5 lg5 class="fontSize14">
                    <v-icon color="success">today</v-icon> <strong>Fecha fin de validez</strong>
                  </v-flex>
                  <v-flex xs12 sm12 md7 lg7 class="fontSize14">
                    {{selectUser.finValidez}}
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="default" @click.native="dialog = false">CERRAR</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
export default {
  // props: ['url'],
  data () {
    return {
      show: true,
      errorMessage: 'Sucedió un error al cargar el PDF',
      pdfBase64: null,
      codigoDocumento: null,
      firmantes: null,
      showSection: false,
      dialog: false,
      selectUser: {}
    };
  },
  methods: {
    showInfoUser (info) {
      this.dialog = true;
      this.selectUser = info;
    },
    resetField () {
      this.codigoDocumento = null;
    },
    async verPdf () {
      try {
        if (this.codigoDocumento) {
          // http://localhost:3000/api/v1/documentos/DC-S61QNDR490-2018
          this.$waiting(true, 'Renderizando documento firmado');
          const documento = await this.$service.get(`documentos/${this.codigoDocumento}`);
          if (documento && documento.firmas && documento.documento) {
            this.show = true;
            this.showSection = true;
            this.pdfBase64 = documento.documento;
            this.firmantes = documento.firmas.map((item) => {
              item.avatar = `${this.$storage.get('path')}/static/images/userSigned.png`;
              return item;
            });
            setTimeout(() => {
              this.$waiting(false);
            }, 100);
          } else {
            this.showSection = false;
            this.$waiting(false);
          }
        }
      } catch (err) {
        this.showSection = false;
        this.$waiting(false);
        this.$message.error(err.message);
      }
    }
  }
};
</script>
<style scoped lang="scss">
  .pdfobject-container {
    width: 100%;
    margin: 1em 0;
    height: calc(90vh - 200px);
  }
  .pdfobject {
    border: 1px solid #666;
  }

  #pdf-signed {
    width: 100%;
    height: 70vh;
  }
  .customized {
    background: red;
  }
  .fontSize14 {
    font-size: 14px !important;
  }
</style>
