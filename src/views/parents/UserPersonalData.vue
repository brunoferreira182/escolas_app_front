<template>
  <ion-page>
    <ToolbarEscolas
      title="Dados pessoais"
      :backButton="true"
    />
    <ion-content class="ion-padding">
      <div class="q-mt-md"><strong>Documento</strong></div>
      <InputDocument
        mode="md"
        label="CPF/CNPJ"
        class="q-mb-sm q-mt-md"
        v-model="document"
        :disabled="hasDocument"
      />
      <div class="q-px-sm">
        <ion-text color="medium">
          {{ CPFText }}
        </ion-text>
      </div>
      <ion-button
        v-if="!hasDocument"
        expand="block"
        class="q-my-md"
        @click="sendCPF"
      >
        Salvar documento
      </ion-button>
      <div class="q-mt-md"><strong>Endereço</strong></div>
      <div style="display:flex;flex-direction: column; gap: 8px;margin-top: 20px;">
        <ion-input 
          mode="md" 
          fill="outline" 
          label-placement="floating" 
          label="CEP" 
          @keyup="checkCEP"
          v-model="addressData.zipCode"
        />
        <ion-input 
          mode="md" 
          fill="outline" 
          label-placement="floating" 
          label="Logradouro" 
          v-model="addressData.street"
        />
        <ion-input 
          mode="md" 
          fill="outline" 
          label-placement="floating" 
          label="Número" 
          type="number" 
          v-model="addressData.number"
        />
        <ion-input 
          mode="md" 
          fill="outline" 
          label-placement="floating" 
          label="Complemento (opcional)" 
          v-model="addressData.complement"
        />
      <ion-row class="ion-justify-content-between q-pa-none">
        <ion-col size="8" class="q-pa-none q-pr-sm">
          <ion-input 
            mode="md"
            fill="outline"
            label-placement="floating"
            label="Cidade"
            v-model="addressData.city"
          />
        </ion-col>
        <ion-col size="4" class="q-pa-none">
          <ion-input
            mode="md"
            fill="outline"
            label-placement="floating"
            label="UF"
            v-model="addressData.state"
          />
        </ion-col>
      </ion-row>
      </div>
      <ion-button
        color="primary"
        @click="clkNewAddress"
        expand="block"
        class="q-mt-md"
      >{{ addressButtonText }}
      </ion-button>
      <ion-alert
        :is-open="dialogInformative.open"
        header="Antes de anunciar, é necessário preencher alguns dados!"
        :backdropDismiss="false"
        animated
        :buttons="[
          {
            text: 'Depois!',
            handler: () => {
              closeAskAddressDialog()
            }
          },
          {
            text: 'Vamos lá!',
            handler: () => {
              confirmDialogAskAddress()
            }
          }
        ]"
      ></ion-alert>
      <ion-alert
        :is-open="dialogNewProfileRegistration.open"
        header="Vamos preencher alguns dados!"
        sub-header="Para anunciar seus serviços, é necessário informar alguns dados."
        :backdropDismiss="false"
        animated
        :buttons="[
          {
            text: 'Depois!',
            handler: () => {
              closeDialogNewProfile()
            }
          },
          {
            text: 'Vamos lá!',
            handler: () => {
              confirmDialogNewProfile()
            }
          }
        ]"
      ></ion-alert>
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
  IonContent,
  onIonViewWillEnter,
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch'
import InputDocument from '../../components/InputDocument.vue'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
import { cpf,cnpj } from 'cpf-cnpj-validator'
</script>
<script>

export default {
  name: "UserPersonalData",
  data() {
    return {
      dialogNewProfileRegistration: {
        open: false,
      },
      dialogInformative: {
        open: false,
      },
      CPFText: 'O documento só poder ser definido uma vez, não havendo possibilidade de alteração. Após inserir seu documento, clique em salvar para validá-lo.',
      showAddress: false,
      showCPF: false,
      cpf: null,
      userInfo: null,
      document:'',
      documentValidated: false,
      docDisabled: false,
      hasAddress: '',
      hasDocument: false,
      addressData: {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        city: '',
        state: '', 
      },
      addressButtonText: '',
      userPersonalData: null
    };
  },
  mounted(){
    utils.loading.hide()
    // this.getUserProfileInfo()
    this.getUserPersonalData()
    if (this.$route.query.postAction === 'none') this.addressButtonText = 'Salvar'
    else this.addressButtonText = 'Avançar'
  },
  methods: {
    getUserAddress () {
      const opt = {
        route: '/mobile/profile/getUserAddress'
      }
      useFetch(opt).then(r => {
        if (!r.data || r.data === '' || r.data === '0') {
          this.hasAddress = false
          return
        }
        this.addressData = r.data
        this.hasAddress = true
      })
    },
    getUserPersonalData() {
      const opt = {
        route: '/mobile/parents/profile/getUserPersonalData'
      }
      useFetch(opt).then((r) => {
        if(!r.error) {
          this.document = r.data.document
          this.addressData = r.data.address
        } 
        else if (r.error) console.log("Erro getUserPersonalData")

      })
    } ,
    displayDialog(){
      this.dialogInformative.open = true
    },
    onChangeInput(d) {
      console.log(d)
      if (d.id === 'cpf') {
        this.documentValidated = d.validated
        this.document = d.value
      }
    },
    sendCPF(){
      if (!this.checkDocument()) {
        utils.toast("O documento informado não é válido")
        return
      }
      const opt = {
        route: '/mobile/parents/profile/saveUserDocument',
        body: {
          document: this.document.replace(/\D/g, "").trim(),
        }
      }
      utils.loading.show()
      useFetch(opt).then((r) => {
        if (r.error) return
        utils.loading.hide()
        utils.toast('Documento inserido com sucesso!')
        this.hasDocument = true
      }) 
    },
    checkDocument () {
      
      const n = this.document.replace(/\D/g, "").trim()
      const len = n.length
      if (len === 11) return cpf.isValid(n)
      else return cnpj.isValid(n)
    },
    // checkCEP (ev) {
    //   this.addressData.zipCode = ev.target.value
    //   if(this.addressData.zipCode.length === 8){
    //     const opt = {
    //       route: '/mobile/parents/profile/getAddressFromZipCode',
    //       body: {
    //         zipCode: this.addressData.zipCode
    //       }
    //     }
    //     utils.loading.show()
    //     useFetch(opt).then(r => {
    //       utils.loading.hide()
    //       this.addressData.street = r.data.logradouro
    //       this.addressData.city = r.data.localidade
    //       this.addressData.state = r.data.uf
    //     })
    //   } 
      
    // },
    clkNewAddress() {
      const opportunityId = this.$route.query.opportunityId
      if(
        this.addressData.street === '' ||
        this.addressData.zipCode === '' ||
        this.addressData.number === '' ||
        this.addressData.city === '' ||
        this.addressData.state === '' ||
        !this.hasDocument 
      ) {
        utils.toast('Preencha todos os campos!')
        return
      }
      const opt = {
        route: '/mobile/parents/profile/saveUserAddress',
        body: {
          addressData: this.addressData,
        }
      }
      utils.loading.show()
      useFetch(opt).then((r) => {
        utils.loading.hide()
        if (r.error) return
        if (this.$route.query.postAction === 'none') {
          utils.toast('Endereço salvo com sucesso!')
          return
        }
      }) 
    },
    // clearAddress(){
    //   this.addressData.street = '' 
    //   this.addressData.zipCode = '' 
    //   this.addressData.number = '' 
    //   this.addressData.complement = '' 
    //   this.addressData.city = '' 
    //   this.addressData.state = ''
    // },
    confirmDialogNewProfile(){
      this.dialogNewProfileRegistration.open = false
    },
    confirmDialogAskAddress(){
      this.showAddress = true
      this.dialogAskForAddress.open = false
    },
    closeAskAddressDialog(){
      this.dialogAskForAddress.open = false
      this.$router.push('/tabs/home')
    },
    closeDialogNewProfile(){
      this.dialogNewProfileRegistration.open = false
      this.$router.push('/tabs/home')
    },

    getUserProfileInfo () {
      const opt = {
        route: '/mobile/profile/getUserProfileInfo'
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.userInfo = r.data
        this.document = r.data.userInfo.document === '0' ? null : r.data.userInfo.document
        if (r.data.addressData)this.addressData = r.data.addressData
      })
    }
  }
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>