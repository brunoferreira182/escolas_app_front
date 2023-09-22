<template>
  <div class="q-px-md ion-text-center q-mt-xl" style="position: relative;">
    <h1>
      Você ja pode começar a usar o app!
    </h1>
    <ion-button class="q-mt-md" @click="$router.replace('/tabs/home?updateTabs=true')">Iniciar</ion-button>
  </div>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonContent
} from '@ionic/vue';
// import { useFetch } from '../../composables/fetch'
</script>
<script>

export default {
  name: "FifthComponent",
  data() {
    return {
    };
  },
  // watch: {
  //   $route(to) {
  //     if (to.path === '/newDraftProcedureSelection') {
  //     }
  //   }
  // },
  // mounted(){

  // },
  // methods: {
  // }
};
</script>