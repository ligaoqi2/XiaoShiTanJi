import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const appName = import.meta.env.VITE_API_BASE;
  const token = ref(localStorage.getItem(`${appName}-token`) || '');
  const user = ref(
    localStorage.getItem(`${appName}-user`)
      ? localStorage.getItem(`${appName}-user`)
      : {}
  );
  const expired = ref(localStorage.getItem(`${appName}-expired`) || '');
  const loggedIn = ref(!!token.value);

  function login(u) {
    localStorage.setItem(`${appName}-user`, JSON.stringify(u));
    localStorage.setItem(`${appName}-token`, u.token);
    localStorage.setItem(`${appName}-expired`, u.expired);

    user.value = u;
    token.value = u.token;
    expired.value = u.expired;
    loggedIn.value = true;
  }

  function logout() {
    localStorage.removeItem(`${appName}-user`);
    localStorage.removeItem(`${appName}-token`);
    localStorage.removeItem(`${appName}-expired`);

    user.value = null;
    token.value = '';
    expired.value = null;
    loggedIn.value = false;
  }

  return { token, user, expired, loggedIn, login, logout };
});
