<template>
  <div class="app-container">
    <el-form
      ref="ProdForm"
      :rules="rules"
      :model="ProdForm"
      label-position="left"
      label-width="120px"
      style=" margin-left:50px;"
    >
      <el-form-item label="商品名称" prop="GoodName">
        <el-input :rows="2" v-model="ProdForm.GoodName" placeholder="请填写商品名称" style="width:220px"/>
      </el-form-item>
      <el-form-item ref="GoodCompany" label="关联企业" prop="GoodCompany">
        <el-select
          v-model="ProdForm.GoodCompany"
          :remote-method="remoteMethod"
          :loading="selectLoading"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
        >
          <el-option
            v-for="item in optionsList"
            :key="item.strGoodCompany"
            :label="item.strMembCompName"
            :value="item.strGoodCompany"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="有效时间" prop="times">
        <el-date-picker
          v-model="datetimerange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item
        v-for="(item, index) in ProdForm.GoodLabel"
        :label="'商品标语' + (index + 1)"
        :key="item.index"
        :prop="'GoodLabel.' + index + '.label'"
        :rules="{
          required: true, message: '标语不能为空', trigger: 'blur'
        }"
      >
        <el-input v-model="item.label" class="label"/>
        <el-button v-if="index === 0" type="primary" @click.prevent="addGoodLabel">添加</el-button>
        <el-button v-else type="danger" @click.prevent="deleteBtn(index,ProdForm.GoodLabel)">删除</el-button>
      </el-form-item>
      <el-form-item label="商品简介" prop="GoodSummary">
        <el-input
          :rows="2"
          v-model="ProdForm.GoodSummary"
          placeholder="请填写商品简介"
          type="textarea"
          style="width:320px"
        />
      </el-form-item>
      <el-form-item ref="GoodCover" label="商品封面图" prop="GoodCover">
        <el-upload
          :action="uploadSingle"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          class="avatar-uploader"
        >
          <img v-if="ProdForm.GoodCover" :src="IMAGE_API + ProdForm.GoodCover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item ref="GoodAlbum" label="商品相册" prop="GoodAlbum">
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
      <el-form-item label="商品描述" prop="GoodDescribe">
        <tinymce :height="300" v-model="ProdForm.GoodDescribe"/>
      </el-form-item>
      <el-form-item label="商品规格" prop="GoodSku">
        <el-button type="primary" @click="addGoodSku">新增商品规格</el-button>
        <el-table
          v-if="ProdForm.GoodSku.length > 0"
          :data="ProdForm.GoodSku"
          border
          fit
          highlight-current-row
        >
          <el-table-column prop="Name" label="规格名" align="center" width="220px">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.Name"
                @change="(value) =>checkLength(value, scope.$index)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="Price" label="单价" align="center" width="110px">
            <template slot-scope="scope">
              <el-input v-model="scope.row.Price" type="number" min="0.01"/>
            </template>
          </el-table-column>
          <el-table-column prop="Price" label="是否为大规格商品" align="center" width="150px">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.Canbuy"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80px">
            <template slot-scope="scope">
              <el-button type="danger" @click.prevent="deleteBtn(scope.$index,ProdForm.GoodSku)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="商品价格" prop="GoodPrice">
        <el-input
          v-model="ProdForm.GoodPrice"
          class="GoodPrice"
          style="width:120px"
          type="number"
          min="0.01"
        />
      </el-form-item>
      <el-form-item label="商品单位" prop="GoodUnit">
        <el-input v-model="ProdForm.GoodUnit" style="width:60px"/>
      </el-form-item>
      <el-form-item label="库存量" prop="GoodStock">
        <el-input
          v-model="ProdForm.GoodStock"
          class="GoodStock"
          style="width:120px"
          type="number"
          min="1"
        />
      </el-form-item>
      <el-form-item label="商品快递费" prop="GoodExpress">
        <el-input
          v-model="ProdForm.GoodExpress"
          class="GoodExpress"
          style="width:120px"
          type="number"
          min="1"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <template v-if="action === 1">
        <el-button type="primary" @click="submitForm('ProdForm')">添加</el-button>
      </template>
      <el-button v-if="action === 2" type="primary" @click="UpdateBtn">确定</el-button>
      <el-button @click="cancelBtn">取消</el-button>
    </div>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import { prodAdd, prodInfo, prodUpdate, goodCompanyList } from '@/api/prods'
import { reduceProsLength, deepClone, getInteger } from '@/utils'
const uploadSingle = process.env.IMAGE_API + '/Picture/UploadSingle'
export default {
  name: 'ProdContent',
  components: {
    Tinymce
  },
  props: {
    action: {
      type: Number,
      default: null
    }
  },
  data() {
    const checkInteger = (rule, value, callback) => {
      if (String(value).indexOf('.') !== -1) {
        callback(new Error('不能为小数'))
        return getInteger(value)
      } else {
        callback()
      }
    }
    return {
      IMAGE_API: process.env.IMAGE_API,
      uploadSingle,
      dialogVisible: false,
      ProdForm: {
        GoodName: '',
        GoodLabel: [{
          ID: '',
          label: ''
        }],
        GoodCompany: '',
        GoodSummary: '',
        GoodCover: '',
        GoodAlbum: [],
        GoodDescribe: '',
        GoodPrice: null,
        GoodStock: null,
        GoodSku: [],
        GoodBeginTime: '',
        GoodEndTime: '',
        GoodUnit: '',
        GoodExpress: 0,
        AdminID: this.$store.state.user.id
      },
      dialogImageUrl: '',
      albumList: [],
      datetimerange: [],
      rules: {
        GoodName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        GoodType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        GoodSummary: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        GoodCover: [{ required: true, message: '请选择封面', trigger: 'change' }],
        GoodAlbum: [{ required: true, message: '相册不能为空', trigger: 'change' }],
        GoodDescribe: [{ required: true, message: '请输入描述', trigger: 'change' }],
        GoodSku: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        GoodPrice: [{ required: true, message: '请输入价格', trigger: 'blur' }
        ],
        GoodStock: [{ required: true, validator: checkInteger, trigger: 'blur' }],
        Price: [{ required: true, message: '价格', trigger: 'blur' }],
        Name: [{ required: true, message: '规格名', trigger: 'blur' }]
      },
      optionsList: [],
      selectLoading: false
    }
  },
  watch: {},
  created() {
    // update product
    if (this.action === 2) {
      return new Promise((resolve, reject) => {
        prodInfo({
          GoodId: this.$route.params.GoodId
        }).then(res => {
          if (res.Result === 1) {
            if (res.Value.dateGoodBeginTime === '1900-01-01 00:00') {
              this.datetimerange = []
            } else {
              this.datetimerange = [res.Value.dateGoodBeginTime, res.Value.dateGoodEndTime]
            }
            this.ProdForm = reduceProsLength(res.Value, 3)
            const albumList = JSON.parse(this.ProdForm.GoodAlbum)
            const goodLabelLlist = JSON.parse(this.ProdForm.GoodLabel)
            this.ProdForm.GoodLabel = goodLabelLlist.map((item, index, arr) => {
              return { 'label': item }
            }
            )
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
  mounted() {
    return new Promise((resolve, reject) => {
      goodCompanyList({ MembCompName: '' }).then(res => {
        if (res.Result === 1) {
          this.optionsList = res.Value
        } else {
          this.$message({
            message: res.Message,
            type: 'error'
          })
        }
      })
    })
  },
  methods: {
    // 远程商品搜索
    remoteMethod(query) {
      this.selectLoading = true
      const selectPord = query.trim()
      setTimeout(() => {
        return new Promise((resolve, reject) => {
          goodCompanyList({ MembCompName: selectPord }).then(res => {
            this.selectLoading = false
            if (res.Result === 1) {
              this.optionsList = res.Value
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
    // check prod's specification length
    checkLength(value, index) {
      if (value.length > 20) {
        this.$message({
          message: '请输入不超过20个字符',
          type: 'warning'
        })
        this.ProdForm.GoodSku[index].Name = ''
      }
    },
    addGoodLabel() {
      if (this.ProdForm.GoodLabel.length >= 2) {
        this.$message({
          message: '标语不能超过2条',
          type: 'warning'
        })
        return false
      }
      this.ProdForm.GoodLabel.push({
        ID: '',
        label: ''
      })
    },
    addGoodSku() {
      this.ProdForm.GoodSku.push({
        ID: '',
        Name: '',
        Price: 1,
        Canbuy: false
      })
    },
    deleteBtn(index, arr) {
      arr.splice(index, 1)
    },
    handleAvatarSuccess(res, file) {
      this.ProdForm.GoodCover = file.response.Value
      this.$refs.GoodCover.clearValidate()
    },
    handleGoodAlbumSuccess(res, file, fileList) {
      this.albumList = fileList
      this.ProdForm.GoodAlbum = fileList
      this.$refs.GoodAlbum.clearValidate()
    },
    handleGoodAlbumRemove(res, file, fileList) {
      this.albumList = file
      this.ProdForm.GoodAlbum = file
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
          if (this.datetimerange && this.datetimerange.length > 0) {
            this.ProdForm.GoodBeginTime = this.datetimerange[0]
            this.ProdForm.GoodEndTime = this.datetimerange[1]
          } else {
            this.ProdForm.GoodBeginTime = '1900-01-01 00:00'
            this.ProdForm.GoodEndTime = '1900-01-01 00:00'
          }
          const data = deepClone(this.ProdForm)
          data.GoodAlbum.forEach((value, i) => {
            data.GoodAlbum[i] = value.response.Value
          })
          data.GoodLabel.forEach((item, index, arr) => {
            arr[index] = item.label
          })
          prodAdd(data).then(res => {
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
    // update prod's info
    UpdateBtn() {
      if (this.datetimerange && this.datetimerange.length > 0) {
        this.ProdForm.GoodBeginTime = this.datetimerange[0]
        this.ProdForm.GoodEndTime = this.datetimerange[1]
      } else {
        this.ProdForm.GoodBeginTime = '1900-01-01 00:00'
        this.ProdForm.GoodEndTime = '1900-01-01 00:00'
      }
      this.ProdForm.AdminID = this.$store.state.user.id
      this.ProdForm.GoodAlbum = []
      this.albumList.forEach((value, i) => {
        if (value.response) {
          this.ProdForm.GoodAlbum.push(value.response.Value)
        } else {
          this.ProdForm.GoodAlbum.push(value.name)
        }
      })
      this.ProdForm.GoodLabel.forEach((item, index, arr) => {
        arr[index] = item.label
      })
      prodUpdate(this.ProdForm).then(res => {
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
