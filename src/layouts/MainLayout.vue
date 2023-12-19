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
// import { useSubscriptionDataStore } from '../stores/subscriptionData'
// const subscriptionDataStore = useSubscriptionDataStore()
</script>

<script>
export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      userPermissions: [],
      appVersion: "",
      mainClass: 'main-white',
      // subscriptionDataStore: useSubscriptionDataStore()
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
    // utils.fetchIuguId()
    // utils.getIuguLib()
    this.backButtonManager()
    defineCustomElements(window)
    this.getCompanyColors()
  },
  methods: {
    async startView () {
      // this.changeAppBar()
      if (this.$route.path === '/login') return
      else this.checkUserAuthentication()
      
    },
    async getUserPermissions(){
      const opt = {
        route:'/mobile/auth/getUserPermissions',
        body: {
          permissionType: 'mobile'
        }
      }
      return await useFetch(opt)
    },
    backButtonManager () {
      const ionRouter = useIonRouter();
      useBackButton(10, () => {
        const path = this.$route.path
        // console.log('deu back button', path)
        if (!ionRouter.canGoBack()) App.exitApp()
        else if (path === '/tabs/home' || path === '/login' || path === '/newAccount')
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
          console.log(document.documentElement.style.getPropertyValue('--ion-color-primary'), 'document.documentElement.style')
          document.documentElement.style.setProperty('--ion-color-primary', r.data.primary);
          document.documentElement.style.setProperty('--ion-color-secondary', r.data.secondary);
          document.documentElement.style.setProperty('--ion-color-accent', r.data.accent);
        }else if(r.error){
          utils.toast(r.errorMessage)
        }
      })
    },
    // changeAppBar () {
    //   if (isPlatform('android')) {
    //     const styles = getComputedStyle(document.body);
    //     StatusBar.setStyle({ style: Style.Light });
    //     const color = styles.getPropertyValue('--ion-color-background-secondary').trim()
    //     StatusBar.setBackgroundColor({ color })
    //   }
    // },
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
      utils.verifyUserPermissions(r.data)
    },
  }

});
</script>

<style scoped>
.main-white {
  background-color: white;
}
.main-gradient {
  background-image: radial-gradient(ellipse at left, #3733b6, #c078fc,#869bf6)
}
</style>