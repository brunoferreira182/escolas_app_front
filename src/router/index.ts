import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue'
import  Login from '../views/Login.vue';
import  Register from '../views/Register.vue';
import waitingAproval from '../views/WaitingAproval.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: Login
      },
      {
        path: '/register',
        name: 'Register',
        component: Register
      },
      {
        path: '/waitingAproval',
        name: 'WaitingAproval',
        component: waitingAproval
      }
    ]
  },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
