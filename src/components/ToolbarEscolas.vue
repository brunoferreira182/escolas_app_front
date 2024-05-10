<template>
  <ion-header class="ion-no-border" style="margin-top: var(--ion-safe-area-top * -1)">
    <ion-toolbar>
      <ion-buttons slot="start" >
        <ion-button
          v-if="backButton"
          @click="$router.back()"
          mode="ios"
          class="ion-no-padding"
          color="primary"
          fill="clear"
        >
          <ion-icon slot="icon-only" :icon="chevronBack"/>
        </ion-button>
      </ion-buttons>
      <ion-title @click="titleClicked">
        {{ props.title }}
      </ion-title>
    </ion-toolbar>
  </ion-header>
</template>

<script setup>

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem, IonToggle,
} from '@ionic/vue';
import { chevronBack, contrast } from 'ionicons/icons';
import { defineComponent, ref } from 'vue';

const props = defineProps(['title', 'backButton'])
const emits = defineEmits(['titleClicked'])
const themeToggle = ref(false);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const toggleDarkTheme = (shouldAdd) => {
  document.body.classList.toggle('dark', shouldAdd);
};

const initializeDarkTheme = (isDark) => {
  themeToggle.value = isDark;
  toggleDarkTheme(isDark);
};

initializeDarkTheme(prefersDark.matches);

prefersDark.addEventListener('change', (mediaQuery) => initializeDarkTheme(mediaQuery.matches));

const toggleChange = (ev) => {
  toggleDarkTheme(ev.detail.checked);
};

function titleClicked () {
  emits('titleClicked')
}
</script>