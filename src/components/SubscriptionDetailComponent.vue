<template>
  <ion-card class="cardCheckout" style="box-shadow: 0">
    <ion-card-header >
      <ion-row class="ion-justify-content-between">
        <ion-col size="auto">
          <h4 >Valor do plano</h4>
        </ion-col>
        <ion-col size="auto" >
          <img width="46" height="46" :src="moneySVG" />
        </ion-col>
      </ion-row>
    </ion-card-header>
    <ion-card-content>
      <ion-item color="transparent" lines="none">
        <ion-label>
          <h2>R$ {{ subscriptionDetail.planData.price.price }}</h2>
          <p>Plano mensal</p>
        </ion-label>
      </ion-item>
      <ion-item color="transparent" lines="none" v-if="subscriptionDetail.iuguData">
        <ion-label>
          <h2 v-if="subscriptionDetail.iuguData.active">Ativa</h2>
          <h2 v-else-if="subscriptionDetail.iuguData.suspended">Suspensa</h2>
          <h2 v-else>Cancelada</h2>
          <p>Status da assinatura</p>
        </ion-label>
      </ion-item>
    </ion-card-content>
  </ion-card>
  <ion-card class="cardCheckout" style="box-shadow: 0">
    <ion-card-header>
      <ion-row class="ion-justify-content-between">
        <ion-col size="auto">
          <h4 >Forma de pagamento</h4>
        </ion-col>
        <ion-col size="auto" class="q-ma-sm">
          <img
            v-if="subscriptionDetail.paymentData.paymentMethod === 'creditCard'
            || subscriptionDetail.paymentData.paymentMethod === 'credit_card'"
            width="46"
            height="46"
            :src="creditSVG"
          />
        </ion-col>
      </ion-row>
    </ion-card-header>
    <ion-card-content>
      <div v-if="subscriptionDetail.paymentData.paymentMethod === 'creditCard'
        || subscriptionDetail.paymentData.paymentMethod === 'credit_card'">
        <ion-item color="transparent" lines="none" >
          <ion-label class="ion-text-wrap">
            <h2>Cartão de crédito</h2>
            <p>Forma de pagamento</p>
          </ion-label>
        </ion-item>
        <ion-item color="transparent" lines="none">
          <ion-label class="ion-text-wrap">
            <h2>{{ subscriptionDetail.paymentData.description }}</h2>
            <p>Apelido do cartão</p>
          </ion-label>
        </ion-item>
        <ion-item color="transparent" lines="none">
          <ion-label class="ion-text-wrap">
            <h2>{{ subscriptionDetail.paymentData.display_number }}</h2>
            <p>Últimos dígitos</p>
          </ion-label>
        </ion-item>
      </div>

      <!-- <div v-if="paymentType === 'bank_slip'">
        <ion-item color="transparent" lines="none">
          <ion-label class="ion-text-wrap">
            <h2>Boleto</h2>
            <p>Forma de pagamento</p>
          </ion-label>
        </ion-item>
      </div>

      <div v-if="paymentType === 'pix'">
        <ion-item color="transparent" lines="none">
          <ion-label class="ion-text-wrap">
            <h2>Boleto</h2>
            <p>Forma de pagamento</p>
          </ion-label>
        </ion-item>
      </div> -->
    </ion-card-content>
  </ion-card>

  <ion-card class="cardCheckout" style="box-shadow: 0">
    <ion-card-header>
      <ion-row class="ion-justify-content-between">
        <ion-col size="auto">
          <h4 >Seu plano</h4>
        </ion-col>
        <ion-col size="auto" class="q-ma-sm">
          <img width="46" height="46" :src="planSVG" />
        </ion-col>
      </ion-row>
    </ion-card-header>
    <ion-card-content>
        <ion-item
          color="transparent"
          lines="none"
        >
          <ion-label class="ion-text-wrap">
            <h2>{{ subscriptionDetail.planData.name }}</h2>
            <p>{{ subscriptionDetail.planData.description }}</p>
          </ion-label>
        </ion-item>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import {
  IonLabel,
  IonCol,
  IonIcon,
  IonItem,
  IonCard, IonCardContent, IonCardHeader,
  IonList,
  IonRow,
} from '@ionic/vue';
import { copy } from 'ionicons/icons';
import { ref, onMounted, watch } from 'vue'

const props = defineProps(['subscriptionDetail'])

const moneySVG = ref('/assets/money.svg')
const creditSVG = ref('/assets/credit-card.svg')
const planSVG = ref('/assets/plan.svg')


</script>

<style scoped>
ion-item::part(native) {
  background: #f3f3f3;
}
ion-card {
  --background: #f3f3f3;
}
.sc-ion-label-ios-h.in-item-color.sc-ion-label-ios-s>p {
  color: rgb(102, 102, 102);
}
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

.cardStyle {
  border-radius: 1rem;
  overflow: hidden;
  background: var(--ion-color-tertiary);
}

.cardCheckout {
  box-shadow: none;
  border-radius: 15px;
  margin: 10px;
}
</style>