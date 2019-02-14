<template>
  <el-dialog :visible.sync="Dialogvisible.visible" :before-close="cancel" title="提示" width="30%">
    <span>删除后不可恢复</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="removePrd">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DelteDialog',

  props: {
    DialogDeleteVisible: {
      type: Object,
      default() {
        return { visible: false }
      }
    }

  },
  computed: {
    Dialogvisible: {
      get() {
        return Object.assign({}, this.DialogDeleteVisible)
      },
      set(newValue) {
        this.DialogDeleteVisible.visible = newValue
      }

    }
  },
  methods: {
    removePrd() {
      this.DialogDeleteVisible.visible = false
      this.$emit('remove')
    },
    cancel() {
      this.DialogDeleteVisible.visible = false
    }
  }

}
</script>

<style scoped>
</style>
