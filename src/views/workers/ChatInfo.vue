<template>
  <ion-page>
    <ToolbarEscolas
      title="Detalhes da turma"
      :backButton="true"
    />
    <ion-content color="light">
      <ion-list>
        <ion-item lines="none" class="profile-item">
          <ion-avatar style="width:60px; height:auto" aria-hidden="true" slot="start" v-if="classData">
              <img :src="utils.makeFileUrl(classData.image[0].filename)"/>
            </ion-avatar> 
            <ion-label class="q-px-sm" v-if="classData">
              <h2>{{ classData.className }}</h2>
          </ion-label>
        </ion-item>
      </ion-list>
      <!-- <ion-list :inset="true">
        <ion-item
        lines="none"
        class="profile-item"
        >
        <ion-avatar style="width:60px; height:auto" >
          <img :src="utils.makeFileUrl(userInfo.userImage)" class="profile-avatar">
        </ion-avatar>
        <ion-label class="q-px-sm">
          <h2>{{ userInfo.name }}</h2>
        </ion-label>
      </ion-item>
    </ion-list> -->
    <ion-list :inset="true">
        <ion-item>
          <h2>Mídia</h2>
        </ion-item>
      </ion-list>
      <ion-list :inset="true" class="q-pl-sm">
        <ion-accordion-group expand="inset">
          <ion-accordion value="first">
            <ion-item slot="header" color="light">
              <ion-label>Eventos da turma</ion-label>
            </ion-item>
            <div slot="content">
              <ion-item
                lines="full"
                v-for="event in eventList"
                :key="event"
              >
                <ion-label>
                  <ion-row class="ion-justify-content-between">
                    <ion-col size="4" class="ion-text-wrap">
                      <h6 class="text-capitalize">
                        {{event.eventName }}
                      </h6>
                      <ion-badge  style="background-color: #eb445a;">{{ event.eventName }}</ion-badge>
                    </ion-col>
                    <ion-col size="5" class="text-subtitle2">{{ event.eventDate.local }}</ion-col>
                  </ion-row>
                  <div class="ion-text-wrap">
                    {{ event.eventDescription }}
                  </div>
                </ion-label>
              <!-- <ion-card>
                <ion-card-header>
                  <ion-card-title>{{ event.eventName }}</ion-card-title>
                  <ion-card-subtitle>{{ event.eventDate.local }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  {{ event.eventDescription }}
                </ion-card-content>
              </ion-card> -->
              </ion-item>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </ion-list>
      <ion-list :inset="true" class="q-pl-sm">
        <ion-accordion-group expand="inset">
          <ion-accordion value="first">
            <ion-item slot="header" color="light">
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
      </ion-list>
      <ion-button @click="goToCreateEvent" expand="block" class="ion-padding">Adicionar evento</ion-button>
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
  IonCardHeader, IonCardContent, IonCard
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
    this.getChildrenInClassByClassId()
    this.getEventsByClassId()
  },
  methods: {
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
    goToCreateEvent() {
      this.$router.push("/createEvent?classId=" + this.$route.query.classId)
    },
    getChildrenInClassByClassId() {
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
