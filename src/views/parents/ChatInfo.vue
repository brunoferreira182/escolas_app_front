<template>
  <ion-page>
    <ToolbarEscolas
      title="Chat"
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
              v-for="event in classEvents"
              :key="event"
              @click="goToEventDetail(event._id)"
            >
              <div class="unread-indicator-wrapper" slot="start">
                <div class="unread-indicator"></div>
              </div>
              <ion-label>
                <strong>{{ event.eventName }}</strong>
                <br/>
                <div class="metadata-end-wrapper" slot="end">
                  <ion-note color="medium">{{ event.eventDate.local }}</ion-note>
                </div>
                <ion-note color="medium" class="ion-text-wrap">
                  {{ event.eventDescription }}
                </ion-note>
              </ion-label>
            </ion-item>
          </div>
        </ion-accordion>
      </ion-accordion-group>
      <ion-accordion-group expand="inset">
        <ion-accordion value="first">
          <ion-item slot="header">
            <ion-label>Funcionários</ion-label>
          </ion-item>
          <div slot="content" v-if="workersClassData && workersClassData.users">
            <ion-item
              v-for="worker in workersClassData.users"
              :key="worker"
            >
              <ion-avatar aria-hidden="true" slot="start" v-if="worker.childPhoto">
                <img :src="utils.makeFileUrl(worker.childPhoto.filename)"/>
              </ion-avatar>
              <ion-avatar aria-hidden="true" slot="start" v-else>
                <img :src="utils.makeFileUrl(worker.image)"/>
              </ion-avatar>
              <p class="text-capitalize">{{ worker.userName }} 
                <div class="text-caption">{{ worker.userFunction }}</div>
              </p>
              <ion-button slot="end" fill="clear" @click="$router.push('/chatUserAndWorker?user_id=' + worker.user_id)">
                <ion-icon color="primary" size="large" :icon="chatbubble"></ion-icon>
              </ion-button>
            </ion-item>
          </div>
          <div v-else class="text-caption q-px-md">
            Não há funcionários nesta turma
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
                <img style="width: 60px; height: auto;" :src="utils.makeFileUrl(child.childPhoto.filename)"/>
              </ion-avatar>
              <ion-avatar aria-hidden="true" slot="start" v-else>
                <img :src="utils.makeFileUrl(child.image)"/>
              </ion-avatar>
              <p>{{ child.childName }}</p>
            </ion-item>
          </div>
        </ion-accordion>
      </ion-accordion-group>
      
      <ion-accordion-group expand="inset">
        <ion-accordion value="first" :toggle-icon="chevronForwardOutline" toggle-icon-slot="end">
          <ion-item slot="header" @click="goToMedia">  
            <ion-label>Mídia</ion-label>
          </ion-item>
        </ion-accordion>
      </ion-accordion-group>
    </ion-content>
  </ion-page>
</template>

<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
import {
  chevronForwardOutline,
  chatbubble
} from 'ionicons/icons'
import {
  IonPage, IonContent,
  IonIcon,
  IonList, IonItem, IonButton,
  IonLabel, IonAccordion,
  IonAccordionGroup, IonAvatar,
  IonCol, IonRow, IonBadge, IonNote
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
      classData: null,
      classEvents: null,
      workersClassData: null,
      eventsRequiredPermission: null,
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      userChildren: null
    };
  },
  mounted () {
    this.getClassDetailById()
    this.getWorkersByClassId()
  },
  methods: {
    
    getWorkersByClassId() {
      const opt = {
        route: '/mobile/workers/getWorkersByClassId',
        body: {
          classId: this.$route.query.classId,
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.workersClassData = r.data
        } else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde.")
        }
      })
    },
    goToMedia() {
      this.$router.push("/chatMedia?classId=" + this.$route.query.classId)
    },
    goToEventDetail(i) {
      this.$router.push("/eventDetail?eventId=" + i)
    },
    getClassDetailById() {
      const opt = {
        route: '/mobile/parents/chat/getClassDetailById',
        body: {
          classId: this.$route.query.classId
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.classChildrenData = r.data.childrenInClass
          this.classData = r.data
          this.classEvents = r.data.classEvents.list
          this.eventsRequiredPermission = this.classEvents.filter(event => event.requireParentsPermission === true);
        } else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde")
        }
      })
    }
  }
}
</script>
