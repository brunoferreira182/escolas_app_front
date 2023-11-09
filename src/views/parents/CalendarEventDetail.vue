<template>
  <ion-page>
    <ToolbarEscolas
      title="Detalhe do evento"
      :backButton="true"
    />
    <ion-content color="light">
      <ion-card >
        <!-- <img :src="utils.makeFileUrl(eventDetail.eventImage)" /> -->
        <ion-card-header>
          <ion-card-title class="text-capitalize">{{ eventDetail.eventName }}</ion-card-title>
          <ion-card-subtitle v-if="eventDetail && eventDetail.eventDate">         
            {{ eventDetail.eventDate.split('-')[2] }}/
            {{ eventDetail.eventDate.split('-')[1] }}/
            {{ eventDetail.eventDate.split('-')[0] }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          {{ eventDetail.eventDescription }} cu
        </ion-card-content>
      </ion-card>
      <div>
        <div style="display: flex; align-items: center;" class="q-mb-md">
          <ion-icon id="heartIcon" size="large" @click="clkReaction(heart)" src="/assets/icons/heart.svg"></ion-icon>
          <ion-icon id="smileIcon" size="large" @click="clkReaction(smile)" src="/assets/icons/smile.svg"></ion-icon>
          <ion-icon id="likeIcon" size="large" @click="clkReaction(icon)" src="/assets/icons/like.svg"></ion-icon>
          <div style="margin-left: 50%;"  @click="$router.push('/postReactions?postId=' + $route.query.postId)">
            <!-- {{post.reactions}} Reações  -->
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { 
  IonPage, 
  IonContent, 
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonCardContent,
  } from '@ionic/vue';
</script>

<script>
  import { defineComponent } from 'vue';
  import { useFetch } from '../../composables/fetch'
  import utils from '../../composables/utils'
  export default defineComponent({
    data() {
      return {
        eventDetail:{},
      }
    },
    beforeMount(){
      this.getCalendarEventDetail()
    },
    methods: {
      getCalendarEventDetail() {
        const opt = {
          route: '/mobile/social/getCalendarEventDetail',
          body: {
            schoolEventId: this.$route.query.schoolEventId
          }
        }
        useFetch(opt).then((r)=>{
          this.eventDetail = r.data
        })
      },
      // getSchoolEvents(){
      //   const opt = {
      //     route: '/mobile/social/getSchoolEvents',
      //     body: {
      //       page: 1,
      //       rowsPerPage: 100
      //     }
      //   }
      //   useFetch(opt).then((r) => {
      //     if (r.error) {
      //       utils.toast("Ocorreu um erro, tente novamente mais tarde")
      //       return
      //     }
      //     this.eventsList = r.data.list
      //   })
      // },
    }
  });
</script>