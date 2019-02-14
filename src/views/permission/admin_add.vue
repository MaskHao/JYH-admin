<template>
  <div class="app-container">
    <el-form
      ref="adminAddForm"
      :rules="adminAddRule"
      :model="adminAddForm"
      label-position="left"
      label-width="150px"
      style="margin-left:50px;"
    >
      <el-form-item label="管理员账号" prop="UserCode">
        <el-input v-model="adminAddForm.UserCode" style="width:220px"/>
      </el-form-item>
      <el-form-item label="管理员密码" prop="UserPwd">
        <el-input
          v-model="adminAddForm.UserPwd"
          autocomplete="off"
          style="width:220px"
          type="password"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          v-model="adminAddForm.checkPass"
          type="password"
          autocomplete="off"
          style="width:220px"
        />
      </el-form-item>
      <el-form-item label="管理员名称" prop="UserName">
        <el-input v-model="adminAddForm.UserName" style="width:220px"/>
      </el-form-item>
      <el-form-item ref="UserHeadUrl" label="管理员头像" prop="UserHeadUrl">
        <el-upload
          :action="uploadSingle"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
        >
          <img v-if="adminAddForm.UserHeadUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否是超级管理员">
        <el-switch v-model="adminAddForm.UserSuper" active-color="#13ce66" inactive-color="#ff4949"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addBtn">添加</el-button>
      <el-button @click="cancelBtn">取消</el-button>
    </div>
  </div>
</template>
<script>
import { adminAdd } from '@/api/user'
const uploadSingle = process.env.IMAGE_API + '/Picture/UploadSingle'
export default {
  name: 'AdminAdd',
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value && typeof (value) !== 'undefined') {
        callback(new Error('请输入密码'))
      } else {
        if (this.adminAddForm.checkPass !== undefined) {
          this.$refs.adminAddForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.adminAddForm.UserPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      imageUrl: '',
      uploadSingle,
      dialogVisible: false,
      AlbumList: [],
      adminAddForm: {
        UserCode: '',
        UserPwd: null,
        UserName: '',
        UserHeadUrl: '',
        UserSuper: null,
        UserCreator: this.$store.state.user.id
      },
      adminAddRule: {
        UserCode: [{ type: 'email', required: true, message: '请输入正确邮箱', trigger: 'blur' }],
        UserPwd: [{ required: true, validator: validatePass, message: '请输入密码', trigger: 'blur' }],
        checkPass: [{ required: true, validator: validatePass2, trigger: 'blur' }],
        UserName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        UserHeadUrl: [{ required: true, message: '请选择用户头像', trigger: 'change' }]

      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.adminAddForm.UserHeadUrl = file.response.Value
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$refs.UserHeadUrl.clearValidate()
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isJPG) {
      //   this.$message.error('上传图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      //  return isJPG && isLt2M;

      return isLt2M
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    addBtn() {
      this.$refs['adminAddForm'].validate((valid) => {
        if (valid) {
          const adminForm = Object.assign({}, this.adminAddForm)
          delete adminForm.checkPass
          adminAdd(adminForm).then(res => {
            if (res.Result === 1) {
              this.$message({
                message: res.Message,
                type: 'success'
              })
              this.$router.push('/permission/admin_list')
            } else {
              this.$message({
                message: res.Message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    cancelBtn() {
      this.$router.go(-1)
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
