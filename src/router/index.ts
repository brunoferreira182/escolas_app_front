import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsLayoutParent from '../layouts/TabsLayoutParents.vue'
import MainLayout from '../layouts/MainLayout.vue'
import  Login from '../views/Login.vue';
import  Register from '../views/Register.vue';
import waitingAproval from '../views/WaitingAproval.vue';
import waitingPermission from '../views/WaitingPermission.vue';
import parentsSocial from '../views/parents/Social.vue'
import parentsChat from '../views/parents/Chat.vue'
import parentsProfile from '../views/parents/Profile.vue'
import parentsMore from '../views/parents/More.vue'
import userPersonalData from '../views/parents/UserPersonalData.vue'
import postDetail from '../views/parents/postDetail.vue'
import addChild from '../views/parents/AddChild.vue'
import addParent from '../views/parents/AddParent.vue'
import childDetail from '../views/parents/ChildDetail.vue'
import parentDetail from '../views/parents/ParentDetail.vue'
import editProfile from '../views/parents/EditProfile.vue'
import solicitationsDetail from '../views/parents/SolicitationsDetail.vue'
import tabsLayoutWorkers from '../layouts/TabsLayoutWorkers.vue'
import workerClass from '../views/workers/Class.vue'
import workerChat from '../views/workers/Chat.vue'
import workerProfile from '../views/workers/Profile.vue'
import chatDetail from '../views/parents/ChatDetail.vue'

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
        path: '/waitingpermission',
        name: 'WaitingPermission',
        component: waitingPermission
      },
      {
        path: '/userPersonalData',
        name: 'UserPersonalData',
        component: userPersonalData
      },
      {
        path: '/addChild',
        name: 'AddChild',
        component: addChild
      },
      {
        path: '/addParent',
        name: 'AddParent',
        component: addParent
      },
      {
        path: '/childDetail',
        name: 'ChildDetail',
        component: childDetail
      },
      {
        path: '/parentDetail',
        name: 'ParentDetail',
        component: parentDetail
      },
      {
        path: '/solicitationsDetail',
        name: 'SolicitationsDetail',
        component: solicitationsDetail
      },
      {
        path: '/chatDetaill',
        name: 'ChatDetail',
        component: chatDetail
      },
      {
        path: '/tabsWorkers',
        name: 'TabsWorkers',
        component: tabsLayoutWorkers,
        children: [
          { path: '/', redirect: '/tabsWorkers/class'},
          { path: '/tabsWorkers/class', component: workerClass},
          { path: '/tabsWorkers/chat', component: workerChat},
          { path: '/tabsWorkers/profile', component: workerProfile},
        ]
      },
      {
        path: '/tabsParents',
        name: 'TabsParents',
        component: TabsLayoutParent,
        children: [
          { path: '/', redirect: '/tabsParents/social'},
          { path: '/tabsParents/social', component: parentsSocial },
          { path: '/tabsParents/chat', component: parentsChat },
          { path: '/tabsParents/profile', component: parentsProfile },
          { path: '/tabsParents/more', component: parentsMore },
        ]
      },
      { path: '/postDetail', component: postDetail },
      { path: '/editProfile', component: editProfile },
    ]
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
