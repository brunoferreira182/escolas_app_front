<template>
  <ion-page>
    <ion-content class="ion-padding ">
      <div style="height: var(--ion-safe-area-top);"></div>
      <div v-if="step === 'email'">
        <ion-text class="text-center">
          <h4 style="font-weight: 800;">Vamos iniciar seu cadastro</h4>
        </ion-text>

        <div class="q-pa-md">
          <ion-input
            fill="outline"
            helperText="Nome completo"
            rows="1" 
            v-model="userData.name" 
            label="Nome e sobrenome"
            label-placement="floating"
          >
          </ion-input>
          <InputEmail
            label="Digite seu email"
            idField = "email"
            v-model="userData.email"
            class="q-my-sm"
          ></InputEmail>
          <InputDocument
            label-placement="floating"
            label="Insira seu CPF"
            v-model="userData.document"
            class="q-mb-sm"
          />
          <InputTelephone
            label="Digite seu telefone"
            idField="phone"
            v-model="userData.phone"
            class="q-mb-sm"
            helperText="Com DDD e número."
          ></InputTelephone>
          <div class="q-mb-md">
            <ion-input 
              :helperText="`Seu usuário será: @${userData.user.replace(/\s/g, '_').replace(/[.;,~^´`!@#$%¨&']/g, '').toLowerCase()}`"  
              fill="outline" 
              rows="1" 
              v-model="userData.user" 
              labelPlacement="floating"  
              label="Escolha um nome para seu perfil"
            />
          </div>
          <ion-input 
            v-if="userData.birthdate"
            ref="item"
            label="Data de nascimento (opcional)"
            label-placement="floating"
            :clear-input="true"
            fill="outline"
            rows="1"
            v-model="userData.birthdate" 
          ></ion-input>
          <ion-button
            expand="block"
            @click="openPicker"
            class="q-mb-lg"
            dense
            fill="clear"
          >
            {{ !userData.birthdate ? 'Data de nascimento (opcional)' : 'Trocar data de nascimento' }}
          </ion-button>
          <ion-item lines="none">
            <ion-label>Eu aceito os termos e condições</ion-label>
            <ion-checkbox
              @ionChange="verifyUserAccepted"
              checked="false"
              v-model="userData.acceptTerms"
            />
          </ion-item>
          <ion-button
            @click="termsAndConditions"
            expand="block"
            class="q-mb-md"
            dense
            fill="clear"
          >
          Ler termos e condições
          </ion-button>
          <ion-button
            expand="block"
            @click="clkChkInitialData"
          >
            Continuar
          </ion-button>
        </div>

      </div>

      <div v-if="step === 'password'">
        <ion-text class="text-center">
          <h4>Agora cadastre sua senha</h4>
        </ion-text>
        <div class="q-mb-md q-pa-md">
          <InputPassword
            class="q-mb-md"
            label="Digite uma senha"
            idField = "password"
            v-model="passwordData.password"
            field-hint="Inclua maiúsculas, minúsculas e caracteres especiais"
          />
          <InputPassword
            label="Confirme a senha digitada"
            idField = "confirmPassword"
            v-model="passwordData.confirmPassword"
            field-hint="As senhas devem coincidir"
          />
        </div>

        <ion-button
            expand="block"
            @click="chkPasswords"
          >
            Continuar
          </ion-button>
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
  pickerController,
  IonItem, IonLabel, IonInput, IonNote,
  IonCheckbox,
  IonChip,
  IonIcon
} from '@ionic/vue';
import InputDocument from '../components/InputDocument.vue'
import InputEmail from '../components/InputEmail.vue'
import InputPassword from '../components/InputPassword.vue'
import InputTelephone from '../components/InputTelephone.vue'
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
import CryptoJS from 'crypto-js'
import { closeOutline } from 'ionicons/icons'
import { Browser } from '@capacitor/browser'
</script>

<script>

export default {
  name: 'Register',
  data() {
    return {
      step: "email",
      monthsDefault: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      years: [],
      days: [],
      months: [],
      userData: {
        acceptTerms: 'false',
        email: '',
        document: '',
        phone: '',
        birthdate: null,
        name: '',
        user: ''
      },
      passwordData: {
        password: '',
        confirmPassword: ''
      },
      verified: {
        email: false,
        phone: false
      },
      key: '',
      smsCode: '',
      emailValidated: false
    };
  },
  name: "NewUserView",
  beforeMount() {
    this.attachmentsAddress = utils.attachmentsAddress()
    for (let i = 1; i < 32; i++) {
      this.days.push({ text: i < 10 ? '0' + i : i, value: i < 10 ? '0' + i : i })
    }
    const today = new Date()
    const year = today.getFullYear()
    for (let i = 18; i < 100; i++) {
      this.years.push({ text: year - i, value: year - i })
    }
    this.monthsDefault.forEach((m, i) => {
      this.months.push({ text: m, value: (i + 1) < 10 ? '0' + (i + 1) : (i + 1) })
    })
  },
  // mounted () {
  //   window.localStorage.clear()
  // },
  methods: {
    chkPasswords () {
      if (this.passwordData.password !== this.passwordData.confirmPassword) {
        utils.toast('As senhas não conferem. Tente novamente')
        return
      }
      this.createPassword()
    },
    createPassword () {
      const tk = CryptoJS.AES.encrypt(JSON.stringify(this.passwordData), this.key).toString()
      const opt = {
        serverName: 'authentication',
        route: '/mobile/auth/createPassword',
        body: {
          tk
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        if (r.error) {
          return
        }
        this.resetForms()
        this.step = 'email'
        utils.toast('Seu usuário foi criado com sucesso. Faça o login para prosseguir.')
        const extra = this.$route.query.postAction ? '?postAction=' + this.$route.query.postAction : ''
        this.$router.replace('/login' + extra)
      })
    },
    clkChkInitialData () {
      // faz checagens
      this.createUser()
    },
    createUser () {
      const userData = {...this.userData}
      userData.user = userData.user.replace(/\s/g, '_').replace(/[.;,~^´`!@#$%¨&']/g, '').toLowerCase()
      userData.email = userData.email.email
      const au = window.localStorage.getItem('au')
      const $k = window.localStorage.getItem('$k')
      let route = '/mobile/auth/createUser'
      if (this.userData.acceptTerms === 'false') {
        utils.toast('Aceite os termos para prosseguir')
        return
      }
      const opt = {
        route,
        body: {
          userData
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        if (r.error) return
        this.key = r.data.key
        window.localStorage.setItem('$k', r.data.key)
        if (!r.data.askSms || r.data.askSms === 'false') {
          const d = CryptoJS.AES.encrypt(JSON.stringify(r.data), r.data.key).toString()
          window.localStorage.setItem('u' + r.data.userId, d)
          window.localStorage.setItem('au', r.data.userId)
          this.resetForms()
          this.step = 'password'
        } if (r.data.askSms) {
          this.step = 'smsCode'
        }
        
        this.resetForms()
      })
    },
    async openPicker() {
      console.log("abriu")
      const picker = await pickerController.create({
        columns: [
          {
            name: 'day',
            options: this.days
          },
          {
            name: 'month',
            options: this.months
          },
          {
            name: 'year',
            options: this.years
          },
        ],
        buttons: [
          {
            text: 'Voltar',
            role: 'cancel',
          },
          {
            text: 'Confirma',
            handler: (value) => {
              this.userData.birthdate = `${value.day.value}/${value.month.value}/${value.year.value}`
            },
          },
        ],
      });
      await picker.present();
    },
    resetForms () {
      this.userData.name = ''
      this.userData.email = ''
      this.userData.phone = ''
      this.userData.user = ''
      this.passwordData.password = ''
      this.passwordData.confirmPassword = ''
      this.smsCode = ''
      
    },
    termsAndConditions() {
    Browser.open({ url: 'https://web01.b3dev.app/privacy_policies/b3dev.html' })
  },
  verifyUserAccepted(e) {
    if(e.detail.checked === true) {
      this.userData.acceptTerms = 'true'
    } else {
      this.userData.acceptTerms = 'false'
    }
  }
  },
  
};
</script>
