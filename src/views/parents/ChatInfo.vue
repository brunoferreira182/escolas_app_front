<template>
  <ion-page>
    <ToolbarEscolas
      title="Chat"
      :backButton="true"
    />
    <ion-content color="light" v-if="classData">
      <ion-row class="ion-justify-content-center q-ma-lg">
        <ion-avatar style="width:150px; height:150px">
          <img :src="utils.makeFileUrl(classData.classImage)"/>
        </ion-avatar> 
      </ion-row>
      <div class="ion-text-center">
        <h2>{{ classData.className }}</h2>
      </div>
      <ion-accordion-group expand="inset">
        <ion-accordion value="first">
          <ion-item slot="header">
            <ion-label>Eventos</ion-label>
          </ion-item>
          <div slot="content" v-if="classEvents.length">
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
                  <ion-note color="medium">
                    {{ event.eventDate.local.split('-')[2] }}/
                    {{ event.eventDate.local.split('-')[1] }}/
                    {{ event.eventDate.local.split('-')[0] }}
                  </ion-note>
                </div>
                <ion-note color="medium" class="ion-text-wrap">
                  {{ event.eventDescription.length > 100 ? 
                    event.eventDescription.slice(0, 100) + '...' : 
                    event.eventDescription
                  }}
                  <ion-label class="q-py-md">
                    Clique para saber mais
                  </ion-label>
                </ion-note>
              </ion-label>
            </ion-item>
          </div>
          <div v-else slot="content"  class="q-pa-md">
            Não há eventos nesta turma
          </div>
        </ion-accordion>
      </ion-accordion-group>
      <ion-accordion-group expand="inset">
        <ion-accordion value="first">
          <ion-item slot="header">
            <ion-label>Professores e Representantes</ion-label>
          </ion-item>
          <div slot="content" v-if="workersClassData && workersClassData.users">
            <div 
              v-for="worker in workersClassData.users"
              :key="worker"
            >
              <ion-item>
                <ion-avatar aria-hidden="true" slot="start" v-if="worker.childPhoto">
                  <img :src="utils.makeFileUrl(worker.childPhoto.filename, 'thumbnail')"/>
                </ion-avatar>
                <ion-avatar aria-hidden="true" slot="start" v-else>
                  <img :src="utils.makeFileUrl(worker.image, 'thumbnail')"/>
                </ion-avatar>
                <p class="text-capitalize">{{ worker.userName }} 
                  <div class="text-caption">{{ worker.userFunction }}</div>
                </p>
                <!-- <ion-button v-if="verifyVision()" slot="end" fill="clear" @click="$router.push('/directMessage?user_id=' + worker.user_id)">
                  <ion-icon color="primary" size="large" :icon="mail"></ion-icon> 
                </ion-button> -->
                <ion-button slot="end" fill="clear" @click="$router.push('/chatUserAndWorker?user_id=' + worker.user_id)">
                  <ion-icon color="primary" size="large" :icon="chatbubble"></ion-icon>
                </ion-button>
              </ion-item>
            </div>
          </div>
          <div v-else class="text-caption q-px-md">
            Não há professores ou representantes nesta turma
          </div>
        </ion-accordion>
      </ion-accordion-group>

      <ion-accordion-group expand="inset">
        <ion-accordion value="first">
          <ion-item slot="header">
            <ion-label>Responsáveis</ion-label>
          </ion-item>
          <div slot="content" v-if="parents">
            <div 
              v-for="parent in parents"
              :key="parent"
            >
              <ion-item>
                <ion-avatar aria-hidden="true" slot="start" v-if="parent.image">
                  <img :src="utils.makeFileUrl(parent.image, 'thumbnail')"/>
                </ion-avatar>
                <p class="text-capitalize">
                  {{ parent.userName }}
                  <div class="text-caption">{{ parent.relationType }}</div>
                </p>
                <ion-button v-if="verifyVision()" slot="end" fill="clear" @click="$router.push('/noteSenderToUser?userId=' + parent.userId)">
                  <ion-icon color="primary" size="large" :icon="mail"></ion-icon> 
                </ion-button>
                <ion-button
                  slot="end"
                  fill="clear"
                  @click="$router.push('/chatUserAndWorker?user_id=' + parent.user_id)"
                >
                  <ion-icon color="primary" size="large" :icon="chatbubble"></ion-icon>
                </ion-button>
              </ion-item>
            </div>
          </div>
          <div v-else class="text-caption q-px-md">
            Não há responsáveis nesta turma
          </div>
        </ion-accordion>
      </ion-accordion-group>


      <ion-accordion-group expand="inset">
        <ion-accordion value="first">
          <ion-item slot="header">  
            <ion-label>Alunos</ion-label>
          </ion-item>
          <div slot="content">
            <ion-item
              v-for="child in classChildrenData"
              :key="child"
            >
              <ion-avatar aria-hidden="true" slot="start" v-if="child.childPhoto">
                <img style="width: 60px; height: auto;" :src="utils.makeFileUrl(child.childPhoto.filename, 'thumbnail')"/>
              </ion-avatar>
              <ion-avatar aria-hidden="true" slot="start" v-else>
                <img :src="utils.makeFileUrl(child.image, 'thumbnail')"/>
              </ion-avatar>
              <p>{{ child.childName }}</p>
            </ion-item>
          </div>
        </ion-accordion>
      </ion-accordion-group>
      
      
      <ion-item 
        button
        style="border-radius: 1rem; margin: 10px; margin-top: 20px;"
        detail="true" 
        @click="goToMedia" 
      >
        <ion-label>Mídias</ion-label>
      </ion-item>
      <ion-item 
        button
        style="border-radius: 1rem; margin: 10px; margin-top: 20px;"
        @click="goToChatDetail" 
      >
        <ion-label>Chat</ion-label>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
import {
  chatbubble,
  mail
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
      userChildren: null,
      userInfo: null,
      parents: null
    };
  },
  mounted () {
    this.getClassDetailById()
    this.getWorkersByClassId()
    this.getParentsByClassId()
  },
  methods: {
    getParentsByClassId() {
      const opt = {
        route: '/mobile/workers/getParentsOfChildrenOfClass',
        body: {
          classId: this.$route.query.classId,
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.parents = r.data
        } else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde.")
        }
      })
    },
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
    goToChatDetail() {
      this.$router.push("/chatDetail?classId=" + this.$route.query.classId)
    },
    verifyVision(){
      return localStorage.getItem('currentVision') === 'worker'
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
          this.userInfo = utils.presentUserInfo()
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
<style scoped>
  ion-avatar {
    --border-radius: 4px;
  }
</style>