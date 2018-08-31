<template>
  <v-card flat style="background: transparent">
    <v-card-text>
      <v-container fluid class="borde">
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-card flat style="background: transparent">
              <v-layout row>
                <v-flex xs1 sm1 md1 class="cursor pr-5">PARA:</v-flex>
                <v-flex xs11 sm11 md11>
                  <div v-if="para.length === 0">
                      <span class="red--text">No seleccionó ningún destinatario'</span>
                  </div>
                  <div v-else>
                    <ul class="listaUsuarios">
                      <li v-for="(usuarioPara, index) in para" :key="index">
                        <div class="usuarioPara">
                          <span>{{usuarioPara.nombreCompleto}}</span>
                          <span>{{usuarioPara.cargo}}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </v-flex>
              </v-layout>
              <v-layout row v-if="checkVia">
                <v-flex xs1 sm1 md1 class="cursor">VIA:</v-flex>
                <v-flex xs11 sm11 md11>
                  <div v-if="via.length === 0">
                    <span class="red--text">No se seleccionó ninguna opción en VIA:</span>
                  </div>
                  <div v-else>
                    <ul class="listaUsuarios">
                      <li v-for="(usuarioVia, index) in via" :key="index">
                        <div class="usuarioVia">
                          <span>{{usuarioVia.nombreCompleto}}</span>
                          <span>{{usuarioVia.cargo}}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs1 sm1 md1 class="cursor">DE:</v-flex>
                <v-flex xs11 sm11 md11>
                  <div v-if="de.length === 0">
                    <span class="red--text">No seleccionó ninguna opción en DE:</span>
                  </div>
                  <div v-else>
                    <ul class="listaUsuarios">
                      <li v-for="(usuarioDe, index) in de" :key="index">
                        <div class="usuarioDe">
                          <span>{{usuarioDe.nombreCompleto}}</span>
                          <span>{{usuarioDe.cargo}}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </v-flex>
              </v-layout>
              <v-layout row v-if="checkRef">
                <v-flex xs1 md1 lg1 sm1>REF:</v-flex>
                <v-flex xs11 md11 lg11 sm11>
                  {{ ref }}
                </v-flex>
              </v-layout>
            </v-card>
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
      para: [],
      via: [],
      de: [],
      ref: null,
      checkVia: null,
      checkRef: null
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.de = (this.to.value && this.to.value.de) ? this.to.value.de : [{'nombre': 'Default de', 'cargo': 'De'}];
      this.via = (this.to.value && this.to.value.via) ? this.to.value.via : [{'nombre': 'Default via', 'cargo': 'Via'}];
      this.para = (this.to.value && this.to.value.para) ? this.to.value.para : {'nombre': 'Default para', 'cargo': 'Para'};
      this.ref = (this.to.value && this.to.value.ref) ? this.to.value.ref : 'Default ref value';
      this.checkVia = this.to.checkVia ? this.to.checkVia : true;
      this.checkRef = this.to.checkRef ? this.to.checkRef : true;
    });
  }
};
</script>
<style lang="scss">
  .subir {
    margin-top: -22px; 
  }
  .ocultar {
    z-index: -1;
    margin-top: -50px;
  }
  .listaUsuarios {
    list-style: none;
  }
  .usuarioPara {
    button {
      margin-top: -10px;
    }
    margin-top: -11px;
    span {
      text-transform: normal;
      ~ span {
        text-transform: none;
        display: flex;
      }
    }
  }
  .usuarioVia {
    span {
      text-transform: normal;
      ~ span {
        text-transform: none;
        display: flex;
      }
    }
  }
  .usuarioDe {
    span {
      text-transform: normal;
      ~ span {
        text-transform: none;
        display: flex;
      }
    }
  }
  .cursor {
    cursor: pointer;
  }
  .ref {
    margin-top: -30px;
  }
</style>

