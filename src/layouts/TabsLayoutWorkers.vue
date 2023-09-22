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
  IonImg, IonAvatar,
} from '@ionic/vue';
import { 
  home,
  person,
  chatbox
} from 'ionicons/icons';
import utils from '../composables/utils'
import { useBackButton } from '@ionic/vue';
</script>
<script>

export default {
  name: "TabsLayout",
  data() {
    return {
      tabs: [],
      tabsGuest: [
        { name: "home", icon: "/assets/home.svg", to: '/tabs/home', label: "Início" },
        { name: "profile", icon: "/assets/user.svg", to: '/profile', label: "Perfil" },
      ],
      tabsParents: [
        { name: "home", icon: "/assets/home.svg", to: '/tabs/home', label: "Início" },
        { name: "messenger", icon: '/assets/message2.svg', to: '/tabs/messenger', label: "Messenger" },
        { name: "serviceAgreements", icon: '/assets/agreement2.svg', to: '/serviceAgreementsList', label: "Serviços" },
        { name: "profile", icon: "/assets/user.svg", to: '/profile', label: "Perfil" },
      ],
      tabsWorkers: [
        { name: "home", icon: "/assets/home.svg", to: '/tabs/home', label: "Início" },
        { name: "messenger", icon: '/assets/message2.svg', to: '/tabs/messenger', label: "Messenger" },
        { name: "serviceAgreements", icon: '/assets/agreement2.svg', to: '/serviceAgreementsList', label: "Serviços" },
        { name: "profile", icon: "/assets/user.svg", to: '/profile', label: "Perfil" },
      ],
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
    utils.getUserInfoByToken().then(r => {
      this.userInfo = r.data
      if (r.data.isGuestUser === 1) this.tabs = this.tabsGuest
      else {
        this.tabs = this.tabsUser
        utils.fetchIuguId()

      }
    })
  },
  methods: {
    verifyUserType () {
      const userType = utils.userType.get()
      // if (!userType) this.$router.replace('/login')
      if (userType.name === 'serviceProvider') this.tabs.push({
        name: 'provider',
        icon: '/assets/bookmark.svg',
        to: '/providerProfile',
        label: 'Prestador'
      })
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
<style>
ion-tab-bar {
  --background: #fff;
  border: 0.1px solid #ebebec;
}
</style>
