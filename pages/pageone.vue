<template>
  <div class="page-container">
    <button @click="showMediaDialog">图片组件</button>
    <el-dialog class="media-dialog media-layer" title="媒体库" width="90%" top="5%" :lock-scroll="true" :visible.sync="isVisible__mediaDialog">
        <Media is-layer="true" @confirm-selected="getPicInfo" @hidden-media-dialog="hiddenMediaDialog" :storage-site-url="storagesiteurl"></Media>
    </el-dialog>
  </div>
</template>

<script>
import Media from '~/components/media.vue'
export default {
  data() {
    return {
      isVisible__mediaDialog: false,
      storagesiteurl: '',
    }
  },
  components: {
    Media
  },
  methods: {
    // 拿到媒体库选择的图片，是数组形式
    getPicInfo(picArr) {
        this.picObject__selected = picArr[0] // 如果在媒体库选择了多张，这边也只是拿到选中的第一张
    },
    // 显示媒体库浮层
    showMediaDialog() {
      this.isVisible__mediaDialog = true
    },
    // 隐藏媒体库浮层
    hiddenMediaDialog(val) {
      this.isVisible__mediaDialog = val;
      this.ImagemediaDialog = val
      this.itemIndex = null
    },
  }
}
</script>

<style lang="scss" scoped>
// @import "~/assets/css/components/media.css";
.page-container{
  position: absolute;
  width: calc(100% - 200px);
  height: 100%;
  overflow-y: scroll;
  left: 200px;
  top: 0;
}
</style>
