<template>
  <ion-page>
    <ToolbarEscolas
      title="Adicionar familiar"
      :backButton="true"
    />
    <ion-content class="ion-padding">
      <div class="q-my-md"><strong>Adicionar familiar</strong></div>
      <div>
        <InputDocument
          mode="md"
          @keyup="getUserByCpf"
          label-placement="floating"
          label="Insira o cpf do familiar"
          v-model="parent.searchDocument"
          class="q-mb-sm"
        />
      </div>
      <div>
        <ion-button 
          expand="block"
          class="q-pt-sm"
          @click="searchParent"
        >
          Pesquisar familiar
        </ion-button>
      </div>
      <div 
        v-if="canShowParentData === true"
        class="q-pt-md"  
      >
        <ion-input
          fill="outline"
          rows="1" 
          v-model="parent.name" 
          hint="Nome"
          label-placement="floating"
          readonly
        />
        <ion-button 
          expand="block" 
          class="q-pt-md"
          @click="addParentToFamily"
        >
          Adicionar na minha família
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
  IonImg,
  IonAvatar
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch'
import InputDocument from '../../components/InputDocument.vue'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
import { cpf } from 'cpf-cnpj-validator'
import PhotoHandler from '../../components/PhotoHandler.vue'
</script>
<script>

export default {
  name: "UserPersonalData",
  data() {
    return {
      canShowParentData: false,
      parent: {
        searchDocument: '',
        document: '',
        name: '',
        id: ''
      },
      familyId: ''
    };
  },
  mounted(){
    this.getFamilyId()
  },
  methods: {
    getFamilyId() {
      this.familyId = this.$route.query.familyId
    },
    getUserProfileById() {
      const opt = {
        route: '/mobile/parents/profile/getUserProfileById'
      }
      useFetch(opt).then((r) => {
        if(!r.error) {
          this.userProfile = r.data
        } else {
          utils.toast("Ocorreu um erro, tente novamente.")
        }
      })
    },
    addParentToFamily() {
      const opt = {
        route: '/mobile/parents/profile/addUserToFamily',
        body: {
          userId: this.parent.id,
          familyId: this.familyId,
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente.")
        }
      })
    },
    searchParent(){
      if (this.parent.searchDocument.length !== 14 || this.parent.document === '' || this.parent.name === '') {
        utils.toast("Preencha um cpf válido")
        return
      }
      this.canShowParentData = true
    },  
    getUserByCpf() {
      const opt = {
        route: '/mobile/parents/profile/getUserByCpf',
        body: {
          cpf: this.parent.searchDocument
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente.")
          return
        }
        if (r.data.length) {
          this.parent.document = r.data[0].document
          this.parent.name = r.data[0].name
          this.parent.id = r.data[0]._id
          return
        }
        else {
          this.parent.document = '',
          this.parent.name = '',
          this.parent.id = '',
          this.canShowParentData = false
        }
      })
    },
  }
};
</script>
<style scoped>
ion-avatar {
  --border-radius: 4px;
  width: 100px;
  height: 100px
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