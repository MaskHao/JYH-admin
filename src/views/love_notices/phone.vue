<template>
  <div class="app-container">
    <el-form
      ref="dataForm"
      :model="dataForm"
      label-position="left"
      label-width="150px"
      style="margin-left:50px;"
    >
      <el-form-item label="活动联系方式">{{ dataForm.SettPhone }}</el-form-item>
      <el-form-item label="活动创建时间">{{ dataForm.SettCreatetime }}</el-form-item>
    </el-form>
    <div slot="footer" class="footer">
      <el-button type="primary" @click="editBtn">修改</el-button>
      <el-button @click="cancelBtn">取消</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="修改手机号码">
      <el-form ref="changeForm" :model="changeForm" :rules="rules" label-position="left" label-width="100px">
        <el-form-item label="原手机号码">{{ dataForm.SettPhone }}</el-form-item>
        <el-form-item label="现手机号码" prop="SettPhone">
          <el-input v-model="changeForm.SettPhone"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('changeForm')">立即修改</el-button>
          <el-button @click="resetForm('changeForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { setPhone, setPhoneUpdate } from '@/api/phone'
import isChinesePhoneNumber from 'is-chinese-phone-number'
export default {
  name: 'Phone',
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!isChinesePhoneNumber(value)) {
        callback(new Error('请输入正确的号码 '))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        SettPhone: '',
        SettId: '',
        SettCreatetime: ''
      },
      changeForm: {
        SettPhone: '',
        SettId: '',
        AdminID: this.$store.state.user.id
      },
      dialogVisible: false,
      rules: {
        SettPhone: [{ required: true, validator: checkPhone, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getPhone()
  },
  methods: {
    getPhone() {
      this.listLoading = true
      setPhone({ AdminID: this.$store.state.user.id }).then(res => {
        if (res.Result === 1) {
          this.listLoading = false
          this.dataForm = res.Value
        }
      })
    },
    editBtn() {
      this.changeForm.SettId = this.dataForm.SettId
      this.changeForm.SettPhone = ''
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['changeForm'].clearValidate()
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          setPhoneUpdate(this.changeForm).then(res => {
            if (res && res.Result === 1) {
              this.$message({
                message: res.Message,
                type: 'success'
              })
              this.dataForm.SettPhone = this.changeForm.SettPhone
              this.dialogVisible = false
            } else {
              this.$message({
                message: '未知错误',
                type: 'error'
              })
            }
          })
        }
      })
    },
    cancelBtn() {
      this.$router.push('/')
    }
  }
}
</script>
<style>
.footer {
  margin-left: 5%;
}
</style>
