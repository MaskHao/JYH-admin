<template>
  <div class="app-container">
    <el-button type="primary" @click="addBanner">添加横幅</el-button>
    <el-tabs v-model="activeName" style="margin-top:15px;">
      <el-tab-pane v-for="item in BannerTypeList" :label="item.label" :key="item.value" :name="item.value">
        <keep-alive>
          <pane v-if="activeName==item.value" :type="item.value" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Pane from './components/Pane'
import { BannerTypeList } from '@/utils/typeCode'
BannerTypeList.forEach((item, index) => {
  item.value = item.value.toString()
})
export default {
  name: 'BannerList',
  components: {
    Pane
  },
  data() {
    return {
      BannerTypeList,
      activeName: 0 // 首页横幅
    }
  },
  methods: {
    addBanner() {
      this.$router.push({
        path: 'banner_add'
      })
    }
  }
}

</script>

