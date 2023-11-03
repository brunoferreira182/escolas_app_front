<template>
  <div v-if="i % 2 === 0" class="card">
    <div class="even-card">
      <img 
        v-if="post.postData.resume.img"
        style="width: 100%; height: auto; object-fit: cover; object-position: center;"
        :src="utils.attachmentsAddress() + post.postData.resume.img.filename" class="img-style"
      />
      <div >
        <h1 class="card-title">{{post.postData.resume.title}}</h1>
        <p class="q-px-md">{{post.postData.resume.description}}</p>
        <ion-row>
          <ion-col class="q-ma-sm q-pt-md">
            <ion-row>
              <ion-col size="5">
                <div v-if="post.userReaction">
                  <ion-icon size="large" src="/assets/icons/heart_filled.svg"/>{{ post.reactions }}
                </div>
                <div v-else-if="!post.userReaction">
                  <ion-icon size="large" src="/assets/icons/heart.svg"/>{{ post.reactions }}
                </div>
              </ion-col>
              <ion-col size="5">
                <div class="q-pa-xs">
                  <ion-icon style="width: 28px; height: 28px;" src="/assets/icons/comment.svg"/> {{ post.comments }}
                </div>
              </ion-col>
            </ion-row>
          </ion-col>
          <ion-col>
            <div class="ion-text-end">
              <ion-button 
                @click="$router.push('/postDetail?postId=' + post._id)"
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
  <div v-else class="card">
    <div class="even-card">
      <img 
        style="width: 100%; height: 150px; object-fit: cover; object-position: center;"
        v-if="post.postData.resume.img"
        :src="utils.attachmentsAddress() + post.postData.resume.img.filename" class="card-img"
      />
      <div>
        <h1 class="card-title">{{post.postData.resume.title}}</h1>
        <ion-row>
          <ion-col class="q-ma-sm q-pt-md">
            <ion-row>
              <ion-col size="5">
                <div v-if="post.userReaction">
                  <ion-icon size="large" src="/assets/icons/heart_filled.svg"/>{{ post.reactions }}
                </div>
                <div v-else-if="!post.userReaction">
                  <ion-icon size="large" src="/assets/icons/heart.svg"/>{{ post.reactions }}
                </div>
              </ion-col>
              <ion-col size="5">
                <div class="q-pa-xs">
                  <ion-icon style="width: 28px; height: 28px;" src="/assets/icons/comment.svg"/> {{ post.comments }}
                </div>
              </ion-col>
            </ion-row>
          </ion-col>
          <ion-col>
            <div class="ion-text-end">
              <ion-button 
                @click="$router.push('/postDetail?postId=' + post._id)"
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
  IonRow,
  IonIcon,
  IonButton, 
} from '@ionic/vue'
import { 
  location,
  chatboxOutline
} from 'ionicons/icons';
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
  margin: 14px;
  font-size: 24px;;
}
.img-style {
  object-fit: cover;
  overflow: hidden;
}
.card-img {
  width: 100%; 
  height: 150px; 
  object-fit: contain;
  border-radius: 10px 0px 0px 0px
}

</style>