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
              <img :src="utils.makeFileUrl(classData.classImage)"/>
            </ion-avatar> 
            <ion-label class="q-px-sm" v-if="classData">
              <h2>{{ classData.className }}</h2>
          </ion-label>
        </ion-item>
      </ion-list>
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
                v-for="event in classEvents"
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
    </ion-content>
  </ion-page>
</template>

<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
import {
  IonPage, IonContent,
  IonList, IonItem,
  IonLabel, IonAccordion,
  IonAccordionGroup, IonAvatar,
  IonCol, IonRow, IonBadge
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
      classEvents: null
    };
  },
  mounted () {
    this.getChildrenInClassByClassId()
  },
  methods: {
    getChildrenInClassByClassId() {
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
        } else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde")
        }
      })
    }
  }
}
</script>
