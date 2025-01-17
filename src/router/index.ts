import { createRouter, createWebHistory } from 'vue-router'
import Nav from '@/views/nav.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'nav',
      component: Nav
    }
  ]
})

export default router 