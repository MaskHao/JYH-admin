<template>
  <div class="app-container client-container">
    <el-button type="primary" @click="addAdminBtn">添加管理员</el-button>
    <el-table v-loading="listLoading" :data="list" element-loading-text="稍等..." border fit highlight-current-row>
      <el-table-column prop="AdminId" align="center" label="管理员ID"/>
      <el-table-column prop="AdminUserCode" align="center" label="管理员账号"/>
      <el-table-column prop="AdminName" align="center" label="管理员名称"/>
      <el-table-column align="center" label="管理员头像">
        <template slot-scope="scope">
          <div v-if="scope.row.AdminUserHeadUrl" :style="{backgroundImage:`url(${imgURL + scope.row.AdminUserHeadUrl})`}" class="headUrl"/>
          <div v-else :style="{backgroundImage:`url(${defaultHeadUrl})`}" class="headUrl"/>
        </template>
      </el-table-column>
      <el-table-column prop="AdminUserCreateTime" align="center" label="管理员创建时间"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.AdminUserSuper" type="danger" @click="deleteBtn(scope.$index, scope.row.AdminId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <delete-dialog :dialog-delete-visible="DialogDeleteVisible" @remove="removeAdmin"/>
  </div>

</template>

<script>
import {
  adminList,
  adminDelete
} from '@/api/user'
import DeleteDialog from '@/components/DeleteDialog'
export default {
  name: 'AdminList',
  components: {
    DeleteDialog
  },
  data() {
    return {
      defaultHeadUrl: '/static/user.jpg',
      imgURL: process.env.IMAGE_API,
      AdminID: this.$store.state.user.id,
      client: {
        username: '',
        tel: '',
        startTime: null,
        endTime: null,
        address: '',
        userSource: ''
      },
      listLoading: false,
      list: [],
      DialogDeleteVisible: { visible: false },
      adminDelete: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      adminList({
        AdminID: this.AdminID
      }).then(res => {
        this.list = res.Value
      })
    },
    addAdminBtn() {
      this.$router.push('/permission/admin_add')
    },
    deleteBtn(index, UserId) {
      this.adminDelete = { index: index, UserId: UserId }
      this.DialogDeleteVisible.visible = true
    },
    removeAdmin() {
      adminDelete({
        UserId: this.adminDelete.UserId
      }).then(res => {
        if (res.Result) {
          this.$message({
            message: '已删除该管理员',
            type: 'success'
          })
          this.list.splice(this.adminDelete.index, 1)
        }
      })
    }
  }
}

</script>
<style scoped>
  .headUrl {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-color: #f6f8f9;
    display: inline-block;
  }

</style>
