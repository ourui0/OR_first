import api from './api.js';
import axios from "axios";

export const getActivities = (params) => api.get('/activity', { params });
export const getActivity   = (id)   => api.get(`/activity/${id}`);
export const createActivity = (data) => {
    const token = getToken();                     // 你的工具函数
    const { username } = JSON.parse(atob(token.split('.')[1])); // 简易解析
    return api.post('/activity', { ...data, createdBy: username });
};
export const updateActivity= (id,data)=> api.put(`/activity/${id}`, data);
export const deleteActivity= (id)   => api.delete(`/activity/${id}`);
export const joinActivity  = (id)   => api.post(`/activity/${id}/order`);
export const getComments   = (id)   => api.get(`/comment/${id}`);
export const addComment    = (data) => api.post('/comment', data);
export const getToken = () => {
    return localStorage.getItem('token');
};

export const checkEnrollStatus = (activityId) => {
    return axios.get(`/api/activity/${activityId}/order/status`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
};
// 批量查询报名状态
export const batchCheckEnrollStatus = (activityIds) => {
    return axios.post('/api/activity/enroll-status/batch', { activityIds }, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
};
export const cancelJoinActivity = (activityId) =>
    axios.delete(`/api/activity/${activityId}/order`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

export const deleteComment = (commentId) =>
    axios.delete(`/api/comment/${commentId}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });