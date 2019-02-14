<template>
  <div class="app-container">
    <el-tabs v-model="activeName" style="margin-top:15px;">
      <el-tab-pane v-for="item in StarTypeList" :label="item.label" :key="item.value" :name="item.value">
        <keep-alive>
          <sort-star-pane v-if="activeName==item.value" :type="item.value" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SortStarPane from './components/SortStarPane'
import { StarTypeList } from '@/utils/typeCode'
StarTypeList.forEach((item, index, arr) => {
  item.value = item.value.toString()
})
StarTypeList.forEach((item, index, arr) => {
  if (item.value === '99') {
    arr.splice(index, 1)
  }
})
export default {
  name: 'SortStar',
  components: {
    SortStarPane
  },
  data() {
    return {
      StarTypeList,
      activeName: '1' // 默认为联合发起人
    }
  }
}
</script>
