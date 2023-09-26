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
            <img :src="'/assets/default_avatar.svg'" class="profile-avatar">
          </ion-avatar>
          <ion-label class="q-px-sm">
            <h2>{{ userInfo.name }}</h2>
            <p>{{ userInfo.email }}</p>
            <p>Editar perfil</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <div class="ion-text-center text-h5 q-py-sm" v-if="userInfo.familyData">
        {{ userInfo.familyData.name }}
      </div>
      <ion-list :inset="true">
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">Filhos</div>
        <ion-item 
          v-for="child in userInfo.children"
          :key="child"
        >
          <ion-avatar aria-hidden="true" slot="start">
            <img :src="utils.makeFileUrl(child.image)"/>
          </ion-avatar>
          <ion-label>
            <h6>{{ child.name }}</h6>
            <ion-badge>{{ child.status.label }}</ion-badge>
          </ion-label>
        </ion-item>
        <ion-item :button="true" @click="addChild">Adicionar Filho</ion-item>
      </ion-list>

      <ion-list :inset="true">
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">Familiares</div>
        <ion-item 
          v-for="child in userInfo.children"
          :key="child"
        >
          <ion-avatar aria-hidden="true" slot="start">
            <img :src="utils.makeFileUrl(child.image)"/>
          </ion-avatar>
          <ion-label>
            <h6>{{ child.name }}</h6>
            <ion-badge>{{ child.status.label }}</ion-badge>
          </ion-label>
        </ion-item>
        <ion-item :button="true" @click="addChild">Adicionar Filho</ion-item>
      </ion-list>


      <ion-list :inset="true">
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">
          Familiares
        </div>
        <ion-item >
        <div>
          {{  }}
          <div class="text-subtitle2">
            {{  }}
          </div>
        </div>
        </ion-item>
        <ion-item :button="true" @click="addParent">Adicionar Familiar</ion-item>
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
      <ion-alert
        :is-open="dialogUserAddFamily.open"
        header="Antes de adicionar seus filhos você precisa criar uma família!"
        :backdropDismiss="false"
        animated
        :inputs="[
          {
            type: 'text',
            placeholder: 'Dê um nome para sua família',
            value: familyName
          }
        ]"
        :buttons="[
          {
            text: 'Depois',
            handler: () => {
              dialogUserAddFamily.open = false
            }
          },
          {
            text: 'Criar',
            handler: (e) => {
              createFamilyName(e)
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
  IonBadge
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
      dialogUserAddFamily: {open: false},
      userInfo: null,
      familyName: ''
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
  },
  methods: {
    createFamilyName (e) {
      const opt = {
        route: '/mobile/parents/profile/createFamily',
        body: {
          name: e[0]
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          console.log("EErrou ao atualizar familia")
        }
        this.startView()
      })
    },
    addChild() {
      if(this.userInfo.familyIdObj === 'noFamily') {
        this.dialogUserAddFamily.open = true
        return
      }
      this.$router.push('/tabsParents/addChild')
    },
    addParent() {
      this.$router.push('/tabsParents/addParent')
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