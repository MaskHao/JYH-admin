<template>
  <div>
    <el-table v-loading="listLoading" :data="list" style="width: 100%">
      <el-table-column label="横幅图片/视频截图" align="center">
        <template slot-scope="scope">
          <img :src="IMAGE_API + scope.row.strBannImg" class="bannerPic">
        </template>
      </el-table-column>
      <el-table-column label="横幅视频" align="center" width="320 ">
        <template slot-scope="scope">
          <video v-if="scope.row.strBannVideo" :src="IMAGE_API + scope.row.strBannVideo" class="bannerVideo" controls="controls"/>
          <span v-else>———</span>
        </template>
      </el-table-column>
      <el-table-column label="横幅类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.intBannGoodsType | bannerTypeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="横幅链接类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.intBannLinkType | typeFilter }}
        </template>
      </el-table-column>
      <el-table-column label="横幅链接地址" align="center">
        <template slot-scope="scope">
          <a
            v-if="URLfilter(scope.row.strBannLink)"
            :href="scope.row.strBannLink"
            class="BannerLink link-type"
            target="_blank"
          >{{ scope.row.strBannLink }}</a>
          <span v-else>{{ scope.row.strBannLink? scope.row.strBannLink : '———' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            class="btn cancelBtn"
            type="danger"
            @click="bannerRemove(scope.row.$index, scope.row.strBannerId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <delete-dialog :dialog-delete-visible="DialogDeleteVisible" @remove="deleteBtn"/>
  </div>
</template>
<script>
import {
  bannerList,
  bannerDelete
} from '@/api/banner'
import { BannerTypeList, LinkTypeList } from '@/utils/typeCode'
import { checkURL } from '@/utils'
import DeleteDialog from '@/components/DeleteDialog'
const typeList = LinkTypeList.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})
const BtypeList = BannerTypeList.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})
export default {
  components: {
    DeleteDialog
  },
  filters: {
    typeFilter(type) {
      return typeList[type]
    },
    bannerTypeFilter(type) {
      return BtypeList[type]
    }
  },
  props: {
    type: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      bannerSearch: {
        AdminID: this.$store.state.user.id,
        BannGoodsType: this.type
      },
      IMAGE_API: process.env.IMAGE_API,
      AdminID: this.$store.state.user.id,
      listLoading: false,
      list: [],
      DialogDeleteVisible: { visible: false },
      bannerDelete: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    URLfilter(URL) {
      return checkURL(URL)
    },
    getList() {
      this.listLoading = true
      bannerList(this.bannerSearch).then(res => {
        if (res.Result === 1) {
          this.list = res.Value
          this.list.forEach(item => {
            if (item.BannerPicture) {
              item.BannerPicture = process.env.IMAGE_API + item.BannerPicture
            } else {
              item.BannerPicture = ''
            }
          })
          this.listLoading = false
        }
      })
    },
    bannerRemove(index, BannId) {
      this.bannerDelete = { index: index, BannId: BannId }
      this.DialogDeleteVisible.visible = true
    },
    deleteBtn() {
      const data = {
        BannId: this.bannerDelete.BannId,
        AdminID: this.AdminID
      }
      bannerDelete(data).then(res => {
        if (res.Result) {
          this.$message({
            message: res.Message,
            type: 'success'
          })
          this.list.splice(this.bannerDelete.index, 1)
        } else {
          this.$message({
            message: res.Message,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped>

.bannerPic{
  width: 200px;
}
.bannerVideo{
  width: 320px;
}
  .BannerLink {
    display: inline-block;
    vertical-align: middle;
    width: 120px;
    overflow: hidden;
    /*超出部分隐藏*/
    white-space: nowrap;
    /*不换行*/
    text-overflow: ellipsis;
    /*超出部分文字以...显示*/
  }
</style>
