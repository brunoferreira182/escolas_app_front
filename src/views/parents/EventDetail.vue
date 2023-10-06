<template>
  <ion-page>
    <ToolbarEscolas
      title="Informações"
      :backButton="true"
    />
    <ion-content class="ion-padding" color="light">
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
  name: "EventDetail",
  data() {
    return {
    };
  },
  methods: {
    getEventDetailById() {
      const opt = {
        route: '',
        body: {
          eventId: this.$route.query.eventId
        }
      }
    }
  }
};
</script>