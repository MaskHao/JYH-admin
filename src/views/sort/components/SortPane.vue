<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="list"
      row-key="strBannerId"
      element-loading-text="稍等..."
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column label="横幅图片/视频截图" align="center">
        <template slot-scope="scope">
          <img :src="IMAGE_API + scope.row.strBannImg" class="bannerPic">
        </template>
      </el-table-column>
      <el-table-column label="横幅视频" align="center" width="320">
        <template slot-scope="scope">
          <video
            v-if="scope.row.strBannVideo"
            :src="IMAGE_API + scope.row.strBannVideo"
            class="bannerVideo"
            controls="controls"
          />
          <span v-else>———</span>
        </template>
      </el-table-column>
      <el-table-column label="横幅类型" align="center">
        <template slot-scope="scope">{{ scope.row.intBannGoodsType | bannerTypeFilter }}</template>
      </el-table-column>
      <el-table-column label="横幅链接类型" align="center">
        <template slot-scope="scope">{{ scope.row.intBannLinkType | typeFilter }}</template>
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
          <icon-svg class="cursor" icon-class="drag"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { bannerList, bannerSort } from '@/api/banner'
import { BannerTypeList, LinkTypeList } from '@/utils/typeCode'
import { checkURL } from '@/utils'
import IconSvg from '@/components/SvgIcon'
import Sortable from 'sortablejs'
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
    IconSvg
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
      listLoading: false,
      sortable: null,
      list: []
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
          this.$nextTick(() => {
            this.setSort()
          })
        }
      })
    },
    setSort() {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const data = {
            BannerId1: this.list[evt.oldIndex].strBannerId,
            BannerId2: this.list[evt.newIndex].strBannerId
          }
          const targetRow = this.list.splice(evt.oldIndex, 1)[0]
          return new Promise((resolve, reject) => {
            bannerSort(data).then(res => {
              if (res.Result && res.Result === 1) {
                this.list.splice(evt.newIndex, 0, targetRow)
                this.$message({
                  message: '排序成功',
                  type: 'success'
                })
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.bannerPic {
  width: 200px;
}
.bannerVideo {
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
