<template>
  <ion-page>
    <ToolbarEscolas
      title="Dados pessoais"
      :backButton="true"
    />
    <ion-content color="light" v-if="userDetail.userData">
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
      <ion-button 
        @click="startPhotoHandler = true" 
        fill="clear" 
        size="default"
        v-if="familyAdmin === true"
      >
        Editar foto de perfil
      </ion-button>
      <h2 class="q-px-md">Responsáveis</h2>
      <ion-list :inset="true" v-if="userDetail.responsibleData">
        <ion-item 
            lines="inset"
            v-for="resp in userDetail.responsibleData"
            :key="resp"
          >
            <ion-avatar aria-hidden="true" slot="start">
              <img :src="utils.makeFileUrl(resp.responsibleImage)"/>
            </ion-avatar>
            <ion-label>
              <h6>{{ resp.responsibleName }}</h6>
              <ion-badge  color="success">{{ resp.responsibleLabel }}</ion-badge>
            </ion-label>
          </ion-item>
      </ion-list>
      <h2 class="q-px-md">Histórico de atividades</h2>
      <ion-list :inset="true" >
        <ion-item 
          v-for="e in childEventsHistory"
          :key="e"
          detail="false"
        >
          <ion-label>
            <strong>{{ e.name }}</strong>
            <ion-badge  color="primary">{{ e.eventName }}</ion-badge><br />
            <ion-note color="medium" class="ion-text-wrap">
              {{ e.obs }}
            </ion-note>
          </ion-label>
          <div class="metadata-end-wrapper" slot="end">
            <ion-note color="medium">
              {{ e.createdAt.createdAtLocale.split(' ')[0] }}<br>
              {{ e.createdAt.createdAtLocale.split(' ')[1] }}
            </ion-note>
          </div>
        </ion-item>
      </ion-list>
      <PhotoHandler
        v-show="startPhotoHandler"
        :start="startPhotoHandler"
        :allFiles="true"
        :noCrop="false"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />
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
  IonBadge,
  IonContent,
  onIonViewWillEnter,
  IonIcon
} from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
import { useFetch } from '../../composables/fetch'
import InputDocument from '../../components/InputDocument.vue'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
import PhotoHandler from '../../components/PhotoHandler.vue'
</script>
<script>

export default {
  name: "ChildDetail",
  data() {
    return {
      userId: null,
      userDetail: [],
      canCreateUsers: null,
      childEventsHistory: [],
      dialogInactivateChild: {
        open: false
      },
      pagination: {
        page: 1,
        rowsPerPage: 6
      },
      startPhotoHandler: false,
      familyAdmin: false
    };
  },
  mounted(){
    this.getUserId()
    this.verifyIfIsAdmin()
  },
  methods: {
    verifyIfIsAdmin() {
      const opt = {
        route: '/mobile/parents/profile/getIfUserIsFamilyAdmin',
      }
      useFetch(opt).then((r) => {
        if (r.error) return
        this.familyAdmin = r.data
      })
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
    },
    captured(fileUrl, fileBlob, fileName) {
      this.updateProfileImg(fileBlob)
      this.startPhotoHandler = false
    },
    updateProfileImg(blob) {
      const opt = {
        route: '/mobile/parents/profile/updateUserImage',
        body: {
          childId: this.$route.query.userId
        },
        file: [ { file: blob, name: 'userPhoto' }]
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        if (r.error) return
        this.getUserId()
      })
    },
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
      this.getChildEventsByUserId()
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
    getChildEventsByUserId() {
      const opt = {
        route: '/mobile/workers/getChildEventsByUserId',
        body: {
          childId: this.$route.query.userId,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        },
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.childEventsHistory = r.data.list
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