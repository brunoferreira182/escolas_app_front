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
  </ion-page>
</template>
<script setup>

import {
  IonTabBar, IonTabButton, IonTabs, IonLabel,
  IonIcon,
  IonPage, IonRouterOutlet,
  IonFab, IonFabButton,
  IonModal, IonContent,
  IonImg, IonAvatar, IonAlert
} from '@ionic/vue';
import { 
  accessibility,
  chatboxOutline,
  personCircleOutline,
  ellipsisHorizontalOutline
} from 'ionicons/icons';
import utils from '../composables/utils'
import { useBackButton } from '@ionic/vue';
</script>
<script>
import { useFetch } from '@/composables/fetch';
export default {
  name: "TabsLayoutParents",
  data() {
    return {
      tabs: [
        { name: "turmas", icon: accessibility, to: '/tabsWorkers/class', label: "Alunos" },
        { name: "messenger", icon: chatboxOutline, to: '/tabsWorkers/chat', label: "Salas" },
        { name: "profile", icon: personCircleOutline, to: '/tabsWorkers/profile', label: "Perfil" },
      ],
      userProfile: [],
    };
  },
  watch: {
    $route(to, from) {
      if (this.$route.query.updateTabs === 'true') {
        utils.getUserInfoByToken().then(r => {
          this.userInfo = r.data
          if (r.data.isGuestUser === 1) this.tabs = this.tabsGuest
          else this.tabs = this.tabsUser
        })
      }
    }
  },
  beforeMount () {
  },
  mounted () {
  },
  methods: {
    verifyUserType () {
      
    },
    makeProfilePhotoUrl () {
      this.userProfilePhotoUrl = this.userInfo.profileImage ? `${utils.attachmentsAddress()}${this.userInfo.profileImage.filename}` : '../../assets/blank-profile-picture-973460.svg'
    }, 
    async clkTab (ev,tab) {
      this.selectedTab = tab.name
      this.$router.push(tab.to)
    },
    
  }
};
</script>

