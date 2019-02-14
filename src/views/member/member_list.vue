<template>
  <div class="app-container">
    <el-form ref="memberSearch" :inline="true" :model="memberSearch" class="demo-form-inline">
      <el-form-item label="会员昵称">
        <el-input v-model="memberSearch.MembNickName"/>
      </el-form-item>
      <el-form-item label="绑定的企业">
        <el-input v-model="memberSearch.MembInCompany"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="memberList"
      element-loading-text="稍等..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="会员昵称" prop="strMembNickName" width="120">
        <template slot-scope="scope">
          <span class="link-type" @click="memberInfo(scope.row)">{{ scope.row.strMembNickName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员头像">
        <template slot-scope="scope">
          <img
            :src="scope.row.strMembHeadUrl"
            class="headUrl"
            style="width:100px;height:100px;display:inline-block"
            alt
          >
        </template>
      </el-table-column>
      <el-table-column align="center" label="会员角色">
        <template slot-scope="scope">{{ scope.row.intMembRole | roleFilter }}</template>
      </el-table-column>
      <el-table-column align="center" label="绑定企业">
        <template
          slot-scope="scope"
        >{{ scope.row.strMebmInCompany? scope.row.strMebmInCompany : '———' }}</template>
      </el-table-column>
      <el-table-column align="center" label="已绑定项目">
        <template slot-scope="scope">
          <template v-if="scope.row.GoodsName.length">
            <p v-for="(item, index) in scope.row.GoodsName" :key="index" >{{ item }} </p>
          </template>
          <template v-else>———</template>
        </template>

      </el-table-column>
      <el-table-column align="center" label="选项目成为记录者">
        <template slot-scope="scope">
          <el-button type="primary" @click="selectMember(scope.$index)">选项目</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.Take" @pagination="getList" />
    <el-dialog :visible.sync="dialogFormVisible" title="选择项目成为记录者">
      <el-form ref="selectedMemberForm" :model="selectedMember" :rules="selectedMemberRule" label-width="80px">
        <el-form-item label="会员昵称">{{ selectedMember.strMembNickName }}</el-form-item>
        <el-form-item label="选择项目" prop="RepoGoods">
          <el-select
            v-model="selectedMember.RepoGoods"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
          >
            <el-option
              v-for="item in optionsList"
              :key="item.strGoodId"
              :label="item.strGoodName"
              :value="item.strGoodId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addReporter">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogInfoVisible" title="会员详情">
      <el-form ref="companyMessage" :model="memberInfoForm" label-width="150px">
        <el-form-item label="会员昵称:">{{ memberInfoForm.strMembNickName }}</el-form-item>
        <el-form-item label="会员角色:">{{ memberInfoForm.intMembRole | roleFilter }}</el-form-item>
        <el-form-item label="会员头像:">
          <img
            :src="memberInfoForm.strMembHeadUrl"
            class="BigHeadUrl"
            style="width:100px;height:100px;display:inline-block"
            alt
          >
        </el-form-item>
        <el-form-item label="已绑定的企业:">{{ memberInfoForm.strMebmInCompany }}</el-form-item>
        <el-form-item label="会员积分:">{{ memberInfoForm.intMembPoint }}</el-form-item>
        <el-form-item label="爱心项目:">
          <template v-if="memberInfoForm.GoodsName">
            <span v-for="(item, index) in memberInfoForm.GoodsName" :key="index" >{{ `${index + 1}.` + item }} </span>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { memberList, memberReporter } from '@/api/member'
import { goodList } from '@/api/prods'
import Pagination from '@/components/Pagination'
import { MemberRoleList } from '@/utils/typeCode'
const roleList = MemberRoleList.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})

export default {
  name: 'ProdList',
  components: {
    Pagination
  },
  filters: {
    roleFilter(type) {
      return roleList[type]
    }
  },
  data() {
    return {
      listQuery: {
        MembNickName: '',
        MembInCompany: '',
        page: 1,
        Skip: 0,
        Take: 10,
        AdminID: this.$store.state.user.id
      },
      memberSearch: {
        MembNickName: '',
        MembInCompany: '',
        Skip: 0,
        Take: 10,
        AdminID: this.$store.state.user.id
      },
      listLoading: false,
      memberList: [],
      total: NaN,
      dialogFormVisible: false,
      selectedMemberRule: {
        RepoGoods: [{ required: true, message: '请选择爱心项目', trigger: 'change' }]
      },
      selectedMember: {},
      optionsList: [],
      selectLoading: false,
      memberInfoForm: {},
      dialogInfoVisible: false
    }
  },

  created() {
    this.getList()
  },
  mounted() {
    return new Promise((resolve, reject) => {
      goodList({ GoodName: '' }).then(res => {
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
    getList({ page, limit } = {}) {
      if (page && limit) {
        this.listQuery.Take = limit
        this.listQuery.Skip = (--page) * limit
      }
      this.listLoading = true
      memberList(this.listQuery).then(res => {
        if (res.Result === 1) {
          this.listLoading = false
          this.memberList = res.Value
          this.total = res.Total
        }
      })
    },
    searchBtn() {
      this.memberSearch.Skip = 0
      this.listQuery = Object.assign({}, this.memberSearch)
      this.getList()
    },
    selectMember(index) {
      this.selectedMember = this.memberList[index]
      this.selectedMember.index = index
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['selectedMemberForm'].clearValidate()
      })
    },
    // 远程商品搜索
    remoteMethod(query) {
      this.selectLoading = true
      const selectPord = query.trim()
      setTimeout(() => {
        return new Promise((resolve, reject) => {
          goodList({ GoodName: selectPord }).then(res => {
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
    addReporter() {
      this.$refs['selectedMemberForm'].validate((valid) => {
        if (valid) {
          const reporter = {
            AdminID: this.$store.state.user.id,
            RepoMember: this.selectedMember.strMembId,
            RepoGoods: this.selectedMember.RepoGoods
          }
          this.dialogFormVisible = false

          return new Promise((resolve, reject) => {
            memberReporter(reporter).then(res => {
              if (res && res.Result && res.Result === 1) {
                this.$message({
                  message: res.Message,
                  type: 'success'
                })
                this.optionsList.forEach((item, index) => {
                  if (item.strGoodId === reporter.RepoGoods) {
                    this.selectedMember.GoodsName.push(this.optionsList[index].strGoodName)
                  }
                })
                this.dialogFormVisible = false
              }
            })
          })
        }
      })
    },
    memberInfo(data) {
      this.dialogInfoVisible = true
      this.memberInfoForm = Object.assign({}, data)
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
.BigHeadUrl{
  width: 80px !important;
  height: 80px !important;
  border-radius: 50%;
}
</style>
