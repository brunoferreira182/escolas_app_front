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
      <ion-accordion-group expand="inset">
        <ion-accordion value="first">
          <ion-item slot="header">
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
      <ion-accordion-group expand="inset">
        <ion-accordion value="first">
          <ion-item slot="header">  
            <ion-label>Autorizações</ion-label>
          </ion-item>
          <div slot="content" v-if="userChildren">
            <div 
              v-for="child in userChildren"
              :key="child"
            >
              <ion-item
                v-for="childPending in child.eventsPendingAuthorization"
                :key="childPending"
              >
                {{ childPending }}
              </ion-item>
            </div>
            <ion-item
              v-for="authorization in userChildren.eventsPendingAuthorization"
              :key="authorization"
            >
              <ion-label>
                <ion-row class="ion-justify-content-between">
                  <ion-col size="4" class="ion-text-wrap">
                    <ion-badge  style="background-color: #eb445a;">{{ authorization.eventName }}</ion-badge>
                  </ion-col>
                  <ion-col size="5" class="text-subtitle2">{{ authorization.eventDate.local }}</ion-col>
                </ion-row>
                <div class="ion-text-wrap">
                  {{ authorization.eventDescription }}
                </div>
                <div>
                  <ion-row class="ion-justify-content-between">
                    <ion-col size="4">
                      <ion-button size="default" style="color: #eb445a;" fill="flat" @click="refuseAuthorization(authorization)">Recusar</ion-button>
                    </ion-col>
                    <ion-col size="4">
                      <ion-button size="default" style="color:#3880ff;" fill="flat" @click="acceptAuthorization(authorization)">Aceitar</ion-button>
                    </ion-col>
                  </ion-row>
                </div>
              </ion-label>
            </ion-item>
          </div>
        </ion-accordion>
      </ion-accordion-group>
    </ion-content>
  </ion-page>
</template>

<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
import {
  IonPage, IonContent,
  IonList, IonItem, IonButton,
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
      classEvents: null,
      eventsRequiredPermission: null,
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      userChildren: null
    };
  },
  mounted () {
    this.getChildrenInClassByClassId()
    this.getChildInClassByParentId()
  },
  methods: {
    createListOfPendingAuthorizationByChild() {
      if (this.userChildren && this.eventsRequiredPermission) {
        this.userChildren.forEach((child, iChild) => {
          this.userChildren[iChild].eventsPendingAuthorization = [...this.eventsRequiredPermission] 
          console.log(child, "to ficando de pau duro")
        })
      }
    },
    getChildInClassByParentId() {
      const opt = {
        route: '/mobile/parents/chat/getChildInClassByParentId',
        body: {
          classId: this.$route.query.classId ,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.userChildren = r.data.children
          this.createListOfPendingAuthorizationByChild()
        }
          else { 
            utils.toast("Ocorreu um erro, tente novamente")
          }
      })
    },
    acceptAuthorization(au) {
      console.log(au)
      // const opt = {
      //   route: '/mobile/parents/chat/respondClassEventSolicitation',
      //   body: {
      //     eventClassId: au._id ,
      //     childId: ,
      //     requireParentsPermission: true
      //   }
      // }
    },
    refuseAuthorization(au) {
      console.log(au)
      // const opt = {
      //   route: '/mobile/parents/chat/respondClassEventSolicitation',
      //   body: {
      //     eventClassId: au._id ,
      //     childId: ,
      //     requireParentsPermission: false
      //   }
      // }
    },
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
          this.eventsRequiredPermission = this.classEvents.filter(event => event.requireParentsPermission === true);
          this.createListOfPendingAuthorizationByChild()
        } else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde")
        }
      })
    }
  }
}
</script>
