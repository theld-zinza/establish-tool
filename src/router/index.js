import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MynaLogs from '../views/MynaLogs.vue'
import CloneData from '../views/CloneData.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/myna-logs',
    name: 'MynaLogs',
    component: MynaLogs
  },
  {
    path: '/clone-data',
    name: 'CloneData',
    component: CloneData
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
