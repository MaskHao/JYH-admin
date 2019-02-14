<template>
  <div class="app-container">
    <el-form
      ref="ProdForm"
      :model="ProdForm"
      label-position="left"
      label-width="120px"
      style=" margin-left:50px;"
    >
      <el-form-item label="商品名称">{{ ProdForm.strGoodName }}</el-form-item>
      <el-form-item label="商品状态">{{ ProdForm.intGoodStatus | statusFilter }}</el-form-item>
      <el-form-item label="关联企业">{{ ProdForm.strMembCompName }}</el-form-item>
      <template v-if="ProdForm.showTime">
        <el-form-item label="有效时间">{{ ProdForm.dateGoodBeginTime }} - {{ ProdForm.dateGoodEndTime }}</el-form-item>
      </template>
      <template v-else>
        <el-form-item label="有效时间">未设置</el-form-item>
      </template>
      <el-form-item v-for="(item, index) in ProdForm.strGoodLabel" :label="'商品标语' + (index + 1)" :key="item.index" align="left">
        <template slot-scope="scope">
          <span>{{ item }}</span>
        </template>
      </el-form-item>
      <el-form-item label="	商品简介">{{ ProdForm.strGoodSummary }}</el-form-item>
      <el-form-item label="商品封面图" prop="strGoodCover">
        <el-upload
          :action="uploadSingle"
          :show-file-list="false"
          :disabled="!changeState"
          class="avatar-uploader"
        >
          <img v-if="ProdForm.strGoodCover" :src="IMAGE_API + ProdForm.strGoodCover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品相册" prop="strGoodAlbum">
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
      <el-form-item label="商品描述" prop="strGoodDescribe">
        <tinymce :height="300" v-model="ProdForm.strGoodDescribe" :edit-state="changeState"/>
      </el-form-item>
      <el-form-item label="商品规格">
        <el-table
          v-if="ProdForm.GoodSku && ProdForm.GoodSku.length > 0"
          :data="ProdForm.GoodSku"
          border=""
          fit
          highlight-current-row
          class="GoodSkuTable"
        >
          <el-table-column prop="Name" label="规格名" align="center"/>
          <el-table-column prop="Price" label="单价" align="center"/>
        </el-table>
      </el-form-item>
      <el-form-item label="商品价格" prop="prodPrice">{{ ProdForm.intGoodPrice }}</el-form-item>
      <el-form-item label="商品单位" prop="strGoodUnit">{{ ProdForm.strGoodUnit }}</el-form-item>
      <el-form-item label="库存量" prop="ProdMarket">{{ ProdForm.intGoodStock }}</el-form-item>
      <el-form-item label="快递费" prop="ProdMarket">{{ ProdForm.intGoodExpress }}</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelBtn">返回商品管理</el-button>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { prodInfo, prodOnOff } from '@/api/prods'
const uploadSingle = process.env.IMAGE_API + '/Picture/UploadSingle'
import { GoodStatusList, GoodTypeList } from '@/utils/typeCode'
const GoodType = GoodTypeList.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})
const GoodStatus = GoodStatusList.reduce((acc, cur) => {
  acc[cur.key] = cur.label
  return acc
}, {})
export default {
  name: 'ProdDetail',
  components: {
    Tinymce
  },
  filters: {
    statusFilter(status) {
      return GoodStatus[status]
    },
    typeFilter(type) {
      return GoodType[type]
    }
  },
  data() {
    return {
      changeState: false,
      ProductID: '',
      uploadSingle,
      IMAGE_API: process.env.IMAGE_API,
      warmingVisible: false,
      ProdForm: {
        ProdBLID: '',
        ProdTag: '',
        ProdID: '',
        ProdName: '',
        strGoodCover: '',
        strGoodAlbum: [],
        strGoodDescribe: '',
        ProdUnit: '',
        ProdPrice: 0,
        ProdMarket: 0,
        ProdPoint: 0,
        GoodSku: [],
        AdminID: this.$store.state.user.id
      },
      dialogVisible: false,
      dialogImageUrl: '',
      AlbumList: [] // 用于展示获取的数据
    }
  },
  created() {
    return new Promise((resolve, reject) => {
      prodInfo({
        GoodId: this.$route.params.GoodId
      }).then(res => {
        if (res.Result === 1) {
          this.ProdForm = res.Value
          const albumList = JSON.parse(this.ProdForm.strGoodAlbum)
          this.AlbumList = albumList.map((value, index) => {
            return {
              name: value,
              url: this.IMAGE_API + value
            }
          })
          this.ProdForm.strGoodLabel = JSON.parse(this.ProdForm.strGoodLabel)
          if (this.ProdForm.dateGoodBeginTime === '1900-01-01 00:00') {
            this.ProdForm.showTime = false
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
    this.ProdForm.AdminID = this.$store.state.user.id
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onProd() {
      prodOnOff({
        ProdID: this.ProdForm.ProdID,
        OnOff: true
      }).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: '商品已上架 !',
            type: 'success'
          })
          this.warmingVisible = false
        }
      })
    },
    cancelBtn() {
      this.$router.push('/prods/prod_list')
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
