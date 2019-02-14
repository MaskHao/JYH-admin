<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="上传时间:">{{ form.SettCreatetime }}</el-form-item>
      <el-form-item label="协议内容:">
        <tinymce :height="900" v-model="form.SettAgreement"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onUpdate">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { setAgreement, setAgreementUpdate } from '@/api/agreement'
export default {
  name: 'ProdAgreement',
  components: {
    Tinymce
  },
  data() {
    return {
      form: {
        AdminID: this.$store.state.user.id,
        SettAgreement: '',
        SettId: '',
        SettCreatetime: ''
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      return new Promise((resolve, reject) => {
        setAgreement({ AdminID: this.$store.state.user.id }).then((res) => {
          if (res.Result && res.Result === 1) {
            this.form = Object.assign(this.form, res.Value)
          }
        })
      })
    },
    onUpdate() {
      return new Promise((resolve, reject) => {
        setAgreementUpdate(this.form).then((res) => {
          if (res.Result && res.Result === 1) {
            this.$message({
              message: res.Message,
              type: 'success'
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
