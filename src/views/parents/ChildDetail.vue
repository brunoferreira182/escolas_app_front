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
            <p>Editar foto</p>
          </ion-label>
          <ion-icon style="color: #eb445a;" :icon="trashOutline" @click="openDialogInactivateChild"></ion-icon>
        </ion-item>
      </ion-list>
      <ion-list lines="none">
        <ion-item>
          <div class="ion-padding ion-align-items-center ion-justify-content-between">
            Status: {{ userDetail.userData.status.label }}
          </div>
          
        </ion-item>
      </ion-list>
      <ion-list>
        <h2>Histórico:</h2>
        <ion-item
          lines="none"
          v-for="event in historic"
          :key="event"
        >
          <div>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-alert
      :is-open="dialogInactivateChild.open"
      header="Inativar filho?" 
      :backdropDismiss="false"
      animated
      :buttons="[
        {
          text: 'Não',
          handler: () => {
            refuseInactivate()
          }
        },
        {
          text: 'Sim',
          handler: () => {
            inactivateChild()
          }
        }
      ]"
    />
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
  IonIcon
} from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
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
      userDetail: [],
      canCreateUsers: null,
      historic: [],
      dialogInactivateChild: {
        open: false
      }
    };
  },
  mounted(){
    this.getUserId()
  },
  methods: {
    refuseInactivate() {
      this.dialogInactivateChild.open = false
    },
    openDialogInactivateChild() {
      this.dialogInactivateChild.open = true
    },
    inactivateChild() {
      const opt = {
        route: '/mobile/parents/profile/inactivateChild',
        body: {
          childId: this.$route.query.userId
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          utils.toast("Cadastro removido com sucesso")
          this.$router.replace('/tabsParents/profile')
          return
        } else {
          utils.toast("Ocorreu um erro, tente novamente.")
        }
      })
    },
    getUserId() {
      this.userId = this.$route.query.userId
      this.getUserDetail()
      this.getUserHistoric()
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
        this.verifyIfCanCreateUsers()
      })
    },
    getUserHistoric() {
      const opt = {
        route: '',
        body: {

        },
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.historic = r.data
        } else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde.")
        }
      })
    },
    verifyIfCanCreateUsers() {
      this.canCreateUsers = this.$route.query.canCreateUsers
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