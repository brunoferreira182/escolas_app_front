<template>
  <div class="ion-padding">
    <div v-if="loginStep === 'email'" class="q-mx-sm">
      <InputEmail
        label="Email"
        idField="email"
        v-model="email"
        @keyupEnter="clkLogin"
      ></InputEmail>
    </div>
    <div v-if="loginStep === 'password'"  class="q-mx-sm">
      <InputPassword
        label="Senha"
        idField="password"
        v-model="password"
        @keyupEnter="clkLogin"
      ></InputPassword>
    </div>
    <div>
      <ion-button expand="block" class="q-mt-md" @click="clkLogin">{{ labelBtnEnter }}</ion-button>
      <ion-button
        expand="block"
        fill="outline"
        @click="clkBack"
        class="q-mt-md"
        v-if="loginStep === 'password'"
      >Voltar</ion-button>
    </div>
  </div>
</template>

<script>
import {
  IonButton,
} from '@ionic/vue';
// import { Swiper, SwiperSlide, useSwiper } from 'swiper/vue';
// import 'swiper/css';
import { defineComponent } from 'vue';
import InputEmail from './InputEmail.vue'
import InputPassword from './InputPassword.vue'
import CryptoJS from 'crypto-js'
import utils from '../composables/utils'
import { useFetch } from '../composables/fetch'


export default defineComponent({
  props: {
    addLogin: Boolean,
    originalUserId: Number
  },
  emits: ['done', 'changeStep'],
  components: {
    IonButton,
    // Swiper, SwiperSlide,
    InputEmail,
    InputPassword

  },
  data() {
    return {
      slideOpts: {
        initialSlide: 1
      },
      email: '',
      password: '',
      emailValidated: '',
      labelBtnEnter: 'Próximo',
      btnLoginLoading: false,
      loginStep: 'email',
      key: '',
      swiper: null
    }
  },
  methods: {
    clkBack () {
      this.email = ''
      this.loginStep = 'email'
      this.labelBtnEnter = 'Próximo'
      this.$emit('changeStep', this.loginStep)
    },
    clkLogin () {
      if (this.loginStep === 'email') {
        if (!this.email.validated || this.email.email === '') {
          utils.toast('Digite um email valido')
          return
        }
        this.checkEmail()
      } else if (this.loginStep === 'password') {
        if (this.password === '') {
          utils.toast('Preencha a senha')
          return
        }
        this.makeLogin()
      }
    },
    async checkEmail () {
      this.btnLoginLoading = true
      const opt = {
        serverName: 'authentication',
        route: '/mobile/auth/getKey',
        body: { login: this.email.email }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.btnLoginLoading = false
        if (r.error) return
        
        if (r.data.info && r.data.info === 'smsScreen') {
          this.$router.push('/newUser?step=smsCode&key=' + r.data.key)
          return
        } else if (r.data.info && r.data.info === 'makeNewPassword') {
          this.$router.push('/newUser?step=smsCode&key=' + r.data.key)
          return
        }
        this.key = r.data.key
        this.loginStep = 'password'
        this.$emit('changeStep', this.loginStep)
        this.labelBtnEnter = 'Entrar'
        
      })
    },
    makeLogin () {
      utils.loading.show()
      const opt = {
        serverName: 'authentication',
        route: '/mobile/auth/makeLogin',
        body: {
          user: this.email.email,
          token: CryptoJS.AES.encrypt(
            this.password,
            this.key
          ).toString(),
          addLogin: {
            addLogin: this.addLogin,
            originalUserId: this.originalUserId
          }
        }
      };
      useFetch(opt).then(r => {
        utils.loading.hide()
        if (r.error) {
          this.btnEnterLoading = false;
          return;
        }
        this.loginStep = 'email'
        console.log('essa merda aqui')
        this.$emit('changeStep', this.loginStep)
        this.$emit('done', r.data, this.key)
      });
    },
  }
});
</script>
