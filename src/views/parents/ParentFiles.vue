<template>
  <ion-page>
    <ToolbarEscolas
      title="Arquivos"
      :backButton="true"
    />
    <ion-content color="light">
      <div class="q-pt-md">
        <ion-list :inset="true">
          <div class="ion-text-left text-h6 q-py-sm q-pl-md">Meus arquivos</div>
          <ion-item 
            v-for="doc in parentFiles"
            :key="doc"
            
          >
            <ion-label>
              <div v-if="doc.type === 'Boleto'">Boleto</div>
              <div v-else>Arquivo</div>
              <ion-note>
                {{ doc.createdAt.createdAtOnlyDate }}
              </ion-note>
            </ion-label>
            <ion-note slot="end">
              <ion-button fill="clear" @click="copyBarcode(doc)" v-if="doc.type === 'Boleto'">
                <ion-icon slot="icon-only" :icon="barcode"></ion-icon>
              </ion-button>
              <ion-button fill="clear" @click="clkDownloadAttachment(doc)">
                <ion-icon slot="icon-only" :icon="cloudDownload"></ion-icon>
              </ion-button>
            </ion-note>
            
          </ion-item>
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
  IonList,
  IonNote,
  IonText,
  IonIcon,
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
import {
  cloudDownload,
  barcode,
  close
} from 'ionicons/icons';
import { Clipboard } from '@capacitor/clipboard';

</script>
<script>

export default {
  name: "ParentFiles",
  data() {
    return {
      searchDocument: '',
      searchResult: null,
      parentFiles: [],
    };
  },
  watch: {
    $route (to, from) {
      if (to.path === '/parentFiles') {
        this.getFilesByUserId()
      }
    }
  },
  mounted(){
    utils.loading.hide()
    this.getFilesByUserId()
  },
  methods: {
    async copyBarcode (doc) {
      console.log(doc, 'doc.barCode')
      await Clipboard.write({
        string: doc.barCode
      });
      utils.toast("Código de barras copiado.")
    },
    async clkDownloadAttachment (doc) {
      utils.loading.show()
      const retDownload = await utils.downloadFile({
        filename: doc.file.filename,
        originalname: doc.file.originalname
      })
      console.log(retDownload, 'retDownload aqui')
      utils.loading.hide()
    },
    getFilesByUserId(){
      const opt = {
        route: '/mobile/parents/profile/getFilesByUserId'
      }
      useFetch(opt).then((r) => {
        if(!r.error) {
          this.parentFiles = r.data
        } else {
          utils.toast("Ocorreu um erro, tente novamente.")
        }
      })
    },
    async copyBarCode(doc) {
      if (doc.type === 'Boleto') {
        await Clipboard.write({
          string: doc.barCode
        });
        
        utils.toast("Código copiado para a área de transferência.");
      } 
      else return utils.toast("Ocorreu um erro ao copiar o código.");
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