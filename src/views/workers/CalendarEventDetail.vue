<template>
  <ion-page>
    <ToolbarEscolas
      title="Detalhe do evento"
      :backButton="true"
    />
    <ion-content color="light" v-if="eventDetail">
      <ion-card>
        <img v-if="eventDetail.images && eventDetail.images.filename" :src="utils.makeFileUrl(eventDetail.images.filename)" />
        <img v-else :src="utils.makeFileUrl(eventDetail.eventImage)" />

        <ion-card-header>
          <ion-card-title>{{ eventDetail.eventName }}</ion-card-title>
          <ion-card-subtitle v-if="eventDetail.eventDate">
            Dia
            {{ eventDetail.eventDate.split('-')[2] }}/
            {{ eventDetail.eventDate.split('-')[1] }}/
            {{ eventDetail.eventDate.split('-')[0] }}
            <div class="q-py-sm" v-if="eventDetail.deadlinePayment">
              Data final para pagamento 
              {{ eventDetail.deadlinePayment.split('-')[2] }}/
              {{ eventDetail.deadlinePayment.split('-')[1] }}/
              {{ eventDetail.deadlinePayment.split('-')[0] }}
            </div>
          </ion-card-subtitle>
          <div class="q-py-md" v-if="eventDetail.paymentValue">
            Contribuição de {{ eventDetail.paymentValue }} reais
          </div>
        </ion-card-header>
        <ion-card-content class="q-py-sm">
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
              <!-- <div class="unread-indicator-wrapper" slot="start">
                <div class="unread-indicator"></div>
              </div> -->
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
                <!-- <div class="q-pa-xs q-px-md text-caption text-capitalize">
                  Por {{ child.responsibleLabel }}
                </div> -->
              </div>
              <ion-button 
                v-else
                fill="flat" 
                color="primary"
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
      <div>
        <h2 class="q-px-lg"> Autorizados </h2>
        <ion-list class="justify-between" :inset="true">
          <ion-item
            v-for="child in childList.list"
            :key="child"
          >
            <ion-label> 
              <strong class="text-capitalize">
                {{ child.name }}
              </strong>
              <!-- <div>
                {{ child.document }}
              </div> -->
            </ion-label>
          </ion-item>
        </ion-list>
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
import { defineComponent } from 'vue'
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'
export default defineComponent({
  data() {
    return {
      eventDetail:{},
      childrenData:[],
      childList:[]
    }
  },
  mounted(){
    this.getChildrenByEventId()
    this.getCalendarEventDetail()
    this.getParentChildrenByUserId()
  },
  methods: {
    getChildrenByEventId (){
      const opt = {
        route:"/mobile/workers/getChildrenByEventId",
        body:{
        page: 1,
        rowsPerPage: 50,
        schoolEventId: this.$route.query.schoolEventId
        },
      };
      utils.loading.show();
      useFetch(opt).then((r) => {
        utils.loading.hide()
        if(r.error){
          utils.toast('Ocorreu um erro, tente novamente mais tarde.')
          return
        } else {
          this.childList = r.data
        }
      });
    },    
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