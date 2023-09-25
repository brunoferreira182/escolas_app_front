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
      <ion-title>{{ props.title }}</ion-title>
      <ion-buttons slot="end" >
        <ion-toggle :checked="themeToggle" @ionChange="toggleChange($event)" justify="space-between"/>
      </ion-buttons>
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

const themeToggle = ref(false);

// Use matchMedia to check the user preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Add or remove the "dark" class on the document body
const toggleDarkTheme = (shouldAdd) => {
  document.body.classList.toggle('dark', shouldAdd);
};

// Check/uncheck the toggle and update the theme based on isDark
const initializeDarkTheme = (isDark) => {
  themeToggle.value = isDark;
  toggleDarkTheme(isDark);
};

// Initialize the dark theme based on the initial
// value of the prefers-color-scheme media query
initializeDarkTheme(prefersDark.matches);

// Listen for changes to the prefers-color-scheme media query
prefersDark.addEventListener('change', (mediaQuery) => initializeDarkTheme(mediaQuery.matches));

// Listen for the toggle check/uncheck to toggle the dark theme
const toggleChange = (ev) => {
  toggleDarkTheme(ev.detail.checked);
};
</script>

<style scoped>
/* ion-toolbar {
  --background: white;
} */
</style>