<template>
  <ion-page>
    <ToolbarEscolas
      title="Perfil"
      :backButton="false"
    />
    <ion-content >
      <ion-item >
        <ion-avatar aria-hidden="true">
          <img alt="Imagem de perfil" src="https://ionicframework.com/docs/img/demos/avatar.svg"/>
        </ion-avatar>
        <ion-label class="q-pa-sm">Nome do usuário</ion-label>
      </ion-item>
      <ion-list :inset="true">
        <ion-item :button="true">
          <ion-icon :icon="personCircleOutline"></ion-icon>
          <ion-label class="q-pa-sm">Adicionar foto de perfil</ion-label>
        </ion-item>
        <ion-item :button="true">
          <ion-icon color="primary" :icon="happyOutline" size="large"/>
          <ion-label class="q-pa-sm">Meus filhos</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { 
  IonPage,
  IonButton,
  IonContent,
  IonImg,
  IonItem,
  IonLabel,
  IonAvatar,
  IonList,
  IonNote,
  IonIcon } from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../../composables/variables';
import { chevronForward, listCircle, personCircleOutline, happyOutline } from 'ionicons/icons'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { defineComponent } from 'vue';
</script>

<script>
import { useFetch } from '@/composables/fetch';
  export default {
    components: {
      IonPage, IonButton,
      IonContent,
      IonImg
    },
    data() {
      return {
        APP_NAME,
        userProfile: []
      };
    },
    watch: {
      $route (to, from) {
        if (to === '/tabsParents/profile') {
          this.startView()
        }
      }
    },
    mounted () {
      this.startView()
    },

    methods: {
      async startView () {
        const userData = await this.getUserProfileById()
        this.userData = userData.data
      },
      backLogin() {
        this.$router.push('/login')
      },
      async getUserProfileById() {
        const opt = {
          route: '/mobile/parents/profile/getUserProfileById'
        }
        return await useFetch(opt)
      }
    }
}
</script>

<style scoped>
.q-carousel__slide {
  padding-right: 0%;
  padding-left: 0%;
}
.login-logo {
  /* width: 12em; */
  height: 19em;
}
.login-logo-letters {
  font-weight: 600;
  color: var(--ion-color-primary);
  font-size: 35px;
  translate:0 20px;
}
</style>