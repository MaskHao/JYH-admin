<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="RecommendList"
      row-key="RecommendID"
      element-loading-text="稍等..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="推荐标题" prop="Title"/>
      <el-table-column align="center" label="推荐简介" prop="Summary"/>
      <el-table-column align="center" label="推荐图片" prop="Img">
        <template slot-scope="scope">
          <img :src="IMAGE_API + scope.row.Img" class="headUrl" style="display:inline-block" alt>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推荐视频" prop="Video" width="350">
        <template slot-scope="scope">
          <video
            v-if="scope.row.Video !=''"
            :src="IMAGE_API + scope.row.Video"
            class="video"
            controls="controls"
          >您的浏览器不支持视频播放</video>
          <span v-else>———</span>
        </template>
      </el-table-column>
      <el-table-column label="推荐跳转链接" align="center">
        <template slot-scope="scope">
          <a
            v-if="URLfilter(scope.row.Link)"
            :href="scope.row.Link"
            class="BannerLink link-type"
            target="_blank"
          >{{ scope.row.Link }}</a>
          <span v-else>{{ scope.row.Link? scope.row.Link : '———' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <icon-svg class="cursor" icon-class="drag"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>

import { recommendList, recommendSort } from '@/api/recommend'
import { checkURL } from '@/utils'
import IconSvg from '@/components/SvgIcon'
import Sortable from 'sortablejs'
export default {
  name: 'RecommendList',
  components: {
    IconSvg
  },
  data() {
    return {
      IMAGE_API: process.env.IMAGE_API,
      uploadSingle: process.env.IMAGE_API + '/Picture/UploadSingle',
      UploadVideo: process.env.IMAGE_API + '/Picture/UploadVideo',
      listLoading: false,
      RecommendList: []
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
      recommendList({ AdminID: this.$store.state.user.id }).then(res => {
        if (res.Result === 1) {
          this.listLoading = false
          this.RecommendList = res.Value
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
            RecommendId1: this.RecommendList[evt.oldIndex].RecommendID,
            RecommendId2: this.RecommendList[evt.newIndex].RecommendID
          }
          const targetRow = this.RecommendList.splice(evt.oldIndex, 1)[0]
          return new Promise((resolve, reject) => {
            recommendSort(data).then(res => {
              if (res.Result && res.Result === 1) {
                this.RecommendList.splice(evt.newIndex, 0, targetRow)
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
<style lang="scss">

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.headUrl {
  width: 80px !important;
}
.video{
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
