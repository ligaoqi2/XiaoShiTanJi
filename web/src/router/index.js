import { createRouter, createWebHashHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import UploadView from '@/views/UploadView.vue';
import ExtractView from '@/views/ExtractView.vue';
import dayjs from 'dayjs';

import { useAuthStore } from '@/stores/auth';
import ChangePassword from '@/views/ChangePassword.vue';
import IndexPage from '@/views/IndexPage.vue';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: '/upload',
      children: [
        {
          path: '/upload',
          name: 'upload',
          component: UploadView
        },
        { path: '/extract', name: 'extract', component: ExtractView },
        {
          path: '/change-password',
          name: 'change-password',
          component: ChangePassword
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  // check token expiration
  if (auth.loggedIn && authRequired) {
    const expiredTime = Number(auth.expired);
    const now = dayjs().unix();
    if (expiredTime < now) {
      auth.logout();
    }
  }

  if (authRequired && !auth.loggedIn) {
    router.push({ name: 'login' });
  } else {
    next();
  }
});

export default router;
