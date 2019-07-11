<template>
  <div class="login-page">
    <img class="logo" src="http://xkmobi.com/wp-content/uploads/2017/12/logo_256_center.png">
    <p class="title">小快网络客户信息管理系统</p>
    <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-col :span="4" :offset="10" class="container-content">
        <el-form-item prop="name" class="form-label">
          <el-input placeholder="用户名" autofocus @keyup.13.native="submitForm('ruleForm')" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="form-label">
          <el-input type="password" placeholder="密码" @keyup.13.native="submitForm('ruleForm')" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" class="btn-click" type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data() {
    return {
      ruleForm: {
        name: '',
        password: '',
        message: ''
      },
      fullscreenLoading: false,
      rules: {
        name: [
          { required: false, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: false, message: '请输入密码', trigger: 'change' },
          { min: 3, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$router.push({
        path: '/pageone'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: 24px;
  color: #666;
  margin-top: 0;
}

.container-content {
  margin-top: 4%;
}

.btn-click {
  display: block;
  width: 100%;
  margin: 20px auto;
  padding: 12px 0;
}

.login-page .el-form-item__label {
  padding: 0 0 0px;
}

.logo {
  width: 10%;
  display: block;
  margin: 5% auto 0;
}
</style>
