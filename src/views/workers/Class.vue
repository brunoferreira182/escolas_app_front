<template>
  <ion-page>
    <ToolbarEscolas
      title="Adicionar filho(a)"
      :backButton="true"
    />
    <ion-content class="ion-padding">
      <div class="q-my-md"><strong>Adicionar filho(a)</strong></div>
      <div>
        <ion-button
          expand="block"
          class="q-mb-md"
          fill="outline"
          @click="startPhotoHandler = true"
          v-if="!image.blob"
        >Foto</ion-button>
        <ion-row class="q-my-md" v-if="image.blob">
          <ion-col>
            <ion-avatar >
              <ion-img :src="image.url" ></ion-img>
            </ion-avatar>
          </ion-col>
          <ion-col>
            <ion-button
              @click="startPhotoHandler = true"
              fill="outline"
            >Trocar foto</ion-button>
          </ion-col>
        </ion-row>
        <ion-input 
          mode="md" 
          fill="outline" 
          label-placement="floating" 
          label="Nome" 
          v-model="childData.name"
          class="q-mb-md"
        />
        <InputDocument
          mode="md"
          label-placement="floating"
          label="CPF/CNPJ"
          v-model="childData.document"
          class="q-mb-sm"
        />
        <ion-input 
          mode="md" 
          fill="outline" 
          label-placement="floating" 
          label="Data de nascimento" 
          type="date" 
          v-model="childData.birthdate"
          class="q-mb-md"
        />
      </div>
      <div>
        <ion-button 
          expand="block"
          class="q-pt-sm"
          @click="addChild"
        >
          Adicionar filho
        </ion-button>
      </div>
      <PhotoHandler
        v-show="startPhotoHandler"
        :start="startPhotoHandler"
        :allFiles="true"
        :noCrop="false"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />
    </ion-content>
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
  IonContent,
  onIonViewWillEnter,
  IonImg,
  IonAvatar
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch'
import InputDocument from '../../components/InputDocument.vue'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
import { cpf } from 'cpf-cnpj-validator'
import PhotoHandler from '../../components/PhotoHandler.vue'
</script>
<script>

export default {
  name: "UserPersonalData",
  data() {
    return {
      childData: {
        name: '',
        document: '',
        birthdate: '',
      },
      startPhotoHandler: false,
      image: {
        url: null,
        blob: null,
        name: null
      }
    };
  },
  mounted(){
  },
  methods: {
    cancelPhotoHandler () {
      this.startPhotoHandler = false
    },
    captured(fileUrl, fileBlob, fileName) {
      this.startPhotoHandler = false
      this.image = {
        url: fileUrl,
        blob: fileBlob,
        name: fileName,
        type: 'newImage'
      }
    },
    addChild() {
      if (this.childData.name === ''
          || this.childData.document === ''
          || this.childData.birthDayDate === ''
          || !this.image.blob)
      {
        utils.toast('Preencha todos os dados e insira uma foto')
        return
      }
      const opt = {
        route: '/mobile/parents/profile/createChild',
        body: this.childData,
        file: [{ file: this.image.blob, name: 'userPhoto' }]
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
        utils.toast('Filho adicionado com sucesso.')
        this.$router.back()
      })
    }
  }
};
</script>
<style scoped>
ion-avatar {
  --border-radius: 4px;
  width: 100px;
  height: 100px
}
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