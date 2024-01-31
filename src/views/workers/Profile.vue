<template>
  <ion-page>
    <ToolbarEscolas
      title="Perfil"
      :backButton="false"
    />
    <ion-content v-if="userInfo" color="light">
      <ion-list :inset="true">
        <ion-item
          @click="$router.push('/editProfile')"
          lines="none"
          class="profile-item"
          v-if="userInfo"
        >
          <ion-avatar style="width:60px; height:auto" >
            <img :src="utils.makeFileUrl(userInfo.userImage)" class="profile-avatar">
          </ion-avatar>
          <ion-label class="q-px-sm">
            <h2>{{ userInfo.name }}</h2>
            <p>{{ userInfo.email }}</p>
            <p>Editar perfil</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <div class="ion-text-center text-h5 q-py-sm" >
        Área do trabalhador
      </div>
      <ion-list :inset="true" v-if="userInfo.family">
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">Horários</div>
        
      </ion-list>

      <ion-list :inset="true">
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">Histórico</div>
      </ion-list>
      <ion-list :inset="true" v-if="isWorker === true">
        <ion-item>
          Área do trabalhador
          <ion-toggle 
            v-model="switchWork"
            alignment="center" 
            justify="end"
            @ionChange="toggleChange($event)"
          />
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
              this.$router.push('/userPersonalData')
            }
          }
        ]"
      />
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
  IonToggle
} from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../../composables/variables';
import { chevronForward, listCircle, personCircleOutline, happyOutline, peopleOutline } from 'ionicons/icons'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { defineComponent } from 'vue';
import utils from '../../composables/utils'
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
      dialogUserAddParent: {open: false},
      userInfo: null,
      familyName: '',
      searchCpf: '',
      familySolicitations: [],
      permissions: [],
      isWorker: false,
      switchWork: false,
      currentVision: null
    };
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsParents/profile') {
        this.startView()
      }
    }
  },
  beforeMount () {
    this.startView()
    this.getCurrentVision();
  },
  mounted () {
    this.getFamilySolicitationsStatusByFamily()
    this.getUserPermissions()
    this.getCurrentVision()
  },
  methods: {
    getCurrentVision() {
      const currentVision = localStorage.getItem("currentVision")
        this.currentVision = currentVision
      if (this.currentVision === 'worker') {
        this.switchWork = true
      } else {
        this.switchWork = false
      }
    },
    verifyIsWorker() {
      if(this.permissions.length === 1){
        if (this.permissions.role === 'IS_WORKER') {
          this.isWorker = true
        }
      } else if (this.permissions.length > 1){
        this.permissions.forEach((p) => {
          if (p.role === 'IS_WORKER') {
            this.isWorker = true
          }
        })
      }
    },
    toggleChange(ev) {
      console.log(ev.detail.checked)
      if (ev.detail.checked) {
        localStorage.setItem("currentVision", "worker")
        this.$router.replace("/tabsWorkers/profile")
      } else {
        localStorage.removeItem("currentVision")
        this.$router.replace("/tabsParents/profile")
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
      this.$router.push("/childDetail?userId=" + childId)
    },
    goToSolicitationsDetail() {
      this.$router.push("/solicitationsDetail")
    },
    goToParentDetail(parentId) {
      this.$router.push("/parentDetail?userId=" + parentId)
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
      // if(this.userInfo.familyIdObj === 'noFamily') {
      //   this.dialogUserAddFamilyName.open = true
      //   return
      // }
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
    getFamilySolicitationsStatusByFamily() {
      const opt = {
        route: '/mobile/parents/profile/getFamiliesSolicitationsByFamilyId'
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          utils.toast(r.errorMessage)
          this.dialogUserAddFamilyName.open = true
        }
        this.familySolicitations = r.data
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