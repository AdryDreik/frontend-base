<template>
    <section class="visualizador">
      <v-card class="formularioVisualizador">
        <v-form v-model="valid" ref="form" lazy-validation>
          <grid-layout
            ref="gridLayout"
            :layout="layout"
            :col-num="12"
            :row-height="50"
            :is-draggable="false"
            :is-resizable="false"
            :vertical-compact="true"
            :auto-size="true"
            :margin="[1, 1]"
            :use-css-transforms="true"
            >
            <grid-item v-for="(item, idx) in this.layout" :key="idx"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              >
              <formly-form @mouseover.native="detectElement(item, idx)" :ref="`item_${idx}`" :id="`item-${idx}`" :form="form" :model="model" :fields="[fields[parseInt(idx)]]" :all="fields"></formly-form>
              {{activeEvent(item, idx)}}
            </grid-item>
          </grid-layout>
        </v-form>
      </v-card>
    </section>
</template>
<script>
import {GridLayout, GridItem} from 'vue-grid-layout';
const COMPONENT_NAME = 'visualizador';
export default {
  name: COMPONENT_NAME,
  props: {
    componente: {
      type: String,
      default: null
    },
    fields: {
      type: Array,
      default: () => {
        return [];
      }
    },
    layout: {
      type: Array,
      default: () => {
        return [];
      }
    },
    mode: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      valid: null,
      model: [],
      form: {},
      sw: true
    };
  },
  watch: {
    layout () {
      setTimeout(() => {
        this.calcularLayout();
      }, 1000);
    },
    mode (mode) {
      this.formDisabled(mode);
    }
  },
  methods: {
    /**
     * @function activeEvent
     * @param i index
     * @param newH Altura
     * @param newW Anchura
     * @param newHPx Numero que aumentara
     * @param newWPy Distancia dle objeto
     *
    */
    activeEvent (item, idx) {
      if (this.layout.length === (idx + 1)) {
        if (this.sw) {
          this.sw = false;
          setTimeout(() => {
            this.calcularLayout();
          }, 1000);
        }
      }
    },
    /**
     * @function calculateLayouts
     * @description Esta es una descripcion para calcular el layout
     */
    calcularLayout () {
      try {
        for (let i = 0; i < this.layout.length; i += 1) {
          const nameItem = `item_${i}`;
          if (this.$refs[nameItem]) {
            const fieldset = this.$refs[nameItem][0].$el;
            const gridItem = fieldset.parentNode;
            let alturaIncrementarODrecrementar;
            if (fieldset.offsetHeight > gridItem.offsetHeight) {
              alturaIncrementarODrecrementar = parseInt(Math.abs(fieldset.offsetHeight - gridItem.offsetHeight) / 50);
              this.$refs.gridLayout.resizeEvent('resizeend', this.layout[i].i, this.layout[i].h, this.layout[i].w, (((this.layout[i].h + alturaIncrementarODrecrementar) > 1) ? this.layout[i].h + alturaIncrementarODrecrementar : 2), this.layout[i].w);
            } else {
              alturaIncrementarODrecrementar = parseInt(Math.abs(gridItem.offsetHeight - fieldset.offsetHeight) / 50);
              this.$refs.gridLayout.resizeEvent('resizeend', this.layout[i].i, this.layout[i].h, this.layout[i].w, (((this.layout[i].h - alturaIncrementarODrecrementar) > 1) ? this.layout[i].h - alturaIncrementarODrecrementar : 2), this.layout[i].w);
            }
          }
        }
      } catch (err) {}
    },
    /**
     * @function detectElement
     * @param i index
     * @param newH Altura
     * @param newW Anchura
     * @param newHPx Numero que aumentara
     * @param newWPy Distancia dle objeto
     *
    */
    detectElement (item, idx) {
      const nameItem = `item_${idx}`;
      const fieldset = this.$refs[nameItem][0].$el;
      const gridItem = fieldset.parentNode;
      let alturaIncrementarODrecrementar;
      if (fieldset.offsetHeight > gridItem.offsetHeight) {
        alturaIncrementarODrecrementar = parseInt(Math.abs(fieldset.offsetHeight - gridItem.offsetHeight) / 50);
        this.$refs.gridLayout.resizeEvent('resizeend', item.i, item.h, item.w, (((item.h + alturaIncrementarODrecrementar) > 1) ? item.h + alturaIncrementarODrecrementar : 2), item.w);
      } else {
        alturaIncrementarODrecrementar = parseInt(Math.abs(gridItem.offsetHeight - fieldset.offsetHeight) / 50);
        this.$refs.gridLayout.resizeEvent('resizeend', item.i, item.h, item.w, (((item.h - alturaIncrementarODrecrementar) > 1) ? item.h - alturaIncrementarODrecrementar : 2), item.w);
      }
    },
    /**
     * @function formDisabled
     * @description Esta funcion esta encargada de deshabilitar el formulario, esto quiere decir quitar la edicion
     * @param {boolean}
     * @description true = disabled, false = remove disabled
     * @return {none}
     */
    formDisabled (option) {
      const allRefs = Object.keys(this.$refs).filter((item) => { return item.includes('item'); });
      allRefs.forEach((form, key) => {
        const _form = this.$refs[form][0];
        _form.$children[0].$children[0].disabled = (option) ? true : false;
      });
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
    background: rgb(242, 239, 239);
    padding: 10mm 0mm;
    .formularioVisualizador {
      margin: 0 30px;
      border: 1px solid #d3d3d3;
      border-radius: 5px;
      background: #fff;
      box-shadow: 0 0 5px rgba(0,0,0,.1);
      
      fieldset {
        padding-left: 3px; 
        border: none !important;
      }
    }
    .vue-grid-layout {
      .vue-grid-item:not(.vue-grid-placeholder) {
        border: none !important;
      }
    }
    .card__actions {
      background: rgb(242, 239, 239) !important;
    }
  }
</style>

