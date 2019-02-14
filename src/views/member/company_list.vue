<template>
  <div class="app-container">
    <el-form ref="companySearch" :inline="true" :model="companySearch" class="demo-form-inline">
      <el-form-item label="企业名称">
        <el-input v-model="companySearch.MembCompName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="companyList"
      element-loading-text="稍等..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="企业名称" prop="strMembCompName">
        <template slot-scope="scope">
          <span class="link-type" @click="companyInfo(scope.row)">{{ scope.row.strMembCompName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业LOGO">
        <template slot-scope="scope">
          <img
            :src="IMAGE_API + scope.row.strMembCompLogo"
            class="headUrl"
            style="display:inline-block"
            alt
          >
        </template>
      </el-table-column>
      <el-table-column align="center" label="企业视频简介" width="320">
        <template slot-scope="scope">
          <video
            v-if="scope.row.strVideo"
            :src="IMAGE_API + scope.row.strVideo"
            class="video"
            controls="controls"
          />
          <span v-else>———</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="负责人姓名" prop="strMembCompCharge">
        <template
          slot-scope="scope"
        >{{ scope.row.strMembCompCharge?scope.row.strMembCompCharge: '———' }}</template>
      </el-table-column>
      <el-table-column align="center" label="负责人电话" prop="strMembCompChaPhone">
        <template
          slot-scope="scope"
        >{{ scope.row.strMembCompChaPhone? scope.row.strMembCompChaPhone: '———' }}</template>
      </el-table-column>
      <el-table-column align="center" label="联系人姓名" prop="strMembCompContact"/>
      <el-table-column align="center" label="联系人电话" prop="strMembCompConPhone"/>>
      <el-table-column align="center" label="修改">
        <template slot-scope="scope">
          <el-button type="primary" @click="showDialog(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.Take" @pagination="getList" />
    <el-dialog :visible.sync="dialogFormVisible" title="修改企业信息" width="1100px">
      <el-form
        v-if="dialogFormVisible"
        ref="companyMessage"
        :model="companyMessage"
        :rules="companyMessageRule"
        label-width="150px"
      >
        <el-form-item label="企业名称">{{ companyMessage.MembCompName }}</el-form-item>
        <el-form-item ref="MembCompLogo" label="企业logo" prop="MembCompLogo">
          <el-upload
            :action="uploadSingle"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            class="avatar-uploader"
          >
            <img
              v-if="companyMessage.MembCompLogo"
              :src="IMAGE_API + companyMessage.MembCompLogo"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item ref="video" label="企业视频" prop="video">
          <el-upload
            :show-file-list="false"
            :on-success="handleVideoSuccess"
            :before-upload="beforeUploadVideo"
            :on-progress="uploadVideoProcess"
            :action="UploadVideo"
            class="avatar-uploader el-upload--text"
          >
            <video
              v-if="companyMessage.Video !='' && videoFlag == false"
              :src="IMAGE_API + companyMessage.Video"
              class="video"
            >您的浏览器不支持视频播放</video>
            <i
              v-else-if="companyMessage.Video =='' && videoFlag == false"
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
        <el-form-item ref="MembCompLicense" label="营业执照" prop="MembCompLicense">
          <el-upload
            ref="license"
            :action="uploadSingle"
            :file-list="companyMessage.MembCompLicense"
            :on-success="handleLicenseSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="(val) =>handleRemove(companyMessage.MembCompLicense, val)"
            multiple
            list-type="picture-card"
            class="avatar-uploader"
          >
            <i class="el-icon-plus"/>
          </el-upload>
          <el-dialog :visible.sync="dialogPreviewVisible">
            <img :src="dialogPreviewImageUrl" width="100%" alt>
          </el-dialog>
        </el-form-item>
        <el-form-item ref="MembCompCertifi" label="企业证书" prop="MembCompCertifi">
          <el-upload
            ref="certifi"
            :action="uploadSingle"
            :file-list="companyMessage.MembCompCertifi"
            :on-success="handleCertifiSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="(val) =>handleRemove(companyMessage.MembCompCertifi, val)"
            multiple
            list-type="picture-card"
            class="avatar-uploader"
          >
            <i class="el-icon-plus"/>
          </el-upload>
          <el-dialog :visible.sync="dialogPreviewVisible">
            <img :src="dialogPreviewImageUrl" width="100%" alt>
          </el-dialog>
        </el-form-item>
        <el-form-item label="企业描述" prop="MembCompDesc">
          <tinymce :height="300" v-model="companyMessage.MembCompDesc" :edit-state="true"/>
        </el-form-item>
        <el-form-item label="成立日期" prop="MembCompSetUpDate">
          <el-date-picker
            v-model="datePicker"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            @input="changeDate(datePicker)"
          />
        </el-form-item>
        <el-form-item label="企业联系电话(座机)" prop="MembCompTel">
          <el-input
            v-model="companyMessage.MembCompTel"
            placeholder="企业联系电话(座机)"
            style="width:220px"
          />
        </el-form-item>
        <el-form-item label="企业地址" prop="MembCompAddress">
          <el-input
            v-model="companyMessage.MembCompAddress"
            placeholder="企业地址"
            style="width:220px"
          />
        </el-form-item>
        <el-form-item label="规模" prop="MembCompScale">
          <el-select v-model="companyMessage.MembCompScale" style="width:220px">
            <el-option
              v-for="item in CompanyScaleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="企业官网地址" prop="MembCompUrl">
          <el-input v-model="companyMessage.MembCompUrl" placeholder="企业官网地址" style="width:220px"/>
        </el-form-item>
        <el-form-item label="企业微信公众号" prop="MembCompWechat">
          <el-input
            v-model="companyMessage.MembCompWechat"
            placeholder="企业微信公众号"
            style="width:220px"
          />
        </el-form-item>
        <el-form-item label="企业联系人姓名" prop="MembCompContact">
          <el-input
            v-model="companyMessage.MembCompContact"
            placeholder="企业联系人姓名"
            style="width:220px"
          />
        </el-form-item>
        <el-form-item label="企业联系人电话" prop="MembCompConPhone">
          <el-input
            v-model="companyMessage.MembCompConPhone"
            placeholder="企业联系人电话"
            style="width:220px"
          />
        </el-form-item>
        <el-form-item label="企业负责人姓名" prop="MembCompCharge">
          <el-input
            v-model="companyMessage.MembCompCharge"
            placeholder="企业负责人姓名"
            style="width:220px"
          />
        </el-form-item>
        <el-form-item label="企业负责人电话" prop="MembCompChaPhone">
          <el-input
            v-model="companyMessage.MembCompChaPhone"
            placeholder="企业负责人电话"
            style="width:220px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCompany">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogInfoVisible" title="企业详情" width="1100px">
      <el-form :model="companyMessage" label-width="150px">
        <el-form-item label="企业名称:">{{ companyMessage.MembCompName }}</el-form-item>
        <el-form-item ref="MembCompLogo" label="企业logo:">
          <img
            v-if="companyMessage.MembCompLogo"
            :src="IMAGE_API + companyMessage.MembCompLogo"
            class="avatar"
          >
        </el-form-item>
        <el-form-item label="企业视频:">
          <video
            v-if="companyMessage.Video !=''"
            :src="IMAGE_API + companyMessage.Video"
            class="video"
            controls="controls"
          >您的浏览器不支持视频播放</video>
        </el-form-item>
        <el-form-item ref="MembCompLicense" label="营业执照:">
          <template v-if="companyMessage.MembCompLicense">
            <img
              v-for="(item, index) in companyMessage.MembCompLicense"
              :key="index"
              :src="item.url"
              class="card"
            >
          </template>
        </el-form-item>
        <el-form-item ref="MembCompCertifi" label="企业证书:">
          <template v-if="companyMessage.MembCompCertifi">
            <img
              v-for="(item, index) in companyMessage.MembCompCertifi"
              :key="index"
              :src="item.url"
              class="card"
            >
          </template>
        </el-form-item>
        <el-form-item label="企业描述" prop="MembCompDesc">
          <tinymce :height="300" v-model="companyMessage.MembCompDesc" :edit-state="false"/>
        </el-form-item>
        <el-form-item
          label="企业成立日期:"
          prop="MembCompSetUpDate"
        >{{ companyMessage.MembCompSetUpDate }}</el-form-item>
        <el-form-item label="企业联系电话(座机):" prop="MembCompTel">{{ companyMessage.MembCompTel }}</el-form-item>
        <el-form-item label="企业地址:" prop="MembCompAddress">{{ companyMessage.MembCompAddress }}</el-form-item>
        <el-form-item
          label="企业规模:"
          prop="MembCompScale"
        >{{ companyMessage.MembCompScale | scaleFilter }}</el-form-item>
        <el-form-item label="企业官网地址:" prop="MembCompUrl">{{ companyMessage.MembCompUrl }}</el-form-item>
        <el-form-item label="企业微信公众号:" prop="MembCompWechat">{{ companyMessage.MembCompWechat }}</el-form-item>
        <el-form-item label="企业联系人姓名:" prop="MembCompContact">{{ companyMessage.MembCompContact }}</el-form-item>
        <el-form-item label="企业联系人电话:" prop="MembCompConPhone">{{ companyMessage.MembCompConPhone }}</el-form-item>
        <el-form-item label="企业负责人姓名:" prop="MembCompCharge">{{ companyMessage.MembCompCharge }}</el-form-item>
        <el-form-item label="企业负责人电话:" prop="MembCompChaPhone">{{ companyMessage.MembCompChaPhone }}</el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { companyList, memberUpdate } from '@/api/member'
import { reduceProsLength, addProsLength, deepClone } from '@/utils'
import { CompanyScaleList } from '@/utils/typeCode'
import Tinymce from '@/components/Tinymce'
import Pagination from '@/components/Pagination'
const scaleList = CompanyScaleList.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})
export default {
  name: 'ProdList',
  components: {
    Tinymce,
    Pagination
  },
  filters: {
    scaleFilter(scale) {
      return scaleList[scale]
    }
  },
  data() {
    return {
      datePicker: '',
      IMAGE_API: process.env.IMAGE_API,
      uploadSingle: process.env.IMAGE_API + '/Picture/UploadSingle',
      UploadVideo: process.env.IMAGE_API + '/Picture/UploadVideo',
      CompanyScaleList,
      listQuery: {
        MembCompName: '',
        page: 1,
        Skip: 0,
        Take: 10,
        AdminID: this.$store.state.user.id
      },
      companySearch: {
        MembCompName: '',
        page: 1,
        Skip: 0,
        Take: 10,
        AdminID: this.$store.state.user.id
      },
      listLoading: false,
      companyList: [],
      total: NaN,
      dialogFormVisible: false,
      dialogInfoVisible: false,
      videoFlag: false,
      videoUploadPercent: 0,
      companyMessage: {},
      companyMessageRule: {
        MembCompLicense: [{ required: true, message: '企业营业执照', trigger: 'change' }],
        MembCompContact: [{ required: true, message: '请输入企业联系人姓名', trigger: 'blur' }],
        MembCompConPhone: [{ required: true, message: '请输入企业联系人电话', trigger: 'blur' }]
      },
      dialogPreviewImageUrl: '',
      dialogPreviewVisible: false
    }
  },

  created() {
    this.getList()
  },
  methods: {
    changeDate(val) {
      this.datePicker = val
      this.$nextTick(() => {
        this.companyMessage.MembCompSetUpDate = val
      })
    },
    handlePictureCardPreview(file) {
      this.dialogPreviewImageUrl = file.url
      this.dialogPreviewVisible = true
    },
    beforeUploadVideo(file) {
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
    },

    handleVideoSuccess(res, file) {
      this.videoFlag = false
      this.companyMessage.Video = res.Value
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = Number(file.percentage.toFixed(0))
    },

    getList({ page, limit } = {}) {
      if (page && limit) {
        this.listQuery.Take = limit
        this.listQuery.Skip = (--page) * limit
      }
      this.listLoading = true
      companyList(this.listQuery).then(res => {
        if (res.Result === 1) {
          this.listLoading = false
          this.companyList = res.Value
          this.total = res.Total
        }
      })
    },
    searchBtn() {
      this.companySearch.Skip = 0
      this.listQuery = Object.assign({}, this.companySearch)
      this.getList()
    },
    getalbumList(data) {
      if (data === '') {
        return []
      } else {
        const albumList = JSON.parse(data)
        const list = albumList.map((value, index) => {
          return {
            name: value,
            url: this.IMAGE_API + value
          }
        })
        return list
      }
    },
    resetcompanyMessage() {
      this.companyMessage = {
        strMembId: NaN,
        strMembCompName: '',
        strMembCompLicense: '',
        strMembCompCharge: '',
        strMembCompChaPhone: '',
        strMembCompContact: '',
        strMembCompConPhone: '',
        strMembCompLogo: '',
        strMembCompDesc: '',
        dateMembCompSetUpDate: '',
        strMembCompTel: '',
        strMembCompAddress: '',
        intMembCompScale: '',
        strMembCompUrl: '',
        strMembCompWechat: '',
        strMembCompCertifi: ''
      }
    },
    showDialog(data) {
      this.resetcompanyMessage()
      this.companyMessage = reduceProsLength(deepClone(data), 3)
      this.companyMessage.MembCompLicense = this.getalbumList(this.companyMessage.MembCompLicense)
      this.companyMessage.MembCompCertifi = this.getalbumList(this.companyMessage.MembCompCertifi)
      const time = data.dateMembCompSetUpDate
      this.companyMessage.MembCompSetUpDate = time
      this.datePicker = time === '1900-01-01' ? '' : time
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['companyMessage'].clearValidate()
      })
    },

    companyInfo(data) {
      this.resetcompanyMessage()
      this.companyMessage = reduceProsLength(deepClone(data), 3)
      this.companyMessage.MembCompLicense = this.getalbumList(this.companyMessage.MembCompLicense)
      this.companyMessage.MembCompCertifi = this.getalbumList(this.companyMessage.MembCompCertifi)
      const time = data.dateMembCompSetUpDate
      this.companyMessage.MembCompSetUpDate = time === '1900-01-01' ? '' : time
      this.dialogInfoVisible = true
    },
    handleAvatarSuccess(res, file) {
      this.companyMessage.MembCompLogo = file.response.Value
    },
    handleLicenseSuccess(res, file, fileList) {
      this.companyMessage.MembCompLicense = fileList
      this.$refs.MembCompLicense.clearValidate()
    },
    handleCertifiSuccess(res, file, fileList) {
      this.companyMessage.MembCompCertifi = fileList
    },
    handleRemove(list, file) {
      list.splice(list.findIndex(v => v.uid === file.uid), 1)
    },
    updateCompany() {
      this.$refs['companyMessage'].validate((valid) => {
        if (valid) {
          const data = deepClone(this.companyMessage)
          data.MembCompLicense = []
          data.MembCompCertifi = []
          this.companyMessage.MembCompLicense.forEach((value, i) => {
            if (value.response) {
              data.MembCompLicense.push(value.response.Value)
            } else {
              data.MembCompLicense.push(value.name)
            }
          })
          this.companyMessage.MembCompCertifi.forEach((value, i) => {
            if (value.response) {
              data.MembCompCertifi.push(value.response.Value)
            } else {
              data.MembCompCertifi.push(value.name)
            }
          })
          const message = addProsLength(data, 'str')
          data.MembCompSetUpDate = this.companyMessage.MembCompSetUpDate
          message.dateMembCompSetUpDate = this.companyMessage.MembCompSetUpDate
          message.intMembCompScale = this.companyMessage.MembCompScale
          message.strMembCompLicense = JSON.stringify(message.strMembCompLicense)
          message.strMembCompCertifi = JSON.stringify(message.strMembCompCertifi)
          return new Promise((resolve, reject) => {
            memberUpdate(data).then(res => {
              if (res.Result && res.Result === 1) {
                this.$message({
                  message: res.Message,
                  type: 'success'
                })
                this.companyList.forEach((item, index) => {
                  if (item.strMembId === this.companyMessage.MembId) {
                    this.companyList.splice(index, 1, message)
                  }
                })
                this.dialogFormVisible = false
              } else {
                this.$message({
                  message: res.Message,
                  type: 'error'
                })
              }
            })
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
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
  display: block;
}
.card {
  width: 178px;
  display: inline-block;
  border-radius: 4px;
  margin-right: 5px;
}
.headUrl {
  width: 75px !important;
}
.video {
  width: 320px;
}
</style>
