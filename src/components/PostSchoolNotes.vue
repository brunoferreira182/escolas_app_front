<template>
  <ion-card>
    <ion-icon 
      class="bounce2"
      size="small" 
      :src="star"
      style="position: fixed; top: 15px; right: 15px;color: #ffd700;"
    />
    <ion-card-header >
      <div class="ion-text-wrap">{{ note.noteName }}</div>
    </ion-card-header>
    <ion-card-content class="ion-no-padding">
      <div class="ion-text-end">
        <ion-button 
          @click="$router.push('/notesList')"
          fill="clear"
        >
          <h6>Ler recados</h6>
        </ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import utils from '../composables/utils'
import {
  IonPage,
  IonImg,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonButton, 
} from '@ionic/vue'
import { 
  star
} from 'ionicons/icons';
const props = defineProps(['note', 'i'])
</script>

<style scoped>
.bounce2 {
  animation: bounce2 1.5s ease infinite;
}
@keyframes bounce2 {
	0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
	40% {transform: translateY(-10px);}
	60% {transform: translateY(-5px);}
}
.card {
  margin: 10px;
  border-radius: 0.4rem;
  overflow: hidden;
}
.even-card {
  height: 100px;
  background-color: var(--ion-card-background);
}

.card-title {
  margin: 14px;
}
.card-img {
  width: 100%; 
  height: 150px; 
  object-fit: contain;
  border-radius: 10px 0px 0px 0px
}

</style>