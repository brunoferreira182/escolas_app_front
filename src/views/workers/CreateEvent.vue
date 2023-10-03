<template>
  <ion-page>
    <ToolbarEscolas
      title="Criar evento"
      :backButton="true"
    />
    <ion-content class="ion-padding" color="light">
      <ion-list :inset="true">
        <p class="q-pl-md">Dê um nome para o evento:</p>
        <ion-item lines="none">
          <ion-input
            fill="outline"
            type="text"
            mode="md"
            v-model="eventData.name"
          ></ion-input>
        </ion-item>
        <p class="q-mt-md q-pl-md">Adicione a data em que acontecerá esse evento:</p>
        <ion-item lines="none">
          <ion-input
            fill="outline"
            type="date"
            mode="md"
            v-model="eventData.date"
          ></ion-input>
        </ion-item>
        <p class="q-mt-md q-pl-md">Adicione o endereço deste evento:</p>
        <ion-item>

          <div style="display:flex;flex-direction: column; gap: 8px;margin-top: 20px;">
          <ion-input 
            mode="md" 
            fill="outline" 
            label-placement="floating" 
            label="CEP" 
            v-model="eventData.address.zipCode"
            @keyup="checkCEP"
          />
          <ion-input 
            mode="md" 
            fill="outline" 
            label-placement="floating" 
            label="Logradouro" 
            v-model="eventData.address.street"
          />
          <ion-input 
            mode="md" 
            fill="outline" 
            label-placement="floating" 
            label="Número" 
            type="number" 
            v-model="eventData.address.number"
          />
          <ion-input 
            mode="md" 
            fill="outline" 
            label-placement="floating" 
            label="Complemento (opcional)" 
            v-model="eventData.address.complement"
          />
        <ion-row class="ion-justify-content-between q-pa-none">
          <ion-col size="8" class="q-pa-none q-pr-sm">
            <ion-input 
              mode="md"
              fill="outline"
              label-placement="floating"
              label="Cidade"
              v-model="eventData.adress.city"
            />
          </ion-col>
          <ion-col size="4" class="q-pa-none">
            <ion-input
              mode="md"
              fill="outline"
              label-placement="floating"
              label="UF"
              v-model="eventData.address.state"
            />
          </ion-col>
        </ion-row>
        </div>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonContent, IonPage,
  IonInput, IonList,
  IonItem, IonRow,
  IonCol
} from '@ionic/vue';
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'

</script>

<script>

export default {
  name: 'CreateEvent',
  data() {
    return {
      eventData: {
        name: '',
        date: '',
        address: {
          zipCode: '',
          street: '',
          number: '',
          complement: '',
          city: '',
          state: '', 
        }
      }
    };
  },
  beforeMount() {
  },
  methods: {
    checkCEP (ev) {
      this.addressData.zipCode = ev.target.value
      if(this.addressData.zipCode.length === 8){
        const opt = {
          route: '/mobile/parents/profile/getAddressFromZipCode',
          body: {
            zipCode: this.addressData.zipCode
          }
        }
        utils.loading.show()
        useFetch(opt).then(r => {
          utils.loading.hide()
          this.addressData.street = r.data.logradouro
          this.addressData.city = r.data.localidade
          this.addressData.state = r.data.uf
        })
      } 
      
    },
  },
  
};
</script>
