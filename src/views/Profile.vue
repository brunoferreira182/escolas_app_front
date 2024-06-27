<template>
  <ion-page>
    <ToolbarEscolas
      title="Meu perfil"
      :backButton="true"
    />
    <ion-content color="light">

      <div style="padding-top: var(--ion-safe-area-top)"></div>
      <div v-if="userInfo" class="ion-padding ion-text-center">
        <img
          :src="utils.makeFileUrl(userInfo.userImage)"
          :style="`border-radius: 50%; height: 250px; width: 250px; object-fit: cover; object-position: center;`"
        /><br>
        <ion-button
          color="primary"
          fill="clear"
          shape="round"
          style="margin-top: -40px; margin-left: 200px"
          @click="$router.push('/editProfile')"
        >
          <ion-icon slot="icon-only" :icon="brush"></ion-icon>
        </ion-button>
        <ion-text>
          <h1>{{ userInfo.name }}</h1>
          <p>{{ userInfo.email }}</p>
        </ion-text>
        
      </div>

      <div v-if="currentVision !== 'worker'">
        <h2 class="q-px-md">Crianças</h2>
        <ion-list :inset="true"  v-if="userInfo && userInfo.children" >
          <div v-if="userInfo.children">
            <ion-item 
              class="q-py-sm"
              lines="inset"
              v-for="child in userInfo.children"
              :key="child"
              :button="true"
              @click="goToChildDetail(child.childData._id)"
            >
              <ion-avatar aria-hidden="true" slot="start" style="height: 60px; width: 60px">
                <img 
                  v-if="child.childData"
                  :src="utils.makeFileUrl(child.childData.childImage) "/>
                <img 
                  v-else
                  src="/assets/default_avatar.svg"
                />
              </ion-avatar>
              <ion-label v-if="child.childData">
                <h6>{{ child.childData.childName }}</h6>
              </ion-label>
            </ion-item>
          </div>
          <div v-else class="q-pa-md">
            Você ainda não possui crianças cadastradas
          </div>
        </ion-list>
      </div>

      <!-- <ion-list :inset="true" v-if="isWorker === true">
        <ion-item>
          Área do trabalhador
          <ion-toggle
            v-model="switchWork"
            alignment="center" 
            justify="end"
            @ionChange="toggleChange($event)"
          />
        </ion-item>
      </ion-list> -->
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
              this.$router.push('/userPersonalData')
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
  IonAlert,
  IonBadge,
  IonToggle,
  IonText
} from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../composables/variables';
import {
  chevronForward,
  listCircle,
  personCircleOutline,
  happyOutline,
  peopleOutline,
  brush
} from 'ionicons/icons'
import ToolbarEscolas from '../components/ToolbarEscolas.vue'
import { defineComponent } from 'vue';
import utils from '../composables/utils'
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
      userProfile: null,
      dialogUserData: {open: false},
      dialogUserAddFamilyName: {open: false},
      dialogUserAddParent: {open: false},
      userInfo: null,
      familyName: '',
      searchCpf: '',
      familySolicitations: [],
      permissions: [],
      isWorker: false,
      switchWork: false,
      currentVision: null,
      familyAdmin: false
    };
  },
  watch: {
    $route (to, from) {
      if (to.path === '/profile') {
        this.startView()
      }
    }
  },
  beforeMount () {
    this.startView()
  },
  mounted () {
    // this.getUserPermissions()
    // this.getCurrentVision()
  },
  methods: {
    getCurrentVision() {
      const currentVision = localStorage.getItem("currentVision")
        this.currentVision = currentVision
      if (this.currentVision === 'worker') {
        this.switchWork = true
        this.$router.replace("/tabsWorkers/attendance")
      } else {
        this.switchWork = false
        this.$router.replace("/tabsParents/social")
      }
    },
    verifyIsWorker() {
      if (this.permissions.length > 1){
        this.permissions.forEach((p) => {
          if (p.role === 'IS_WORKER') {
            this.isWorker = true
          }
        })
      }
    },
    toggleChange(ev) {
      if (ev.detail.checked) {
        localStorage.setItem("currentVision", "worker")
        this.$router.replace("/tabsWorkers/attendance")
      } else {
        localStorage.removeItem("currentVision")
        this.$router.replace("/tabsParents/social")
        this.switchWork = false
      }
    },
    getUserPermissions(){
      const opt = {
        route:'/mobile/auth/getUserPermissions',
        body: {
          permissionType: 'mobile'
        }
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          console.log("Erro getUserPermissions")
          return
        }
        this.permissions = r.data
        this.verifyIsWorker()
      })
    },
    goToChildDetail(childId) {
      this.$router.push("/childDetail?userId=" + childId + "&canCreateUsers=" + this.userInfo.canCreateUsers)
    },
    goToSolicitationsDetail() {
      this.$router.push("/solicitationsDetail")
    },

    createFamilyName (e) {
      const opt = {
        route: '/mobile/parents/profile/createFamily',
        body: {
          name: e[0]
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          console.log("Errou ao atualizar familia")
        }
        this.startView()
      })
    },
    addChild() {
      if(this.userInfo.familyIdObj === 'noFamily') {
        this.dialogUserAddFamilyName.open = true
        return
      }
      this.$router.push('/addChild')
    },
    addParent() {
      if(this.userInfo.familyIdObj === 'noFamily') {
        this.dialogUserAddFamilyName.open = true
        return
      }
      this.$router.push('/addParent')
    },
    async startView () {
      const userInfo = await this.getUserProfileById()
      this.userInfo = userInfo.data
      if (!this.userInfo.document) {
        this.dialogUserData.open = true
      }
      // this.getCurrentVision()
    },
    backLogin() {
      this.$router.push('/login')
    },
    async getUserProfileById() {
      const opt = {
        route: '/mobile/parents/profile/getUserProfileById'
      }
      return await useFetch(opt)
    },
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