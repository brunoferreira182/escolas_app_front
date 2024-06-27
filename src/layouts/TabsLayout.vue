<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet style="height: 100%;"></ion-router-outlet>
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
      style="margin-bottom: 50px"
      v-if="showSwitchButton && currentRoute.includes('social')"
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
        { name: "messenger", icon: chatboxOutline, to: '/tabsLayout/chat', label: "Salas" },
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
      this.userPermissions = userPermissions
      if (userPermissions.permissions.includes('IS_WORKER')) {
        this.tabs = this.tabsWorkers
      } else {
        this.tabs = this.tabsParents
      }
      this.verifyShowSwitchButton()
    },
    switchViews () {
      if (this.tabs === this.tabsParents) {
        this.tabs = this.tabsWorkers
        utils.toast('Você está na visualização de funcionário')
      } else {
        this.tabs = this.tabsParents
        utils.toast('Você está na visualização de familiar')
      }
    }
  }
};
</script>

