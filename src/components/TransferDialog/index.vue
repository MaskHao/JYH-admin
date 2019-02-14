<template>
  <el-dialog :visible.sync="Dialogvisible.visible" :before-close="cancel" title="提示" width="30%">
    <span>确定转移？</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'TransferDialog',

  props: {
    DialogTransferVisible: {
      type: Object,
      default() {
        return { visible: false }
      }
    }

  },
  computed: {
    Dialogvisible: {
      get() {
        return Object.assign({}, this.DialogTransferVisible)
      },
      set(newValue) {
        this.DialogTransferVisible.visible = newValue
      }

    }
  },
  methods: {
    submit() {
      this.DialogTransferVisible.visible = false
      this.$emit('transfer')
    },
    cancel() {
      this.DialogTransferVisible.visible = false
    }
  }

}
</script>

<style scoped>
</style>
