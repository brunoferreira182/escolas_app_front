<template>
  <ion-page>
    <ToolbarEscolas
      title="Mais informações"
      :backButton="false"
    />
    <ion-content color="light">
      <ion-list :inset="true">
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">Outras opções</div>
        <ion-item :button="true">
          <ion-label>Agenda</ion-label>
        </ion-item>
        <ion-item :button="true">
          <ion-label>Pagamentos</ion-label>
        </ion-item>
        <ion-item :button="true" @click="this.$router.push('/notesListWorker')">
          <ion-label>Recados</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
</script>

<script>
import { IonPage, IonButton,
  IonContent, IonImg,
  IonList, IonItem, IonLabel } from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../../composables/variables';
import { defineComponent } from 'vue';


export default {
  data() {
    return {
      APP_NAME
    };
  },
  methods: {
    backLogin() {
      this.$router.push('/login')
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