<template>
  <ion-page>
    <ToolbarEscolas
      title="Informações"
      :backButton="true"
    />
    <ion-content class="ion-padding" color="light" v-if="eventDetail">
      <ion-row class="ion-justify-content-center q-ma-lg">
        <ion-avatar style="width:108px; height:108px">
          <img :src="utils.makeFileUrl(eventDetail.eventImage)"/>
        </ion-avatar> 
      </ion-row>
      <div class="ion-text-center">
        <h2>{{ eventDetail.eventName }}</h2>
        <p>{{ eventDetail.eventDescription }}</p>
        <p>{{ eventDetail.eventDate.local }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonButton,
  IonAlert,
  IonGrid,
  IonText,
  IonInput,
  IonRow,
  IonItem,
  IonLabel,
  IonCol,
  IonList,
  IonAvatar,
  IonBadge,
  IonContent,
  onIonViewWillEnter,
  IonIcon
} from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
import { useFetch } from '../../composables/fetch'
import InputDocument from '../../components/InputDocument.vue'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
import PhotoHandler from '../../components/PhotoHandler.vue'
</script>
<script>

export default {
  name: "EventDetail",
  data() {
    return {
      eventDetail: null,
      pagination: {
        page: 1,
        rowsPerPage: 10
      }
    };
  },
  beforeMount () {
    this.getEventDetailById()
  },
  methods: {
    getEventDetailById() { 
      const opt = {
        route: '/mobile/parents/chat/getEventDetailById',
        body: {
          classEventId: this.$route.query.eventId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente mais tarde")
          return
        }
        this.eventDetail = r.data
      })
    },
    //Aceitar ou autorizar filho a participar do evento
    acceptAuthorization(au) { 
      // console.log(au)
      // const opt = {
      //   route: '/mobile/parents/chat/respondClassEventSolicitation',
      //   body: {
      //     eventClassId: au._id ,
      //     childId: ,
      //     requireParentsPermission: true
      //   }
      // }
    },
    //Recusar ou não autorizar filho a participar do evento
    refuseAuthorization(au) { 
      // console.log(au)
      // const opt = {
      //   route: '/mobile/parents/chat/respondClassEventSolicitation',
      //   body: {
      //     eventClassId: au._id ,
      //     childId: ,
      //     requireParentsPermission: false
      //   }
      // }
    },
  }
};
</script>