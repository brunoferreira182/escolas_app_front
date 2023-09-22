<template>
  <ion-grid >
    <ion-row 
      class="ion-justify-content-around ion-align-items-center" 
      style="border-radius: 2.5rem 2.5rem 0rem 0rem"
    >
      <ion-col class="ion-no-padding" style="margin-left: -20px;">
        <ion-button mode="ios" style="text-transform: none;" @click="$router.push('/UserProfile')" class="no-padding" fill="clear">
          Olá, {{ userInfo.userName ? userInfo.userName.split(' ')[0].charAt(0).toUpperCase() + userInfo.userName.split(' ')[0].slice(1).toLowerCase() : '' }}!
        </ion-button>
      </ion-col>
      <ion-col class="ion-text-right">
        <ion-button 
          style="margin-right: -35px;"
          fill="clear"
          @click="$router.push('/UserData')"
          shape="round"
        >
          Gerência
          <ion-icon slot="end" :icon="chevronForward"></ion-icon>
        </ion-button>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>


<script setup>
import {
  IonRow, 
  IonCol, 
  IonGrid,
  IonIcon,
  IonButton,
} from '@ionic/vue';
import { chevronForward } from 'ionicons/icons';
</script>
<script>

export default {
  name: "UserInfoBarComponent",
  props: ['userInfo'],
  data() {
    return {
      chevronForward,
    }
  },
};
</script>

