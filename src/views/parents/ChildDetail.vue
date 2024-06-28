<template>
  <ion-page>
    <ToolbarEscolas
      title="Detalhe do aluno"
      :backButton="true"
    />
    <ion-content color="light">

      <div v-if="userDetail.userData" class="ion-padding ion-text-center">
        <img
          :src="utils.makeFileUrl(userDetail.userData.image)"
          :style="`border-radius: 50%; height: 250px; width: 250px; object-fit: cover; object-position: center;`"
        /><br>
        <ion-text>
          <h2>{{ userDetail.userData.name }}</h2>
          <p>{{ userDetail.userData.document }}</p>
        </ion-text>
        
      </div>
      <h2 class="q-px-md">Responsáveis</h2>
      <ion-list :inset="true" v-if="userDetail.responsibleData" class="q-py-md">
        <ion-item 
            lines="inset"
            v-for="resp in userDetail.responsibleData"
            :key="resp"
          >
            <ion-avatar aria-hidden="true" slot="start" style="width:60px; height: 60px;">
              <img :src="utils.makeFileUrl(resp.responsibleImage)"/>
            </ion-avatar>
            <ion-label>
              <h6>{{ resp.responsibleName }}</h6>
              <ion-badge  color="success">{{ resp.responsibleLabel }}</ion-badge>
            </ion-label>
          </ion-item>
      </ion-list>

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
  IonNote,
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
  IonIcon,
} from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
import { useFetch } from '../../composables/fetch'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
</script>
<script>

export default {
  name: "ChildDetail",
  data() {
    return {
      userId: null,
      presentingElement: null,
      userDetail: [],
    };
  },
  mounted(){
    this.getUserId()
  },
  methods: {
    getUserId() {
      this.userId = this.$route.query.userId
      this.getUserDetail()
    },
    getUserDetail() {
      const opt = {
        route: '/mobile/parents/profile/getChildDetailById',
        body: {
          userId: this.userId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente")
          return
        }
        this.userDetail = r.data
        this.verifyIfCanCreateUsers()
      })
    },

  }
};
</script>
