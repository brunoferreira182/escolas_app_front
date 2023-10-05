<template>
  <div class="card" >
    <div class="even-card">
      <ion-icon 
        class="bounce2"
        size="large" 
        :src="star"
        style="position: absolute; top: 15px; right: 20px; color: #ffd700;"
      />
      <ion-img 
        v-if="event.postData.resume.img"
        :src="utils.attachmentsAddress() + event.postData.resume.img.filename" class="card-img"
        style="width: 100%; height: 200px; object-fit: cover; object-position: center;"
      >
        
      </ion-img>
      <div >
        <h1 class="card-title">{{ event.postData.resume.title }}</h1>
        <p class="q-px-md">
          {{ event.postData.resume.description.length > 50 ? event.postData.resume.description.slice(0, 50) + '...' : event.postData.resume.description }}
          <span v-if="event.postData.resume.description.length > 50"></span>
        </p>
        <ion-row>
          <ion-col>
            <div class="ion-text-end">
              <ion-button 
                @click="$router.push('/postDetail?postId=' + event._id)"
                fill="clear"
              >
                <h6>Ler mais</h6>
              </ion-button>
            </div>
          </ion-col>
        </ion-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import utils from '../composables/utils'
import {
  IonPage,
  IonCol,
  IonImg,
  IonRow,
  IonIcon,
  IonButton, 
} from '@ionic/vue'
import { 
  star
} from 'ionicons/icons';
const props = defineProps(['event', 'i'])
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
  height: 382px;
  background-color: var(--ion-card-background);
}

.card-title {
  margin: 14px;
  font-size: 24px;;
}
.card-img {
  width: 100%; 
  height: 200px; 
  object-fit: contain;
  border-radius: 10px 0px 0px 0px
}

</style>