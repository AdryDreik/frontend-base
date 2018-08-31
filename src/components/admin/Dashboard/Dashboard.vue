<template>
    <section>
      <v-card class="pa-5">
        <div v-if="imageIntro" class="personGuide">
          <img :src="`${$storage.get('path')}/static/images/tour${selectImage}.png`" class="imagenTour">
          <div class="mensajeInicial"> 
            <div>
              Hola, {{ diaNoche }} <br/> <strong>{{$storage.getUser().nombres}} {{$storage.getUser().primer_apellido}} {{$storage.getUser().segundo_apellido}} </strong> te ayudare explicandote como funciona esta sección del sistema  
            </div>
            <div> {{messageIntro}} </div>
          </div>
        </div>
        <div class="headline text-md-center pb-4">{{institucion}}</div>
        <div data-step="1" :data-intro="guiaUsuario[1].mensaje">
          <v-layout row wrap>
            <v-flex xs4 v-for="(tram, i) in tramites" :key="i" pa-2 class="contador-container">
              <v-card :color="`${tram.color}`" class="white--text card-1">
                <v-container>
                  <v-layout row wrap>
                    <v-flex xs10>
                      <p class="display-1">{{tram.cantidad}}</p>
                    </v-flex>
                    <v-flex xs2 class="text-md-right">
                      <v-icon x-large color="white">{{tram.icon}}</v-icon>
                    </v-flex>
                  </v-layout>
                  <v-divider dark></v-divider>
                  <div class="subheading">{{tram.label}}</div>
                </v-container>
              </v-card>
            </v-flex>
          </v-layout>
        </div>
        <!-- <div class="headline text-md-center pt-5">Reportes</div>
        <div class="title py-3">Por trámite</div>
        <div data-step="2" :data-intro="guiaUsuario[2].mensaje">
          <v-layout v-if="graficoData" data-step="2" :data-intro="guiaUsuario[2].mensaje">
            <grafico :data="graficoData" :options="graficoOptions"></grafico>
          </v-layout>
        </div> -->
      </v-card>
  </section>
</template>

<script>
  // import FileUpload from '@/common/util/FileUpload.vue';
  import introJs from 'intro.js';
  import guide from './guide.json';
  import 'intro.js/introjs.css';
  import Grafico from '@/common/util/grafico/grafico.vue';
  import { mapState } from 'vuex';
  export default {
    computed: mapState({
      initTour: store => store.tour
    }),
    created () {
      this.guiaUsuario = guide.pasos;
      this.selectImage = Math.floor(Math.random() * Math.floor(8));
    },
    data () {
      return {
        ejemplo: {titulo: 'Nuevo', value: {}},
        tramites: {},
        graficoOptions: null,
        graficoData: null,
        guiaUsuario: null,
        intro: null,
        imageIntro: false,
        messageIntro: null,
        selectImage: null,
        diaNoche: null,
        institucion: null
      };
    },
    watch: {
      initTour (val) {
        if (val) {
          this.tour();
        }
      }
    },
    mounted () {
      this.$service.get(`reportes/`)
      .then(response => {
        if (response && response.tramites) {
          this.tramites = response.tramites;
        }
        if (response && response.graficoData) {
          this.graficoData = response.graficoData;
        }
      });
      let user = this.$store.state.user;
      if (user.institucion) {
        this.institucion = user.institucion.nombre;
      }
    },
    components: {
      // FileUpload,
      Grafico
    },
    methods: {
      /*
       * @function tour
       */
      tour () {
        const _this = this;
        const time = new Date().toLocaleString('en-US', { hour: 'numeric', hour12: true }).includes('AM');
        this.diaNoche = (time) ? ' buenos dias' : ' buenas tardes';
        this.imageIntro = true;
        this.intro = introJs();
        this.intro.setOptions({
          exitOnEsc: true,
          exitOnOverlayClick: true,
          nextLabel: 'Siguiente',
          prevLabel: 'Anterior',
          skipLabel: 'Saltar',
          doneLabel: 'Salir',
          showProgress: true
        });
        this.intro.onbeforechange(function () {
          _this.messageIntro = this._introItems[this._currentStep].intro;
        });
        this.intro.oncomplete(function () {
          _this.imageIntro = false;
        });
        this.intro.onexit(function () {
          _this.imageIntro = false;
        });
        this.intro.start();
      },
      showMessage (type) {
        console.log(type, this.$message);
        this.$message[type](`Mensaje tipo ${type}`);
      },
      showAlert () {
        this.$alert('Mensaje de alerta', function () {
          console.log('callback!!');
        });
      },
      showConfirm () {
        this.$confirm('Mensaje de confirmación', function () {
          console.log('ok!!');
        }, function () {
          console.log('cancel!!');
        });
      }
    }
  };
</script>
<style lang="scss">
  .contador-container {
    min-height: 180px;
    width: 100%;
    .card {
      min-height: 100%;
    }
  }
</style>
