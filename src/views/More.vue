<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Outras opções</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">Outras opções</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list :inset="true">
        <ion-item :button="true" @click="$router.push('/calendar')">
          <ion-label>Agenda</ion-label>
        </ion-item>

        <ion-item
          :button="true"
          @click="$router.push('/parentFiles')"
        >
          <ion-label>Anexos</ion-label>
        </ion-item>
        
        <ion-item :button="true" @click="$router.push('/messenger')">
          <ion-label>Mensagens</ion-label>
        </ion-item>
        <ion-item :button="true" @click="$router.push('/mealMenu')">
          <ion-label>Cardápio Mensal</ion-label>
        </ion-item>
        <ion-item :button="true" @click="$router.push('/notesList')">
          <ion-label>Recados Gerais</ion-label>
        </ion-item>
        <ion-item :button="true" @click="$router.push('/userNotesList')">
          <ion-label>Meus Recados</ion-label>
          <ion-note slot="end">{{ userNotes }}</ion-note>
        </ion-item>
        <ion-item :button="true" @click="clkExitApp">
          <ion-label>Sair do aplicativo</ion-label>
        </ion-item>
        <ion-item :button="true" @click="clkDeleteAccount">
          <ion-label>Excluir conta</ion-label>
        </ion-item>
      </ion-list>
      <ion-alert
        :is-open="dialogDeleteAccount.open"
        header="Confirma a exclusão da conta?"
        message="Esta ação não pode ser desfeita."
        :buttons="dialogDeleteAccount.buttons"
        @didDismiss="dialogDeleteAccount.open = false"
      ></ion-alert>

    </ion-content>
  </ion-page>
</template>
<script setup>
import { 
  IonPage, IonNote,
  IonContent,
  IonList, IonItem, IonLabel,
  IonAlert,
  IonTitle,
  IonToolbar,
  IonHeader,
} from '@ionic/vue';

</script>
<script>
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'

export default {
  name: 'More',
  data() {
    return {
      dialogDeleteAccount: {
        open: false,
        buttons: []
      },
      userNotes: 0
    };
  },
  mounted () {
    utils.loading.clear()
    this.startView()
  },
  watch: {
    $route(to, from) {
      if (this.$route.path === '/tabsWorkers/more' || this.$route.path === '/tabsParents/more') {
        console.log('entrou no primeiro if')
        this.startView()
      }
    }
  },
  methods: {
    startView(){
      this.getUserNotesList()
      this.dialogDeleteAccount.buttons = [
        {
          text: 'Confirma',
          handler: () => {
            this.confirmDeleteAccount()
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        }
      ]
    },
    dismissModal(){
      this.openModal = false
      this.todayMenuData = {}
    },
    async getUserNotesList() {
      const opt = {
        route: '/mobile/parents/profile/getUserNotesList',
        body: {
          onlyNotRead: true,
          doNotUpdate: true
        }
      }
        const response = await useFetch(opt)
        if (response.data.count.length > 0 && response.data.count) {
          this.userNotes = response.data.count[0].count;
      } else{this.userNotes = 0}
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
    clkDeleteAccount () {
      this.dialogDeleteAccount.open = true
    },
    confirmDeleteAccount () {
      const opt = {
        route: '/mobile/auth/deleteAccount'
      }
      utils.loading.show()
      useFetch(opt).then((r) => {
        utils.loading.hide()
        if (r.error) {
          utils.toast('Não foi possível excluir a conta, tente novamente mais tarde.')
          return
        }
        this.$router.push('/login')
      })
    }
  }
}

</script>

