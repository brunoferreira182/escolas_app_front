<template>
  <div class="card">
    <div class="even-card">
      <img 
        v-if="post.postData.resume.img"
        style="width: 100%; height: auto; object-fit: cover; object-position: center;"
        :src="utils.attachmentsAddress() + post.postData.resume.img.filename" class="img-style"
      />
      <div >
        <p class="q-px-md text-caption" v-if="post.routeDestination.split('?')[0] === '/calendarEventDetail'">
          Evento 
        </p>
        <h1 class="card-title">{{post.postData.resume.title}}</h1>
        <p class="q-px-md">
          {{ post.postData.resume.description.length > 50 ? post.postData.resume.description.slice(0, 50) + '...' : post.postData.resume.description }}
          <span v-if="post.postData.resume.description.length > 50"></span>
        </p>
        <ion-row>
          <ion-col class="q-ma-sm q-pt-md">
            <ion-row>
              <ion-col size="5">
                <div v-if="post.userReaction">
                  <ion-icon size="large" @click="clkRemoveReaction(post)" :src="heart_filled"/>{{ post.reactions }}
                </div>
                <div v-else-if="!post.userReaction" @click="clkReaction(heart, post)">
                  <ion-icon size="large" :src="heart"/>{{ post.reactions }}
                </div>
              </ion-col>
              <ion-col size="5">
                <div class="q-pa-xs" v-if="post.routeDestination === '/postDetail'">
                  <ion-icon style="width: 28px; height: 28px;" :src="comment"/> {{ post.comments }}
                </div>
              </ion-col>
            </ion-row>
          </ion-col>
          <ion-col>
            <div class="ion-text-end">
              <ion-button 
                v-if="post.routeDestination !== '/postDetail'"
                @click="$router.push(post.routeDestination )"
                fill="clear"
              >
                <h6>Ler mais</h6>
              </ion-button>
              <ion-button 
                v-else-if="post.routeDestination === '/postDetail'"
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
  <!-- <div v-if="i % 2 === 0" class="card">
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
                  <ion-icon size="large" @click="clkRemoveReaction(post)" src="/assets/icons/heart_filled.svg"/>{{ post.reactions }}
                </div>
                <div v-else-if="!post.userReaction" @click="clkReaction(heart, post)">
                  <ion-icon size="large" src="/assets/icons/heart.svg"/>{{ post.reactions }}
                </div>
              </ion-col>
              <ion-col size="5">
                <div class="q-pa-xs" v-if="post.routeDestination === '/postDetail'">
                  <ion-icon style="width: 28px; height: 28px;" src="/assets/icons/comment.svg"/> {{ post.comments }}
                </div>
              </ion-col>
            </ion-row>
          </ion-col>
          <ion-col>
            <div class="ion-text-end">
              <ion-button 
                v-if="post.routeDestination !== '/postDetail'"
                @click="$router.push(post.routeDestination )"
                fill="clear"
              >
                <h6>Ler mais</h6>
              </ion-button>
              <ion-button 
                v-else-if="post.routeDestination === '/postDetail'"
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
  </div> -->
  <!-- <div v-else class="card">
    <div class="even-card">
      <img 
        style="width: 100%; height: 150px; object-fit: cover; object-position: center;"
        v-if="post.postData.resume.img"
        :src="utils.attachmentsAddress() + post.postData.resume.img.filename" class="card-img"
      />
      <div>
        <h1 class="card-title">{{post.postData.resume.title}}</h1>
        <div v-if="post.routeDestination == '/calendarEventDetail'">
          dap´sldop
        </div>
        <ion-row>
          <ion-col class="q-ma-sm q-pt-md">
            <ion-row>
              <ion-col size="5">
                <div v-if="post.userReaction">
                  <ion-icon size="large" @click="clkRemoveReaction(post)" src="/assets/icons/heart_filled.svg"/>{{ post.reactions }}
                </div>
                <div v-else-if="!post.userReaction" @click="clkReaction(heart, post)">
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
                v-if="post.routeDestination !== '/postDetail'"
                @click="$router.push(post.routeDestination )"
                fill="clear"
              >
                <h6>Ler mais</h6>
              </ion-button>
              <ion-button 
                v-else-if="post.routeDestination === '/postDetail'"
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
  </div> -->
</template>

<script setup>
import utils from '../composables/utils'
import { useFetch } from '../composables/fetch'
import {
  IonPage,
  IonCol,
  IonRow,
  IonIcon,
  
  IonButton, 
} from '@ionic/vue'
import { 
  location,
  calendarOutline,
  chatboxOutline
} from 'ionicons/icons';
import heart from '/src/assets/icons/heart.svg'
import heart_filled from '/src/assets/icons/heart_filled.svg'
import smile from '/src/assets/icons/smile.svg'
import like from '/src/assets/icons/like.svg'
const props = defineProps(['post', 'i'])
</script>
<script>
export default {
  name: "SocialPost",
  data() {
    return {
    }
  },
  methods: {
    clkRemoveReaction(post) {
      const opt = {
        route: '/mobile/social/removePostReaction',
        body: {
          postId: post._id,
        }
      }
      useFetch(opt).then(r => {
        this.$emit('getPosts')
      })
    },
    clkReaction(icon, post) {
      const opt = {
        route: '/mobile/social/addNewPostReaction',
        body: {
          postId: post._id,
          // reaction: icon
        }
      }
      useFetch(opt).then(r => {
        this.$emit('getPosts')
      })
    },
  }
};
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