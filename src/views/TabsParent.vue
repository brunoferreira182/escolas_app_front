<template>
  <ion-page>
    <ion-content>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar >
          <ion-tab-button tab="social" href="/socialPage">
            <ion-icon :icon="idCardOutline"></ion-icon>
            <ion-label>Social</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="chat" href="/chatPage">
            <ion-icon :icon="chatboxOutline"></ion-icon>
            <ion-label>Chat</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="profile" href="/profilePage">
            <ion-icon :icon="personCircleOutline" />
            <ion-label>Perfil</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="more" href="/morePage">
            <ion-icon :icon="ellipsisHorizontalOutline" />
            <ion-label>Mais</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonItem, 
  IonLabel, 
  IonList, 
  IonButton, 
  IonPage,
  IonContent, 
  IonButtons, 
  IonRouterOutlet,
  IonIcon, 
  IonTabButton,
  IonTabBar, 
  IonTabs  
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { useFetch } from '../composables/fetch.js';
import { useBackButton, useIonRouter, isPlatform } from '@ionic/vue';
import { App } from '@capacitor/app';
import { chatboxOutline } from 'ionicons/icons';
import { idCardOutline } from 'ionicons/icons';
import { personCircleOutline } from 'ionicons/icons';
import { ellipsisHorizontalOutline } from 'ionicons/icons';
import utils from '../composables/utils'
import pushService from '../composables/notifications'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
</script>

<script>
export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      
    };
  },
  methods: {
  }

});
</script>