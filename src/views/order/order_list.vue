<template>
  <div class="app-container order-container">
    <div class="filter-container">
      <el-form :inline="true" :model="orderSearch" class="order-form">
        <el-form-item label="订单编号">
          <el-input v-model="orderSearch.OrderCode"/>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="orderSearch.GoodName"/>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="orderSearch.OrderStatus" style="width: 150px">
            <el-option
              v-for="item in OrderStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="selectTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change = "dateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">查询</el-button>
        </el-form-item>
        <el-button type="primary" @click="exportExcel">导 出</el-button>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="orderList"
      element-loading-text="稍等..."
      border
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="订单ID">
              <span>{{ props.row.OrderID }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.CreateTime }}</span>
            </el-form-item>
            <el-form-item label="支付时间">
              <span>{{ props.row.PayTime | payTimeFilter }}</span>
            </el-form-item>
            <el-form-item label="收货人姓名">
              <span>{{ props.row.Addressname }}</span>
            </el-form-item>
            <el-form-item label="收货人联系方式">
              <span>{{ props.row.Phone }}</span>
            </el-form-item>
            <el-form-item label="收货人地址">
              <span>{{ props.row.AddressName }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="OrderCode" label="订单编码" align="center" width="200px"/>
      <el-table-column prop="GoodName" label="商品名称" align="center"/>
      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">{{ scope.row.Status | statusFilter }}</template>
      </el-table-column>
      <el-table-column label="支付方式" align="center">
        <template slot-scope="scope">{{ scope.row.PayType | payTypeFilter }}</template>
      </el-table-column>
      <el-table-column label="支付金额" align="center" prop="Amount">
        <template slot-scope="scope">{{ scope.row.Amount | showPrice }}</template>
      </el-table-column>
      <el-table-column prop="MemberName" label="支付者" align="center"/>
      <el-table-column label="操作" width="160px" align="center">
        <template slot-scope="scope">
          <el-button type="info" @click="orderInfoShow(scope.row.OrderID)">详情</el-button>
          <el-button
            v-if="scope.row.Status === 1"
            type="primary"
            @click="orderShipShow(scope.row, scope.row.OrderID)"
          >发货</el-button>
          <el-button v-else type="primary" disabled>已发货</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.Take" @pagination="getList" />
    <el-dialog :visible.sync="dialogOrderVisible" title="订单详情" width="70%">
      <div v-loading="orderFormLoading" v-if="orderDetail.Receiver">
        <el-row>
          <el-col :span="24">
            <span class="title">订单ID：</span>
            <span>{{ orderDetail.OrderID }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <span class="title">订单状态:</span>
            {{ orderDetail.StatusName }}
          </el-col>
          <el-col :span="18">
            <span class="title">下单时间:</span>
            {{ orderDetail.CreateTime }}
          </el-col>
        </el-row>

        <p>收货人信息</p>
        <el-row>
          <el-col :span="6">
            <span class="title">收货人:</span>
            {{ orderDetail.Receiver.Name }}
          </el-col>
          <el-col :span="18">
            <span class="title">手机:</span>
            {{ orderDetail.Receiver.Phone }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="title">地址:</span>
            {{ orderDetail.Receiver.Address }}
          </el-col>
        </el-row>

        <p>快递信息</p>
        <el-row>
          <el-col :span="6">
            <span class="title">快递公司:</span>
            {{ orderDetail.Express ? orderDetail.Express: '暂无信息' }}
          </el-col>
          <el-col :span="18">
            <span class="title">快递单号:</span>
            {{ orderDetail.ExpressCode ? orderDetail.ExpressCode : '暂无信息' }}
          </el-col>
        </el-row>
        <p>订单列表</p>
        <el-table :data="[orderDetail.OrdSnap]">
          <el-table-column prop="strSnapGoodsName" label="商品名称" align="center"/>
          <el-table-column prop="intSnapGoodsPrice" label="单价" align="center"/>
          <el-table-column prop="intSnapQuantity" label="数量" align="center">
            <span>1</span>
          </el-table-column>
          <el-table-column prop="strSnapGoodsCover" label="商品封面图" align="center">
            <template slot-scope="scope">
              <img :src="IMAGE_API + scope.row.strSnapGoodsCover" class="snapImg" alt>
            </template>
          </el-table-column>
          <el-table-column prop="intSnapAmount" label="总价" align="center">
            <template slot-scope="scope">{{ scope.row.intSnapAmount | showPrice }}</template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOrderVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogShipVisible" title="订单发货">
      <el-form ref="OrderShipForm" :model="OrderShip" :rules="OrderShipRules" label-width="80px">
        <el-form-item label="OrderID">{{ OrderShip.OrderID }}</el-form-item>
        <el-form-item label="快递公司" prop="Express">
          <el-select v-model="OrderShip.Express" placeholder="请选择">
            <el-option
              v-for="item in ExpressList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="ExpressCode">
        <el-input v-model="OrderShip.ExpressCode" style="width: 400px"/></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShipVisible = false">取 消</el-button>
        <el-button type="primary" @click="shipSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { parseTime, excelExport } from '@/utils'
import { goodOrder, orderInfo, orderShip } from '@/api/order'
import { OrderStatusList, PayTypeList, ExpressList } from '@/utils/typeCode'
import Pagination from '@/components/Pagination'
const orderStatus = OrderStatusList.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})
const PayTypeArray = PayTypeList.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})
export default {
  name: 'OrderList',
  components: {
    Pagination
  },
  filters: {
    statusFilter(status) {
      return orderStatus[status]
    },
    payTypeFilter(PayType) {
      return PayTypeArray[PayType]
    },
    typeFilter(row) {
      return row.PayType === 1 ? row.PayAble + '元' : row.PayPoint + '积分'
    },
    payTimeFilter(time) {
      if (time === '1900-01-01 00:00') {
        return '——'
      } else {
        return time
      }
    },
    showPrice(price) {
      return Number(price / 100).toFixed(2) + '元'
    }
  },
  data() {
    return {
      IMAGE_API: process.env.IMAGE_API,
      OrderStatusList,
      ExpressList,
      selectTime: '',
      listQuery: {
        page: 1,
        OrderCode: '',
        GoodName: '',
        GoodType: 99,
        OrderStatus: 99,
        PayTimeStart: '1970-01-01',
        PayTimeEnd: parseTime(Date.now()),
        Skip: 0,
        Take: 20
      },
      orderSearch: {
        page: 1,
        OrderCode: '',
        GoodName: '',
        GoodType: 99,
        OrderStatus: 99,
        PayTimeStart: '',
        PayTimeEnd: '',
        Skip: 0,
        Take: 20
      },
      total: NaN,
      listLoading: false,
      orderList: [],
      dialogOrderVisible: false, // 显示
      orderDetail: {},
      orderFormLoading: false,
      dialogShipVisible: false,
      OrderShip: {
        AdminID: this.$store.state.user.id
      },
      oderChange: {},
      OrderShipRules: {
        Express: [{ required: true, message: '请选择快递公司', trigger: 'change' }],
        ExpressCode: [{ required: true, message: '请输入快递单号', trigger: 'blur' }]
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
      goodOrder(this.listQuery).then(res => {
        if (res.Result) {
          this.listLoading = false
          this.orderList = res.Value
          this.total = res.Total
        }
      })
    },
    dateChange() {
      if (this.selectTime) {
        this.orderSearch.PayTimeStart = this.selectTime[0]
        this.orderSearch.PayTimeEnd = this.selectTime[1]
      } else {
        this.orderSearch.PayTimeStart = '1970-01-01'
        this.orderSearch.PayTimeEnd = parseTime(Date.now())
      }
    },
    searchBtn() {
      this.orderSearch.Skip = 0
      this.listQuery = Object.assign({}, this.orderSearch)
      if (!this.listQuery.PayTimeStart) {
        this.listQuery.PayTimeStart = '1970-01-01'
      }
      if (!this.listQuery.PayTimeEnd) {
        this.listQuery.PayTimeEnd = parseTime(Date.now())
      }
      this.getList()
    },
    orderInfoShow(id) {
      this.dialogOrderVisible = true
      this.orderFormLoading = true
      return new Promise((resolve, reject) => {
        orderInfo({ OrderID: id }).then(res => {
          if (res.Result && res.Result === 1) {
            this.orderDetail = res.Value
          }
          this.orderFormLoading = false
        })
      })
    },
    orderShipShow(order, id) {
      this.dialogShipVisible = true
      this.OrderShip.OrderID = id
      this.oderChange = order
    },
    shipSubmit() {
      this.$refs['OrderShipForm'].validate((valid) => {
        if (valid) {
          return new Promise((resolve, reject) => {
            orderShip(this.OrderShip).then(res => {
              if (res.Result && res.Result === 1) {
                this.$message({
                  message: res.Message,
                  type: 'success'
                })
                this.oderChange.Status = 3
                this.dialogShipVisible = false
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
    },
    exportExcel() {
      this.orderSearch.Skip = 0
      this.listQuery = Object.assign({}, this.orderSearch)
      if (!this.listQuery.PayTimeStart) {
        this.listQuery.PayTimeStart = '1970-01-01'
      }
      if (!this.listQuery.PayTimeEnd) {
        this.listQuery.PayTimeEnd = parseTime(Date.now())
      }
      const data = {
        GoodName: this.listQuery.GoodName,
        GoodType: 1,
        Status: this.listQuery.OrderStatus,
        OrderCode: this.listQuery.OrderCode,
        Begin: this.listQuery.PayTimeStart,
        End: this.listQuery.PayTimeEnd
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      excelExport(data, loading.close())
    }
  }
}
</script>
<style>
.orderDetail {
  min-width: 262px;
  padding: 0 10px 0 30px;
  margin: 0 0 0 -1px;
  border-width: 0 0 0 1px;
}

.prodPic {
  width: 60px;
  height: 60px;
}

  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 120px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .title{
     width: 120px;
     font-size: 16px;
    color: #99a9bf;
  }
  .snapImg{
    width: 150px;
  }
</style>
