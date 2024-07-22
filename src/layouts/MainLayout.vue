<template >
  <ion-page>
    <ion-content :scroll-y="false">
      <ion-router-outlet class="ion-router-outlet">
      </ion-router-outlet>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonContent,
  IonRouterOutlet,
  IonPage
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { useFetch } from '../composables/fetch.js';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useBackButton, useIonRouter, isPlatform } from '@ionic/vue';
import { App } from '@capacitor/app';
import utils from '../composables/utils'
import pushService from '../composables/notifications'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
</script>

<script>
export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      userPermissions: [],
    };
  },
  beforeMount () {
    App.addListener('appUrlOpen', (event) => {
      console.log(event, 'console event')
      console.log(event.url, 'console event url')
    })
  },
  mounted () {
    this.startView()
    utils.loading.hide()
    this.backButtonManager()
    defineCustomElements(window)
    // this.getCompanyColors()
  },
  methods: {
    async startView () {
      if (this.$route.path === '/login') return
      else this.checkUserAuthentication()
      
      
    },
    // async getUserPermissions(){
    //   const opt = {
    //     route:'/mobile/auth/getUserPermissions',
    //     body: {
    //       permissionType: 'mobile'
    //     }
    //   }
    //   return await useFetch(opt)
    // },
    backButtonManager () {
      const ionRouter = useIonRouter();
      useBackButton(10, () => {
        const path = this.$route.path
        if (!ionRouter.canGoBack()) App.exitApp()
        else if (path === '/tabsLayout/social' || path === '/login' || path === '/newAccount')
          App.exitApp()
        else this.$router.back()
      });
    },
    getCompanyColors () {
      const opt = {
        route: '/mobile/auth/getCompanyColors',
      }
      useFetch(opt).then(r => {
        if(!r.error){
          document.documentElement.style.setProperty('--ion-color-primary', r.data.primary);
          document.documentElement.style.setProperty('--ion-color-secondary', r.data.secondary);
          document.documentElement.style.setProperty('--ion-color-accent', r.data.accent);
        } else if (r.error) {
          utils.toast(r.errorMessage)
        }
      })
    },
    async checkUserAuthentication () {
      const ui = utils.presentUserInfo();
      if (!ui || !ui.token) { 
        this.$router.replace('/login')
        return
      }
      const r = await utils.getUserInfoByToken()
      if (r.error) { this.$router.push("/login"); return; } 
      this.userInfo = r.data;
      pushService.initPush()
      const verifyPerm = await utils.verifyUserPermissions(r.data)
      // if (verifyPerm.status === 'waitingPermission') {
      //   this.$router.push("/waitingPermission")
      //   return
      // } else if (verifyPerm.status === 'waitingApproval') {
      //   this.$router.push("/waitingApproval")
      //   return
      // }
      // this.$router.push("/tabsLayout/social")
    },
  }

});
</script>

<style>
body.dark {
  --ion-color-primary: #fd44fd;
}
</style>