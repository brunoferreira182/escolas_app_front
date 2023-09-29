<template>
  <ion-page>
    <ToolbarEscolas
      title="Dados pessoais"
      :backButton="true"
    />
    <ion-content class="ion-padding" v-if="userDetail.userData">
      <ion-list :inset="true">
        <ion-item
          lines="none"
          class="profile-item"
        >
          <ion-avatar style="width:60px; height:auto" >
            <img :src="utils.makeFileUrl(userDetail.userData.image)" class="profile-avatar">
          </ion-avatar>
          <ion-label class="q-px-sm">
            <h2>{{ userDetail.userData.name }}</h2>
            <p>{{ userDetail.userData.document }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-list>
        <div class="ion-padding">
          Status: {{ userDetail.userData.status.label }}
        </div>
      </ion-list>
      <ion-list>
        <!-- <ion-input
          v-model="userDetail.userData."
        >

        </ion-input> -->
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
  IonInput,
  IonRow,
  IonItem,
  IonLabel,
  IonCol,
  IonList,
  IonAvatar,
  IonContent,
  onIonViewWillEnter,
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch'
import InputDocument from '../../components/InputDocument.vue'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
</script>
<script>

export default {
  name: "UserPersonalData",
  data() {
    return {
      userId: null,
      userDetail: []
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
        route: '/mobile/parents/profile/getUserDetailById',
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
      })
    }
  }
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>