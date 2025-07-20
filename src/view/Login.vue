<template>
  <div class="auth-container">
    <h1 class="page-title">体育活动室</h1>
    <div class="auth-form">
      <h2>登录您的账户</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="user.username" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="user.password" required>
        </div>
        <div v-if="message" class="error-message">
          {{ message }}
        </div>
        <button type="submit" :disabled="loading">
          <span v-if="loading">登录中...</span>
          <span v-else>登录</span>
        </button>
      </form>
      <div class="switch-auth">
        <p>还没有账户？ <router-link to="/register">立即注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.service.js';


const user = ref({
  username: '',
  password: ''
});
const loading = ref(false);
const message = ref('');
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  message.value = '';
  try {
    const response = await authService.login(user.value);
    // 登录成功后，后端通常会返回一个token
    // 您需要将token存储起来（例如 localStorage），并用于后续的API请求
    if (response.data.token) {
      localStorage.setItem('user-token', response.data.token);
      // 跳转到需要认证的页面，例如首页或仪表盘
      await authService.login(user.value);
      console.log('登录成功，准备跳转');
      await router.push('/');
      console.log('已调用 push');
    }
  } catch (error) {
    message.value = error.response?.data?.message || '用户名或密码错误。';
    loading.value = false;
  }
};
</script>

<style scoped>
.page-title {
  position: absolute;   /* 让它脱离 flex 居中流，固定在顶部 */
  top: 60px;            /* 距离视口顶部 20px，可随意调 */
  left: 50%;
  transform: translateX(-50%);
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 4px;
  color: #333;
  margin: 0;
}

.auth-container {
  position: fixed;
  inset: 0;             /* 等价于 top:0 right:0 bottom:0 left:0 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
}

.auth-form {
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
button:disabled {
  background-color: #94d3a2;
  cursor: not-allowed;
}
.error-message {
  color: red;
  margin-bottom: 15px;
  text-align: center;
}
.switch-auth {
  margin-top: 20px;
  text-align: center;
}
</style>