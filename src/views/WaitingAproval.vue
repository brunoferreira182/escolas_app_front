<template>
  <ion-page>
    <ion-content >
      <div style="height: var(--ion-safe-area-top);"></div>
      <div class="ion-padding">
        <div class="ion-text-center ">
          <ion-img
            src="/assets/logo_login_custom.png"
            class="login-logo"
          />
          <div class="login-logo-letters q-mb-md">{{ APP_NAME}}</div>
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
    <ion-alert
      v-if="familySolicitation"
      :is-open="dialogAcceptSolicitation.open"
      :header="`Você recebeu um convite de ${familySolicitation.sendBy} para participar da  ${familySolicitation.familyName }` " 
      :backdropDismiss="false"
      animated
      :buttons="[
        {
          text: 'Recusar',
          handler: () => {
            refuseFamilySolicitation()
          }
        },
        {
          text: 'Aceitar',
          handler: () => {
            acceptFamilySolicitation()
          }
        }
      ]"
    />
  </ion-page>
</template>
<script>
import { useFetch } from '@/composables/fetch';
import { IonPage, IonButton, IonContent, IonAlert, IonImg } from '@ionic/vue';
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
      APP_NAME,
      familySolicitation: null,
      dialogAcceptSolicitation: {open: false}
    };
  },
  mounted () {
    this.getFamiliesSolicitationsToUser()
  },
  methods: {
    acceptFamilySolicitation() {
      const opt = {
        route: '/mobile/parents/profile/respondFamiliesSolicitation',
        body: {
          solicitationsId: this.familySolicitation._id,
          respond: 'accepted' 
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente mais tarde.")
        }
        this.$router.replace('/tabsParents')
      })
    },
    refuseFamilySolicitation() {
      const opt = {
        route: '/mobile/parents/profile/respondFamiliesSolicitation',
        body: {
          solicitationsId: this.familySolicitation._id,
          respond: 'refused' 
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente mais tarde.")
        }
      })
    },
    getFamiliesSolicitationsToUser() {
      const opt = {
        route: '/mobile/parents/profile/getFamiliesSolicitationsToUser'
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente")
        }
        this.familySolicitation = r.data
        this.dialogUserAcceptSolicitation()
      })
    },
    dialogUserAcceptSolicitation() {
      this.dialogAcceptSolicitation.open = true
    },
    backLogin() {
      this.$router.back('/login')
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