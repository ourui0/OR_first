// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// 请求拦截：自动携带 token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 响应拦截：统一错误处理
api.interceptors.response.use(
    (res) => res.data,
    (err) => {
        const { response } = err;
        if (!response) {
            console.error('网络错误或服务器无响应');
            return Promise.reject(err);
        }

        const { status, data } = response;
        switch (status) {
            case 401:
                console.error('认证失效，请重新登录');
                localStorage.removeItem('token'); // 清除失效 token
                break;
            case 403:
                console.error('权限不足');
                break;
            case 404:
                console.error('资源不存在');
                break;
            default:
                console.error(`请求错误：${data?.message || err.message}`);
        }
        return Promise.reject(err);
    }
);

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// 活动相关
export const getActivities = (params) => api.get('/activity', { params });
export const saveActivity   = (data) => api.post('/activity', data);
export const updateActivity = (id, data) => api.put(`/activity/${id}`, data);
export const deleteActivity = (id) => api.delete(`/activity/${id}`);

export default api;