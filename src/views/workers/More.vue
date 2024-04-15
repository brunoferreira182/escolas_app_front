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
        <!-- <ion-item :button="true">
          <ion-label>Pagamentos</ion-label>
        </ion-item> -->
        <ion-item :button="true" @click="$router.push('/childrenAttendanceCalendar')">
          <ion-label>Comparecimento</ion-label>
        </ion-item>
        <ion-item :button="true" @click="$router.push('/notesList')">
          <ion-label>Recados Gerais</ion-label>
        </ion-item>
        <ion-item :button="true" @click="$router.push('/userNotesList')">
          <ion-label>Meus Recados</ion-label>
          <ion-note slot="end">{{ userNotes }}</ion-note>
        </ion-item>
        <ion-item :button="true" @click="$router.push('/mealMenu')">
          <!-- <ion-label>Cardápio do dia</ion-label> -->
          <ion-label>Cardápio Mensal</ion-label>
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
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
</script>

<script>
import { IonPage, IonButton,
  IonContent, IonImg,
  IonNote,
  IonList, IonItem, IonLabel,
  IonAlert } from '@ionic/vue';
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'
export default {
  name: 'More',
  data() {
    return {
      dialogDeleteAccount: {
        open: false,
        buttons: []
      },
      userNotes: 0,
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
      }else{this.userNotes = 0}
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