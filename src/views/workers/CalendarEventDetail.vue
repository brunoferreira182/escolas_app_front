<template>
  <ion-page>
    <ToolbarEscolas
      title="Detalhe do evento"
      :backButton="true"
    />
    <ion-content class="ion-padding" color="light" v-if="eventDetail">
      <ion-card>
        <img :src="utils.makeFileUrl(eventDetail.eventImage)" />
        <ion-card-header>
          
          <ion-card-title>{{ eventDetail.eventName }}</ion-card-title>
          <ion-card-subtitle v-if="eventDetail.eventDate">
            {{ eventDetail.eventDate.split('-')[2] }}/
            {{ eventDetail.eventDate.split('-')[1] }}/
            {{ eventDetail.eventDate.split('-')[0] }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="q-px-lg">
          {{ eventDetail.eventDescription }}
        </ion-card-content>
      </ion-card>
      <div v-if="eventDetail.requireParentsPermission">
        <h2 class="q-px-lg">Autorizar crianças</h2>
        <ion-list :inset="true">
          <div  
            v-for="child in childrenData"
            :key="child"
          >
            <ion-item 
              v-if="child.isResponsibleAdmin"
            >
              <div class="unread-indicator-wrapper" slot="start">
                <div class="unread-indicator"></div>
              </div>
              <ion-label >
                <strong class="ion-text-capitalize">{{ child.childName }}</strong><br/>
              </ion-label> <br/>
              <div v-if="child.childPermission">
                <ion-button 
                  fill="flat" 
                  style="color: #2dd36f;" 
                  icon
                  size="default"
                >
                  <ion-icon slot="start" :icon="checkmarkCircleOutline"></ion-icon>
                  Autorizado
                </ion-button>
                <div class="q-pa-xs q-px-md text-caption text-capitalize">
                  Por {{ child.responsibleLabel }}
                </div>
              </div>
              <ion-button 
                v-else
                fill="flat" 
                style="color: #3880ff;" 
                icon
                size="default"
                @click="acceptAuthorization(child)"
              >
                <ion-icon slot="end" :icon="checkmarkOutline"></ion-icon>
                Autorizar
              </ion-button>
            
            </ion-item>
          </div>
        </ion-list>
      </div>
    </ion-content>
    <!-- <ion-content color="light">
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
    </ion-content> -->
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
  IonItem,
  IonList,
  IonButton,
  IonLabel,
  IonIcon,
  IonCardHeader,
  IonCardContent,
} from '@ionic/vue';
import { trashOutline, checkmarkOutline, checkmarkCircleOutline } from 'ionicons/icons';
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
      childrenData:[],
    }
  },
  beforeMount(){
    this.getCalendarEventDetail()
    this.getParentChildrenByUserId()
  },
  methods: {
    
    acceptAuthorization(child) { 
      console.log(child, 'posdkfpodsfpofkgpoafrdgpofdpoijhpoijg')
      const opt = {
        route: '/mobile/social/insertUserInSchoolEvent',
        body: {
          schoolEventId: this.$route.query.schoolEventId,
          childId: child.childId,
          parentsPermission: true,
        }
      } 
      useFetch(opt).then((r) => {
        if(r.error) {
          utils.toast("Ocorreu um erro, tente novamente")
        } else {
          utils.toast("Autorização enviada com sucesso.")
          this.getCalendarEventDetail()
          this.getParentChildrenByUserId()
        }
      })
    },
    getParentChildrenByUserId() {
      const opt = {
        route: '/mobile/social/getParentChildrenByUserId',
        body:{
          schoolEventId: this.$route.query.schoolEventId
        }
      }
      useFetch(opt).then(r => {
        this.childrenData = r.data.childData
      })
    },
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