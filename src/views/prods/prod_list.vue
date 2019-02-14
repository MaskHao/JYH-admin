<template>
  <div class="app-container">
    <el-button type="primary" @click="addProd">添加</el-button>
    <el-form ref="prodSearch" :inline="true" :model="prodSearch" class="demo-form-inline">
      <el-form-item label="商品名称">
        <el-input v-model="prodSearch.GoodName"/>
      </el-form-item>
      <el-form-item label="最小售价">
        <el-input v-model="prodSearch.GoodMinPrice" type="number" style="width:100px"/>
      </el-form-item>
      <el-form-item label="最大售价">
        <el-input v-model="prodSearch.GoodMaxPrice" type="number" style="width:100px"/>
      </el-form-item>
      <el-form-item label="商品状态">
        <el-select v-model="prodSearch.GoodStatus" style="width:100px">
          <el-option
            v-for="(item, index) in GoodStatusList"
            :key="index"
            :value="item.key"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="prodSearch.GooddatBegin" type="datetime"/>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="prodSearch.GooddatEnd" type="datetime"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="prodsList"
      element-loading-text="稍等..."
      border=""
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="商品名称" prop="strGoodName">
        <template slot-scope="scope">
          <span class="link-type" @click="prodInfo(scope.row.strGoodId)">{{ scope.row.strGoodName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品标语" prop="strGoodLabel">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.strGoodLabel" :key="index">
            <p>{{ item }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品封面图">
        <template slot-scope="scope">
          <img
            :src="IMAGE_API + scope.row.strGoodCover"
            style="width:100px;display:inline-block"
            alt=""
          >
        </template>
      </el-table-column>
      <el-table-column align="center" label="售价" prop="intGoodPrice"/>
      <!-- <el-table-column align="center" label="积分价" prop="intGoodPointPrice"/> -->
      <el-table-column align="center" label="状态" prop="intGoodStatus">
        <template slot-scope="scope">{{ scope.row.intGoodStatus | statusFilter }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="dateGoodUpdatetime"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <!-- 已审核或已下架 => 上架 -->
          <el-button
            v-if="scope.row.intGoodStatus === 1 ||scope.row.intGoodStatus === -2"
            class="handle-btn"
            type="primary"
            size="medium"
            @click.stop="onProd(scope.row, scope.row.strGoodId)"
          >上架</el-button>
          <!-- 已上架 -->
          <el-button
            v-if="scope.row.intGoodStatus === 3"
            class="handle-btn"
            type="warning"
            size="medium"
            @click.stop="offProd(scope.row, scope.row.strGoodId)"
          >下架</el-button>

          <!-- 已推荐 -->
          <!-- <el-tag v-if="scope.row.boolGoodRecommend" type="success" @click.native.stop>已推荐</el-tag> -->
          <!-- 已上架商品未推荐才可以推荐该商品 -->
          <!-- <el-button
            v-if="scope.row.intGoodStatus== 3 && !scope.row.boolGoodRecommend"
            class="handle-btn"
            type="success"
            size="medium"
            @click.stop="AddRecommendDialog(scope.row, scope.row.strGoodId)"
          >推荐</el-button> -->

          <!-- 删除商品 -->
          <el-button
            class="handle-btn"
            type="danger"
            size="medium"
            @click.native.stop="deleteProd(scope.$index, scope.row.strGoodId)"
          >删除</el-button>
          <el-button
            class="handle-btn"
            size="medium"
            @click.native.stop="updateProd(scope.row.strGoodId)"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.GoodTake" @pagination="getList" />
    <el-dialog :visible.sync="DialogRDVisibale" title="推荐确认">
      <el-form ref="dataForm" :model="RecommendAddItem" :rules="rules" label-position="left">
        <el-form-item label-width="220px" label="推荐原因" prop="RecoReason">
          <el-input
            v-model="RecommendAddItem.RecoReason"
            autocomplete="off"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="DialogRDVisibale = false">取 消</el-button>
        <el-button type="primary" @click="AddRecommend">确 定</el-button>
      </div>
    </el-dialog>
    <delete-dialog :dialog-delete-visible="DialogDeleteVisible" @remove="removePrd"/>
  </div>
</template>
<script>
import { prodPage, prodDel, prodOnOff } from '@/api/prods'
import { addRecommend } from '@/api/recommend'
import { parseTime } from '@/utils/index'
import { GoodStatusList } from '@/utils/typeCode'
import DeleteDialog from '@/components/DeleteDialog'
import Pagination from '@/components/Pagination'
const GoodStatus = GoodStatusList.reduce((acc, cur) => {
  acc[cur.key] = cur.label
  return acc
}, {})
export default {
  name: 'ProdList',
  filters: {
    statusFilter(status) {
      return GoodStatus[status]
    }
  },
  components: {
    DeleteDialog,
    Pagination
  },
  data() {
    return {
      listQuery: {
        GoodName: '',
        GoodMinPrice: 0,
        GoodMaxPrice: 0,
        GoodStatus: 99,
        GooddatBegin: '1970-01-01',
        GooddatEnd: '1900-01-01',
        page: 1,
        GoodSkip: 0,
        GoodTake: 10
      },
      prodSearch: {
        GoodName: '',
        GoodMinPrice: null,
        GoodMaxPrice: null,
        GoodStatus: 99,
        GooddatBegin: null,
        GooddatEnd: null,
        page: 1,
        GoodSkip: 0,
        GoodTake: 10
      },
      listLoading: false,
      prodsList: [],
      total: NaN,
      GoodStatusList,
      IMAGE_API: process.env.IMAGE_API, // 接口返回图片需域名拼接
      DialogRDVisibale: false,
      RecommendAddItem: {
        GoodID: null,
        AdminID: this.$store.state.user.id,
        RecoReason: ''
      },
      rules: {
        RecoReason: [{ required: true, message: '请输入推荐理由', trigger: 'change' }]
      },
      DialogDeleteVisible: { visible: false },
      GoodDelete: {}
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
      prodPage(this.listQuery).then(res => {
        if (res.Result === 1) {
          this.listLoading = false
          this.prodsList = res.Value
          this.prodsList.forEach((item, index) => {
            item.strGoodLabel = JSON.parse(item.strGoodLabel)
          })
          this.total = res.Total
        }
      })
    },
    searchBtn() {
      this.prodSearch.GoodSkip = 0
      this.listQuery = Object.assign({}, this.prodSearch)
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

    // 添加商品
    addProd() {
      this.$router.push({
        path: 'prod_add'
      })
    },

    // 商品详情
    prodInfo(strGoodId) {
      this.$router.push('/prods/prod_detail/' + strGoodId)
    },
    // 上架
    onProd(row, strGoodId) {
      prodOnOff({
        GoodID: strGoodId,
        OnOff: true
      }).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: '商品已上架 !',
            type: 'success'
          })
          row.intGoodStatus = 3
        }
      })
    },

    // 下架
    offProd(row, strGoodId) {
      prodOnOff({
        GoodID: strGoodId,
        OnOff: false
      }).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: '商品已下架 !',
            type: 'success'
          })
          row.intGoodStatus = -2
        }
      })
    },

    // 修改商品
    updateProd(GoodId) {
      this.$router.push('/prods/prod_update/' + GoodId)
    },

    // 删除商品
    deleteProd(index, prodID) {
      this.GoodDelete = { index: index, GoodId: prodID }
      this.DialogDeleteVisible.visible = true
    },
    removePrd() {
      prodDel({
        GoodId: this.GoodDelete.GoodId
      }).then(res => {
        if (res.Result === 1) {
          this.$message({
            message: '删除成功 !',
            type: 'success'
          })
          this.prodsList.splice(this.GoodDelete.index, 1)
        }
      })
    },

    // 推荐商品弹框展开
    AddRecommendDialog(row, strGoodId) {
      this.RecommendAddItem = Object.assign({}, row)
      this.DialogRDVisibale = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 推荐商品
    AddRecommend() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const temp = {
            GoodID: this.RecommendAddItem.strGoodId,
            AdminID: this.$store.state.user.id,
            RecoReason: this.RecommendAddItem.RecoReason
          }
          addRecommend(temp).then(res => {
            if (res.Result === 1) {
              this.$message({
                message: '已将该商品新增为推荐商品！',
                type: 'success'
              })
              this.RecommendAddItem.boolGoodRecommend = true
              for (const v of this.prodsList) {
                if (v.strGoodId === this.RecommendAddItem.strGoodId) {
                  const index = this.prodsList.indexOf(v)
                  this.prodsList.splice(index, 1, this.RecommendAddItem)
                  break
                }
              }
              this.DialogRDVisibale = false
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" >
.prodPic {
  max-height: 100px;
}
.handle-btn {
  padding: 3px 5px;
}
</style>
