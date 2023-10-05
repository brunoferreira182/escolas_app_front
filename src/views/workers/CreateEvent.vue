<template>
  <ion-page>
    <ToolbarEscolas
      title="Criar evento"
      :backButton="true"
    />
    <ion-content class="ion-padding" color="light">
      <ion-list :inset="true">
        <p class="q-pl-md">Dê um nome para o evento:</p>
        <ion-item lines="none">
          <ion-input
            fill="outline"
            type="text"
            mode="md"
            v-model="eventData.name"
          ></ion-input>
        </ion-item>
        <p class="q-mt-md q-pl-md">Adicione a data em que acontecerá esse evento:</p>
        <ion-item lines="none">
          <ion-input
            fill="outline"
            type="date"
            mode="md"
            v-model="eventData.date"
          ></ion-input>
        </ion-item>
        <p class="q-mt-md q-pl-md">Adicione a descrição do evento:</p>
        <ion-item lines="none">
          <ion-textarea fill="outline" mode="md" v-model="eventData.description"></ion-textarea>
        </ion-item>
        <ion-item class="q-pt-sm" lines="none">
          <ion-checkbox v-model="eventData.requireParentsPermission">
            <p class="ion-text-wrap">
              Este evento requer autorização dos pais?
            </p>
          </ion-checkbox>
        </ion-item>
        <ion-button expand="block" class="q-pa-sm" @click="createEvent">Criar evento</ion-button>
      </ion-list>
    </ion-content>
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
        requireParentsPermission: false
      }
    };
  },
  beforeMount() {
  },
  methods: {
    createEvent() {
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
        }
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
