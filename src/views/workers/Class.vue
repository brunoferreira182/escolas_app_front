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
        <ion-item 
          v-for="classe in classData"
          :key="classe"
          :button="true"
          @click="clkOpenDialogClassEvent(classe)"
        >
          <ion-avatar aria-hidden="true" slot="start">
            <img :src="utils.makeFileUrl(classe.image)"/>
          </ion-avatar>
          <ion-label>
            <h6>{{ classe.className }}</h6>
            <ion-badge style="background-color: #36c499;">Função: {{ classe.functionName }}</ion-badge>
          </ion-label>
        </ion-item>
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
        <ion-content>
          <div class="input-wrapper q-px-md q-mx-md">
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
          <div class="input-wrapper  q-px-md q-mx-md">
            <ion-textarea
              label="Descrição"
              label-placement="floating"
              v-model="dialogInsertChildEvent.obs"
              placeholder="Descrição da atividade"
              :auto-grow="true"
            ></ion-textarea>
          </div>
          <ion-list :inset="true" >
            <div class="ion-text-left text-h6 q-py-sm q-pl-md">Últimas atividades</div>
            <ion-item 
              v-for="e in childEventsHistory"
              :key="e"
            >
              <ion-label >
                <h6>{{ e.eventName }}</h6>
                <ion-badge  style="background-color: #eb445a;">{{ e.obs }}</ion-badge>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
        <ion-button @click="addNewUserChildEvents" class="q-pa-md" expand="block">Salvar</ion-button>
      </ion-modal>
      <ion-modal 
        :is-open="dialogInsertClassEvent.open" 
        @ionModalDidPresent="getClassChildrenById()" 
        @willDismiss="clearModalDataClass()"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="dialogInsertClassEvent.open = false">Fechar</ion-button>
            </ion-buttons>
            <ion-title >Atividades</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div class="input-wrapper q-px-md q-mx-md">
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
          <div class="input-wrapper  q-px-md q-mx-md">
            <ion-textarea
              label="Descrição"
              label-placement="floating"
              v-model="dialogInsertChildEvent.obs"
              placeholder="Descrição da atividade"
              :auto-grow="true"
            ></ion-textarea>
          </div>
          <ion-list :inset="true">
            <ion-checkbox @change="handleCheckboxChangeAll">Marcar todas as crianças</ion-checkbox>
            <div class="ion-text-left text-h6 q-py-sm q-pl-md">Lista de crianças</div>
            <ion-item
              v-for="child in classList"
              :key="child"
            >
            <ion-checkbox class="q-pr-md" @change="handleCheckboxChange(child._id)"></ion-checkbox>
              <p>
                {{ child.childName }}
              </p>
            </ion-item>
          </ion-list>
          <ion-list :inset="true" >
            <div class="ion-text-left text-h6 q-py-sm q-pl-md">Últimas atividades</div>
            <ion-item 
              v-for="e in childEventsHistory"
              :key="e"
            >
              <ion-label >
                <h6>{{ e.eventName }}</h6>
                <ion-badge  style="background-color: #eb445a;">{{ e.obs }}</ion-badge>
              </ion-label>
            </ion-item>
          </ion-list>
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
  IonCheckbox,
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
      dialogInsertClassEvent: {
        open: false,
        data: {},
        obs: '',
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
      classList: [],
      selectedChildren: [],
      selectAllChildren: false
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
    handleCheckboxChangeAll() {
      console.log("Chamou marcar todos")
      this.selectedChildren = [];
      if (this.selectAllChildren) {
        this.selectedChildren = this.classList.map(child => child._id)
      }
      this.selectAllChildren = !this.selectAllChildren
    },
    handleCheckboxChange(childId) {
      console.log("Chamou marcar individual")
    const index = this.selectedChildren.indexOf(childId);
    if (index === -1) {
      this.selectedChildren.push(childId);
    } else {
      this.selectedChildren.splice(index, 1);
    }
    this.selectAllChildren = this.selectedChildren.length === this.classList.length;
  },

    getClassChildrenById() {
      const opt = {
        route: '/mobile/workers/getChildrenListByClassId',
        body: {
          classId: this.dialogInsertClassEvent.data.classId,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.classList = r.data.list
        }
        else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde.")
        }
      })
    },
    clearModelDataClass() {
      this.dialogInsertClassEvent.open = false
      this.dialogInsertClassEvent.data = {}
      this.dialogInsertClassEvent.obs = ''
    },
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
    clkOpenDialogClassEvent(classe){
      this.dialogInsertClassEvent.data = classe
      this.dialogInsertClassEvent.open = true
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
          childId: this.dialogInsertChildEvent.data.childId,
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
      utils.loading.show()
      useFetch(opt).then((r) => {
        utils.loading.hide()
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
        this.classData = r.data.list
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