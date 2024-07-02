<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Salas de aula</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">Salas de aula</ion-title>
        </ion-toolbar>
      </ion-header>

      <div v-if="childClassInfo">
        <div class="ion-padding">
          <ion-text>
            <h3>Turmas</h3>
            <ion-note>Aqui estão as turmas que seu(s) filho(s) estão</ion-note>
          </ion-text>
        </div>
        <div
          v-for="(ch, i) in childClassInfo"
          :key="i"
        >
        <ion-list :inset="true">
          <ion-item 
            v-for="c in ch"
            :key="c"
            :disabled="c.className ? false : true"
            :button="true"
            @click="goToChatInfo(c.classId)"
          >
          
            <ion-avatar
              aria-hidden="true"
              slot="start"
              style="height: 60px; width: 60px; border: 2px solid white !important;"
            >
              <img :src="utils.makeFileUrl(c.classImage, 'thumbnail')" v-if="c.classImage"/>
              <img :src="utils.makeFileUrl('default-avatar.svg')" v-else/>
            </ion-avatar>
            <ion-avatar
              aria-hidden="true"
              slot="start"
              style="margin-left: -40px; height: 60px; width: 60px; border: 2px solid white !important;"
            >
              <img :src="utils.makeFileUrl(c.userImage, 'thumbnail')" v-if="c.userImage"/>
              <img :src="utils.makeFileUrl('default-avatar.svg')" v-else/>
            </ion-avatar>
            <ion-label>
              <ion-badge 
                class="ion-text-capitalize"
                color="success"
              >
                {{ c.userName }}
              </ion-badge>
              <h6 
                class="ion-text-caption" 
                v-if="!c.className"> Nenhuma turma vinculada
              </h6>
              <h6 v-else> {{ c.className }}</h6>
            </ion-label>
          </ion-item>
        </ion-list>
        </div>
      </div>
    </ion-content>

  </ion-page>
</template>
<script setup>
import { 
  IonPage, 
  IonButton, 
  IonContent, 
  IonImg, 
  IonList, 
  IonBadge,
  IonChip, 
  IonAvatar,
  IonModal,
  IonItem, 
  IonLabel, 
  IonNote,
  IonIcon,
  IonDatetimeButton, IonDatetime,
  IonText,
  IonHeader, IonToolbar, IonTitle
} from '@ionic/vue';
import { APP_NAME} from '../../composables/variables';
import utils from '../../composables/utils'
</script>

<script>
import { useFetch } from '@/composables/fetch';
export default {
  name: 'chatParents',
  components: {
    IonPage, IonButton,
    IonContent,
    IonImg,
    IonIcon
  },
  data() {
    return {
      APP_NAME,
      progressBar: false,
      childClassInfo: null,
      presentingElement: null,
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      childEventsHistory: [],
      userProfile: [],
      openImageModalProfile:{
        open: false,
        data: {},
        imageData: null,
      },
      dateSelected: null
    };
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsLayout/chat') {
        this.startView()
      }
    }
  },
  mounted() {
    utils.loading.hide()
    this.startView()
  },
  methods: {
    startView () {
      this.getChildClass()
    },
    getChildClass() {
      const opt = {
        route: '/mobile/parents/chat/getClassesOfChildrenByUserId',
      }
      useFetch(opt).then(r => {
        this.childClassInfo = r.data
      })
    },
    goToChatInfo(classId) {
      this.$router.push('/chatInfo?classId=' + classId)
    },
  }
}

</script>