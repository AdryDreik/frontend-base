<template>
  <div class="uploader-file" :status="status">
    <slot
      :file="file"
      :list="list"
      :status="status"
      :name="name"
      :paused="paused"
      :error="error"
      :average-speed="averageSpeed"
      :formated-average-speed="formatedAverageSpeed"
      :current-speed="currentSpeed"
      :is-complete="isComplete"
      :is-uploading="isUploading"
      :size="size"
      :formated-size="formatedSize"
      :uploaded-size="uploadedSize"
      :progress="progress"
      :progress-style="progressStyle"
      :progressing-class="progressingClass"
      :time-remaining="timeRemaining"
      :formated-time-remaining="formatedTimeRemaining"
      :type="type"
      :extension="extension"
      :file-category="fileCategory"
      >
      <div class="uploader-file-progress" :class="progressingClass" :style="progressStyle"></div>
      <div class="uploader-file-info">
        <div class="uploader-file-name"><i class="uploader-file-icon" :icon="fileCategory"></i>{{name}}</div>
        <div class="uploader-file-size">{{formatedSize}}</div>
        <div class="uploader-file-meta"></div>
        <div class="uploader-file-status">
          <span v-show="status !== 'uploading'">{{translate(statusText)}}</span>
          <span v-show="status === 'uploading'">
            <span>{{progressStyle.progress}}</span>
            <em>{{formatedAverageSpeed}}</em>
            <i>{{formatedTimeRemaining}}</i>
          </span>
        </div>
        <div class="uploader-file-actions">
          <span class="uploader-file-pause" @click="pause"></span>
          <span class="uploader-file-resume" @click="resume">️</span>
          <span class="uploader-file-retry" @click="retry"></span>
          <span class="uploader-file-remove" @click="remove"></span>
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
  import Uploader from 'simple-uploader.js'
  import events from '../common/file-events'
  import { secondsToStr } from '../common/utils'

  const COMPONENT_NAME = 'uploader-file'

  export default {
    name: COMPONENT_NAME,
    props: {
      file: {
        type: Object,
        default () {
          return {}
        }
      },
      list: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        name: '',
        paused: false,
        error: false,
        averageSpeed: 0,
        currentSpeed: 0,
        isComplete: false,
        isUploading: false,
        size: 0,
        formatedSize: '',
        uploadedSize: 0,
        progress: 0,
        timeRemaining: 0,
        type: '',
        extension: '',
        progressingClass: ''
      }
    },
    computed: {
      fileCategory () {
        const extension = this.extension
        const isFolder = this.file.isFolder
        let type = isFolder ? 'folder' : 'unknown'
        const typeMap = {
          image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
          video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
          audio: ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'],
          document: ['doc', 'txt', 'docx', 'pages', 'epub', 'pdf', 'numbers', 'csv', 'xls', 'xlsx', 'keynote', 'ppt', 'pptx']
        }
        Object.keys(typeMap).forEach((_type) => {
          const extensions = typeMap[_type]
          if (extensions.indexOf(extension) > -1) {
            type = _type
          }
        })
        return type
      },
      progressStyle () {
        const progress = Math.floor(this.progress * 100)
        const style = `translateX(${Math.floor(progress - 100)}%)`
        return {
          progress: `${progress}%`,
          webkitTransform: style,
          mozTransform: style,
          msTransform: style,
          transform: style
        }
      },
      formatedAverageSpeed () {
        return `${Uploader.utils.formatSize(this.averageSpeed)} / s`
      },
      status () {
        const isUploading = this.isUploading
        const isComplete = this.isComplete
        const isError = this.error
        const paused = this.paused
        if (isComplete) {
          return 'success'
        } else if (isError) {
          return 'error'
        } else if (isUploading) {
          return 'uploading'
        } else if (paused) {
          return 'paused'
        } else {
          return 'waiting'
        }
      },
      statusText () {
        const status = this.status
        return this.file.uploader.fileStatusText[status] || status
      },
      formatedTimeRemaining () {
        const timeRemaining = this.timeRemaining
        const file = this.file
        if (timeRemaining === Number.POSITIVE_INFINITY || timeRemaining === 0) {
          return ''
        }
        let parsedTimeRemaining = secondsToStr(timeRemaining)
        const parseTimeRemaining = file.uploader.opts.parseTimeRemaining
        if (parseTimeRemaining) {
          parsedTimeRemaining = parseTimeRemaining(timeRemaining, parsedTimeRemaining)
        }
        return parsedTimeRemaining
      }
    },
    watch: {
      status (newStatus, oldStatus) {
        if (oldStatus && newStatus === 'uploading' && oldStatus !== 'uploading') {
          this.tid = setTimeout(() => {
            this.progressingClass = 'uploader-file-progressing'
          }, 200)
        } else {
          clearTimeout(this.tid)
          this.progressingClass = ''
        }
      }
    },
    methods: {
      translate (word) {
        if (word === 'waiting') {
          return 'Listando archivos para subir'
        } else if (word === 'success') {
          return 'Archivo satisfactoriamente subido'
        } else if (word === 'error') {
          return 'Error al tratar de subir'
        } else {
          return ''
        }
      },
      _actionCheck () {
        this.paused = this.file.paused
        this.error = this.file.error
        this.isUploading = this.file.isUploading()
      },
      pause () {
        this.file.pause()
        this._actionCheck()
        this._fileProgress()
      },
      resume () {
        this.file.resume()
        this._actionCheck()
      },
      remove () {
        this.file.cancel()
      },
      retry () {
        this.file.retry()
        this._actionCheck()
      },
      fileEventsHandler (event, args) {
        const rootFile = args[0]
        const file = args[1]
        const target = this.list ? rootFile : file
        if (this.file === target) {
          if (this.list && event === 'fileSuccess') {
            return
          }
          this[`_${event}`].apply(this, args)
        }
      },
      _fileProgress () {
        this.progress = this.file.progress()
        this.averageSpeed = this.file.averageSpeed
        this.currentSpeed = this.file.currentSpeed
        this.timeRemaining = this.file.timeRemaining()
        this.uploadedSize = this.file.sizeUploaded()
        this._actionCheck()
      },
      _fileSuccess () {
        this._fileProgress()
        this.error = false
        this.isComplete = true
        this.isUploading = false
      },
      _fileComplete () {
        this._fileSuccess()
      },
      _fileError () {
        this._fileProgress()
        this.error = true
        this.isComplete = false
        this.isUploading = false
      }
    },
    mounted () {
      const staticProps = ['name', 'paused', 'error', 'averageSpeed', 'currentSpeed']
      const fnProps = [
        'isComplete',
        'isUploading',
        {
          key: 'size',
          fn: 'getSize'
        },
        {
          key: 'formatedSize',
          fn: 'getFormatSize'
        },
        {
          key: 'uploadedSize',
          fn: 'sizeUploaded'
        },
        'progress',
        'timeRemaining',
        {
          key: 'type',
          fn: 'getType'
        },
        {
          key: 'extension',
          fn: 'getExtension'
        }
      ]
      staticProps.forEach(prop => {
        this[prop] = this.file[prop]
      })
      fnProps.forEach((fnProp) => {
        if (typeof fnProp === 'string') {
          this[fnProp] = this.file[fnProp]()
        } else {
          this[fnProp.key] = this.file[fnProp.fn]()
        }
      })

      const handlers = this._handlers = {}
      const eventHandler = (event) => {
        handlers[event] = (...args) => {
          this.fileEventsHandler(event, args)
        }
        return handlers[event]
      }
      events.forEach((event) => {
        this.file.uploader.on(event, eventHandler(event))
      })
    },
    destroyed () {
      events.forEach((event) => {
        this.file.uploader.off(event, this._handlers[event])
      })
      this._handlers = null
    }
  }
</script>

<style src="./main.scss" lang="scss"></style>
