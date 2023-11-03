<template>
  <ion-page>
    <ToolbarEscolas
      title="Adicionar familiar"
      :backButton="true"
    />
    <ion-content color="light">
      <div class="ion-padding">
        <div class="q-my-md"><strong>Adicionar familiar</strong></div>
        <div>
          <InputDocument
            mode="md"
            label-placement="floating"
            label="Insira o CPF do familiar"
            v-model="searchDocument"
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
      </div>
      <div 
        v-if="searchResult"
        class="q-pt-md"  
      >
        <ion-list :inset="true">
          <!-- <div class="ion-text-left text-h6 q-py-sm q-pl-md">Resultado</div> -->
          <!-- <ion-item 
            :button="true"
            @click="inviteParentToFamily"
          >
            <ion-avatar slot="start">
              <ion-img :src="utils.makeFileUrl(searchResult.image)"/>
            </ion-avatar>
            <ion-label>
              <h6>{{ searchResult.name }}</h6>
            </ion-label>
          </ion-item> -->
        </ion-list>

      </div>
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonAlert,
  IonInput,
  IonItem,
  IonLabel,
  IonContent,
  onIonViewWillEnter,
  IonImg,
  IonAvatar,
  IonList
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
  name: "AddParent",
  data() {
    return {
      searchDocument: '',
      searchResult: null,
    };
  },
  methods: {
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
    inviteParentToFamily() {
      const opt = {
        route: '/mobile/parents/profile/addSolicitationToUserGetFamily',
        body: {
          userId: this.searchResult._id,
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente.")
        }
        else {
          utils.toast("Convite enviado com sucesso.")
          this.$router.back()
        }
      })
    },
    searchParent () {
      if (this.searchDocument.length !== 14) {
        utils.toast("Preencha um CPF válido")
        return
      }
      const opt = {
        route: '/mobile/parents/profile/getUserByCpf',
        body: {
          document: this.searchDocument
        }
      }
      utils.loading.show()
      useFetch(opt).then((r) => {
        utils.loading.hide()
        if (r.error) return
        this.searchResult = r.data
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