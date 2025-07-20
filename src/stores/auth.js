import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('ACCESS_TOKEN') || '');
    const user  = ref(JSON.parse(localStorage.getItem('USER') || '{}'));

    const setAuth = (t, u) => {
        token.value = t;
        user.value  = u;
        localStorage.setItem('ACCESS_TOKEN', t);
        localStorage.setItem('USER', JSON.stringify(u));
    };

    const logout = () => {
        token.value = '';
        user.value  = {};
        localStorage.clear();
    };

    return { token, user, setAuth, logout };
});