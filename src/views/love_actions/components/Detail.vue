<template>
  <div class="app-container">
    <el-form
      ref="GoodForm"
      :rules="rules"
      :model="GoodForm"
      label-position="left"
      label-width="120px"
      style=" margin-left:50px;"
    >
      <el-form-item label="活动名称" prop="GoodName">
        <el-input :rows="2" v-model="GoodForm.GoodName" placeholder="请填写活动名称" style="width:220px"/>
      </el-form-item>
      <el-form-item label="活动时间" style="width:620px" prop="datetime">
        <el-date-picker
          v-model="GoodForm.datetime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="timeChange"
        />
      </el-form-item>
      <el-form-item label="活动简介" prop="GoodSummary">
        <el-input
          :rows="2"
          v-model="GoodForm.GoodSummary"
          placeholder="请填写活动简介"
          type="textarea"
          style="width:320px"
        />
      </el-form-item>
      <el-form-item ref="GoodCover" label="活动封面图" prop="GoodCover">
        <el-upload
          :action="uploadSingle"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
        >
          <img v-if="GoodForm.GoodCover" :src="IMAGE_API + GoodForm.GoodCover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item ref="GoodAlbum" label="活动相册" prop="GoodAlbum">
        <el-upload
          :action="uploadSingle"
          :file-list="albumList"
          :on-success="handleGoodAlbumSuccess"
          :on-remove="handleGoodAlbumRemove"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePictureCardPreview"
          multiple
          list-type="picture-card"
        >
          <i class="el-icon-plus"/>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" width="100%" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item label="活动描述" prop="GoodDescribe">
        <tinymce :height="300" v-model="GoodForm.GoodDescribe"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <template v-if="!isUpdate">
        <el-button type="primary" @click="submitForm('GoodForm')">添加</el-button>
      </template>
      <el-button v-else type="primary" @click="UpdateBtn">确定</el-button>
      <el-button @click="cancelBtn">取消</el-button>
    </div>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import { loveAdd, loveInfo, loveUpdate } from '@/api/action'
import { deepClone } from '@/utils'
const uploadSingle = process.env.IMAGE_API + '/Picture/UploadSingle'
export default {
  name: 'GoodContent',
  components: {
    Tinymce
  },
  props: {
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      IMAGE_API: process.env.IMAGE_API,
      uploadSingle,
      dialogVisible: false,
      GoodForm: {
        GoodName: '',
        GoodSummary: '',
        GoodCover: '',
        GoodAlbum: [],
        GoodDescribe: '',
        GoodBeginTime: '',
        GoodEndTime: '',
        AdminID: this.$store.state.user.id
      },
      dialogImageUrl: '',
      albumList: [],
      rules: {
        GoodName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        GoodSummary: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        datetime: [{ type: 'array', required: true, message: '请选择时间范围', trigger: 'change' }],
        GoodCover: [{ required: true, message: '请选择封面', trigger: 'change' }],
        GoodAlbum: [{ required: true, message: '相册不能为空', trigger: 'change' }],
        GoodDescribe: [{ required: true, message: '请输入描述', trigger: 'change' }]
      },
      optionsList: [],
      selectLoading: false
    }
  },
  created() {
    // update Gooduct
    if (this.isUpdate) {
      return new Promise((resolve, reject) => {
        loveInfo({
          GoodId: this.$route.params.GoodId
        }).then(res => {
          if (res.Result === 1) {
            this.GoodForm = res.Value
            this.GoodForm.datetime = [res.Value.GoodBeginTime, res.Value.GoodEndTime]
            const albumList = JSON.parse(this.GoodForm.GoodAlbum)
            this.albumList = albumList.map((value, index) => {
              return {
                name: value,
                url: this.IMAGE_API + value
              }
            })
          } else {
            this.$message({
              message: res.Message,
              type: 'warning'
            })
          }
        })
      })
    }
  },

  methods: {
    timeChange([starTime, endeTime] = []) {
      this.GoodForm.GoodBeginTime = starTime
      this.GoodForm.GoodEndTime = endeTime
    },
    handleAvatarSuccess(res, file) {
      this.GoodForm.GoodCover = file.response.Value
      this.$refs.GoodCover.clearValidate()
    },
    handleGoodAlbumSuccess(res, file, fileList) {
      this.albumList = fileList
      this.GoodForm.GoodAlbum = fileList
      this.$refs.GoodAlbum.clearValidate()
    },
    handleGoodAlbumRemove(res, file, fileList) {
      this.albumList = file
      this.GoodForm.GoodAlbum = file
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = deepClone(this.GoodForm)
          data.GoodAlbum.forEach((value, i) => {
            data.GoodAlbum[i] = value.response.Value
          })
          loveAdd(data).then(res => {
            if (res && res.Result === 1) {
              this.$message({
                message: res.Message,
                type: 'success'
              })
              this.$router.go(-1)
            } else {
              this.$message({
                message: '后台错误',
                type: 'error'
              })
            }
          })
        }
      })
    },
    // update Good's info
    UpdateBtn() {
      this.GoodForm.AdminID = this.$store.state.user.id
      this.GoodForm.GoodAlbum = []
      this.albumList.forEach((value, i) => {
        if (value.response) {
          this.GoodForm.GoodAlbum.push(value.response.Value)
        } else {
          this.GoodForm.GoodAlbum.push(value.name)
        }
      })
      loveUpdate(this.GoodForm).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: res.Message,
            type: 'success'
          })
          this.$router.go(-1)
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

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}

.cover {
  width: 80px;
  height: 80px;
  display: block;
}
.label {
  width: 250px;
}
.dialog-footer {
  margin-left: 5%;
}
</style>
