<template>
  <div class="page-container">
    这是第一个页面
  </div>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.page-container{
  position: absolute;
  width: calc(100% - 200px);
  height: 100%;
  overflow-y: scroll;
  left: 200px;
  top: 0;
}
</style>
