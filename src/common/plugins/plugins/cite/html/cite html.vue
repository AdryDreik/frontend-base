<template>
  <v-card flat>
    <v-card-text>
      <v-container fluid class="containerCITE">
        <v-layout row wrap>
          <v-flex xs12 md12 class="pt-2">
            <v-card flat>
              <v-select
                prepend-icon="people_outline"
                :name="`lista_desplegable-${this._uid}`"
                :items="usuarios"
                v-model="para"
                label="Para:"
                item-text="nombreCompleto"
                :rules="[() => para && para.length > 0 || 'El campo no pueder estar vacio']"
                :disabled="disabled"
                autocomplete
                multiple
                :value="para"
                :required="required"
                no-data-text="No hay datos para mostrar"
              >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    :key="JSON.stringify(data.item)"
                    close
                    class="chip--select-multi white--text"
                    color="primary"
                    @input="data.parent.selectItem(data.item)"
                  >
                    {{ data.item.nombreCompleto }}
                    <span>&nbsp;- {{ data.item.cargo }}</span>
                  </v-chip>
                </template>
                <template slot="item" slot-scope="data">
                  <template v-if="typeof data.item !== 'object'">
                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                  </template>
                  <template v-else>
                    <v-list-tile-content>
                      <v-list-tile-title v-html="`${data.item.nombreCompleto}`"></v-list-tile-title>
                      <v-list-tile-sub-title v-html="data.item.cargo"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </template>
                </template>
              </v-select>
              </v-card>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12 v-if="checkVia">
              <v-card flat>
                <v-select
                  prepend-icon="account_circle"
                  :name="`lista_desplegable-${this._uid}`"
                  :items="usuarios"
                  v-model="via"
                  label="Via:" 
                  item-text="nombreCompleto"
                  multiple
                  :disabled="disabled"
                  autocomplete
                  chips
                  :required="required"
                  no-data-text="No hay datos para mostrar"
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :selected="data.selected"
                      :key="JSON.stringify(data.item)"
                      close
                      class="chip--select-multi white--text"
                      color="primary"
                      @input="data.parent.selectItem(data.item)"
                    >
                      {{ data.item.nombreCompleto }}
                      <span>&nbsp;- {{ data.item.cargo }}</span>
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="`${data.item.nombreCompleto}`"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="data.item.cargo"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
                </v-card>
            </v-flex>
            <v-flex xs12 sm12 md12 lg12>
              <v-select
                prepend-icon="face"
                :name="`lista_desplegable-${this._uid}`"
                :items="usuarios"
                v-model="de"
                item-text="nombreCompleto"
                item-value="idUser"
                label="De:"
                multiple
                :rules="[() => de && de.length > 0 || 'El campo no pueder estar vacio']"
                :disabled="disabled"
                :required="required"
                chips
                autocomplete
                no-data-text="No hay datos para mostrar"
              >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :selected="data.selected"
                      :key="JSON.stringify(data.item)"
                      close
                      class="chip--select-multi white--text"
                      color="primary"
                      @input="data.parent.selectItem(data.item)"
                    >
                      {{ data.item.nombreCompleto }}
                      <span>&nbsp;- {{ data.item.cargo }}</span>
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="`${data.item.nombreCompleto}`"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="data.item.cargo"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </template>
                  </template>
              </v-select>
            </v-flex>
              <v-flex xs12 md12 lg12 sm12 v-if="checkRef">
                <v-text-field
                  :name="`input_html-${this._uid}`"
                  label="Ref:"
                  v-model="ref"
                  :rules="customRules"
                  :disabled="disabled"
                ></v-text-field>
              </v-flex>
      </v-layout>
      </v-container>
    </v-card-text>
    <v-dialog v-model="dialog" persistent max-width="500" v-if="settings">
      <v-btn icon slot="activator" large class="botonApps">
        <v-icon color="primary darken-1">settings</v-icon>
      </v-btn>
      <v-card>
        <v-card-title class="bloqueTituloCabecera">
          <span class="headline">Datos Generales</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex sm6 xs6 md6>
                <v-checkbox color="primary" :label="(checkVia) ? 'Ocultar via' : 'Mostrar via'" v-model="checkVia"></v-checkbox>
              </v-flex>
              <v-flex sm6 xs6 md6>
                <v-checkbox color="primary" :label="(checkRef) ? 'Ocultar referencia' : 'Mostrar referencia'" v-model="checkRef"></v-checkbox>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click.native="dialog = false">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import axios from 'axios';
import validate from '../../validate.js';
import usuarios from './usuarios.json';
export default {
  props: [ 'form', 'field', 'model', 'to', 'all' ],
  mixins: [validate],
  data () {
    return {
      para: null,
      via: null,
      de: null,
      dialog: null,
      local: true,
      settings: null,
      usuarios: [],
      ref: null,
      checkVia: null,
      checkRef: null,
      disabled: null,
      required: false
    };
  },
  created () {
    if (!this.local) {
      const token = 'eyJ0eXAiOiJKV1QiLC....';
      const instance = axios.create({
        baseURL: 'https://intranet.agetic.gob.bo/plantillas/ws/api/v1/',
        headers: {'Authorization': `Bearer ${token}`},
        withCredentials: false,
        responseType: 'json'
      });
      instance.get('seguridad/usuario_rol/')
        .then((res) => {
          if (res) {
            res.data.datos.reduce((a, b) => {
              const user = {};
              user.nombreCompleto = `${b.nombres} ${b.apellidos}`;
              user.cargo = b.cargo;
              user.id = b.id_usuario;
              a.push(user);
              return a;
            }, this.usuarios);
          }
        })
        .catch(err => this.$message.error(err.message));
    } else {
      usuarios.reduce((a, b) => {
        const user = {};
        user.nombreCompleto = `${b.nombres} ${b.apellidos}`;
        user.cargo = b.cargo;
        user.id = b.id_usuario;
        a.push(user);
        return a;
      }, this.usuarios);
    }
  },
  watch: {
    disabled (disabled) {
      this.to.disabled = disabled;
    },
    de (de) {
      if (!(this.to.value && this.to.value.de)) {
        this.to.value = (this.to.value) ? this.to.value : {};
        this.to.value.de = (this.to.value.de) ? this.to.value.de : [];
        this.to.value.para = (this.to.value.para) ? this.to.value.para : [];
        this.to.value.via = (this.to.value.via) ? this.to.value.via : [];
      }
      this.to.value.de = de;
    },
    para (para) {
      if (!(this.to.value && this.to.value.para)) {
        this.to.value = (this.to.value) ? this.to.value : {};
        this.to.value.de = (this.to.value.de) ? this.to.value.de : [];
        this.to.value.para = (this.to.value.para) ? this.to.value.para : [];
        this.to.value.via = (this.to.value.via) ? this.to.value.via : [];
      }
      this.to.value.para = para;
    },
    via (via) {
      if (!(this.to.value && this.to.value.via)) {
        this.to.value = (this.to.value) ? this.to.value : {};
        this.to.value.de = (this.to.value.de) ? this.to.value.de : [];
        this.to.value.para = (this.to.value.para) ? this.to.value.para : [];
        this.to.value.via = (this.to.value.via) ? this.to.value.via : [];
      }
      this.to.value.via = via;
    },
    ref (ref) {
      this.to.value.ref = ref;
    },
    checkVia (checkVia) {
      this.to.via = checkVia;
    },
    checkRef (checkRef) {
      this.to.ref = checkRef;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.settings = this.to.settings;
      this.checkVia = (this.to.checkVia) ? this.to.checkVia : true;
      this.checkRef = (this.to.checkRef) ? this.to.checkRef : true;
      this.field.name = (this.field && this.field.name.includes('-')) ? this.field.name : `${this.field.type}-${this._uid}`;
      // Adicionando la opcion de que cuando sea comodin, este sea solo vista aunque tenga todos los permisos
      this.disabled = this.to.disabled;
      if (this.field.comodin) {
        this.disabled = this.to.disabled || !!this.field.comodin;
      }
      this.para = (this.to.value) ? this.to.value.para : [];
      this.de = (this.to.value) ? this.to.value.de : [];
      this.via = (this.to.value) ? this.to.value.via : [];
      this.ref = (this.to.value) ? this.to.value.ref : null;
      this.to.id = `componente_cite-${this._uid}`;
      this.to.validations = [];
      // this.$service.get(`validaciones/${this.field.name}-all`)
      // .then((res) => {
      //   if (res) {
      //     res.listado.forEach((item) => {
      //       this.to.validations = [];
      //       this.to.validations.push({
      //         titulo: item.titulo,
      //         id: item._id
      //       });
      //     });
      //   }
      // })
      // .catch((err) => this.$message.error(err.message));
    });
  }
};
</script>
<style lang="scss">
.containerCITE {
  .chip__content {
    font-weight: 700;
    span {
      font-weight: 100;
    }
  }
}
</style>

