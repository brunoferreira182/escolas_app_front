<template>
  <ion-modal :isOpen="modalLastMessage" @willDismiss="closeModal()">
    <ion-content>
      <ion-header>
        <ion-toolbar>
          <ion-title>Quem leu</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal()">Fechar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <ion-item v-for="item in usersReadersMsg" :key="item" lines="full">
          <ion-avatar aria-hidden="true" slot="start">
            <img :src="utils.makeFileUrl(item.userImage?.filename, 'thumbnail')" />
          </ion-avatar>
          <ion-label class="ion-text-nowrap">
            <h3> {{ item.userDetails.name }}</h3>
            <p>{{ item.userDetails.email }}</p>
          </ion-label>
          <ion-icon :icon="double_check" slot="end" class="q-ma-md"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import utils from '../../src/composables/utils.js';
import double_check from '../assets/double_check.svg'
import {
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonAvatar,
  IonTitle,
  IonLabel,
  IonIcon,
  IonList,
  IonItem,
  IonButtons,
  IonButton,
} from '@ionic/vue';

const props = defineProps(['usersReadersMsg', 'modalLastMessage']);
const emits = defineEmits(['modalLastMessage']);

const closeModal = () => {
  emits('modalLastMessage');
};
</script>
