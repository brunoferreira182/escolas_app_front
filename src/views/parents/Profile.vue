<template>
  <ion-page>
    <ToolbarEscolas
      title="Perfil"
      :backButton="false"
    />
    <ion-content >
      <ion-item
        @click="$router.push('/editProfile')"
        lines="none"
        class="profile-item"
        v-if="userInfo"
      >
        <ion-avatar style="width:60px; height:auto" slot="start">
          <img :src="'/assets/default_avatar.svg'" class="profile-avatar">
        </ion-avatar>
        <ion-label>
          <h2>{{ userInfo.name }}</h2>
          <p>{{ userInfo.email }}</p>
          <p>Editar perfil</p>
        </ion-label>
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
      <ion-alert
        :is-open="dialogUserData.open"
        header="Você precisa preencher seus dados cadastrais"
        :backdropDismiss="false"
        animated
        :buttons="[
          {
            text: 'Depois',
            handler: () => {
              dialogUserData.open = false
            }
          },
          {
            text: 'Preencher',
            handler: () => {
              this.$router.push('/tabsParents/userPersonalData')
            }
          }
        ]"
      ></ion-alert>
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
  IonIcon,
  IonAlert } from '@ionic/vue';
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
        userProfile: [],
        dialogUserData: {open: false},
        userInfo: null
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
        const userInfo = await this.getUserProfileById()
        this.userInfo = userInfo.data
        if (!this.userInfo.document) {
          this.dialogUserData.open = true
        }
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