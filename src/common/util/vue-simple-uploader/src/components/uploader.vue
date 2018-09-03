<template>
  <div class="uploader">
    <slot :files="files" :file-list="fileList" :started="started">

    </slot>
  </div>
</template>

<script>
  import Uploader from 'simple-uploader.js'
  import { kebabCase } from '../common/utils'
  import UploaderBtn from './btn.vue'
  import UploaderDrop from './drop.vue'
  import UploaderUnsupport from './unsupport.vue'
  import UploaderList from './list.vue'
  import UploaderFiles from './files.vue'
  import UploaderFile from './file.vue'

  const COMPONENT_NAME = 'uploader'
  const FILE_ADDED_EVENT = 'fileAdded'

  export default {
    name: COMPONENT_NAME,
    props: {
      reload: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
        default () {
          return {}
        }
      },
      autoStart: {
        type: Boolean,
        default: true
      },
      fileStatusText: {
        type: Object,
        default () {
          return {
            success: 'success',
            error: 'error',
            uploading: 'uploading',
            paused: 'paused',
            waiting: 'waiting'
          }
        }
      }
    },
    data () {
      return {
        started: false,
        files: [],
        fileList: []
      }
    },
    methods: {
      uploadStart () {
        this.started = true
        this.$waiting(true, 'Se esta subiendo archivos, espere unos segundos por favor...')
      },
      uploadFinish (file) {
        this.$waiting(false)
        this.$store.commit('setMain', false)
        this.$nextTick(function () {
          this.$store.commit('setMain', true)
        })
        this.$message.success('Componente exitosamente cargado')
      },
      uploadError (file) {
        this.$waiting(false)
        this.$message.error('Error al tratar de agregar plugin')
      },
      fileAdded (file) {
        this.$emit(kebabCase(FILE_ADDED_EVENT), file)
        if (file.ignored) {
          // is ignored, filter it
          return false
        }
      },
      fileRemoved (file) {
        this.files = this.uploader.files
        this.fileList = this.uploader.fileList
      },
      filesSubmitted (files, fileList) {
        this.files = this.uploader.files
        this.fileList = this.uploader.fileList
        // if (this.autoStart) { // iniciar automaticamente la subida de archivos
        //   this.uploader.upload()
        // }
      },
      allEvent (...args) {
        const name = args[0]
        if (name === FILE_ADDED_EVENT) {
          return
        }
        args[0] = kebabCase(name)
        this.$emit.apply(this, args)
      }
    },
    created () {
      const uploader = new Uploader(this.options)
      this.uploader = uploader
      this.uploader.fileStatusText = this.fileStatusText
      uploader.on('catchAll', this.allEvent)
      uploader.on('uploadStart', this.uploadStart)
      uploader.on('fileComplete', this.uploadFinish)
      uploader.on('fileError', this.uploadError)
      uploader.on(FILE_ADDED_EVENT, this.fileAdded)
      uploader.on('fileRemoved', this.fileRemoved)
      uploader.on('filesSubmitted', this.filesSubmitted)
    },
    destroyed () {
      const uploader = this.uploader
      uploader.off('catchAll', this.allEvent)
      uploader.off('uploadStart', this.uploadStart)
      uploader.on('fileError', this.uploadError)
      uploader.off(FILE_ADDED_EVENT, this.fileAdded)
      uploader.off('fileRemoved', this.fileRemoved)
      uploader.off('filesSubmitted', this.filesSubmitted)
      this.uploader = null
    },
    components: {
      UploaderBtn,
      UploaderDrop,
      UploaderUnsupport,
      UploaderList,
      UploaderFiles,
      UploaderFile
    }
  }
</script>

<style>
  .uploader {
    position: relative;
  }
</style>
