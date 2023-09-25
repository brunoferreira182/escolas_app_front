<template>
  <ion-page>
    <ToolbarEscolas
      title="Adicionar filho(a)"
      :backButton="true"
    />
    <ion-content class="ion-padding">
      <div class="q-mt-md"><strong>Adicionar filho(a)</strong></div>
      <div style="display:flex;flex-direction: column; gap: 8px;margin-top: 20px;">
        <ion-input 
          mode="md" 
          fill="outline" 
          label-placement="floating" 
          label="Nome" 
          v-model="childData.name"
          />
        <InputDocument
          mode="md"
          label-placement="floating"
          label="CPF/CNPJ"
          v-model="childData.document"
        />
        <ion-input 
          mode="md" 
          fill="outline" 
          label-placement="floating" 
          label="Data de nascimento" 
          type="date" 
          v-model="childData.birthDayDate"
        />
      </div>
      <div>
        <ion-button 
          expand="block"
          class="q-pt-sm"
          @click="addChild"
        >
        Adicionar filho
      </ion-button>
      </div>
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
import { cpf } from 'cpf-cnpj-validator'
</script>
<script>

export default {
  name: "UserPersonalData",
  data() {
    return {
      childData: {
        name: '',
        document: '',
        birthDayDate: '',
      },
    };
  },
  mounted(){
  },
  methods: {
    addChild() {
      if (this.childData.name !== '' && this.childData.document !== '' && this.childData.birthDayDate !== '') {
        const opt = {
          route: '/mobile/parents/profile/createChild',
          body: {
            childData: this.childData
          }
        }
        useFetch(opt).then((r) => {
          if (r.error) {
            console.log("Erro ao salvar o filho")
          }
          this.$router.back
        })
      } else {
        this.$q.notify("Preencha todos os dados e tente novamente.")
      }
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