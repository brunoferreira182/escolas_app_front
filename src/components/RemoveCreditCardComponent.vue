<template>
  <div>
    <div class="ion-text-center q-mb-sm">Escolha o cartão a remover</div>
    <ion-list>
      <ion-item
        v-for="item in listOfPaymentMethods.data"
        :key="item.id"
        @click="clkConfirmRemoveCard(item)"
        button detail="true"
        :detailIcon="caretForwardOutline"
      >
        <font-awesome-icon 
          icon="fa-solid fa-credit-card fa-2x" 
          slot="start" 
          style="color: blue; 
          font-size: 1.5em;"
        />
        <ion-label>
          <h3>Cartão de crédito</h3>
          <p>Final {{ item.data.last_digits }}</p>
        </ion-label>
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup>
import {
  IonItem, IonLabel, IonList
} from '@ionic/vue';
import { caretForwardOutline } from 'ionicons/icons';
</script>

<script>

import { useFetch } from '../composables/fetch'
import utils from '../composables/utils'

export default {
  name: "RemoveCreditCard",
  props: ['listOfPaymentMethods'],
  data() {
    return {
      
    };
  },
  methods: {
    clkConfirmRemoveCard (item) {
      const opt = {
        route: '/mobile/subscription/removePaymentMethod',
        body: {
          // customerId: item.customer_id,
          id: item.id
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.$emit('done')
      })
    },
  },
};
</script>