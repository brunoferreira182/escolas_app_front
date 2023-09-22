import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsLayoutParent from '../views/TabsParent.vue'
import MainLayout from '../layouts/MainLayout.vue'
import  Login from '../views/Login.vue';
import  Register from '../views/Register.vue';
import waitingAproval from '../views/WaitingAproval.vue';
import socialPage from '../views/SocialPage.vue'
import chatPage from '../views/ChatPage.vue'
import profilePage from '../views/ProfilePage.vue'
import morePage from '../views/MorePage.vue'

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
      },
      {
        path: '/tabsParent',
        name: 'TabsParent',
        component: TabsLayoutParent,
        children: [
          { path: '/', redirect: '/socialPage'},
          { path: '/socialPage', component: socialPage },
          { path: '/chatPage', component: chatPage },
          { path: '/ProfilePage', component: profilePage },
          { path: '/MorePage', component: morePage },
        ]
      },
    ]
  },
  
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
