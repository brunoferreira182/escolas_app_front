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
        <ion-item :button="true" @click="$router.push('/parentFiles')">
          <ion-label>Anexos</ion-label>
        </ion-item>
        <!-- <ion-item :button="true">
          <ion-label>Pagamentos</ion-label>
        </ion-item> -->
        <!-- <ion-item :button="true" @click="$router.push('/childrenAttendanceCalendar')">
          <ion-label>Comparecimento</ion-label>
        </ion-item> -->
        
        
        <ion-item :button="true" @click="$router.push('/messenger')">
          <ion-label>Mensagens</ion-label>
        </ion-item>
        <ion-item :button="true" @click="$router.push('/mealMenu')">
          <!-- <ion-label>Cardápio do dia</ion-label> -->
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
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { 
  IonPage, IonNote,
  IonContent,
  IonList, IonItem, IonLabel,
  IonAlert
} from '@ionic/vue';

</script>
<script>
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
      userNotes: 0
    };
  },
  beforeMount () {
    this.getUserNotes()
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
  methods: {
    dismissModal(){
      this.openModal = false
      this.todayMenuData = {}
    },
    getUserNotes() {
      const opt = {
        route: '/mobile/parents/profile/getUserNotesList',
        body: {
          onlyNotRead: true,
          doNotUpdate: true
        }
      }
      useFetch(opt).then( r => {
        if (r.data.count.length > 0 && r.data.count) {
          this.userNotes = r.data.count[0].count;
          return
        }
        
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