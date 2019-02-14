<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">添加</el-button>
    <el-table
      v-loading="listLoading"
      :data="RecommendList"
      row-key="RecommendID"
      element-loading-text="稍等..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="推荐标题" prop="Title"/>
      <el-table-column align="center" label="推荐简介" prop="Summary"/>
      <el-table-column align="center" label="推荐图片" prop="Img">
        <template slot-scope="scope">
          <img :src="IMAGE_API + scope.row.Img" class="headUrl" style="display:inline-block" alt>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推荐视频" prop="Video" width="350">
        <template slot-scope="scope">
          <video
            v-if="scope.row.Video !=''"
            :src="IMAGE_API + scope.row.Video"
            class="video"
            controls="controls"
          >您的浏览器不支持视频播放</video>
          <span v-else>———</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐跳转链接" align="center">
        <template slot-scope="scope">
          <a
            v-if="URLfilter(scope.row.Link)"
            :href="scope.row.Link"
            class="BannerLink link-type"
            target="_blank"
          >{{ scope.row.Link }}</a>
          <span v-else>{{ scope.row.Link? scope.row.Link : '———' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteRecommend(scope.$index, scope.row.RecommendID)">删除</el-button>
          <!-- <el-button type="primary" @click="handleUpdate(scope.row)">更新</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <delete-dialog :dialog-delete-visible="DialogDeleteVisible" @remove="removeRecommend"/>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogRecommendVisible">
      <el-form
        ref="RecommendForm"
        :rules="rules"
        :model="RecommendForm"
        label-width="120px"
      >
        <el-form-item label="推荐标题" prop="Title">
          <el-input
            v-model="RecommendForm.Title"
            placeholder="请填写推荐标题"
            style="width:220px"
          />
        </el-form-item>
        <el-form-item label="推荐简介" prop="Summary">
          <el-input
            :rows="2"
            v-model="RecommendForm.Summary"
            type="textarea"
            placeholder="请填写推荐简介"
            style="width:320px"
          />
        </el-form-item>
        <el-form-item ref="Img" label="推荐封面图" prop="Img">
          <el-upload
            :action="uploadSingle"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            class="avatar-uploader"
          >
            <img v-if="RecommendForm.Img" :src="IMAGE_API + RecommendForm.Img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item ref="Video" label="推荐视频">
          {{ RecommendForm.Video }}
          <el-upload
            :show-file-list="false"
            :on-success="handleVideoSuccess"
            :before-upload="beforeUploadVideo"
            :on-progress="uploadVideoProcess"
            :action="UploadVideo"
            class="avatar-uploader"
          >
            <video
              v-if="RecommendForm.Video !='' && videoFlag == false"
              :src="IMAGE_API + RecommendForm.Video"
              class="video"
            >您的浏览器不支持视频播放</video>
            <i
              v-else-if="RecommendForm.Video =='' && videoFlag == false"
              class="el-icon-plus avatar-uploader-icon"
            />
            <el-progress
              v-if="videoFlag == true"
              :percentage="videoUploadPercent"
              type="circle"
              style="margin-top:30px;"
            />
          </el-upload>
        </el-form-item>
        <el-form-item label="推荐链接">
          <el-input v-model="RecommendForm.Link"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRecommendVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='add'?addRecommend():updateRecommend()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { recommendList, deleteRecommend, addRecommend } from '@/api/recommend'
import DeleteDialog from '@/components/DeleteDialog'
import { checkURL } from '@/utils'
export default {
  name: 'RecommendList',
  components: {
    DeleteDialog
  },
  data() {
    return {
      IMAGE_API: process.env.IMAGE_API,
      uploadSingle: process.env.IMAGE_API + '/Picture/UploadSingle',
      UploadVideo: process.env.IMAGE_API + '/Picture/UploadVideo',
      listLoading: false,
      RecommendList: [],
      // delete Recommend
      DialogDeleteVisible: { visible: false },
      RecommendDelete: {},

      // update or add
      dialogStatus: '',
      textMap: {
        add: '添加推荐',
        update: '修改推荐资料'
      },
      videoFlag: false,
      videoUploadPercent: 0,
      dialogRecommendVisible: false,
      RecommendForm: {
        AdminID: this.$store.state.user.id,
        RecommendID: '',
        Title: '',
        Summary: '',
        Img: '',
        Video: '',
        Link: ''
      },
      rules: {
        Title: [{ required: true, message: '请输入推荐标题', trigger: 'blur' }],
        Summary: [{ required: true, message: '请输入推荐简介', trigger: 'blur' }],
        Img: [{ required: true, message: '请选择推荐照片', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    URLfilter(URL) {
      return checkURL(URL)
    },
    getList() {
      this.listLoading = true
      recommendList({ AdminID: this.$store.state.user.id }).then(res => {
        if (res.Result === 1) {
          this.listLoading = false
          this.RecommendList = res.Value
        }
      })
    },
    handleAvatarSuccess(res) {
      this.RecommendForm.Img = res.Value
      this.$refs.Img.clearValidate()
    },
    beforeUploadVideo(file) {
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
    },
    handleVideoSuccess(res, file) {
      this.videoFlag = false
      this.RecommendForm.Video = res.Value
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = Number(file.percentage.toFixed(0))
    },
    typeChange() {

    },
    resetTemp() {
      this.RecommendForm = {
        AdminID: this.$store.state.user.id,
        Title: '',
        Summary: '',
        Img: '',
        Video: '',
        Link: ''
      }
    },
    // 添加推荐
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'add'
      this.dialogRecommendVisible = true
      this.$nextTick(() => {
        this.$refs['RecommendForm'].clearValidate()
      })
    },
    addRecommend() {
      this.$refs['RecommendForm'].validate((valid) => {
        if (valid) {
          addRecommend(this.RecommendForm).then((res) => {
            if (res.Result && res.Result === 1) {
              this.RecommendForm.RecommendID = res.Value
              this.RecommendList.splice(0, 0, this.RecommendForm)
              this.dialogRecommendVisible = false
              this.$message({
                message: res.Message,
                type: 'success'
              })
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
    // handleUpdate(row) {
    //   this.RecommendForm = Object.assign({}, row) // copy obj
    //   this.RecommendForm.AdminID = this.$store.state.user.id
    //   this.dialogStatus = 'update'
    //   this.dialogRecommendVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['RecommendForm'].clearValidate()
    //   })
    // },
    // updateRecommend() {
    //   this.$refs['RecommendForm'].validate((valid) => {
    //     if (valid) {
    //       recommendUpdate(this.RecommendForm).then((res) => {
    //         for (const v of this.RecommendList) {
    //           if (v.RecommendID === this.RecommendForm.RecommendID) {
    //             const index = this.RecommendList.indexOf(v)
    //             this.RecommendList.splice(index, 1, this.RecommendForm)
    //             break
    //           }
    //         }
    //         this.RecommendForm
    //         this.dialogRecommendVisible = false
    //         this.$message({
    //           message: res.Message,
    //           type: 'success'
    //         })
    //       })
    //     }
    //   })
    // },
    deleteRecommend(index, RecommendID) {
      this.RecommendDelete = { index: index, RecommendID: RecommendID }
      this.DialogDeleteVisible.visible = true
    },
    removeRecommend() {
      deleteRecommend({
        AdminID: this.$store.state.user.id,
        RecommendID: this.RecommendDelete.RecommendID
      }).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: '删除成功 !',
            type: 'success'
          })
          this.RecommendList.splice(this.RecommendDelete.index, 1)
        }
      })
    }
  }
}
</script>
<style lang="scss">

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.headUrl {
  width: 80px !important;
}
.video{
  width: 320px;
}
  .BannerLink {
    display: inline-block;
    vertical-align: middle;
    width: 120px;
    overflow: hidden;
    /*超出部分隐藏*/
    white-space: nowrap;
    /*不换行*/
    text-overflow: ellipsis;
    /*超出部分文字以...显示*/
  }
</style>
