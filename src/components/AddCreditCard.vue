<template>
  <div class="q-pa-md">
    <div class="q-py-sm">
      <ion-input
        mode="md"
        fill="outline"
        label="Apelido do cartão"
        helper-text="Por ex.: Meu cartão Visa"
        label-placement="floating"
        v-model="dialogAddCreditCard.data.description"
      />
    </div>
    <InputCreditCard
      label="Número do cartão de crédito"
      :modelValue="dialogAddCreditCard.data.number"
      @update:modelValue="updateCardNumber($event)"
      mode="md"
      class="q-my-sm"
    />
    <ion-row class="q-py-xs">
      <ion-col class="ion-no-padding">
        <ion-select mode="md" placeholder="Mês" v-model="dialogAddCreditCard.data.month" fill="outline">
          <ion-select-option
            v-for="item in options.months"
            :key="'m' + item"
            :value="item"
          >{{ item }}</ion-select-option>
        </ion-select>
        <ion-note class="text-caption">Mês vencimento</ion-note>
      </ion-col>
      <ion-col  class="ion-no-padding q-ml-md">
        <ion-select fill="outline" placeholder="Ano"  mode="md" v-model="dialogAddCreditCard.data.year">
          <ion-select-option
            v-for="item in options.years"
            :key="'m' + item"
            :value="item"
          >{{ item }}</ion-select-option>
        </ion-select>
        <ion-note class="text-caption">Ano vencimento</ion-note>
      </ion-col>
    </ion-row>
    <div class="q-py-sm">
      <ion-input
        mode="md"
        fill="outline"
        label="Código de segurança (CVV)"
        inputmode="numeric"
        maxlength="3"
        helper-text="Os 3 dígitos na parte traseira do cartão"
        label-placement="floating"
        v-model="dialogAddCreditCard.data.verification_value"
      />
    </div>
    <ion-input
      mode="md"
      fill="outline"
      label="Primeiro nome"
      helper-text="Primeiro nome do titular do cartão"
      label-placement="floating"
      autocapitalize="characters"
      v-model="dialogAddCreditCard.data.first_name"
    />
    <div class="q-py-sm">
      <ion-input
        mode="md"
        fill="outline"
        label="Último nome"
        helper-text="Último nome do titular do cartão"
        label-placement="floating"
        autocapitalize="characters"
        v-model="dialogAddCreditCard.data.last_name"
      />
    </div>
    <CreditCardComponent
      :cardData="dialogAddCreditCard.data"
    />
    <ion-button expand="block" class="q-mt-md" @click="clkSaveCard" style="margin-bottom: 100px">
      Salvar cartão
    </ion-button>
  </div>
</template>

<script setup>
import {
  IonItem, IonLabel, IonInput, IonNote,
  IonRow, IonCol,
  IonSelect, IonSelectOption,
  IonButton
} from '@ionic/vue';
import CreditCardComponent from '../components/CreditCardComponent.vue'
import InputCreditCard from '../components/InputCreditCard.vue'
import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'
import { IUGU_TEST_MODE, getIuguId  } from '../composables/variables'
import InputCreditCardVue from './InputCreditCard.vue';
</script>

<script>



export default {
  name: "AddCreditCard",
  props: {
    shippingCosts: Object,
    productInfo: Object
  },
  data() {
    return {
      iugu: null,
      dialogAddCreditCard: {
        open: false,
        data: {
          description: '',
          number: '',
          verification_value: '',
          first_name: '',
          last_name: '',
          month: '',
          year: '',
          brand: '',
          numberValidated: false,
        }
      },
      paymentToken: {},
      options: {
        years: [],
        months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      }
    };
  },
  mounted () {
    window.Iugu.setAccountID(getIuguId())
    window.Iugu.setTestMode(IUGU_TEST_MODE)
    const today = new Date()
    const todayYear = +today.getFullYear()
    for (let i = 0; i <= 12; i++) {
      this.options.years.push(todayYear + i)
    }
  },
  methods: {
    updateCardNumber($event) {
      this.dialogAddCreditCard.data.number = $event;
      this.verifyCardNumber()
    },
    clkSaveCard () {
      const chk = this.chkCardData()
      if (!chk) return
      const number = this.dialogAddCreditCard.data.number.replace(/ /g,'')
      const cc = window.Iugu.CreditCard(
        number,
        this.dialogAddCreditCard.data.month,
        this.dialogAddCreditCard.data.year,
        this.dialogAddCreditCard.data.first_name,
        this.dialogAddCreditCard.data.last_name,
        this.dialogAddCreditCard.data.verification_value
      )
      utils.loading.show()
      window.Iugu.createPaymentToken(cc, (response) => {
        utils.loading.hide()
        if (response.errors) {
          console.log(response.errors);
          if (response.errors.verification_value) {
            utils.toast('Código de segurança inválido')  
            return
          } else if(response.errors.record_invalid) {
            utils.toast('Número do cartão inválido')
            return
          }
          utils.toast('Ops. Algo deu errado. Tente novamente.')
        } else {
          console.log('resposta criar token iugu', response)
          this.paymentToken = response
          this.addPaymentMethod()
        }
      });
    },
    addPaymentMethod () {
      const opt = {
        route: '/mobile/subscription/addPaymentMethod',
        body: {
          token: this.paymentToken.id,
          description: this.dialogAddCreditCard.data.description
        }
      }
      utils.loading.show()
      useFetch(opt).then(() => {
        utils.loading.hide()
        this.$emit('done')
      })
    },
    chkCardData () {
      const number = this.dialogAddCreditCard.data.number.replace(/ /g,'')
      if (this.dialogAddCreditCard.data.description === '') {
        utils.toast('Insira um apelido para o cartão')
        return false
      } else if (number.length !== 16) {
        utils.toast('O cartão deve ter 16 dígitos')
        return false
      } else if (!window.Iugu.utils.validateCreditCardNumber(this.dialogAddCreditCard.data.number)) {
        utils.toast('Número do cartão inválido')
        return false
      } else if (this.dialogAddCreditCard.data.month === '') {
        utils.toast('Preencha o mês')
        return false
      } else if (this.dialogAddCreditCard.data.year === '') {
        utils.toast('Preencha o ano')
        return false
      } else if (this.dialogAddCreditCard.data.first_name === '' || this.dialogAddCreditCard.data.last_name === '') {
        utils.toast('Preencha o nome completo')
        return false
      } else if (window.Iugu.utils.validateCVV(this.dialogAddCreditCard.data.verification_value)) {
        utils.toast('Código verificador inválido')
        return false
      }
      return true
    },
    verifyCardNumber (ev) {
      const ccNum = this.dialogAddCreditCard.data.number.replace(/\D/g, "")
      const ccBrand = window.Iugu.utils.getBrandByCreditCardNumber(ccNum)
      if (!ccBrand) this.dialogAddCreditCard.data.brand = ''
      this.dialogAddCreditCard.data.brand = ccBrand
    },
    // verifyCvv () {
    //   const cvvValidated = this.validateCVV(this.dialogAddCreditCard.data.verification_value)
    //   console.log(cvvValidated)
    // },
  },
};
</script>

<style scoped>
.input-wrapper {
  padding-left: 15px;
  margin-block: 10px;
}
</style>