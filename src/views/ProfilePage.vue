<template>
  <ion-page>
    <ion-content >
      <div style="height: var(--ion-safe-area-top);"></div>
      <div class="ion-padding" style="background-color: rgb(0, 174, 255); border-bottom-left-radius: 10%; border-bottom-right-radius: 10%;">
        <div class="ion-text-center text-h5" style="color: white;" >
          Perfil
        </div>
      </div>
      <div class="ion-text-center q-pa-lg text-h5">
        Olá, seja bem vindo ao nosso aplicativo!
      </div>
      <div class="ion-text-center q-pa-lg text-subtitle1">
        Seu cadastro está aguardando aprovação pela escola, tente novamente mais tarde.
      </div>
      <div class="text-right ion-padding">
        <ion-button expand="block" @click="backLogin">Ir para login</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonButton, IonContent, IonImg } from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../composables/variables';
import { defineComponent } from 'vue';


export default {
  components: {
    IonPage, IonButton,
    IonContent,
    IonImg
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