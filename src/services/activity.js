import api from './api.js';

export const getActivities = (params) => api.get('/activity', { params });
export const getActivity   = (id)   => api.get(`/activity/${id}`);
export const createActivity= (data) => api.post('/activity', data);
export const updateActivity= (id,data)=> api.put(`/activity/${id}`, data);
export const deleteActivity= (id)   => api.delete(`/activity/${id}`);
export const joinActivity  = (id)   => api.post(`/activity/${id}/order`);
export const getEnrollStatus = (id) => api.get(`/api/activity/${id}/order/status`);
export const getComments   = (id)   => api.get(`/comment/${id}`);
export const addComment    = (data) => api.post('/comment', data);