import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import splitVideo from '@/components/juejin/splitVideo/splitVideo.vue'
import excelView from '@/views/excel/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: '/splitVideo',
      children: [
        {
          path: '/splitVideo',
          name: 'splitVideo',
          component: splitVideo
        }
      ]
    }, {
      path: '/excelView',
      name: 'excelView',
      component: excelView
    }
  ]
})

export default router
