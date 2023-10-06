<template>
  <ion-page>
    <ToolbarEscolas
      title="Criar evento"
      :backButton="true"
    />
    <ion-content class="ion-padding">
      <p class="q-pl-md">Dê um nome para o evento:</p>
      <div class="input-wrapper">
        <ion-input
          fill="outline"
          type="text"
          v-model="eventData.name"
          label="Nome do evento"
          label-placement="floating"
        />
      </div>
      <p class="q-mt-md q-pl-md">Adicione a data em que acontecerá esse evento:</p>
      <div class="input-wrapper ">
        <ion-input
          fill="outline"
          type="date"
          v-model="eventData.date"
        />
      </div>
      <p class="q-mt-md q-pl-md">Adicione a descrição do evento:</p>
      <div class="input-wrapper ">
        <ion-textarea 
          fill="outline" 
          label="Descrição do evento" 
          label-placement="floating" 
          v-model="eventData.description"
        />
      </div>
      <ion-button fill="clear" expand="block" @click="startNewPhotoHandler">Adicionar foto ao evento</ion-button>
      <ion-checkbox v-model="eventData.requireParentsPermission">
        <p class="ion-text-wrap q-mx-sm">
          Este evento requer autorização dos pais?
        </p>
      </ion-checkbox>
      <ion-button expand="block" class="q-pa-sm" @click="createEvent">Criar evento</ion-button>
    </ion-content>
    <PhotoHandler
      v-show="startPhotoHandler"
      :start="startPhotoHandler"
      :allFiles="true"
      :noCrop="false"
      @captured="captured"
      @cancel="cancelPhotoHandler"
    />
  </ion-page>
</template>

<script setup>
import {
  IonContent, IonPage,
  IonInput, IonList,
  IonItem, IonRow,
  IonCol, IonButton, IonTextarea,
  IonCheckbox
} from '@ionic/vue';
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'
import PhotoHandler from '../../components/PhotoHandler.vue'

</script>

<script>

export default {
  name: 'CreateEvent',
  data() {
    return {
      eventData: {
        name: '',
        date: '',
        description: '',
        eventPhoto: null,
        requireParentsPermission: false,
      },
      startPhotoHandler: false,
      image: {
        url: null,
        blob: null,
        name: null
      }
    };
  },
  methods: {
    startNewPhotoHandler() {
      this.startPhotoHandler = true
    },
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
      this.eventData.eventPhoto = {
        file: fileBlob,
      }
    },
    createEvent() {
      console.log(this.eventData.eventPhoto, "macaco")
      if (this.eventData.name === '' ||
        this.eventData.date === '' ||
        this.eventData.description === '') {
          utils.toast("Preencha todos os campos para criar o evento.")
          return
        }
      const opt = {
        route: '/mobile/workers/createClassEvents',
        body: {
          classId: this.$route.query.classId,
          eventName: this.eventData.name,
          eventDescription: this.eventData.description,
          eventDate: this.eventData.date,
          requireParentsPermission: this.eventData.requireParentsPermission
        },
        file: [ this.eventData.eventPhoto.file ]
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          utils.toast("Evento criado com sucesso.")
          this.$router.replace('/chatInfoWorker?classId=' + this.$route.query.classId)
        } else {
          utils.toast("Ocorreu um erro, tente novamente.")
        }
      })
    }
  },
};
</script>
<style scoped>
.input-wrapper {
  border: 1px solid #ebebec;
  border-radius: 0.5rem;
  margin-block: 10px;
}
</style>
