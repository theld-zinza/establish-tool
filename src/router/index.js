import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MynaLogs from '../views/MynaLogs.vue'
import CloneData from '../views/CloneData.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/myna-logs',
    name: 'MynaLogs',
    component: MynaLogs,
    meta: { requiresAuth: true }
  },
  {
    path: '/clone-data',
    name: 'CloneData',
    component: CloneData,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const storedPassword = localStorage.getItem('app_auth')
    const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD
    const isAuthenticated = storedPassword === APP_PASSWORD
    
    if (!isAuthenticated) {
      next({ name: 'Login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
