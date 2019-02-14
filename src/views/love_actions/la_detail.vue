<template>
  <div class="app-container">
    <el-form
      ref="GoodForm"
      :model="GoodForm"
      label-position="left"
      label-width="120px"
      style=" margin-left:50px;"
    >
      <el-form-item label="活动名称">{{ GoodForm.GoodName }}</el-form-item>
      <template v-if="GoodForm.showTime">
        <el-form-item label="有效时间">{{ GoodForm.GoodBeginTime }} - {{ GoodForm.GoodEndTime }}</el-form-item>
      </template>
      <template v-else>
        <el-form-item label="有效时间">未设置</el-form-item>
      </template>
      <el-form-item label="	活动简介">{{ GoodForm.GoodSummary }}</el-form-item>
      <el-form-item label="活动封面图" prop="GoodCover">
        <el-upload
          :action="uploadSingle"
          :show-file-list="false"
          :disabled="!changeState"
          class="avatar-uploader"
        >
          <img v-if="GoodForm.GoodCover" :src="IMAGE_API + GoodForm.GoodCover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item label="活动相册" prop="GoodAlbum">
        <el-upload
          :action="uploadSingle"
          :file-list="AlbumList"
          :on-preview="handlePictureCardPreview"
          :disabled="!changeState"
          multiple
          list-type="picture-card"
        >
          <i class="el-icon-plus"/>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" width="100%" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="活动描述" prop="GoodDescribe">
        <tinymce :height="300" v-model="GoodForm.GoodDescribe" :edit-state="changeState"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelBtn">返回爱心活动管理</el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { loveInfo } from '@/api/action'
const uploadSingle = process.env.IMAGE_API + '/Picture/UploadSingle'
export default {
  name: 'LaDetail',
  components: {
    Tinymce
  },
  filters: {
  },
  data() {
    return {
      changeState: false,
      uploadSingle,
      IMAGE_API: process.env.IMAGE_API,
      warmingVisible: false,
      GoodForm: {
        GoodId: '',
        GoodName: '',
        GoodCover: '',
        GoodAlbum: [],
        GoodDescribe: '',
        AdminID: this.$store.state.user.id
      },
      dialogVisible: false,
      dialogImageUrl: '',
      AlbumList: [] // 用于展示获取的数据
    }
  },
  created() {
    return new Promise((resolve, reject) => {
      loveInfo({
        GoodId: this.$route.params.GoodId
      }).then(res => {
        if (res.Result === 1) {
          this.GoodForm = res.Value
          const albumList = JSON.parse(this.GoodForm.GoodAlbum)
          this.AlbumList = albumList.map((value, index) => {
            return {
              name: value,
              url: this.IMAGE_API + value
            }
          })
          if (this.GoodForm.GoodBeginTime === '1900-01-01 00:00') {
            this.GoodForm.showTime = false
          } else {
            this.GoodForm.showTime = true
          }
        } else {
          this.$message({
            message: res.Message,
            type: 'warning'
          })
        }
      })
    })
  },
  mounted() {
    this.GoodForm.AdminID = this.$store.state.user.id
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    cancelBtn() {
      this.$router.push('/love_actions/la_list')
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: poer;
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

.dialog-footer {
  margin-left: 5%;
}
.GoodSkuTable {
  width: 500px;
}
.golldLabel{
  text-align: left;
}
</style>
