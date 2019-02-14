<template>
  <div class="app-container">
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
import Pane from './components/SortPane'
import { BannerTypeList } from '@/utils/typeCode'
BannerTypeList.forEach((item, index) => {
  item.value = item.value.toString()
})
export default {
  name: 'SortBanner',
  components: {
    Pane
  },
  data() {
    return {
      BannerTypeList,
      activeName: 0 // 首页横幅
    }
  }
}

</script>

