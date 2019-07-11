<template>
  <div id="app">
    <div v-if="isLogin" class="menu-container">
      <n-menu />
    </div>
    <nuxt />
  </div>
</template>

<script>
  import NMenu from '~/components/menu.vue'
  export default {
    components: {
      NMenu
    },
    data () {
      return {
      }
    },
    computed: {
      isLogin () {
        if (this.$route.name == 'index') {
          return false
        } else {
          return true
        }
      }
    }
  }
</script>

<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
}

* {
  box-sizing: border-box;
  margin: 0;
  &:before, &:after{
    box-sizing: border-box;
    margin: 0;
  }
}
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#__nuxt {
  height: 100%;
  #__layout {
    height: 100%;
    #app {
    height: 100%;
    .menu-container {
      height: 100%;
    }
  }
  }
}
</style>
