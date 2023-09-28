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
  mounted () {
    this.startView()
    // utils.fetchIuguId()
    // utils.getIuguLib()
    this.backButtonManager()
    defineCustomElements(window)
  },
  methods: {
    async startView () {
      this.changeAppBar()
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
        console.log('deu back button', path)
        if (!ionRouter.canGoBack()) App.exitApp()
        else if (path === '/tabs/home' || path === '/login' || path === '/newAccount')
          App.exitApp()
        else this.$router.back()
      });
    },
    changeAppBar () {
      if (isPlatform('android')) {
        const styles = getComputedStyle(document.body);
        StatusBar.setStyle({ style: Style.Light });
        const color = styles.getPropertyValue('--ion-color-background-secondary').trim()
        // StatusBar.setOverlaysWebView( { overlay: true } )
        StatusBar.setBackgroundColor({ color })
      }
    },
    async checkUserAuthentication () {
      const ui = utils.presentUserInfo();
      if (!ui || !ui.token) { 
        this.$router.replace('/login')
        return
      }
      const r = await utils.getUserInfoByToken()
      if (r.error) {
        this.$router.push("/login")
        return
      } 
      this.userInfo = r.data;
      pushService.initPush()
      if(r.data.status === 'waitingApproval') {
        this.$router.push("/waitingAproval")
        return
      }
      if(r.data.status === 'active') {
        const permissions = await this.getUserPermissions()
        this.userPermissions = permissions.data
        if (this.userPermissions.length === 0){
          this.$router.push("/waitingPermission")
          return
        }
        this.userPermissions.forEach((p) => {
          if (p.role === 'IS_PARENT') {
            this.$router.push("/tabsParents")
            return
          }
          else if (p.role === 'IS_WORKER') {
            this.$router.push("/tabsWorkers")
            return
          }
        })
      }
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