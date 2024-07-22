<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>Rematrícula</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">Rematrícula</ion-title>
        </ion-toolbar>
        <div class="q-mx-md" style="color:dimgray">
          Selecione uma ou mais crianças para fazer a rematrícula
        </div>
      </ion-header>
      <div v-if="children" class="ion-text-center q-mt-xl">
        <ion-list :inset="true">
          <ion-item @click="clkAllChildren">
            <ion-label>
              Todas crianças
            </ion-label>
            <ion-icon
              aria-hidden="true"
              :icon="checkmark"
              slot="end"
              color="primary"
              v-if="selectedChildren.selectAllChildren"
            ></ion-icon>
          </ion-item>
          <ion-item
            v-for="child in children"
            :key="child"
            @click="clkChild(child)"
          >
            <ion-avatar aria-hidden="true" slot="start" >
              <img :src="utils.makeFileUrl(child.childData?.childImage)" v-if="child.childData?.childImage"/>
              <img :src="utils.makeFileUrl(child.childData?.childImage, 'thumbnail')" v-else/>
            </ion-avatar>
            <ion-label class="text-capitalize">
              {{ child.childData.childName }}
            </ion-label>
            <ion-icon
              aria-hidden="true"
              :icon="checkmark"
              slot="end"
              color="primary"
              v-if="selectedChildren.array.includes(child.childData.childId)"
            ></ion-icon>
          </ion-item>
        </ion-list>
      </div>
      <ion-button 
        @click="createRegistrationRequest" 
        class="q-pa-md" 
        expand="block"
        :disabled="selectedChildren.array.length === 0"
      >
        Rematricular
      </ion-button>
    </ion-content>
  </ion-page>
</template>
<script setup>
import { 
  IonPage, IonNote,
  IonContent,
  IonList, IonItem, IonLabel,
  IonAlert,
  IonIcon,
  IonButton,
  IonAvatar,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonText,
  IonRow, IonCol
  
} from '@ionic/vue';
import {
  checkmark,
} from 'ionicons/icons';

</script>
<script>
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'

export default {
  name: 'Registration',
  data() {
    return {
      children: null,
      widthChildImage: null,
      
      selectedChildren: {
        data: [],
        array: [],
        selectAllChildren: false,
      },
    };
  },
  beforeMount () {
    this.widthChildImage = window.innerWidth / 2.5
  },
  mounted () {
    utils.loading.clear()
    this.startView()
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsLayout/childrenMural') {
        this.startView()
      }
    }
  },
  methods: {
    startView(){
      this.getParentChildren()
    },
    createRegistrationRequest(){
      const selectedChildren = this.selectedChildren.data.map(child => ( child.childData ));
      const opt = {
        route: '/mobile/social/createRegistrationRequest',
        body: {
          registrationId: this.$route.query.registrationId,
          selectedChildren: selectedChildren
          
        }
      }
      useFetch(opt).then(r => {
        if (r.error) return
        utils.toast('Rematrícula encaminhada com sucesso! Aguarde um retorno da escola')
        this.children = r.data
        this.$router.back()
      })
    },
    clkAllChildren () {
      this.selectedChildren.selectAllChildren = !this.selectedChildren.selectAllChildren
      if (this.selectedChildren.selectAllChildren) {
        this.selectedChildren.data = [...this.children]
        this.selectedChildren.array = this.children.map((child) => child.childData.childId)
      } else {
        this.selectedChildren.data = []
        this.selectedChildren.array = []
      }
    },
    clkChild (child) {
      if (this.selectedChildren.array.includes(child.childData.childId)) {
        this.selectedChildren.array.forEach((c, i) => {
          if (c === child.childData.childId) {
            this.selectedChildren.array.splice(i, 1)
          }
        })
        this.selectedChildren.data.forEach((c, i) => {
          if (c.childData.childId === child.childData.childId) {
            this.selectedChildren.data.splice(i, 1)
          }
        })
      } else {
        this.selectedChildren.array.push(child.childData.childId)
        this.selectedChildren.data.push(child)
      }   },
    // clkChild (child) {
    //   this.$router.push('/childMuralDetail?childId=' + child.childData.childId)
    // },
    async getParentChildren () {
      const opt = {
        route: '/mobile/parents/profile/getParentChildren'
      }
      const r = await useFetch(opt)
      if (r.error) return
      this.children = r.data
    }
  }
}

</script>
<style scoped>

.ion-content-center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.button-wrapper {
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  margin-left: 12px;
  margin-top: 20px;
}

.button-container {
  position: relative;
  display: inline-block;
}

.highlight-button {
  background-color: var(--ion-color-primary);
  color: #fff;
  border-radius: 10px;
  padding: 2px;
  box-shadow: 0 0 12px var(--ion-color-primary);
  animation: pulse 1s infinite;
}

.badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #ff4081;
  color: white;
  border-radius: 50%;
  padding: 5px 10px;
  font-size: 0.8em;
  animation: fadeRotate 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeRotate {
  0% {
    opacity: 1;
    transform: rotate(0deg);
  }
  50% {
    opacity: 0.5;
    transform: rotate(180deg);
  }
  100% {
    opacity: 1;
    transform: rotate(360deg);
  }
}
ion-avatar {
  width: 56px;
  height: 56px
}
</style>

