// src/services/auth.service.js
import api from './api.js';

class AuthService {
    async login({ username, password }) {
        const res = await api.post('/auth/login', { username, password });
        // 后端返回 { code: 200, data: { token } } 或者 { token }
        const token = res.data?.token;
        if (!token) throw new Error('未返回 token');
        localStorage.setItem('token', token);
        return { ...res, token };
    }

    async register({ username, email, password }) {
        const res = await api.post('/auth/register', { username, email, password });
        const token = res.data?.token;
        if (!token) throw new Error('未返回 token');
        localStorage.setItem('token', token);
        return { ...res, token };
    }

    logout() {
        localStorage.removeItem('token');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isLoggedIn() {
        return !!this.getToken();
    }
}

export default new AuthService();