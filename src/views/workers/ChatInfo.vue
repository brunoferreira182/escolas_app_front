<template>
  <ion-page>
    <ToolbarEscolas
      title="Detalhes da turma"
      :backButton="true"
    />
    <ion-content color="light" v-if="classData">
      <ion-row class="ion-justify-content-center q-ma-lg">
        <ion-avatar style="width:108px; height:108px">
          <img :src="utils.makeFileUrl(classData.classImage)"/>
        </ion-avatar> 
      </ion-row>
      <div class="ion-text-center">
        <h2>{{ classData.className }}</h2>
      </div>
      <ion-accordion-group expand="inset">
        <ion-accordion value="first">
          <ion-item slot="header">
            <ion-label>Eventos da turma</ion-label>
          </ion-item>
          <div slot="content">
            <ion-item 
              :button="true" 
              detail="false"
              v-for="event in eventList"
              :key="event"
            >
              <div class="unread-indicator-wrapper" slot="start">
                <div class="unread-indicator"></div>
              </div>
              <ion-label>
                <strong>{{ event.eventName }}</strong>
                <br />
                <ion-note color="medium" class="ion-text-wrap">
                  {{ event.eventDescription }}
                </ion-note>
              </ion-label>
              <div class="metadata-end-wrapper" slot="end">
                <ion-note color="medium">{{ event.eventDate.local }}</ion-note>
                <ion-icon color="medium" :icon="chevronForward"></ion-icon>
              </div>
            </ion-item>
          </div>
        </ion-accordion>
      </ion-accordion-group>
      <ion-accordion-group expand="inset">
        <ion-accordion value="first">
          <ion-item slot="header">
            <ion-label>Alunos da turma</ion-label>
          </ion-item>
          <div slot="content">
            <ion-item
              v-for="child in classChildrenData"
              :key="child"
            >
              <ion-avatar aria-hidden="true" slot="start" v-if="child.childPhoto">
                <img :src="utils.makeFileUrl(child.childPhoto.filename)"/>
              </ion-avatar>
              <ion-avatar aria-hidden="true" slot="start" v-else>
                <img :src="utils.makeFileUrl(child.image)"/>
              </ion-avatar>
              <p>{{ child.childName }}</p>
            </ion-item>
          </div>
        </ion-accordion>
      </ion-accordion-group>
      <ion-list :inset="true" :button="true">
        <ion-item :button="true" @click="goToMedia">
          Mídia  
        </ion-item>
      </ion-list>
      <ion-button @click="clkGoToCreateEvent" expand="block" class="ion-padding">Adicionar evento</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
import {
  IonPage, IonContent,
  IonList, IonItem,
  IonButton, IonAvatar,
  IonAccordionGroup, IonAccordion,
  IonLabel, IonCardTitle, IonCardSubtitle,
  IonCardHeader, IonCardContent, IonCard, IonRow, 
  IonCol, IonBadge
} from '@ionic/vue'
</script>

<script>
import { useFetch } from '@/composables/fetch';
export default {
  components: {
  },
  data() {
    return {
      classChildrenData: null,
      eventList: null,
      classData: null
    };
  },
  mounted () {
    this.getClassDetailById()
    this.getEventsByClassId()
  },
  watch: {
    $route (to, from) {
      if (to.path === '/chatInfoWorker') {
        this.getClassDetailById()
        this.getEventsByClassId()
      }
    }
  },
  methods: {
    goToMedia() {
      this.$router.push("/chatMediaWorker?classId=" + this.$route.query.classId)
    },
    getEventsByClassId() {
      const opt = {
        route: '/mobile/workers/getClassEvents',
        body: {
          classId: this.$route.query.classId,
          page: 1,
          rowsPerPage: 15
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this. eventList = r.data.list
        } else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde.")
        }
      })
    },
    clkGoToCreateEvent() {
      this.$router.push("/createEvent?classId=" + this.$route.query.classId)
    },
    getClassDetailById() {
      const opt = {
        route: '/mobile/workers/getClassDetailById',
        body: {
          classId: this.$route.query.classId
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.classChildrenData = r.data.childrenInClass
          this.classData = r.data
        } else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde")
        }
      })
    }
  }
}
</script>
