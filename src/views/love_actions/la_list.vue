<template>
  <div class="app-container">
    <el-button type="primary" @click="addAction">添加</el-button>
    <el-form ref="actionSearch" :inline="true" :model="actionSearch" class="demo-form-inline">
      <el-form-item label="活动名称">
        <el-input v-model="actionSearch.GoodName"/>
      </el-form-item>
      <el-form-item label="活动状态">
        <el-select v-model="actionSearch.GoodStatus" style="width:100px">
          <el-option
            v-for="(item, index) in GoodStatusList"
            :key="index"
            :value="item.key"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建开始时间">
        <el-date-picker
          v-model="actionSearch.GooddatBegin"
          type="datetime"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="创建结束时间">
        <el-date-picker
          v-model="actionSearch.GooddatEnd"
          type="datetime"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="actionsList"
      element-loading-text="稍等..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="活动名称" prop="GoodName">
        <template slot-scope="scope">
          <span class="link-type" @click="actionInfo(scope.row.GoodId)">{{ scope.row.GoodName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动封面图">
        <template slot-scope="scope">
          <img :src="IMAGE_API + scope.row.GoodCover" style="width:100px;display:inline-block" alt>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="GoodStatus">
        <template slot-scope="scope">{{ scope.row.GoodStatus | statusFilter }}</template>
      </el-table-column>
      <el-table-column align="center" label="有效时间段">
        <template slot-scope="scope">{{ scope.row.GoodBeginTime }} - {{ scope.row.GoodEndTime }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="GoodUpdatetime"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <!-- 已下架 => 上架 -->
          <el-button
            v-if="scope.row.GoodStatus === 1 ||scope.row.GoodStatus === -2"
            class="handle-btn"
            type="primary"
            size="medium"
            @click.stop="onaction(scope.row, scope.row.GoodId)"
          >上架</el-button>
          <!-- 已上架 -->
          <el-button
            v-if="scope.row.GoodStatus === 3"
            class="handle-btn"
            type="warning"
            size="medium"
            @click.stop="offaction(scope.row, scope.row.GoodId)"
          >下架</el-button>
          <el-button
            class="handle-btn"
            size="medium"
            @click.native.stop="updateAction(scope.row.GoodId)"
          >修改</el-button>
          <el-tooltip class="item" effect="dark" content="迁移到活动参与中" placement="top-end">
            <el-button
              class="handle-btn"
              type="primary"
              size="medium"
              @click="transfer(scope.$index, scope.row.GoodId)"
            >迁移</el-button>
          </el-tooltip>
          <!-- 删除活动 -->
          <el-button
            class="handle-btn"
            type="danger"
            size="medium"
            @click.native.stop="deleteaction(scope.$index, scope.row.GoodId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.GoodTake" @pagination="getList" />
    <delete-dialog :dialog-delete-visible="DialogDeleteVisible" @remove="removePrd"/>
    <transfer-dialog :dialog-transfer-visible="DialogTransferVisible" @transfer="tranferEnter"/>
  </div>
</template>
<script>
import { lovePage, loveDelete, loveConvertToUpcoming } from '@/api/action'
import { prodOnOff } from '@/api/prods'
import { parseTime } from '@/utils/index'
import { GoodStatusList } from '@/utils/typeCode'
import DeleteDialog from '@/components/DeleteDialog'
import TransferDialog from '@/components/TransferDialog'
import Pagination from '@/components/Pagination'
const GoodStatus = GoodStatusList.reduce((acc, cur) => {
  acc[cur.key] = cur.label
  return acc
}, {})
export default {
  name: 'LaList',
  filters: {
    statusFilter(status) {
      return GoodStatus[status]
    }
  },
  components: {
    DeleteDialog,
    TransferDialog,
    Pagination
  },
  data() {
    return {
      GoodStatusList,
      listQuery: {
        GoodName: '',
        GoodStatus: 99,
        GooddatBegin: '1970-01-01',
        GooddatEnd: '1900-01-01',
        GoodSkip: 0,
        GoodTake: 10,
        page: 1
      },
      actionSearch: {
        GoodName: '',
        GoodStatus: 99,
        GooddatBegin: null,
        GooddatEnd: null,
        GoodSkip: 0,
        GoodTake: 10,
        page: 1
      },
      listLoading: false,
      actionsList: [],
      total: NaN,
      IMAGE_API: process.env.IMAGE_API, // 接口返回图片需域名拼接
      DialogDeleteVisible: { visible: false },
      GoodDelete: {},
      DialogTransferVisible: { visible: false },
      GoodTransfer: {}
    }
  },

  created() {
    this.getList()
  },
  methods: {
    getList({ page, limit } = {}) {
      if (page && limit) {
        this.listQuery.GoodTake = limit
        this.listQuery.GoodSkip = (--page) * limit
      }
      this.listLoading = true
      lovePage(this.listQuery).then(res => {
        if (res.Result === 1) {
          this.listLoading = false
          this.actionsList = res.Value
          this.total = res.Total
        }
      })
    },
    searchBtn() {
      this.actionSearch.GoodSkip = 0
      this.listQuery = Object.assign({}, this.actionSearch)
      if (!this.listQuery.GoodMinPrice) {
        this.listQuery.GoodMinPrice = 0
      }
      if (!this.listQuery.GoodMaxPrice) {
        this.listQuery.GoodMaxPrice = 0
      }
      if (!this.listQuery.GooddatBegin) {
        this.listQuery.GooddatBegin = '1970-01-01'
      }
      if (!this.listQuery.GooddatEnd) {
        this.listQuery.GooddatEnd = parseTime(Date.now())
      }
      this.getList()
    },

    // 添加活动
    addAction() {
      this.$router.push({
        path: 'la_add'
      })
    },

    // 活动详情
    actionInfo(GoodId) {
      this.$router.push('/love_actions/la_detail/' + GoodId)
    },
    // 上架
    onaction(row, GoodId) {
      prodOnOff({
        GoodID: GoodId,
        OnOff: true
      }).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: '活动已上架 !',
            type: 'success'
          })
          row.GoodStatus = 3
        }
      })
    },

    // 下架
    offaction(row, GoodId) {
      prodOnOff({
        GoodID: GoodId,
        OnOff: false
      }).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: '活动已下架 !',
            type: 'success'
          })
          row.GoodStatus = -2
        }
      })
    },

    // 修改活动
    updateAction(GoodId) {
      this.$router.push('/love_actions/la_update/' + GoodId)
    },

    // 删除活动
    deleteaction(index, actionID) {
      this.GoodDelete = { index: index, GoodId: actionID }
      this.DialogDeleteVisible.visible = true
    },
    removePrd() {
      loveDelete({
        GoodId: this.GoodDelete.GoodId
      }).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: '删除成功 !',
            type: 'success'
          })
          this.actionsList.splice(this.GoodDelete.index, 1)
        }
      })
    },
    // 迁移活动
    transfer(index, actionID) {
      this.GoodTransfer = { index: index, GoodId: actionID }
      this.DialogTransferVisible.visible = true
    },
    tranferEnter() {
      loveConvertToUpcoming({
        GoodID: this.GoodTransfer.GoodId,
        AdminID: this.$store.state.user.id
      }).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: '迁移成功 !',
            type: 'success'
          })
          this.actionsList.splice(this.GoodTransfer.index, 1)
        }
      })
    }
  }
}
</script>
<style lang="scss" >
.actionPic {
  max-height: 100px;
}
.handle-btn {
  padding: 3px 5px;
}
</style>
