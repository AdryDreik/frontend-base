<template>
  <v-layout row wrap class="and-or-template">
    <v-flex xs5 sm5 lg5>
      <v-switch
      color= "primary"
      :label="`${(opcion) ? 'Y' : 'O'}`"
      v-model="opcion"
      ></v-switch>
    </v-flex>
    <v-flex sm7 md7 lg7 class="text-md-right">
      <v-tooltip bottom class="pr-1">
        <v-btn color="primary" icon slot="activator" @click.prevent="addRule">
          <v-icon>add_circle</v-icon>
        </v-btn>
        <span>Agregar una nueva condicion</span>
      </v-tooltip>
    </v-flex>
      <rule
        v-for="(rule, index) in rules" :documentos="documentos" ref="rules" :regla="rule" :paso="paso" :key="index" @delete-rule="deleteRule(index)">
      </rule>
  </v-layout>
</template>

<script>
  import Rule from './Rule';
  export default {
    name: 'decision',
    props: ['paso', 'documentos', 'prevConfig'],
    components: {
      Rule
    },
    watch: {
      documentos () {
        this.setRules();
      }
    },
    data () {
      return {
        opcion: true,
        rules: []
      };
    },
    methods: {
      addRule () {
        this.rules.push({
          id: this.paso
        });
      },
      setRules () {
        this.rules = [];
        if (Array.isArray(this.prevConfig) && this.prevConfig) {
          for (var i = 0; i < this.prevConfig.length; i++) {
            const dec = this.prevConfig[i];
            /*
            if (dec.decision && dec.decision.length > 0) {
              if (dec.decision[0].idPaso === this.paso.idOriginal) {
                this.opcion = dec.decision[0].opcion === 'O' ? false : true;
                const reglas = dec.decision[0].rules;
                if (Array.isArray(reglas) && reglas.length > 0) {
                  reglas.forEach((regla) => {
                    this.rules.push(regla);
                  });
                }
              }
            }
            */
            if (dec.paso === this.paso.idOriginal) {
              this.opcion = dec.opcion === 'O' ? false : true;
              const reglas = dec.rules;
              if (Array.isArray(reglas) && reglas.length > 0) {
                reglas.forEach((regla) => {
                  this.rules.push(regla);
                });
              }
            }
          }
        }
        if (this.rules.length === 0) {
          this.addRule();
        }
      },
      deleteSelf () {
        this.$emit('delete-group');
      },

      deleteRule (index) {
        this.rules.splice(index, 1);
      },

      queryFormStatus () {
        const query = {};
        const rules = this.$refs.rules || {};
        query.decision = [];
        const tmp = [];
        rules.forEach((item) => tmp.push(item.queryFormStatus()));
        if (Array.isArray(tmp) && tmp.length > 0) {
          query.decision.push({
            paso: this.paso.idOriginal,
            opcion: this.opcion ? 'Y' : 'O',
            rules: tmp
          });
        }
        return query;
      },
      generateId () {
        return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = (c === 'x') ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    }
  };
</script>

<style>
  .and-or-template {
    padding: 8px;
    position: relative;
    border-radius: 3px;
    border: 1px solid #6d77b8;
    border-top: 3px solid #d2d6de;
    margin-bottom: 20px;
    /* width: 100%; */
    box-shadow: 0 1px 1px rgba(0,0,0,0.1);
    border-top-color: #6d77b8;
    background-color: rgba(255, 255, 255, 0.9);
  }

  .and-or-template:before,
  .and-or-template:after {
    content: '';
    position: absolute;
    left: -17px;
    width: 16px;
    height: calc(50% + 18px);
    border-color: #c0c5e2;
    border-style: solid;
  }

  .and-or-template:before {
    top: -18px;
    border-width: 0 0 2px 2px;
  }

  .and-or-template:after {
    top: 50%;
    border-width: 0 0 0 2px;
  }

  .and-or-first:before,
  .and-or-first:after,
  .and-or-template:last-child:after {
    border: none;
  }

  .and-or-top,
  .btn-and-or {
    padding: 0;
  }

  .btn-and-or button {
    margin-left: 4px;
  }

  .and-or-offset {
    margin-left: 30px;
  }
</style>
