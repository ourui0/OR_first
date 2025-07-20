import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
    { path: '/login',    component: () => import('@/view/Login.vue') },
    { path: '/register', component: () => import('@/view/Register.vue') },
    { path: '/', redirect: '/activities' },
    { path: '/activities', component: () => import('@/view/Activity/List.vue'), meta: { requiresAuth: true } },
    { path: '/activity/:id', component: () => import('@/view/Activity/Detail.vue'), meta: { requiresAuth: true } },
    { path: '/activity/new', component: () => import('@/view/Activity/Edit.vue'), meta: { requiresAuth: true } },
];

const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth && !token) {
        console.warn('被守卫拦截：', to.path, 'token=', token);
        next('/login');
    } else {
        console.log('守卫放行：', to.path);
        next();   // 这里必须调 next()
    }
});
export default router;