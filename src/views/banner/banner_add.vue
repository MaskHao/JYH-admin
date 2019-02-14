<template>
  <div class="app-container">
    <el-form
      ref="BannerForm"
      :rules="rules"
      :model="BannerForm"
      label-position="left"
      label-width="150px"
      style=" margin-left:50px;"
    >
      <!-- 上传图片 -->
      <el-form-item ref="BannImg" label="横幅图片/视频首图" prop="BannImg">
        <el-upload
          :action="uploadSingle"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
        >
          <img v-if="BannerForm.BannImg" :src="IMAGE_API + BannerForm.BannImg" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon banner"/>
        </el-upload>
      </el-form-item>

      <!-- 上传视频 -->
      <el-form-item ref="BannVideo" label="横幅视频" prop="BannVideo">
        <el-upload
          :show-file-list="false"
          :on-success="handleVideoSuccess"
          :before-upload="beforeUploadVideo"
          :on-progress="uploadVideoProcess"
          :action="UploadVideo"
          width="320"
          class="avatar-uploader el-upload--text"
        >
          <video
            v-if="BannerForm.BannVideo !='' && videoFlag == false"
            :src="IMAGE_API + BannerForm.BannVideo"
            class="avatar"
            controls="controls"
          >您的浏览器不支持视频播放</video>
          <i
            v-else-if="BannerForm.BannVideo =='' && videoFlag == false"
            class="el-icon-plus avatar-uploader-icon video"
          />
          <el-progress
            v-if="videoFlag == true"
            :percentage="videoUploadPercent"
            type="circle"
            style="margin-top:30px;"
          />
        </el-upload>
      </el-form-item>

      <el-form-item label="横幅类型" prop="BannGoodsType">
        <el-select v-model="BannerForm.BannGoodsType" @change="typeChange">
          <el-option
            v-for="item in BannerTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item ref="BannLinkType" label="横幅链接类型" prop="BannLinkType">
        <el-select
          v-model="BannerForm.BannLinkType"
          :disabled="LinkTypeDisabled"
          placeholder="请选择"
          @change="linkTypeChange"
        >
          <el-option
            v-for="item in IntLinkTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 跳转到商品 -->
      <template v-if="BannerForm.BannLinkType === 1">
        <el-form-item ref="BannLink" label="商品" prop="BannLink">
          <el-select
            v-model="BannerForm.BannLink"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
          >
            <el-option
              v-for="item in optionsGoodsList"
              :key="item.strGoodId"
              :label="item.strGoodName"
              :value="item.strGoodId"
            />
          </el-select>
        </el-form-item>
      </template>
      <!-- 跳转到链接 -->
      <template v-if="BannerForm.BannLinkType === 2">
        <el-form-item ref="BannLink" label="横幅图片链接" prop="BannLink">
          <el-input v-model="BannerForm.BannLink" class="BannerPrice" style="width:260px"/>
        </el-form-item>
      </template>
      <!-- 跳转到企业 -->
      <template v-if="BannerForm.BannLinkType === 3">
        <el-form-item ref="BannLink" label="选择企业" prop="BannLink">
          <el-select
            v-model="BannerForm.BannLink"
            :remote-method="remoteMethodCompany"
            :loading="selectLoading"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
          >
            <el-option
              v-for="item in optionsCompanyList"
              :key="item.strGoodCompany"
              :label="item.strMembCompName"
              :value="item.strGoodCompany"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('BannerForm')">添加</el-button>
      <el-button @click="cancelBtn">取消</el-button>
    </div>
  </div>
</template>
<script>
// import axios from 'axios'
import { bannerAdd } from '@/api/banner'
import { goodList, goodCompanyList } from '@/api/prods'
import { LinkTypeList, BannerTypeList } from '@/utils/typeCode'
import { checkURL } from '@/utils'
export default {
  name: 'BannerAdd',
  data() {
    const validateLink = (rule, value, callback) => {
      // 跳转到商品
      if (this.BannerForm.BannLinkType === 1) {
        if (value === '') {
          callback(new Error('请输入爱心商品'))
        } else {
          callback()
        }
      } else if (this.BannerForm.BannLinkType === 2) {
        if (value !== '' && checkURL(value)) {
          callback()
        } else {
          callback(new Error('请输入有效链接(含有http或https)'))
        }
      } else {
        if (value === '') {
          callback(new Error('请选择爱心企业'))
        } else {
          callback()
        }
      }
    }
    return {
      uploadSingle: process.env.IMAGE_API + '/Picture/UploadSingle',
      UploadVideo: process.env.IMAGE_API + '/Picture/UploadVideo',
      IMAGE_API: process.env.IMAGE_API,
      BannerTypeList,
      LinkTypeList,
      IntLinkTypeList: LinkTypeList,
      LinkTypeDisabled: false,
      BannerForm: {
        BannImg: '',
        BannVideo: '',
        BannGoodsType: null,
        BannLinkType: null,
        BannLink: '',
        AdminID: this.$store.state.user.id
      },
      videoFlag: false,
      videoUploadPercent: 0,
      rules: {
        BannImg: [
          { required: true, message: '请选择横幅', trigger: 'change' }
        ],
        BannGoodsType: [
          { required: true, message: '请选择横幅类型', trigger: 'change' }
        ],
        BannLinkType: [
          { required: true, message: '请选择横幅链接类型', trigger: 'change' }
        ],
        BannLink: [
          { required: true, validator: validateLink, trigger: 'change' }
        ]

      },
      selectLoading: false,
      optionsGoodsList: [],
      optionsCompanyList: []
    }
  },
  mounted() {
    goodList({ GoodName: '' }).then(res => {
      if (res.Result === 1) {
        this.optionsGoodsList = res.Value
      } else {
        this.$message({
          message: res.Message,
          type: 'error'
        })
      }
    })
    goodCompanyList({ MembCompName: '' }).then(res => {
      if (res.Result === 1) {
        this.optionsCompanyList = res.Value
      } else {
        this.$message({
          message: res.Message,
          type: 'error'
        })
      }
    })
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.BannerForm.BannImg = file.response.Value
      this.$refs.BannImg.clearValidate()
    },
    beforeAvatarUpload(file) {
      // const isJPG = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 jpg、jpeg、png、gif、bmp、webp格式!')
      // }
      // return isJPG && isLt2M
      return isLt2M
    },
    beforeUploadVideo(file) {
      this.videoFlag = false
      this.videoUploadPercent = 0
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
    },

    handleVideoSuccess(res, file) {
      this.videoFlag = false
      this.BannerForm.BannVideo = res.Value
      this.BannerForm.BannLinkType = 0 // 不跳转
      this.LinkTypeDisabled = true
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = Number(file.percentage.toFixed(0))
    },
    typeChange() {
      if (this.isPic) {
        this.BannerForm.BannLinkType = ''
        if (this.$refs['BannLinkType']) {
          this.$refs['BannLinkType'].clearValidate()
        }
      }
      // this.BannerForm.BannLinkType = ''
      // if (this.$refs['BannLinkType']) {
      //   this.$refs['BannLinkType'].clearValidate()
      // }
      this.BannerForm.BannLink = ''
      if (this.$refs['BannLink']) {
        this.$refs['BannLink'].clearValidate()
      }
      // 选择为企业
      if (this.BannerForm.BannGoodsType === 1) {
        this.IntLinkTypeList = this.LinkTypeList.filter((item, index) => {
          return item.value !== 1
        })
      } else {
        this.IntLinkTypeList = this.LinkTypeList
      }
    },
    // banner 类型选择
    linkTypeChange() {
      if (this.$refs['BannLink']) {
        this.$refs['BannLink'].clearValidate()
      }
      this.BannerForm.BannLink = ''
    },
    // 远程商品搜索
    remoteMethod(query) {
      this.selectLoading = true
      const selectPord = query.trim()
      setTimeout(() => {
        return new Promise((resolve, reject) => {
          goodList({ GoodName: selectPord }).then(res => {
            this.selectLoading = false
            if (res.Result === 1) {
              this.optionsGoodsList = res.Value
            } else {
              this.$message({
                message: res.Message,
                type: 'error'
              })
            }
          })
        })
      }, 200)
    },
    remoteMethodCompany(query) {
      this.selectLoading = true
      const selectPord = query.trim()
      setTimeout(() => {
        return new Promise((resolve, reject) => {
          goodCompanyList({ MembCompName: selectPord }).then(res => {
            this.selectLoading = false
            if (res.Result === 1) {
              this.optionsCompanyList = res.Value
            } else {
              this.$message({
                message: res.Message,
                type: 'error'
              })
            }
          })
        })
      }, 200)
    },
    // ADD提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          bannerAdd(this.BannerForm).then(res => {
            if (res.Result === 1) {
              this.$message({
                message: res.Message,
                type: 'success'
              })
              setTimeout(() => {
                this.$router.push('/banner/banner_list')
              }, 1000)
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
<style scoped>
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
  width: auto;
  height: 178px;
  display: block;
}
.dialog-footer {
  margin-left: 5%;
}
.banner{
  width: 320px;
}
.video{
  width: 320px;
}
</style>
