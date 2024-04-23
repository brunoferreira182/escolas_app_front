<template>
  <ion-page>
    <ion-content>
      <div style="height: var(--ion-safe-area-top);">
        <div class="ion-padding">    
          <!-- <div style="color: var(--ion-color-primary);" class="ion-text-center text-h4 q-my-lg">{{ appName }}</div> -->
          <div v-if="step === 'email'" class="ion-padding q-my-md">
            <div class="ion-text-center q-mb-lg">
              <ion-text style="font-size: 20px;" color="primary">Digite seu email para recuperar sua senha</ion-text>
            </div>
            <InputEmail
              label="Email"
              idField = "email"
              v-model="email"
              @keyupEnter="clkSendEmail"
            ></InputEmail>
            <div class="ion-text-center q-mt-lg">
              <ion-button
                class="q-mb-md"
                expand="block"
                @click="clkSendEmail"
                color="primary"
              >
                Enviar
              </ion-button>
              <ion-button
                fill="outline"
                expand="block"
                @click="$router.back()"
                color="primary"
              >
                Voltar
              </ion-button>
            </div>
          </div>
          <div v-if="step === 'confirmSms'" class=" ion-padding q-my-md">
            <div class="ion-text-center">
              <div class=" q-mb-lg">
                <ion-text style="font-size: 20px;" color="primary">{{ smsScreenText }}</ion-text>
              </div>
              <div class=" q-mb-lg">
                <ion-text style="font-size: 14px;" color="primary">{{ smsScreenText2 }}</ion-text>
              </div>
            </div>
            <!-- <ion-item fill="outline">
              <ion-label position="floating">Código</ion-label>
              <ion-input
                v-model="smsCode"
                @keyup.enter="clkSendSmsCode"
                :maxlength="4"
                inputmode="numeric"
              />
            </ion-item> -->
            <ion-input
              v-model="smsCode"
              @keyup.enter="clkSendSmsCode"
              :maxlength="4"
              inputmode="numeric"
              labelPlacement="floating"
              fill="outline"
              helper-text="Código de 4 dígitos"
              label="Código"
            />
            <div class="ion-text-center q-mt-lg">
              <ion-button
                class="q-mb-md"
                expand="block"
                @click="clkSendSmsCode"
                color="primary"
                :disabled="smsCode.length != 4"
              >
                Enviar
              </ion-button>
              <ion-button
                fill="outline"
                expand="block"
                @click="step = 'email'"
                color="primary"
              >
                Voltar
              </ion-button>
            </div>
          </div>
          <div v-if="step === 'password'" class=" ion-padding q-my-md">
            <div class="ion-text-center q-mb-lg">
              <ion-text style="font-size: 20px;" color="primary">Digite a nova senha</ion-text>
            </div>

            <InputPassword
              v-model="passwordData.password"
              label="Senha"
              class="q-mb-md"
              idField="password"
            ></InputPassword>
            <InputPassword
              v-model="passwordData.confirmPassword"
              label="Confirme sua senha"
              idField="password"
            ></InputPassword>
            <div class="ion-text-center q-mt-lg">
              <ion-button
                class="q-mb-md"
                expand="block"
                @click="clkChangePassword"
                color="primary"
                :disabled="smsCode.length != 4"
              >
                Trocar senha
              </ion-button>
              <ion-button
                fill="outline"
                expand="block"
                @click="step = 'email'"
                color="primary"
              >
                voltar
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { 
  IonPage,
  IonButton, 
  IonContent,
  IonText,
  IonItem,IonInput,
  IonLabel
} from '@ionic/vue';
import InputEmail from '../components/InputEmail.vue'
import InputPassword from '../components/InputPassword.vue'
</script>

<script>

import utils from '../composables/utils'
import pushService from '../composables/notifications'
import { useFetch } from '@/composables/fetch';
import CryptoJS from "crypto-js";

export default {
  data() {
    return {
      step: "email",
      key: "",
      appName: '',
      loginImageType: 'default',
      CID: 1,
      smsScreenText: '',
      smsScreenText2: '',
      token: '',
      phoneMasked: '',
      smsCode: '',
      passwordData: {
        password: '',
        confirmPassword: ''
      },
      email: null
    };
  },
  name: "ForgotPassword",
  watch: {
    $route(to) {
      if (to.path === '/login' || to.path === '/newUser') {
        window.localStorage.clear()
      }
    }
  },
  mounted () {
    window.localStorage.clear()
  },
  methods: {
    onChangePwd (d) {
      this.passwordData.password = d.value
    },
    onChangeConfirmPwd (d) {
      this.passwordData.confirmPassword = d.value
    },
    clkSendSmsCode() {
      if (this.smsCode.length < 4) {
      utils.toast("Digite um código válido");
        return;
      }
      const opt = {
        route: "/forgotPasswordCheckSmsCode",
        body: {
          smsCode: this.smsCode,
          token: this.token,
        },
      };
      this.btnLoading = true
      useFetch(opt).then((r) => {
        this.btnLoading = false
        if (r.error) {
          if (r.message)utils.toast(r.message)
          if (r.action === 'restart') this.step = 'email'
          return
        }
        this.step = 'password'
      });
    },
    clkSendEmail() {
      if (this.email.email === "" || !this.email.validated) {
        utils.toast("Insira um email válido");
        return;
      }
      this.btnLoading = true
      const opt = {
        route: "/forgotPasswordCheckEmail",
        body: {
          login: this.email.email,
        },
      };
      useFetch(opt).then((r) => {
        this.btnLoading = false;
        if (r.error) {
          if (r.message) utils.toast(r.message);
          if (r.action === "toSms") {
            this.smsScreenText = 'Você já tem uma solicitação de troca de senha. Insira o código recebido pelo email.'
            this.smsScreenText2 = 'Caso não tenha recebido, tente novamente em 1 minuto'
            this.token = r.token
            this.phoneMasked = r.phone;
            this.step = 'confirmSms'
          } else if (r.action === 'restart') {
            this.smsScreenText = 'Você irá receber um email com o código de ativação. Digite-o abaixo para refazer a senha.'
            this.smsScreenText2 = ''
            this.step = 'email'
          }
          return
        }
        this.phoneMasked = r.data.phone;
        this.token = r.data.token;
        this.smsScreenText = 'Você irá receber um email com o código de ativação. Digite-o abaixo para refazer a senha.'
        this.smsScreenText2 = ''
        this.step = "confirmSms";
      });
    },
    clkChangePassword () {
      if (this.passwordData.password !== this.passwordData.confirmPassword) {
        utils.toast('As senhas digitadas são diferentes.')
        return
      }
      if (this.passwordData.password.length < 6) {
        utils.toast('A senha deve ter no mínimo 6 caracteres')
        return
      }

      const tk = CryptoJS.AES.encrypt(JSON.stringify(this.passwordData), this.token).toString()
      
      const opt = {
        route: '/forgotPasswordChangePassword',
        body: {
          tk,
          token: this.token
        }
      }
      this.btnLoading = true
      useFetch(opt).then(r => {
        if (r.error) {
          if (r.message) utils.toast(r.message)
          if (r.action === 'restart') {
            this.smsScreenText = 'Você irá receber um email com o código de ativação. Digite-o abaixo para refazer a senha.'
            this.smsScreenText2 = ''
            this.step = 'email'
          }
          return
        }
        this.smsScreenText = 'Você irá receber um email com o código de ativação. Digite-o abaixo para refazer a senha.'
        this.smsScreenText2 = ''
        this.step = 'email'
        this.smsCode = ''
        utils.toast('Sua senha foi alterada com sucesso. Faça o login para prosseguir.')
        this.$router.push('/login')
      })
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
  height: 14em;
}
</style>