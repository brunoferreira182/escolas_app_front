<template>
  <ion-page>
    <ToolbarEscolas
      title="Turmas"
      :backButton="false"
    />
    <ion-content color="light">
      <ion-searchbar 
        show-clear-button="always"
        animated="true" 
        placeholder="Pesquisar"
      >
      </ion-searchbar>
      <ion-list :inset="true" >
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">Turmas</div>
        <!-- <ion-item 
          v-for="child in userInfo.family.children"
          :key="child"
          :button="true"
          @click="goToChildDetail(child._id)"
        >
          <ion-avatar aria-hidden="true" slot="start">
            <img :src="utils.makeFileUrl(child.image)"/>
          </ion-avatar>
          <ion-label>
            <h6>{{ child.name }}</h6>
            <ion-badge v-if="child.status.status === 'inactive'" style="background-color: #eb445a;">{{ child.status.label }}</ion-badge>
            <ion-badge v-else-if="child.status.status === 'waitingApproval'" style="background-color: #ffc409;">{{ child.status.label }}</ion-badge>
            <ion-badge v-else >{{ child.status.label }}</ion-badge>
          </ion-label>
        </ion-item> -->
      </ion-list>
      <ion-list :inset="true" >
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">Alunos</div>
        <ion-item 
          v-for="child in childrenInClassList"
          :key="child"
          @click="clkOpenDialogChildEvent(child)"
          :button="true"
        >
          <ion-avatar aria-hidden="true" slot="start">
            <img :src="utils.makeFileUrl(child.image)"/>
          </ion-avatar>
          <ion-label>
            <h6>{{ child.childName }}</h6>
            <ion-badge  style="background-color: #eb445a;">{{ child.className }}</ion-badge>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-modal 
        :is-open="dialogInsertChildEvent.open" 
        @ionModalDidPresent="getChildEvents() || getChildEventsByUserId()" 
        @willDismiss="clearModalData()"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="dialogInsertChildEvent.open = false">Fechar</ion-button>
            </ion-buttons>
            <ion-title >Atividades</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div class="input-wrapper q-px-md">
            <ion-select 
              interface="popover" 
              class="always-flip"
              v-model="dialogInsertChildEvent.childEventId"
              :toggle-icon="caretDownSharp"
              label="Selecione a atividade"
            >
              <ion-select-option 
                v-for="event in childEventsList"
                :key="event"
                :value="event._id"
              >
                {{ event.name }}
              </ion-select-option>
            </ion-select>
          </div>
          <ion-textarea
            mode="md"
            label="Descrição"
            label-placement="floating"
            fill="outline"
            v-model="dialogInsertChildEvent.obs"
            placeholder="Descrição da atividade"
          ></ion-textarea>
        </ion-content>
        <ion-button @click="addNewUserChildEvents" class="q-pa-md" expand="block">Salvar</ion-button>
      </ion-modal>
      <PhotoHandler
        v-show="startPhotoHandler"
        :start="startPhotoHandler"
        :allFiles="true"
        :noCrop="false"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonBadge,
  IonHeader,
  IonToolbar,
  IonItem,
  IonButtons,
  IonTitle,
  IonSearchbar,
  IonLabel,
  IonContent,
  IonSelect, 
  IonSelectOption,
  IonTextarea,
  IonModal,
  IonList,
  IonAvatar
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { caretDownSharp } from 'ionicons/icons';
import utils from '../../composables/utils'
import PhotoHandler from '../../components/PhotoHandler.vue'
</script>
<script>

export default {
  name: "Class",
  data() {
    return {
      // childData: {
      //   name: '',
      //   document: '',
      //   birthdate: '',
      // },
      startPhotoHandler: false,
      image: {
        url: null,
        blob: null,
        name: null
      },
      dialogInsertChildEvent: {
        open: false,
        data: {},
        obs: '',
        childEventId: ''
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      classData: [],
      childrenInClassList: [],
      childEventsList: [],
      childEventsHistory: [],
    };
  },
  mounted(){
    utils.loading.hide()
  },
  beforeMount() {
    this.getClassesByUserId()
    this.getChildrenInClassList()
  },
  methods: {
    clearModalData(){
      this.dialogInsertChildEvent.open = false
      this.dialogInsertChildEvent.data = {}
      this.dialogInsertChildEvent.obs = ''
      this.dialogInsertChildEvent.childEventId = ''
    },
    clkOpenDialogChildEvent(child){
      this.dialogInsertChildEvent.data = child
      this.dialogInsertChildEvent.open = true
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
    },
    captured(fileUrl, fileBlob, fileName) {
      this.startPhotoHandler = false
      this.image = {
        url: fileUrl,
        blob: fileBlob,
        name: fileName,
        type: 'newImage'
      }
    },
    getChildEventsByUserId() {
      const opt = {
        route: '/mobile/workers/getChildEventsByUserId',
        body: {
          childId: this.dialogInsertChildEvent.data._id,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
        this.childEventsHistory = r.data.list
      })
    },
    addNewUserChildEvents() {
      if(this.dialogInsertChildEvent.obs === '' || this.dialogInsertChildEvent.childEventId === ''){
        utils.toast('Preencha o evento e insira uma observação para prosseguir')
        return
      }
      const opt = {
        route: '/mobile/workers/addNewUserChildEvents',
        body: {
          childId: this.dialogInsertChildEvent.data._id,
          childEventId: this.dialogInsertChildEvent.childEventId,
          obs: this.dialogInsertChildEvent.obs
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
          this.clearModalData()
          utils.toast('Evento inserido com sucesso!')
      })
    },
    getChildEvents() {
      const opt = {
        route: '/mobile/workers/getChildEvents',
        body: {
          status: 'active',
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
        this.childEventsList = r.data.list
      })
    },
    getChildrenInClassList() {
      const opt = {
        route: '/mobile/workers/getChildrenInClassList',
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
        this.childrenInClassList = r.data.list
      })
    },
    getClassesByUserId() {
      const opt = {
        route: '/mobile/workers/getClassesByUserId',
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
        this.childrenInClassList = r.data.list
      })
    }
  }
};
</script>
<style scoped>
ion-select.always-flip::part(icon) {
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

ion-select.always-flip.select-expanded::part(icon) {
  transform: rotate(180deg);
}

ion-select.never-flip::part(icon) {
  transform: none;
}
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
.input-wrapper {
  border: 1px solid #ebebec;
  /* padding-left: 15px; */
  border-radius: 0.5rem;
  margin-block: 10px;
}
</style>