<template>
  <div class="app-container">
    <el-form ref="progressSearch" :inline="true" :model="progressSearch" class="demo-form-inline">
      <el-form-item label="爱心项目名称">
        <el-input v-model="progressSearch.GoodsName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="progressList"
      element-loading-text="稍等..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="爱心项目名称" prop="strGoodsName">
        <template slot-scope="scope">
          <span class="link-type" @click="checkInfo(scope.row, 'info')">{{ scope.row.strGoodsName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布单位" prop="strProgPublisher"/>
      <el-table-column align="center" label="上报的会员" prop="strProgMemberName"/>
      <el-table-column align="center" label="创建时间" prop="dateProgCreatetime"/>
      <el-table-column align="center" label="审核时间" prop="dateProgCheckTime">
        <template slot-scope="scope">
          {{ scope.row.dateProgCheckTime | timeFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.intProgStatus === 0" type="primary" @click="checkInfo(scope.row, 'check' )">审核</el-button>
          <el-button v-else-if="scope.row.intProgStatus === 1" type="primary" disabled>已通过</el-button>
          <el-button v-else-if="scope.row.intProgStatus === -1" type="danger" disabled>未通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.Take" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogInfoVisible">
      <el-form
        ref="infoForm"
        :data="infoForm"
        label-position="left"
        label-width="120px"
        style=" margin-left:50px;"
      >
        <el-form-item label="爱心项目名称：">{{ infoForm.strGoodsName }}</el-form-item>
        <el-form-item label="发布单位：">{{ infoForm.strProgPublisher }}</el-form-item>
        <el-form-item label="上报会员：">{{ infoForm.strProgMemberName }}</el-form-item>
        <el-form-item label="爱心进展标题：">{{ infoForm.strProgTitle }}</el-form-item>
        <el-form-item label="爱心进展简介：">{{ infoForm.strProgSummary }}</el-form-item>
        <el-form-item label="爱心进展描述：">{{ infoForm.strProgDescribe }}</el-form-item>
        <el-form-item label="爱心进展相册：">
          <img v-for="(item, index) in infoForm.strProgAlbum" :key="index" :src="IMAGE_API + item" class="infoPic" alt="">
        </el-form-item>
        <el-form-item label="爱心进展视频：">
          <video v-if=" infoForm.strVideo" :src="IMAGE_API + infoForm.strVideo" controls="controls" class="infoVideo"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template v-if="dialogStatus==='check'">
          <el-button type="primary" @click="checkProgress(infoForm.strProgId , true)">通过</el-button>
          <el-button type="danger" @click="checkProgress(infoForm.strProgId , false)">驳回</el-button>
        </template>
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { progressInfoList, progressCheck } from '@/api/progress'
import Pagination from '@/components/Pagination'

export default {
  name: 'LpList',
  components: {
    Pagination
  },
  filters: {
    timeFilter(time) {
      if (time === '1900-01-01 00:00') {
        return '———'
      } else {
        return time
      }
    }
  },
  data() {
    return {
      IMAGE_API: process.env.IMAGE_API,
      listQuery: {
        GoodsName: '',
        page: 1,
        Skip: 0,
        Take: 10,
        AdminID: this.$store.state.user.id
      },
      progressSearch: {
        GoodsName: '',
        page: 1,
        Skip: 0,
        Take: 10,
        AdminID: this.$store.state.user.id
      },
      listLoading: false,
      progressList: [],
      total: NaN,
      dialogStatus: '',
      textMap: {
        info: '详情',
        check: '审核'
      },
      dialogInfoVisible: false,
      infoForm: {}
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
      progressInfoList(this.listQuery).then(res => {
        if (res.Result === 1) {
          this.listLoading = false
          this.progressList = res.Value
          this.progressList.forEach((item, index) => {
            item.strProgAlbum = JSON.parse(item.strProgAlbum)
          })
          this.total = res.Total
        }
      })
    },
    searchBtn() {
      this.progressSearch.Skip = 0
      this.listQuery = Object.assign({}, this.progressSearch)
      this.getList()
    },
    checkInfo(info, statusName) {
      this.dialogStatus = statusName
      this.infoForm = Object.assign({}, info)
      this.dialogInfoVisible = true
    },
    checkProgress(id, isCheck) {
      const checked = {
        AdminID: this.$store.state.user.id,
        ProgId: id,
        Check: isCheck
      }
      return new Promise((resolve, reject) => {
        progressCheck(checked).then(res => {
          if (res.Result && res.Result === 1) {
            this.$message({
              message: res.Message,
              type: 'success'
            })
            this.progressList.forEach((item) => {
              if (item.strProgId === this.infoForm.strProgId) {
                item.intProgStatus = isCheck ? 1 : -1
                item.dateProgCheckTime = res.Value
              }
            })
            this.dialogInfoVisible = false
          } else {
            this.$message({
              message: res.Message,
              type: 'error'
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.prodPic {
  max-height: 100px;
}
.handle-btn {
  padding: 3px 5px;
}
.headUrl {
  width: 45px !important;
  height: 45px !important;
  border-radius: 50%;
}
.infoPic{
  width: 200px;
  border-radius: 3%
}
.infoVideo{
  width: 400px;
}
</style>
