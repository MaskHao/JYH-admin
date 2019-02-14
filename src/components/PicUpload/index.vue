<template>
  <div class="upload-container">
    <el-upload
      :http-request="uploadSectionFile"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      action="uploadSingle"
      class="avatar-uploader"
    >
      <img v-if="BannImg" :src="BannImg" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"/>
    </el-upload>
  </div>
</template>
<script>
// import axios from 'axios'
export default {
  name: 'Upload',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: '', key: '' }
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    emitInput(val) {
      this.$emit('input', val)
    }
  }
}
</script>

