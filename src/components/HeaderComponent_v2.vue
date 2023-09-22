<template>
  <!-- <ion-header class="ion-no-border" style="margin-top: var(--ion-safe-area-top * -1)"> -->
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button
          @click="$router.back()"
          mode="ios"
          class="ion-no-padding"
          color="primary"
          fill="clear"
        >
          <ion-icon slot="icon-only" :icon="chevronBack"/>
        </ion-button>
      </ion-buttons>
      <ion-title>{{ props.title }}</ion-title>
    </ion-toolbar>
  <!-- </ion-header> -->
</template>

<script setup>

import {
  // IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { chevronBack } from 'ionicons/icons';

const props = defineProps(['title'])
</script>

<style scoped>
ion-toolbar {
  --background: white;
}
</style>