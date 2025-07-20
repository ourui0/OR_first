<template>
  <div class="auth-container">
    <h1 class="page-title">体育活动室</h1>
    <div class="auth-form">
      <h2>创建您的账户</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="user.username" required>
        </div>
        <div class="form-group">
          <label for="email">邮箱地址</label>
          <input type="email" id="email" v-model="user.email" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="user.password" required>
        </div>
        <div v-if="message" class="error-message">
          {{ message }}
        </div>
        <button type="submit" :disabled="loading">
          <span v-if="loading">注册中...</span>
          <span v-else>注册</span>
        </button>
      </form>
      <div class="switch-auth">
        <p>已有账户？ <router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.service.js';

const user = ref({ username: '', password: '' });
const loading = ref(false);
const message = ref('');
const router = useRouter();

const handleRegister = async () => {
  loading.value = true;
  message.value = '';
  try {
    await authService.register({ username: user.value.username, password: user.value.password });
    await router.push('/login');
  } catch (err) {
    // 显示后端错误
    message.value = err.response?.data?.msg || '注册失败';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 建议将样式放在单独的CSS文件中或使用 scoped 以避免全局污染 */
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
  /* 确保表单本身在 flex 容器中居中 */
  margin: auto; /* 冗余但保险 */
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
button:disabled {
  background-color: #a0cfff;
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
body {
  margin: 0;
  height: 100%;
}
</style>