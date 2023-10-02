<template>
  <ion-page>
    <ToolbarEscolas
      title="Mais informações"
      :backButton="true"
    />
    <ion-content >
      <ion-list>
        <ion-item>
          Agenda
        </ion-item>
        <ion-item>
          Pagamentos
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
  IonList, IonItem } from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../../composables/variables';
import { defineComponent } from 'vue';


export default {
  components: {
    IonPage, IonButton,
    IonContent,
    IonImg, 
  },
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