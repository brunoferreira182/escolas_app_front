<template>
  <ion-page>
    <ToolbarEscolas
      title="Turmas"
      :backButton="false"
    />
    <ion-content color="light">
      <ion-searchbar 
        show-clear-button="always"
        animated="true" 
        placeholder="Pesquisar alunos"
      >
      </ion-searchbar>
      <ion-list :inset="true" >
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">Alunos</div>
        <!-- <ion-item 
          v-for="child in userInfo.family.children"
          :key="child"
          :button="true"
          @click="goToChildDetail(child._id)"
        >
          <ion-avatar aria-hidden="true" slot="start">
            <img :src="utils.makeFileUrl(child.image)"/>
          </ion-avatar>
          <ion-label>
            <h6>{{ child.name }}</h6>
            <ion-badge v-if="child.status.status === 'inactive'" style="background-color: #eb445a;">{{ child.status.label }}</ion-badge>
            <ion-badge v-else-if="child.status.status === 'waitingApproval'" style="background-color: #ffc409;">{{ child.status.label }}</ion-badge>
            <ion-badge v-else >{{ child.status.label }}</ion-badge>
          </ion-label>
        </ion-item> -->
        <div >
          <ion-item 
            :button="true" 
            @click="addChild"
          >
          Adicionar Filho</ion-item>
        </div>
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
  IonSearchbar,
  IonLabel,
  IonCol,
  IonTextarea,
  IonContent,
  IonList,
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