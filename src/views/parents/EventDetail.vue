<template>
  <ion-page>
    <ToolbarEscolas
      title="Informações"
      :backButton="true"
    />
    <ion-content class="ion-padding" color="light" v-if="eventDetail">
      <ion-card>
        <img :src="utils.makeFileUrl(eventDetail.eventImage)" />
        <ion-card-header>
          <ion-card-title>{{ eventDetail.eventName }}</ion-card-title>
          <ion-card-subtitle>{{ eventDetail.eventDate.local }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          {{ eventDetail.eventDescription }}
        </ion-card-content>
      </ion-card>
      <h2 class="q-px-md">Crianças</h2>
      <ion-list :inset="true">
        <ion-item 
          v-for="child in eventDetail.children.data"
          :key="child"
        >
          <div class="unread-indicator-wrapper" slot="start">
            <div class="unread-indicator"></div>
          </div>
          <ion-label>
            <strong class="ion-text-capitalize">{{ child.childName }}</strong><br/>
            
          </ion-label> <br/>
          <div v-if="child.permissionsData && child.permissionsData.parentsPermission">
            <ion-button 
              fill="flat" 
              style="color: #2dd36f;" 
              icon
              size="default"
            >
              <ion-icon slot="start" :icon="checkmarkCircleOutline"></ion-icon>
              Autorizado
            </ion-button>
            <div class="q-pa-xs q-px-lg text-caption text-capitalize">
              Por {{ child.permissionsData.createdBy.name }}
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
      </ion-list>
      <h2 class="q-px-md">Acompanhantes:</h2>
      <ion-list :inset="true" v-if="eventDetail.users && eventDetail.users.length">
        <ion-item 
          v-for="parent in eventDetail.users"
          :key="parent"
        >
          <div class="unread-indicator-wrapper" slot="start">
            <div class="unread-indicator"></div>
          </div>
          <ion-label>
            <strong >{{ parent.name }}</strong><br/>
          </ion-label> <br/>
          <ion-button 
            v-if="!parent.classEventPermissionId"
            fill="flat" 
            style="color: #3880ff;" 
            icon
            size="default"
            @click="acceptAuthorization(child)"
          >
            <ion-icon slot="end" :icon="checkmarkOutline"></ion-icon>
            Acompanhar
          </ion-button>
          <ion-button 
            v-else
            fill="flat" 
            style="color: #2dd36f;" 
            icon
            size="default"
          >
            <ion-icon slot="start" :icon="checkmarkCircleOutline"></ion-icon>
            Acompanhando
          </ion-button>
        </ion-item>
      </ion-list>
      <div class="q-px-lg text-caption">
        Não há acompanhantes
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonContent, IonList,
  IonItem, IonButton, IonIcon,
  IonLabel, IonCard, IonCardContent,
  IonCardHeader, IonCardSubtitle,
  IonCardTitle
} from '@ionic/vue';
import { trashOutline, checkmarkOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'
import InputDocument from '../../components/InputDocument.vue'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
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
    acceptAuthorization(child) { 
      const opt = {
        route: '/mobile/parents/chat/insertUserInClassEvent',
        body: {
          eventClassId: this.$route.query.eventId,
          childId: child.childId,
          parentsPermission: true,
        }
      } 
      useFetch(opt).then((r) => {
        if(r.error) {
          utils.toast("Ocorreu um erro, tente novamente")
        } else {
          utils.toast("Autorização enviada com sucesso.")
          this.getEventDetailById()
        }
      })
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
  }
</script>