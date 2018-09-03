<template>
  <div>
    <v-tooltip bottom class="bottomUploadStyle" v-show="fileList.length > 0">
      <v-btn icon slot="activator" @click.prevent="upload">
        <v-icon medium>cloud_upload</v-icon>
      </v-btn>
      <span>Subir todos los archivos de la lista</span>
    </v-tooltip>
    <div class="uploader-list">
      <slot :file-list="fileList">
        <ul>
          <li v-for="file in fileList" :key="file.id">
            <uploader-file :file="file" :list="true"></uploader-file>
          </li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script>
  import UploaderFile from './file.vue'

  const COMPONENT_NAME = 'uploader-list'

  export default {
    name: COMPONENT_NAME,
    computed: {
      fileList () {
        return this.$parent.fileList
      }
    },
    methods: {
      upload (e) {
        e.preventDefault()
        this.$parent.uploader.retry()
      }
    },
    components: {
      UploaderFile
    }
  }
</script>

<style src="./main.scss" lang="scss"></style>
