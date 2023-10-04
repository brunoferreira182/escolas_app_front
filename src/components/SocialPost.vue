<template>
    <div v-if="i % 2 === 0" class="card">
      <div class="even-card">
        <img 
          v-if="post.postData.resume.img"
          :src="utils.attachmentsAddress() + post.postData.resume.img.filename" class="card-img">
        <div style="padding:10px">
          <h1 class="card-title">{{post.postData.resume.title}}</h1>
          <div>
            Comentários: {{ post.comments }}
          </div>
          <div>
            Reações: {{ post.reactions }}
          </div>
          <p>{{post.postData.resume.description}}</p>
          <div class="ion-text-end">
            <ion-button 
              @click="$router.push('/postDetail?postId=' + post._id)"
              fill="clear"
            >
              Ler mais
            </ion-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="card">
      <div class="even-card">
        <img 
          v-if="post.postData.resume.img"
          :src="utils.attachmentsAddress() + post.postData.resume.img.filename" class="card-img">
        <div style="padding:10px">
          <h1 class="card-title">{{post.postData.resume.title}}</h1>
          <div>
            Comentários: {{ post.comments }}
          </div>
          <div>
            Reações: {{ post.reactions }}
          </div>
          <p>{{post.postData.resume.description }}</p>
          <div class="ion-text-end text-black" >
            <ion-button
              @click="$router.push('/postDetail?postId=' + post._id)"
              fill="clear"
            >
              Ler mais
            </ion-button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import utils from '../composables/utils'
import {
  IonPage,
  IonButton, 
} from '@ionic/vue'
const props = defineProps(['post', 'i'])
</script>

<style scoped>
.card {
  margin: 10px;
  border-radius: 0.4rem;
  overflow: hidden;
}
.even-card {
  background-color: var(--ion-card-background);
}

.card-title {
  margin: 0px;
  font-size: 24px;

  margin-bottom: 10px;
  font-size: 24px;;
}
.card-img {
  border-radius: 0.4rem;
}

</style>