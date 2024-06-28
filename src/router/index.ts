import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsLayoutParent from '../layouts/TabsLayoutParents.vue'
import MainLayout from '../layouts/MainLayout.vue'
import Login from '../views/Login.vue';
import ChatUserAndWorker from '../views/ChatUserAndWorker.vue';
import Register from '../views/Register.vue';
import waitingAproval from '../views/WaitingAproval.vue';
import waitingPermission from '../views/WaitingPermission.vue';
import parentsSocial from '../views/parents/Social.vue'
import parentsChat from '../views/parents/Chat.vue'
// import parentProfile from '../views/Profile.vue'
import userPersonalData from '../views/parents/UserPersonalData.vue'
import postDetail from '../views/parents/PostDetail.vue'
import addChild from '../views/parents/AddChild.vue'
import addParent from '../views/parents/AddParent.vue'
import childDetail from '../views/parents/ChildDetail.vue'
import editProfile from '../views/parents/EditProfile.vue'
import solicitationsDetail from '../views/parents/SolicitationsDetail.vue'
import tabsLayoutWorkers from '../layouts/TabsLayoutWorkers.vue'
import workerClass from '../views/workers/Class.vue'
import workerChat from '../views/workers/Chat.vue'
import workerAttendance from '../views/workers/Attendance.vue'
// import workerProfile from '../views/Profile.vue'
import profile from '../views/Profile.vue'
import chatDetail from '../views/parents/ChatDetail.vue'
import noteSenderToUser from '../views/workers/NoteSenderToUser.vue'
import chatDetailWorker from '../views/parents/ChatDetail.vue'
import postReactions from '../views/parents/PostReactions.vue'
import chatInfo from '../views/ChatInfo.vue'
import createEvent from '../views/workers/CreateEvent.vue'
import eventDetailParent from  '../views/parents/EventDetail.vue'
import chatMedia from '../views/ChatMedia.vue'
import notesList from '../views/parents/NotesList.vue'
import notesListWorker from '../views/workers/NotesList.vue'
import userNotesList from '../views/parents/UserNotesList.vue';
import calendarParent from '../views/parents/Calendar.vue'
import calendarWorker from '../views/workers/Calendar.vue'
import storyDetail from '../views/parents/StoryDetail.vue'
import calendarEventDetail from '../views/workers/CalendarEventDetail.vue'
import Messenger from '../views/Messenger.vue';
import ChildrenAttendanceCalendar from '../views/ChildrenAttendanceCalendar.vue';
import ParentFiles from  '../views/parents/ParentFiles.vue'
import MealMenu from '../views/MealMenu.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import More from '../views/More.vue'
import ParentsSolicitationsHome from '../views/parents/SolicitationsHome.vue'
import NewParentSolicitation from '../views/parents/NewParentSolicitation.vue'
import SolicitationChatParent from '../views/parents/SolicitationChat.vue'
import SolicitationChatWorker from '../views/workers/SolicitationChat.vue'
import ChildrenMural from '../views/parents/ChildrenMural.vue'
import ChildMuralDetail from '../views/parents/ChildMuralDetail.vue'
import SolicitationsHomeWorkers from '../views/workers/SolicitationsHome.vue'

import TabsLayout from '../layouts/TabsLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '/login', component: Login },
      { path: '/ChatUserAndWorker', component: ChatUserAndWorker },
      { path: '/messenger', component: Messenger },
      {
        path: '/tabsLayout',
        component: TabsLayout,
        children: [
          { path: '/', redirect: '/tabsParents/social'},
          { path: '/tabsLayout/social', component: parentsSocial },
          { path: '/tabsLayout/solicitationsHome', component: ParentsSolicitationsHome },
          { path: '/tabsLayout/chat', component: parentsChat },
          { path: '/tabsLayout/childrenMural', component: ChildrenMural },
          { path: '/tabsLayout/more', component: More },
          { path: '/tabsLayout/attendance', component: workerAttendance},
          { path: '/tabsLayout/class', component: workerClass},
          { path: '/tabsLayout/chat', component: workerChat},
          { path: '/tabsLayout/more', component: More}
        ]
      },
      { path: '/register', component: Register },
      { path: '/waitingAproval', component: waitingAproval },
      { path: '/waitingpermission', component: waitingPermission },
      { path: '/userPersonalData', component: userPersonalData },
      { path: '/addChild', component: addChild },
      { path: '/addParent', component: addParent },
      { path: '/childDetail', component: childDetail },
      { path: '/parentFiles', component: ParentFiles },
      { path: '/solicitationsDetail', component: solicitationsDetail },
      { path: '/chatDetail', component: chatDetail },
      { path: '/chatDetailWorker', component: chatDetailWorker },
      { path: '/chatInfo', component: chatInfo },
      { path: '/eventDetail', component: eventDetailParent },
      { path: '/notesList', component: notesList },
      { path: '/notesListWorker', component: notesListWorker },
      { path: '/calendar', component: calendarParent },
      { path: '/calendarWorker', component: calendarWorker },
      { path: '/createEvent', component: createEvent },
      { path: '/postDetail', component: postDetail },
      { path: '/storyDetail', component: storyDetail },
      { path: '/calendarEventDetail', component: calendarEventDetail },
      { path: '/editProfile', component: editProfile },
      { path: '/postReactions', component: postReactions },
      { path: '/chatMedia', component: chatMedia },
      { path: '/mealMenu', component: MealMenu },
      { path: '/forgotPassword', component: ForgotPassword },
      { path: '/noteSenderToUser', component: noteSenderToUser },
      { path: '/userNotesList', component: userNotesList },
      { path: '/newParentSolicitation', component: NewParentSolicitation },
      { path: '/solicitationChatParent', component: SolicitationChatParent },
      { path: '/solicitationChatWorker', component: SolicitationChatWorker },
      { path: '/profile', component: profile },
      { path: '/childMuralDetail', component: ChildMuralDetail },
      { path: '/solicitationsHomeWorkers', component: SolicitationsHomeWorkers },
    ]
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
