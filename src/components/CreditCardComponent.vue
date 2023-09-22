<template>
  <ion-card class="credit-card-class" v-if="cardData.number !== ''" style="width: 80%; ; z-index: 2">
    <div class="q-pa-md">
      <div
        class="ion-text-right bg-white q-pa-sm"
        style="border-radius: 15px; width: 25%"
      >
        <img
          :src="'/assets/banks_logos/logo_' + cardData.brand + '.png'"
          style="border-radius: 10px;"
        />
      </div>
    </div>
    <div class="ion-text-left q-pl-md q-pb-md">
      <div class="text-h6">{{ cardData.number }}</div>
    </div>
    <div class="ion-text-left q-pl-md">
      <div>{{ cardData.first_name }} {{ cardData.last_name }}</div>
    </div>
    <div class="ion-text-right q-pa-md">
      <div>{{ cardData.month }}/{{ cardData.year }}</div>
    </div>
  </ion-card>
  <ion-card
    class="credit-card-class"
    v-if="cardData.number !== ''"
    style="width: 80%; margin-left: 20%; margin-top: -140px; z-index: 1"
  >
    <div style="height: 15px"></div>
    <div style="height: 40px; width: 100%; background: black"></div>
    <div style="height: 110px" class="ion-text-right q-mr-md q-mt-sm">{{ cardData.verification_value }}</div>
  </ion-card>

</template>

<script setup>
import {
  IonCard
} from '@ionic/vue';
</script>

<script>
export default {
  name: 'CreditCardComponent',
  props: {
    cardData: Object
  },
  data () {
    return {}
  }
}
</script>

<style >
.credit-card-class {
  border-radius: 12px;
  background-image: linear-gradient(rgb(200, 200, 200), grey);
  color: white;
}
</style>