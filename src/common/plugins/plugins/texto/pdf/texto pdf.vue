<template>
  <v-card flat style="background: transparent">
    <v-card-text>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12 md12>
            <v-card flat style="background: transparent">
              <h3 class="primary--text titleModified" :class="[alignment, fontTransform, option]">{{ label }}</h3>
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
      option: 'Titulo',
      fontTransform: null,
      alignment: null,
      label: null
    };
  },
  watch: {
    label (label) {
      this.to.label = label;
      this.to.value = label;
    },
    alignment (alignment) {
      this.to.alignment = alignment;
    },
    option (option) {
      this.to.option = option;
    },
    fontTransform (transform) {
      this.to.fontTransform = transform;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.alignment = this.to.alignment ? this.to.alignment : 'text-md-left';
      this.label = this.to.value ? this.to.value : (this.to.label ? this.to.label : 'Default title label');
      this.option = this.to.option ? this.to.option : null;
      this.fontTransform = this.to.fontTransform ? this.to.fontTransform : null;
    });
  }
};
</script>
<style lang="scss">
  @import '../../../../../assets/scss/_variables.scss';
  .titleModified {
    font-weight: 700;
  }
  .underline {
    text-decoration: underline;
  }
  .italic {
    font-style: italic;
  }
  .Titulo {
    font-size: 2em;
  }
  .Texto {
    margin:10px 10px 10px 0px;
    padding: 10px;
    border-left: 4px solid lighten($color: $primary, $amount: 20%);
    border-right: 1px solid lighten($color: $primary, $amount: 20%);
    border-top: 1px solid lighten($color: $primary, $amount: 20%);
    border-bottom: 1px solid lighten($color: $primary, $amount: 20%);
    font-weight: 100 !important;
    font-size: 1em;
    color: lighten($color: $primary, $amount: 20%);
    background: rgba($color: lighten($color: $primary, $amount: 40%), $alpha: .1); 
    &::before {
      content: '';
      width: 20px;
      height: 20px;
      float: left;
      filter: opacity(.8);
      margin-right: 10px;
      background: url('../../../../../../static/images/infoicon.png') no-repeat;
      background-position: center center;
      background-size: 100%;
    }
  }
  .Subtitulo {
    font-size: 1.3em;
    border-bottom: 1px dashed rgba(116, 115, 115, 0.5);
  }
  .quitarAltura {
    margin-top: -15px;
  }
  .titleModified {
    font-weight: 700;
  }
  .bloqueTituloCabecera {
    background: rgb(96,108,136);
    background: -moz-linear-gradient(top, rgba(96,108,136,1) 0%, rgba(63,76,107,1) 100%); 
    background: -webkit-linear-gradient(top, rgba(96,108,136,1) 0%,rgba(63,76,107,1) 100%);
    background: linear-gradient(to bottom, rgba(96,108,136,1) 0%,rgba(63,76,107,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#606c88', endColorstr='#3f4c6b',GradientType=0 );
    .headline {
      color: #FFF;
      text-transform: uppercase;
      font-weight: 700;
      font-size: 1em !important;
      margin-top: -10px;
    }
  }
</style>
