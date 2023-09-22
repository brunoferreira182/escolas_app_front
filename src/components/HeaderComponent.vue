<template>
  <!-- <div style="height: 60px;background: #fff;"></div> -->
  <ion-content 
    :scroll-y="false"
    :style="
      `height: 50px;
      --background: rgba(255,255,255,0.97);
      translate: 0 -60px;
      position: fixed;
      z-index: 100;
      box-shadow: 0 0 10px 10px rgba(255,255,255,0.97)`"
    >
    <div 
      style="
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      height:60px;"
    >
      <ion-button
        @click="$router.back()"
        mode="ios"
        class="ion-no-padding"
        color="primary"
        fill="clear"
        style="position: absolute;left: 10px;"
      >
        <ion-icon slot="icon-only" :icon="chevronBack"/>
      </ion-button>
      <Transition name="fade">
        <ion-row>
          <!-- <ion-avatar v-if="avatar" style="height:45px; width:45px" @click="clkHeader">
            <ion-img :src="avatar"/>
          </ion-avatar> -->
          <ion-title v-if="userId" color="primary">
            {{ title }} <br>
            <div
              v-if="subtitle"
              style="font-size: x-small"
            >{{ subtitle }}</div>
          </ion-title>
          <ion-title v-if="title && !userId" >{{ title }}</ion-title>
        </ion-row>
        <!-- <h4
          v-if="title"
          class="ion-text-center ion-no-margin"
          
          >
          {{title}}
        </h4> -->
      </Transition>
    </div>
  </ion-content>
</template>

<script setup>
import {
  IonHeader, 
  IonToolbar, 
  IonBackButton, 
  IonTitle, 
  IonButtons,
  IonText,
  IonButton,
  IonCol,
  IonBadge,
  IonAvatar,
  IonImg,
  IonRow,
  IonContent,
  IonIcon,
} from '@ionic/vue';
import { search, exitOutline, notifications, menu, chevronBack,close } from 'ionicons/icons';
import utils from '../composables/utils'
import { useFetch } from '@/composables/fetch';
</script>

<script>
export default {
  name: "HeaderComponent",
  props: [
    'subtitle',
    'title',
    'shadow',
    'logo',
    'transparent',
    'back',
    'userId',
    'avatar',
    'closeButton'
  ],
  data() {
    return {
      selectedProcedures: 0,
    };
  },
  mounted () {
  },

};
</script>

<style>
ion-badge {
    --border-radius: 5rem, 5rem, 5rem, 5rem;
    --color: white;
  }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>