import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsLayoutParent from '../layouts/TabsLayoutParents.vue'
import MainLayout from '../layouts/MainLayout.vue'
import  Login from '../views/Login.vue';
import  ChatUserAndWorker from '../views/ChatUserAndWorker.vue';
import  Register from '../views/Register.vue';
import waitingAproval from '../views/WaitingAproval.vue';
import waitingPermission from '../views/WaitingPermission.vue';
import parentsSocial from '../views/parents/Social.vue'
import parentsChat from '../views/parents/Chat.vue'
import parentsProfile from '../views/parents/Profile.vue'
import parentsMore from '../views/parents/More.vue'
import userPersonalData from '../views/parents/UserPersonalData.vue'
import postDetail from '../views/parents/PostDetail.vue'
import addChild from '../views/parents/AddChild.vue'
import addParent from '../views/parents/AddParent.vue'
import childDetail from '../views/parents/ChildDetail.vue'
import parentDetail from '../views/parents/ParentDetail.vue'
import editProfile from '../views/parents/EditProfile.vue'
import solicitationsDetail from '../views/parents/SolicitationsDetail.vue'
import tabsLayoutWorkers from '../layouts/TabsLayoutWorkers.vue'
import workerClass from '../views/workers/Class.vue'
import workerChat from '../views/workers/Chat.vue'
import workerAttendance from '../views/workers/Attendance.vue'
import workerProfile from '../views/workers/Profile.vue'
import chatDetail from '../views/parents/ChatDetail.vue'

import chatDetailWorker from '../views/parents/ChatDetail.vue'

import postReactions from '../views/parents/PostReactions.vue'
import chatInfo from '../views/parents/ChatInfo.vue'
import chatInfoWorker from '../views/workers/ChatInfo.vue'
import createEvent from '../views/workers/CreateEvent.vue'
import eventDetailParent from  '../views/parents/EventDetail.vue'
import workerMore from '../views/workers/More.vue'
import chatMedia from '../views/ChatMedia.vue'
import notesList from '../views/parents/NotesList.vue'
import notesListWorker from '../views/workers/NotesList.vue'
import calendarParent from '../views/parents/Calendar.vue'
import calendarWorker from '../views/workers/Calendar.vue'
import storyDetail from '../views/parents/StoryDetail.vue'
import calendarEventDetail from '../views/workers/CalendarEventDetail.vue'
import Messenger from '../views/Messenger.vue';
import ChildrenAttendanceCalendar from '../views/ChildrenAttendanceCalendar.vue';
import ParentFiles from  '../views/parents/ParentFiles.vue'
import MealMenu from '../views/MealMenu.vue';


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
        path: '/ChatUserAndWorker',
        name: 'ChatUserAndWorker',
        component: ChatUserAndWorker
      },
      {
        path: '/messenger',
        name: 'Messenger',
        component: Messenger
      },
      // {
      //   path: '/childrenAttendanceCalendar',
      //   name: 'ChildrenAttendanceCalendar',
      //   component: ChildrenAttendanceCalendar
      // },
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
        path: '/parentFiles',
        name: 'ParentFiles',
        component: ParentFiles
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
        path: '/chatDetail',
        name: 'ChatDetail',
        component: chatDetail
      },
      {
        path: '/chatDetailWorker',
        name: 'ChatDetailWorker',
        component: chatDetailWorker
      },
      {
        path: '/chatInfo',
        name: 'ChatInfo',
        component: chatInfo
      },
      {
        path: '/chatInfoWorker',
        name: 'ChatInfoWorker',
        component: chatInfoWorker
      },
      {
        path: '/eventDetail',
        name: 'EventDetail',
        component: eventDetailParent
      },
 
      {
        path: '/notesList',
        name: 'NotesList',
        component: notesList
      },
      {
        path: '/notesListWorker',
        name: 'NotesListWorker',
        component: notesListWorker
      },
      {
        path: '/calendar',
        name: 'Calendar',
        component: calendarParent
      },
      {
        path: '/calendarWorker',
        name: 'CalendarWorker',
        component: calendarWorker
      },
      {
        path: '/createEvent',
        name: 'CreateEvent',
        component: createEvent
      },
      {
        path: '/tabsWorkers',
        name: 'TabsWorkers',
        component: tabsLayoutWorkers,
        children: [
          { path: '/', redirect: '/tabsWorkers/attendance'},
          { path: '/tabsWorkers/attendance', component: workerAttendance},
          { path: '/tabsWorkers/class', component: workerClass},
          { path: '/tabsWorkers/chat', component: workerChat},
          { path: '/tabsWorkers/profile', component: workerProfile},
          { path: '/tabsWorkers/more', component: workerMore}
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
          {
            path: '/childrenAttendanceCalendar',
            name: 'ChildrenAttendanceCalendar',
            component: ChildrenAttendanceCalendar
          },
        ]
      },
      { path: '/postDetail', component: postDetail },
      { path: '/storyDetail', component: storyDetail },
      { path: '/calendarEventDetail', component: calendarEventDetail },
      { path: '/editProfile', component: editProfile },
      { path: '/postReactions', component: postReactions },
      {
        path: '/chatMedia',
        name: 'ChatMedia',
        component: chatMedia
      },
      { path: '/mealMenu', component: MealMenu },
    ]
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
