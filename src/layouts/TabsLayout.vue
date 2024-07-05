<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet style="height: 100%; background: var(--ion-color-light)" ></ion-router-outlet>
      <ion-tab-bar
        style="padding-bottom: var(--ion-safe-area-bottom);"
        ref="tabbar"
        slot="bottom"
        class="transition"
      >
        <ion-tab-button
          class="transition"
          v-for="tab in tabs"
          :key="tab.name"
          :tab="tab.name"
          @click="clkTab($event,tab)"
          :selected="$route.path === tab.to ? true : false"
        >
        <ion-icon :src="tab.icon" />
          <ion-label style="font-size: 12px;">{{ tab.label }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>

    <ion-fab
      slot="fixed"
      vertical="bottom"
      horizontal="end"
      style="margin-bottom: 50px; padding-bottom: var(ion-safe-area-bottom);"
      v-if="showSwitchButton || currentRoute.includes('social')"
      @click="switchViews"
    >
      <ion-fab-button size="small">
        <ion-icon :icon="reload"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>
<script setup>

import {
  IonTabBar, IonTabButton, IonTabs, IonLabel,
  IonIcon,
  IonPage, IonRouterOutlet,
  IonFab, IonFabButton,
  IonModal, IonContent,
  IonImg, IonAvatar, IonAlert,
  toastController
} from '@ionic/vue';
import { 
  idCardOutline,
  chatboxOutline,
  personCircleOutline,
  ellipsisHorizontalOutline,
  calendar,
  informationCircle,
  accessibility,
  reload
} from 'ionicons/icons';
import utils from '../composables/utils'
import { useBackButton } from '@ionic/vue';
import { useUserPermissions } from '@/stores/userPermissions'
import { useCurrentView } from '@/stores/currentView'
</script>
<script>
import { useFetch } from '@/composables/fetch';
export default {
  name: "TabsLayout",
  data() {
    return {
      tabs: null,
      tabsParents: [
        { name: "social", icon: idCardOutline, to: '/tabsLayout/social', label: "Social" },
        { name: "solicitations", icon: informationCircle, to: '/tabsLayout/solicitationsHome', label: "Atend." },
        { name: "mural", icon: accessibility, to: '/tabsLayout/childrenMural', label: "Mural" },
        { name: "messenger", icon: chatboxOutline, to: '/tabsLayout/chat' , label: "Sala" },
        { name: "more", icon: ellipsisHorizontalOutline, to: '/tabsLayout/more', label: "Mais" },
      ],
      tabsWorkers: [
        { name: "social", icon: idCardOutline, to: '/tabsLayout/social', label: "Social" },
        { name: "attendance", icon: calendar, to: '/tabsLayout/attendance', label: "Presença" },
        { name: "turmas", icon: accessibility, to: '/tabsLayout/class', label: "Atividades" },
        { name: "messenger", icon: chatboxOutline, to: '/tabsLayout/chatWorkers', label: "Salas" },
        { name: "more", icon: ellipsisHorizontalOutline, to: '/tabsLayout/more', label: "Mais" },
      ],
      userProfile: [],
      userPermissions: null,
      showSwitchButton: false,
      currentRoute: null
    };
  },
  beforeMount () {
    this.currentRoute = this.$route.path
    console.log("🚀 ~ beforeMount ~ this.currentRoute:", this.currentRoute)
  },
  watch: {
    $route(to, from) {
      this.currentRoute = this.$route.path
      if (to.path === '/tabsLayout/social') {
        this.verifyShowSwitchButton()
      }
    }
  },
  mounted () {
    this.verifyView()
  },
  methods: {
    makeProfilePhotoUrl () {
      this.userProfilePhotoUrl = this.userInfo.profileImage ? `${utils.attachmentsAddress()}${this.userInfo.profileImage.filename}` : '../../assets/blank-profile-picture-973460.svg'
    }, 
    async clkTab (ev,tab) {
      this.selectedTab = tab.name
      this.$router.push(tab.to)
    },
    verifyShowSwitchButton () {
      if (this.currentRoute.includes('social') && this.userPermissions.permissions.includes('IS_WORKER')) {
        this.showSwitchButton = true
      } else {
        this.showSwitchButton = false
      }
    },
    verifyView () {
      const userPermissions = useUserPermissions()
      const currentView = useCurrentView()
      this.userPermissions = userPermissions
      if (userPermissions.permissions.includes('IS_WORKER')) {
        this.tabs = this.tabsWorkers
        currentView.set('worker')
      } else {
        this.tabs = this.tabsParents
        currentView.set('parent')
      }
      this.verifyShowSwitchButton()
    },
    switchViews () {
      const currentView = useCurrentView()
      if (this.tabs === this.tabsParents) {
        this.tabs = this.tabsWorkers
        currentView.set('worker')
        this.customToast('Você está na visualização de funcionário')
      } else {
        this.tabs = this.tabsParents
        currentView.set('parent')
        this.customToast('Você está na visualização de familiar')
      }
    },
    async customToast (message) {
      const t = await toastController.create({
        message,
        duration: 2500,
        color: 'primary',
        position: 'top',
        buttons: [
          {
            text: 'Fechar',
            role: 'cancel',
            handler: () => { this.handlerMessage = 'Dismiss clicked'; }
          }
        ]
      })
      await t.present()
    },
  }
};
</script>


