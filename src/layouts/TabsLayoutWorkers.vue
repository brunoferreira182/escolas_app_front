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
    <ion-alert
      v-if="familySolicitation"
      :is-open="dialogAcceptSolicitation.open"
      :header="`Você recebeu um convite de ${familySolicitation.sendBy} para participar da  ${familySolicitation.familyName }` " 
      :backdropDismiss="false"
      animated
      :buttons="[
        {
          text: 'Recusar',
          handler: () => {
            refuseFamilySolicitation()
          }
        },
        {
          text: 'Aceitar',
          handler: () => {
            acceptFamilySolicitation()
          }
        }
      ]"
    />
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
  idCardOutline,
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
        { name: "social", icon: idCardOutline, to: '/tabsParents/social', label: "Social" },
        { name: "messenger", icon: chatboxOutline, to: '/tabsParents/chat', label: "Chat" },
        { name: "profile", icon: personCircleOutline, to: '/tabsParents/profile', label: "Perfil" },
        { name: "more", icon: ellipsisHorizontalOutline, to: '/tabsParents/more', label: "Mais" },
      ],
      userProfile: [],
      familySolicitation: null,
      dialogAcceptSolicitation: {open: false}
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
    this.getFamiliesSolicitationsToUser()
  },
  methods: {
    getFamiliesSolicitationsToUser() {
      const opt = {
        route: '/mobile/parents/profile/getFamiliesSolicitationsToUser'
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente")
        }
        this.familySolicitation = r.data
        this.dialogUserAcceptSolicitation()
      })
    },
    acceptFamilySolicitation() {
      const opt = {
        route: '/mobile/parents/profile/respondFamiliesSolicitation',
        body: {
          solicitationsId: this.familySolicitation._id,
          respond: 'accepted' 
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente mais tarde.")
        }
      })
    },
    refuseFamilySolicitation() {
      const opt = {
        route: '/mobile/parents/profile/respondFamiliesSolicitation',
        body: {
          solicitationsId: this.familySolicitation._id,
          respond: 'refused' 
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente mais tarde.")
        }
      })
    },
    dialogUserAcceptSolicitation() {
      this.dialogAcceptSolicitation.open = true
    },
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

