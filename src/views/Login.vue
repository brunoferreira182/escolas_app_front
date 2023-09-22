<template>
  <ion-page>
    <ion-content >
      <div style="height: var(--ion-safe-area-top);"></div>
      <div class="ion-padding">
        <div class="ion-text-center ">
          <ion-img
            src="/assets/logo.png"
            class="login-logo"
          />
          <!-- <div class="login-logo-letters q-mb-md">Bem Cuidar</div> -->
        </div>
        <div class="text-center">
          <LoginCarousel
            :addLogin="false"
            @done="registerLogin"
            @changeStep="changeStep"
          />
          <ion-button
            expand="block"
            @click="clkForgotPassword"
            fill="clear"
            style="text-transform:none"
            color="primary"
            >
            Esqueci minha senha
          </ion-button>
        </div>

        <div class="ion-padding ion-text-center" v-if="step === 'email'">
          <div class="q-mt-sm q-mb-md">É novo aqui?</div>
          <ion-button
            fill="outline"
            expand="block"
            @click="goToRegister"
            color="primary"
          >
            Faça seu cadastro
          </ion-button>
          <div class="q-mt-sm q-mb-sm">Ou</div>
          <ion-button
            fill="outline"
            expand="block"
            @click="gotoSignup"
            color="primary"
          >
            Entre como convidado
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonButton, IonContent, IonImg } from '@ionic/vue';
import LoginCarousel from "../components/LoginCarousel.vue";
import utils from '../composables/utils'
import { APP_NAME, COMPANY_ID } from '../composables/variables'
import { useFetch } from '../composables/fetch';
import pushService from '../composables/notifications'

export default {
  components: {
    IonPage, IonButton,
    LoginCarousel,
    IonContent,
    IonImg
  },
  data() {
    return {
      loginStep: "email",
      key: "",
      appVersion: "",
      appName: '',
      loginImageType: 'default',
      CID: COMPANY_ID,
      attachmentsAddress: '',
      APP_NAME,
      step: 'email'
    };
  },
  name: "LoginPage",
  watch: {
    $route(to) {
      if (to.path === '/login' || to.path === '/newUser') {
        window.localStorage.clear()
        utils.getIuguLib()
      }
    }
  },
  mounted () {
    this.$emit("unregisterLogin");
    // this.loginImageType = utils.returnLoginImageType()
    this.attachmentsAddress = utils.attachmentsAddress()
    window.localStorage.clear()
    utils.getIuguLib()
    
  },


  methods: {
    changeStep (step) {
      this.step = step
    },
    clkForgotPassword () {
      this.$router.push('/forgotPassword')
    },
    async registerLogin(data, key) {
      // window.localStorage.setItem("ul", data.userId);
      // window.localStorage.setItem("$k", key);
      utils.registerLogin(data, key)
      utils.loading.clear()
      pushService.initPush()
      const location = await this.getUserLocation()
      if (!location.data || !location.data.city) {
        this.$router.replace('/editUserLocation')
      }
      window.localStorage.setItem('location', JSON.stringify(location.data))
      const extra = this.$route.query.postAction ? '&postAction=' + this.$route.query.postAction : ''

      this.$router.replace('/tabs/home?updateTabs=true' + extra)
    },
    getUserLocation () {
      const opt = {
        route: '/mobile/profile/getUserLocation',
      }
      return useFetch(opt)
    },
    gotoSignup() {
      this.$router.push("/newAccount?postAction=createGuestUser");
    },
    goToRegister() {
      this.$router.push('/register?postAction=newAd')
    },
    gotoEmail() {
      this.loginStep = "email";
      this.labelBtnEnter = "Próximo";
    },
    
  },
};
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
  font-size: 56px;
  font-family: BickleyScript;
  text-shadow: 2px 2px #fff,4px 4px var(--ion-color-secondary);
  translate:0 20px;
}
</style>