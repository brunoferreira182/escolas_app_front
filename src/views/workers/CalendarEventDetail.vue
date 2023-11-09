<template>
  <ion-page>
    <ToolbarEscolas
      title="Detalhe do evento"
      :backButton="true"
    />
    <ion-content color="light">
      <ion-card >
        <ion-card-header>
          <ion-card-title class="text-capitalize">{{ eventDetail.eventName }}</ion-card-title>
          <ion-card-subtitle v-if="eventDetail && eventDetail.eventDate">         
            {{ eventDetail.eventDate.split('-')[2] }}/
            {{ eventDetail.eventDate.split('-')[1] }}/
            {{ eventDetail.eventDate.split('-')[0] }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          {{ eventDetail.eventDescription }}
        </ion-card-content>
        <div 
          style="display: flex; 
          align-items: center;" 
          class="q-px-md q-pb-md"
          v-if="!eventDetail.userReaction"
        >
          <ion-icon id="heartIcon" size="large" @click="clkReaction(heart)" src="/assets/icons/heart.svg" />
          <div style="margin-left: 70%;"  @click="$router.push('/postReactions?postId=' + $route.query.postId)">
            Curtidas
          </div>
        </div>
        <div 
          style="display: flex; 
          align-items: center;" 
          class="q-px-md q-pb-md"
          v-if="eventDetail.userReaction"
        >
          <ion-icon id="heartIcon" size="large" @click="clkReaction(heart)" src="/assets/icons/heart_filled.svg" />
          <div style="margin-left: 70%;"  @click="$router.push('/postReactions?postId=' + $route.query.postId)">
            Curtidas
          </div>
        </div>
      </ion-card>
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
  IonIcon,
  IonCardHeader,
  IonCardContent,
  } from '@ionic/vue';
  import heart from '/assets/icons/heart.svg'
import smile from '/assets/icons/smile.svg'
import like from '/assets/icons/like.svg'
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
      clkReaction(icon) {
        const opt = {
          route: '/mobile/social/addNewPostReaction',
          body: {
            postId: this.$route.query.schoolEventId,
            reaction: icon
          }
        }
        useFetch(opt).then(r => {
          this.getCalendarEventDetail()
          this.liked = true
        })
      },
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