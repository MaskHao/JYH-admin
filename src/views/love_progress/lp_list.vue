<template>
  <div class="app-container">
    <el-form ref="Search" :inline="true" :model="Search" class="demo-form-inline">
      <el-form-item label="爱心项目名称:">
        <el-input v-model="Search.GoodName"/>
      </el-form-item>
      <el-form-item label="项目人员名称:">
        <el-input v-model="Search.MembNickName"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="loveList"
      element-loading-text="稍等..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="爱心项目名称" prop="GoodsName"/>
      <el-table-column align="center" label="项目负责人员" prop="MembNickName"/>
      <el-table-column align="center" label="创建时间" prop="RepoCreatetime"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" @click="deleteMember(scope.$index, scope.row.RepoId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.Take" @pagination="getList" />
    <delete-dialog :dialog-delete-visible="DialogDeleteVisible" @remove="removeMember"/>
  </div>
</template>
<script>

import { goodReporterList, reporterDelete } from '@/api/progress'
import Pagination from '@/components/Pagination'
import DeleteDialog from '@/components/DeleteDialog'
export default {
  name: 'LpList',
  components: {
    DeleteDialog,
    Pagination
  },
  data() {
    return {
      IMAGE_API: process.env.IMAGE_API,
      listQuery: {
        GoodName: '',
        MembNickName: '',
        page: 1,
        Skip: 0,
        Take: 10,
        AdminID: this.$store.state.user.id
      },
      Search: {
        GoodName: '',
        MembNickName: '',
        page: 1,
        Skip: 0,
        Take: 10,
        AdminID: this.$store.state.user.id
      },
      listLoading: false,
      loveList: [],
      total: NaN,
      DialogDeleteVisible: { visible: false }
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
      goodReporterList(this.listQuery).then(res => {
        if (res.Result === 1) {
          this.listLoading = false
          this.loveList = res.Value
          this.total = res.Total
        }
      })
    },
    searchBtn() {
      this.Search.Skip = 0
      this.listQuery = Object.assign({}, this.Search)
      this.getList()
    },
    deleteMember(index, RepoId) {
      this.memberDelete = { index: index, RepoId: RepoId }
      this.DialogDeleteVisible.visible = true
    },
    removeMember() {
      reporterDelete({
        AdminID: this.Search.AdminID,
        RepoId: this.memberDelete.RepoId
      }).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: '删除成功 !',
            type: 'success'
          })
          this.loveList.splice(this.memberDelete.index, 1)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
</style>
