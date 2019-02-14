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
        <el-form-item label="商品类型">
          <el-select v-model="orderSearch.GoodType" style="width: 120px">
            <el-option
              v-for="item in GoodTypeSelectList"
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
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBtn">查 询</el-button>
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
      <el-table-column prop="OrderCode" label="订单编码" align="center" width="200px">
        <template slot-scope="scope">
          <span class="link-type" @click="prodInfo(scope.row)">{{ scope.row.OrderCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="GoodName" label="商品名称" align="center"/>
      <el-table-column label="商品类型" align="center">
        <template slot-scope="scope">{{ scope.row.GoodsType | GoodsTypeFilter }}</template>
      </el-table-column>
      <el-table-column prop="PayTime" label="支付时间" align="center"/>
      <el-table-column label="支付金额" align="center" prop="Amount">
        <template slot-scope="scope">{{ scope.row.Amount | showPrice }}</template>
      </el-table-column>
      <el-table-column prop="MemberName" label="会员名称" align="center"/>
      <el-table-column prop="Name" label="捐赠者姓名" align="center">
        <template slot-scope="scope">{{ scope.row.Name? scope.row.Name: '———' }}</template>
      </el-table-column>
      <el-table-column prop="Phone" label="捐赠者手机号" align="center">
        <template slot-scope="scope">{{ scope.row.Phone? scope.row.Name: '———' }}</template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.Take" @pagination="getList" />
    <el-dialog :visible.sync="dialogOrderVisible" title="订单详情" width="70%">
      <div v-if="orderDetail">
        <el-row>
          <el-col :span="24">
            <span class="title">订单名称：</span>
            <span>{{ orderDetail.GoodName }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <span class="title">订单类型:</span>
            {{ orderDetail.OrderType | GoodsTypeFilter }}
          </el-col>
          <el-col :span="18">
            <span class="title">支付时间:</span>
            {{ orderDetail.PayTime }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <span class="title">支付者:</span>
            {{ orderDetail.MemberName }}
          </el-col>
          <el-col :span="18">
            <span class="title">支付金额:</span>
            {{ orderDetail.Amount | showPrice }}
          </el-col>
        </el-row>
        <template v-if="orderDetail.OrderType === 1">
          <p>报名人员</p>
          <el-table :data="orderDetail.SignUps">
            <el-table-column prop="Name" label="报名者姓名" align="center"/>
            <el-table-column prop="Phone" label="报名人电话" align="center"/>
            <el-table-column prop="IDNumb" label="报名人身份证号" align="center"/>
            <el-table-column prop="Remark" label="报名人备注" align="center"/>
          </el-table>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOrderVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import { parseTime, GetVisitData } from '@/utils'
import { order } from '@/api/order'
import { GoodTypeList } from '@/utils/typeCode'
import Pagination from '@/components/Pagination'
const GoodTypeSelectList = [{ value: 99, label: '全部' }].concat(GoodTypeList)
GoodTypeSelectList.forEach((item, index, arr) => {
  if (item.value === 3) {
    arr.splice(index, 1)
  }
})
const GoodsTypeList = GoodTypeList.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})
export default {
  name: 'OrderList',
  components: {
    Pagination
  },
  filters: {
    GoodsTypeFilter(type) {
      return GoodsTypeList[type]
    },
    showPrice(price) {
      return Number(price / 100).toFixed(2) + '元'
    }
  },
  data() {
    return {
      IMAGE_API: process.env.IMAGE_API,
      GoodTypeSelectList,
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
      dialogOrderVisible: false,
      orderDetail: {}
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
      order(this.listQuery).then(res => {
        if (res.Result) {
          this.listLoading = false
          this.orderList = res.Value
          this.total = res.Total
        }
      })
    },
    prodInfo(data) {
      this.orderDetail = Object.assign({}, data)
      this.dialogOrderVisible = true
    },
    searchBtn() {
      if (this.selectTime) {
        this.orderSearch.PayTimeStart = this.selectTime[0]
        this.orderSearch.PayTimeEnd = this.selectTime[1]
      } else {
        this.orderSearch.PayTimeStart = '1970-01-01'
        this.orderSearch.PayTimeEnd = parseTime(Date.now())
      }
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
        GoodType: this.listQuery.GoodType,
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
      this.excelExport(data, loading.close())
    },
    excelExport(data, callback) {
      axios({
        method: 'post',
        url: process.env.BASE_API + '/Order/ActionOrderExport',
        data: GetVisitData(data),
        headers: {
          Accept: 'text/html, application/xhtml+xml, */*'
        },
        responseType: 'blob' // 表明返回服务器返回的数据类型
      }).then(res => {
      // 处理返回的文件流
      // 主要是将返回的data数据通过blob保存成文件
        var content = res.data
        var blob = new Blob([content])
        var fileName = '活动订单.xlsx' // 要保存的文件名称
        if ('download' in document.createElement('a')) {
        // 非IE下载
          const eLink = document.createElement('a')
          eLink.download = fileName
          eLink.style.display = 'none'
          eLink.href = URL.createObjectURL(blob)
          document.body.appendChild(eLink)
          eLink.click()
          URL.revokeObjectURL(eLink.href) // 释放URL 对象
          document.body.removeChild(eLink)
          callback
        } else {
        // IE10+下载
          navigator.msSaveBlob(blob, fileName)
          callback
        }
      })
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
.el-dialog {
  width: 70%;
}
.title {
  width: 120px;
  color: #99a9bf;
}
.snapImg {
  width: 150px;
}
</style>
