<template>
  <div class="app-container">
    <el-form
      ref="adminForm"
      :model="adminForm"
      label-position="left"
      label-width="150px"
      style="margin-left:50px;"
    >
      <el-form-item label="管理员账号">{{ UserCode }}</el-form-item>
      <el-form-item label="管理员新密码" prop="UserPwd">
        <el-input
          v-model="adminForm.UserPwd"
          placeholder="请填写管理员新密码"
          style="width:220px"
          type="password"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editBtn">修改</el-button>
      <el-button @click="cancelBtn">取消</el-button>
    </div>
  </div>
</template>
<script>
import { updatePwd } from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  name: 'AdminEdit',
  data() {
    return {
      adminForm: {
        UserCode: null,
        UserPwd: null
      }
    }
  },
  computed: {
    ...mapGetters({
      UserCode: 'userCode'
    })
  },
  methods: {
    editBtn() {
      const UserId = this.$store.state.user.id
      updatePwd({
        UserId: UserId,
        UserPwd: this.adminForm.UserPwd
      })
        .then(res => {
          if (res && res.Result === 1) {
            this.$message({
              message: res.Message,
              type: 'success'
            })
          } else {
            this.$message({
              message: '未知错误',
              type: 'error'
            })
          }
          const loading = this.$loading({
            lock: true,
            text: '跳转到首页中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          setTimeout(() => {
            loading.close()
            this.$router.push('/')
          }, 2000)
        })
    },
    cancelBtn() {
      this.$router.push('/')
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.dialog-footer {
  margin-left: 5%;
}
</style>
