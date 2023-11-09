<template>
  <div class="card" >
    <div class="even-card">
      <ion-img 
        v-if="story.postData.resume.img"
        :src="utils.attachmentsAddress() + story.postData.resume.img.filename" class="card-img"
        style="width: 100%; height: 150px; object-fit: cover; object-position: center;"
      />
      <h1 class="card-title">{{ story.postData.resume.title }}</h1>
      <p class="q-px-md">
        {{ story.postData.resume.description.length > 20 ? story.postData.resume.description.slice(0, 20) + '...' : story.postData.resume.description }}
        <span v-if="story.postData.resume.description.length > 20"></span>
        <div class="ion-text-end">
          <ion-button 
            @click="$router.push('/postDetail?postId=' + story._id)"
            fill="clear"
          >
            <h6>Ler mais</h6>
          </ion-button>
        </div>
      </p>
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
const props = defineProps(['story', 'i'])
</script>

<style scoped>

.card {
  margin: 10px;
  border-radius: 0.4rem;
  overflow: hidden;
}
.even-card {
  height: 302px;
  background-color: var(--ion-card-background);
}

.card-title {
  margin: 14px;
  font-size: 24px;;
}
.card-img {
  width: 100%; 
  height: 150px; 
  object-fit: contain;
  border-radius: 10px 0px 0px 0px
}

</style>