<template>
  <ion-page>
    <ToolbarEscolas
      title="Mais informações"
      :backButton="false"
    />
    <ion-content color="light">
      <ion-list :inset="true">
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">Outras opções</div>
        <ion-item :button="true" @click="$router.push('/calendar')">
          <ion-label>Agenda</ion-label>
        </ion-item>
        <ion-item :button="true">
          <ion-label>Pagamentos</ion-label>
        </ion-item>
        <ion-item :button="true" @click="$router.push('/childrenAttendanceCalendar')">
          <ion-label>Comparecimento</ion-label>
        </ion-item>
        <ion-item :button="true" @click="$router.push('/messenger')">
          <ion-label>Mensagens</ion-label>
        </ion-item>
        <ion-item :button="true" @click="openModal = true">
          <ion-label>Cardápio do dia</ion-label>
        </ion-item>
        <ion-item :button="true" @click="$router.push('/notesList')">
          <ion-label>Recados</ion-label>
        </ion-item>
        <ion-item :button="true" @click="clkExitApp">
          <ion-label>Sair do aplicativo</ion-label>
        </ion-item>
      </ion-list>
      <ion-modal 
        :is-open="openModal" 
        @willDismiss="dismissModal()" 
        @willPresent="getMenuByTodaysDate()"
      >
        <ion-content>
          <ion-toolbar>
            <ion-title>Cardápio do dia</ion-title>
            <ion-buttons slot="end">
              <ion-button color="primary" @click="dismissModal()">Fechar</ion-button>
            </ion-buttons>
          </ion-toolbar>
          <h2 class="ion-text-center">{{ todayMenuData.name }}</h2>
          <p>
            <div v-html="todayMenuData.content"></div>
          </p>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>
<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
</script>

<script>
import { IonPage, IonButton,
  IonModal,
  IonTitle,IonButtons,
  IonToolbar,
  IonContent, IonImg,
  IonList, IonItem, IonLabel } from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../../composables/variables';
import { defineComponent } from 'vue';
import { useFetch } from '../../composables/fetch'

export default {
  name: 'More',
  data() {
    return {
      APP_NAME,
      openModal: false,
      todayMenuData:{}
    };
  },
  methods: {
    dismissModal(){
      this.openModal = false
      this.todayMenuData = {}
    },
    getMenuByTodaysDate(){
      const opt = {
        route: '/mobile/social/getMenuByTodaysDate',
      }
      useFetch(opt).then(r => {
        if(r.error){
          utils.toast('Não foi possível obter o cardápio do dia, tente novamente mais tarde.')
          return
        }this.todayMenuData = r.data
      })
    },
    clkExitApp () {
      const opt = {
        route: '/disconnectFromAccount',
        body: {
          fbToken: localStorage.getItem('fbToken')
        }
      }
      useFetch(opt).then(() => {
        this.$router.push('/login')
      })
    },
  }
}

</script>

<style scoped>
ion-modal {
  --height: 80%;
  --border-radius: 16px;
  --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

ion-modal::part(backdrop) {
  background: rgba(209, 213, 219);
  opacity: 1;
}

ion-modal ion-toolbar {
  --background: transparent
  --color: white;
}
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