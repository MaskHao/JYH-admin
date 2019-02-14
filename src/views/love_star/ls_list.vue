<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">添加</el-button>
    <el-form ref="Search" :inline="true" :model="Search" class="demo-form-inline">
      <el-form-item label="爱心明星姓名:">
        <el-input v-model="Search.StarName"/>
      </el-form-item>
      <el-form-item label="爱心明星类型">
        <el-select v-model="Search.Type" style="width: 120px">
          <el-option
            v-for="item in StarTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="starList"
      row-key="StarId"
      element-loading-text="稍等..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="爱心明星姓名" prop="StarName"/>
      <el-table-column align="center" label="爱心明星头像" prop="StarCover">
        <template slot-scope="scope">
          <img :src="IMAGE_API + scope.row.StarCover" class="headUrl" style="display:inline-block" alt>
        </template>
      </el-table-column>
      <el-table-column align="center" label="爱心明星视频简介" prop="Video" width="350">
        <template slot-scope="scope">
          <video v-if="scope.row.Video" :src="IMAGE_API + scope.row.Video" controls="controls" class="video"/>
          <span v-else>———</span>
        </template>
      </el-table-column>
      <el-table-column label="爱心明星类型" align="center">
        <template slot-scope="scope">{{ scope.row.Type | StarTypeFilter }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="StarCreatetime"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteStar(scope.$index, scope.row.StarId)">删除</el-button>
          <el-button type="primary" @click="handleUpdate(scope.row)">更新</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.Take" @pagination="getList" />
    <delete-dialog :dialog-delete-visible="DialogDeleteVisible" @remove="removeStar"/>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogStarVisible">
      <el-form
        ref="starForm"
        :rules="rules"
        :model="starForm"
        label-width="120px"
      >
        <el-form-item label="爱心明星姓名" prop="StarName">
          <el-input
            :rows="2"
            v-model="starForm.StarName"
            placeholder="请填写爱心明星姓名"
            style="width:220px"
          />
        </el-form-item>
        <el-form-item ref="StarCover" label="爱心明星封面图" prop="StarCover">
          <el-upload
            :action="uploadSingle"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            class="avatar-uploader"
          >
            <img v-if="starForm.StarCover" :src="IMAGE_API + starForm.StarCover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item ref="Video" label="爱心明星视频" prop="Video">
          <el-upload
            :show-file-list="false"
            :on-success="handleVideoSuccess"
            :before-upload="beforeUploadVideo"
            :on-progress="uploadVideoProcess"
            :action="UploadVideo"
            class="avatar-uploader"
          >
            <video
              v-if="starForm.Video !='' && videoFlag == false"
              :src="IMAGE_API + starForm.Video"
              class="video"
            >您的浏览器不支持视频播放</video>
            <i
              v-else-if="starForm.Video =='' && videoFlag == false"
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
        <el-form-item label="爱心明星类型" prop="Type">
          <el-select v-model="starForm.Type" @change="typeChange">
            <el-option
              v-for="item in addStarTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="爱心明星简介" prop="StarSummary">
          <el-input v-model="starForm.StarSummary" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogStarVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='add'?addStar():updateStar()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { starList, starDelete, starUpdate, starAdd } from '@/api/loveStar'
import { StarTypeList } from '@/utils/typeCode'
import Pagination from '@/components/Pagination'
import DeleteDialog from '@/components/DeleteDialog'
const addStarTypeList = [...StarTypeList]
addStarTypeList.forEach((item, index, arr) => {
  if (item.value === 99) {
    arr.splice(index, 1)
  }
})
const TypeList = StarTypeList.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})
export default {
  name: 'LsList',
  components: {
    DeleteDialog,
    Pagination
  },
  filters: {
    StarTypeFilter(type) {
      return TypeList[type]
    }
  },
  data() {
    return {
      IMAGE_API: process.env.IMAGE_API,
      uploadSingle: process.env.IMAGE_API + '/Picture/UploadSingle',
      UploadVideo: process.env.IMAGE_API + '/Picture/UploadVideo',
      StarTypeList,
      addStarTypeList,
      listQuery: {
        StarName: '',
        Type: 99,
        page: 1,
        Skip: 0,
        Take: 10,
        AdminID: this.$store.state.user.id
      },
      Search: {
        StarName: '',
        Type: 99,
        page: 1,
        Skip: 0,
        Take: 10,
        AdminID: this.$store.state.user.id
      },
      listLoading: false,
      starList: [],
      total: NaN,
      // delete star
      DialogDeleteVisible: { visible: false },
      starDelete: {},

      // update or add
      dialogStatus: '',
      textMap: {
        add: '添加爱心明星',
        update: '修改爱心明星资料'
      },
      videoFlag: false,
      videoUploadPercent: 0,
      dialogStarVisible: false,
      starForm: {
        StarName: '',
        StarCover: '',
        Type: '',
        Video: '',
        StarSummary: '',
        AdminID: this.$store.state.user.id
      },
      rules: {
        StarName: [{ required: true, message: '请输入爱心明星姓名', trigger: 'blur' }],
        StarCover: [{ required: true, message: '请选择明星照片', trigger: 'change' }],
        Type: [{ required: true, message: '请选择明星类型', trigger: 'change' }],
        StarSummary: [{ required: true, message: '请输入简介', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList({ page, limit } = {}) {
      if (page && limit) {
        this.listQuery.Take = limit
        this.listQuery.Skip = (--page) * limit
      }
      this.listLoading = true
      starList(this.listQuery).then(res => {
        if (res.Result === 1) {
          this.listLoading = false
          this.starList = res.Value
          this.total = res.Total
        }
      })
    },
    searchBtn() {
      this.Search.Skip = 0
      this.listQuery = Object.assign({}, this.Search)
      this.getList()
    },
    handleAvatarSuccess(res) {
      this.starForm.StarCover = res.Value
      this.$refs.StarCover.clearValidate()
    },
    beforeUploadVideo(file) {
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
    },
    handleVideoSuccess(res, file) {
      this.videoFlag = false
      this.starForm.Video = res.Value
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = Number(file.percentage.toFixed(0))
    },
    typeChange() {

    },
    resetTemp() {
      this.starForm = {
        StarName: '',
        StarCover: '',
        Type: '',
        Video: '',
        StarSummary: '',
        AdminID: this.$store.state.user.id
      }
    },
    // 添加明星
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'add'
      this.dialogStarVisible = true
      this.$nextTick(() => {
        this.$refs['starForm'].clearValidate()
      })
    },
    addStar() {
      this.$refs['starForm'].validate((valid) => {
        if (valid) {
          starAdd(this.starForm).then((res) => {
            if (res.Result && res.Result === 1) {
              this.starForm.StarId = res.Value.StarID
              this.starForm.StarCreatetime = res.Value.Createtime
              this.starList.splice(0, 0, this.starForm)
              this.dialogStarVisible = false
              this.starForm = { AdminID: this.$store.state.user.id }
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
    handleUpdate(row) {
      this.starForm = Object.assign({}, row) // copy obj
      this.starForm.AdminID = this.$store.state.user.id
      this.dialogStatus = 'update'
      this.dialogStarVisible = true
      this.$nextTick(() => {
        this.$refs['starForm'].clearValidate()
      })
    },
    updateStar() {
      this.$refs['starForm'].validate((valid) => {
        if (valid) {
          starUpdate(this.starForm).then((res) => {
            for (const v of this.starList) {
              if (v.StarId === this.starForm.StarId) {
                const index = this.starList.indexOf(v)
                this.starList.splice(index, 1, this.starForm)
                break
              }
            }
            this.starForm
            this.dialogStarVisible = false
            this.$message({
              message: res.Message,
              type: 'success'
            })
          })
        }
      })
    },
    deleteStar(index, StarId) {
      this.starDelete = { index: index, StarId: StarId }
      this.DialogDeleteVisible.visible = true
    },
    removeStar() {
      starDelete({
        AdminID: this.Search.AdminID,
        StarId: this.starDelete.StarId
      }).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: '删除成功 !',
            type: 'success'
          })
          this.starList.splice(this.starDelete.index, 1)
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
.infoPic {
  width: 200px;
  border-radius: 3%;
}
</style>
