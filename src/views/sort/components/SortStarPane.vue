<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="starList"
      row-key="StarId"
      element-loading-text="稍等..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="爱心明星姓名" prop="StarName"/>
      <el-table-column align="center" label="爱心明星头像" prop="StarCover">
        <template slot-scope="scope">
          <img :src="IMAGE_API + scope.row.StarCover" class="headUrl" style="display:inline-block" alt>
        </template>
      </el-table-column>
      <el-table-column align="center" label="爱心明星视频" prop="Video" width="320">
        <template slot-scope="scope">
          <video v-if="scope.row.Video" :src="IMAGE_API + scope.row.Video" controls="controls"/>
          <span v-else>———</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="StarCreatetime"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <icon-svg class="cursor" icon-class="drag"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { starList, starSort } from '@/api/loveStar'
import IconSvg from '@/components/SvgIcon'
import Sortable from 'sortablejs'
export default {
  components: {
    IconSvg
  },
  props: {
    type: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      IMAGE_API: process.env.IMAGE_API,
      listQuery: {
        StarName: '',
        Type: this.type,
        Skip: 0,
        Take: 0,
        AdminID: this.$store.state.user.id
      },
      sortable: null,
      starList: [],
      listLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      starList(this.listQuery).then(res => {
        if (res.Result === 1) {
          this.listLoading = false
          this.starList = res.Value
          this.total = res.Total
        }
        this.$nextTick(() => {
          this.setSort()
        })
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
            StarId1: this.starList[evt.oldIndex].StarId,
            StarId2: this.starList[evt.newIndex].StarId
          }
          const targetRow = this.starList.splice(evt.oldIndex, 1)[0]
          return new Promise((resolve, reject) => {
            starSort(data).then(res => {
              if (res.Result && res.Result === 1) {
                this.starList.splice(evt.newIndex, 0, targetRow)
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
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
}
.headUrl {
  width: 80px !important;
}
</style>
