<template>
    <section class="visualizador">
      <v-form v-model="valid" ref="form" lazy-validation>
        <grid-layout
          :layout="layout"
          :col-num="12"
          :row-height="50"
          :is-draggable="false"
          :is-resizable="false"
          :vertical-compact="true"
          :margin="[10, 10]"
          :use-css-transforms="true"
        >
          <grid-item v-for="(item, ind) in this.posicion" :key="ind"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
          >
          <formly-form :form="form" :model="model" :fields="[datos[parseInt(item.i)]]"></formly-form>
          </grid-item>
          <div class="text-xs-center text-md-center text-lg-center">
            <v-btn
            class="enviarFormulario"
            @click="enviarFormulario"
            color="primary" 
            >SUBMIT</v-btn>
          </div>
        </grid-layout>
      </v-form>
    </section>
</template>
<script>
import {GridLayout, GridItem} from 'vue-grid-layout';
export default {
  created () {
    if (this.$route && this.$route.query && this.$route.query.idDocument) {
      this.$service.get(`documentos_plantilla/${this.$route.query.idDocument}`)
        .then((res) => {
          if (res) {
            this.datos = res.componentes.reduce((ant, next) => {
              const objTmp = next;
              objTmp.templateOptions.settings = false;
              ant.push(objTmp);
              return ant;
            }, []);
            this.posicion = res.posicion;
            let height = 0;
            let sumaDoce = 0;
            for (let index = 0; index < this.posicion.length; index++) {
              sumaDoce = parseInt(this.posicion[index].w) + sumaDoce;
              if (sumaDoce === 12) {
                height = height + (this.posicion[index].h * 56);
                sumaDoce = 0;
              }
            }
            // const lay = document.getElementsByClassName('vue-grid-layout');
            // lay[0].removeAttribute('style');
            // lay[0].setAttribute('style', `height: ${height + 50}px !important`);
          }
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    }
  },
  data () {
    return {
      valid: null,
      datos: null,
      form: {},
      layout: [],
      model: {
        input: '',
        datepicker: '',
        radio: '',
        title: '',
        textarea: '',
        button: '',
        check: '',
        dropdown: '',
        segip: ''
      },
      posicion: []
    };
  },
  methods: {
    async documentoPlantilla () {
      const docPlt = {
        componentes: this.datos.reduce((ant, next) => {
          const objTmp = next;
          objTmp.templateOptions.settings = true;
          objTmp.validacion = {
            [next.name]: next.templateOptions.validations
          };
          objTmp.contenido = {};
          ant.push(objTmp);
          return ant;
        }, []),
        validacion: this.datos.reduce((ant, next) => {
          ant.push({
            [next.name]: next.templateOptions.validations
          });
          return ant;
        }, []),
        posicion: this.layout,
        valores: this.datos.reduce((ant, act) => {
          ant.push({
            [act.name]: act.templateOptions.value
          });
          return ant;
        }, [])
      };
      return docPlt;
    },
    async enviarFormulario () {
      if (this.$refs.form.validate()) {
        this.valid = true;
        await this.documentoPlantilla()
          .then((res) => {
            console.log('----------ress final--------------------------');
            console.log(JSON.stringify(res));
            console.log('------------------------------------');
          });
        // this.$service.put(`documentos_plantilla/${this.id}`, this.documentoPlantilla())
        // .then((res) => {
        //   this.$message.success('Formulario exitosamente guardado');
        //   this.$emit('enviarFormulario', 2);
        // })
        // .catch((err) => this.$message.error(err.message));
      } else {
        this.valid = false;
      }
    }
  },
  components: {
    GridLayout,
    GridItem
  }
};
</script>
<style lang="scss">
  .visualizador {
    padding-bottom: 50px;
    fieldset {
      border: none;
    }
    .enviarFormulario {
      position: fixed;
      bottom: 0;
    }
    .vue-grid-layout {
      .vue-grid-item:not(.vue-grid-placeholder) {
        border: none !important;
      }
    }
  }
</style>

