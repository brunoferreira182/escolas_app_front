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
        :debounce="400"
        v-model="filterValue"
        @ionInput="getChildrenInClassList()"
      />
      <Transition name="bounce">
        <ion-list :inset="true" v-if="show">
          <div class="ion-text-left text-h6 q-py-sm q-pl-md">Turmas</div>
          <ion-item 
            v-for="c in classData"
            :key="c"
            :button="true"
            class="q-pa-sm"
            @click="clkOpenDialogClassEvent(c)"
          >
            <ion-avatar aria-hidden="true" slot="start" v-if="c.classImage">
              <img :src="utils.makeFileUrl(c.classImage.filename)" />
            </ion-avatar>
            <ion-avatar aria-hidden="true" slot="start" v-else>
              <img :src="utils.makeFileUrl(c.image)"/>
            </ion-avatar>
            <ion-label>
              <h6>{{ c.className }}</h6>
              <ion-badge color="success">Função: {{ c.functionName }}</ion-badge>
            </ion-label>
          </ion-item>
        </ion-list>
      </Transition>
      <ion-list :inset="true" >
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">Alunos</div>
        <ion-item 
          v-for="child in childrenInClassList"
          :key="child"
          @click="clkOpenDialogChildEvent(child)"
          :button="true"
          class="q-pa-sm"
        >
          <ion-avatar aria-hidden="true" slot="start" v-if="child.childPhoto">
            <img :src="utils.makeFileUrl(child.childPhoto.filename)"/>
          </ion-avatar>
          <ion-avatar aria-hidden="true" slot="start" v-else>
            <img :src="utils.makeFileUrl(child.image)"/>
          </ion-avatar>
          <ion-label>
            <h6>{{ child.childName }}</h6>
            <ion-badge  color="primary"> {{ child.className }}</ion-badge>
          </ion-label>
        </ion-item>
      </ion-list>
      
      <ion-modal
        :is-open="dialogViewImage.open === true"
      >
        <ion-header v-if="dialogViewImage.data">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="clearDialogViewImage">Fechar</ion-button>
            </ion-buttons>
            <ion-title >{{ dialogViewImage.data.eventName }}</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content v-if="dialogViewImage">
          <div class="centered-image">
            <img style="width: 80%;height: auto;" :src="utils.makeFileUrl(dialogViewImage.image)"/>
          </div>
        </ion-content>
      </ion-modal>

      <ion-modal 
        :is-open="dialogInsertClassEvent.open" 
        @ionModalDidPresent="startModal()" 
        @didDismiss="clearModalDataClass()"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="closeDialogClass">Fechar</ion-button>
            </ion-buttons>
            <ion-title >Atividades</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div class="input-wrapper q-px-md q-mx-md">
            <ion-button 
              @click="openActivityAlert()" 
              expand="block" 
              fill="flat"
            >
              {{ dialogInsertChildEvent.childEventId !== '' ? selectedEvent[0].name : 'Selecionar Atividade' }}
            </ion-button>
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
            <div class="ion-text-left text-h6 q-py-sm q-pl-md">
              <ion-checkbox v-model="selectAllChildren" @ionChange="handleCheckboxChangeAll($event)"/>
              Lista de crianças
            </div>
            <ion-item
              v-for="child in classList"
              :key="child"
              >
              <ion-checkbox 
                :checked="child.isChecked" 
                @ionChange="handleCheckboxChange(child.childId, $event)" 
              />
                <ion-label class="q-px-md ion-text-capitalize">
                  {{ child.childName }}
                </ion-label>
              </ion-item>
          </ion-list>
          <div class="ion-text-left text-h6 q-py-sm q-pl-md">Últimas atividades</div>
          <ion-list :inset="true" v-if="childEventsHistory.length">
            <ion-item 
              v-for="e in childEventsHistory"
              :key="e"
            >
              <ion-avatar aria-hidden="true" slot="start" v-if="e.childEventImage">
                <img :src="utils.makeFileUrl(e.childEventImage)" @click="startDialogViewImage(e)"/>
              </ion-avatar>
              <ion-avatar aria-hidden="true" slot="start" v-else>
                <img :src="utils.makeFileUrl(e.childPhoto)"/>
              </ion-avatar>
              <ion-label>
                <ion-row class="ion-justify-content-between">
                  <ion-col size="2">
                    <strong class="text-capitalize">{{ e.childName }}</strong><br/>
                    <ion-badge  color="primary">{{ e.eventName }}</ion-badge><br />
                  </ion-col>
                  <ion-col 
                    size="6" 
                    class="text-subtitle2 ion-text-end"
                  >
                    <div>
                      {{ e.createdAt.createdAtLocale.split(' ')[0] }}
                    </div>
                    <div>
                      {{ e.createdAt.createdAtLocale.split(' ')[1] }}
                    </div>
                  </ion-col>
                </ion-row>
                <ion-badge  style="background-color: #eb445a;">{{ e.obs }}</ion-badge>
              </ion-label>
            </ion-item>
          </ion-list>
          <div v-else class="q-px-lg text-caption">
            Nenhuma atividade
          </div>
        </ion-content>
        <ion-button @click="createUserChildEvents" class="q-pa-md" expand="block">Salvar</ion-button>
      </ion-modal>
  
    </ion-content>
    <ion-alert v-if="formattedChildEventList"
      :is-open="dialogInsertActivity.open"
      header="Escolha uma atividade"
      :backdropDismiss="false"
      animated
      :inputs="formattedChildEventList"
      :buttons="[
        {
          text: 'Depois',
          handler: () => {
            dialogInsertActivity.open = false;
          },
        },
        {
          text: 'Confirmar',
          handler: (e) => {
            dialogInsertActivity.open = false;
            selectOptionActivity(e)
          },
        },
      ]"
    />
 
    <DialogInsertChildEvent
      :dialogInsertChildEvent="dialogInsertChildEvent"
      :selectedEvent="selectedEvent"
      :childEventsHistory="childEventsHistory"
      :pagination="pagination"
      :dialogInsertActivity="dialogInsertActivity"
      @close="closeDialogInserChildren"
    />
  </ion-page>
</template>


<script setup>
import {
  IonPage, IonAlert,
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
  IonChip ,
  IonCol,
  IonCheckbox,
  IonImg,
  IonRow,
  IonAvatar
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { caretDownSharp } from 'ionicons/icons';
import utils from '../../composables/utils'
import PhotoHandler from '../../components/PhotoHandler.vue'
import DialogInsertChildEvent from '../../components/DialogInsertChildEvent.vue'
</script>
<script>

export default {
  name: "Class",
  data() {
    return {
      startPhotoHandler: false,
      dialogInsertChildEvent: {
        open: false,
        data: [],
        obs: '',
        childEventId: ''
      },
      image: {
        url: null,
        blob: null,
        name: null
      },
      dialogInsertClassEvent: {
        open: false,
        data: {},
        obs: '',
      },
      dialogViewImage: {
        open: false,
        data: null,
        image: null
      },
      dialogInsertActivity: {
        open: false
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      classData: [],
      childrenInClassList: [],
      childEventsHistory: [],
      childEventsList: [],
      show: true,
      selectedEvent: null,
      classList: [],
      selectedChildren: [],
      childrenFilter: [],
      filterValue: '',
      selectAllChildren: false,
      formattedChildEventList: null,
    };
  },
  mounted(){
    utils.loading.hide()
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsWorkers/class') {
        this.getClassesByUserId()
        this.getChildrenInClassList()
        this.verifyIfHasChildId()
        this.getLastActivityFromChildrenOfClasses()
      }
    }
  },
  beforeMount() {
    utils.loading.hide()
    this.getClassesByUserId()
    this.getChildrenInClassList()
    this.verifyIfHasChildId()
    this.getLastActivityFromChildrenOfClasses()
  },
  methods: {
    startModal(){
      this.getChildrenListByClassId()
      this.getLastActivityFromChildrenOfClasses()
      this.getChildrenInClassList()
    },
    getLastActivityFromChildrenOfClasses() {
      const opt = {
        route: '/mobile/workers/classes/getLastActivityFromChildrenOfClasses',
        body: {
          page: 1,
          rowsPerPage: 100,
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) utils.toast("Ocorreu um erro, tente novamente.")
        else {
          this.childEventsHistory = r.data.list
        } 
      })
    },
    getLastActivityFromChild() {
      const opt = {
        route: '/mobile/workers/classes/getLastActivityFromChild',
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage,
          childId: this.dialogInsertChildEvent.data.childId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente.")
          return
        }
        this.childEventsHistory = r.data.list
        this.pagination.page++
      })
    },
    verifyIfHasChildId() {
      if (this.$route.query.childId !== undefined) {
        this.clkOpenDialogChildEvent(this.$route.query.childId)
        return
      }
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
    },
    closeDialogClass() {
      this.dialogInsertClassEvent.open = false,
      this.dialogInsertClassEvent.data = {},
      this.image = {
        url: null,
        blob: null,
        name: null
      },
      this.dialogInsertClassEvent.obs = ''
    },
    selectOptionActivity(e) {
      this.dialogInsertChildEvent.childEventId = e
      this.selectedEvent = this.childEventsList.filter(event => event._id === e)
    },
    openActivityAlert() {
      this.dialogInsertActivity.open = true
    },
    filterChildren(event) {
      const query = event.target.value.toLowerCase();
      this.childrenFilter = this.states.filter((d) => d.nome.toLowerCase().indexOf(query) > -1);
    },
    handleCheckboxChangeAll(e) {
      if (e.detail.checked === true) {
        this.selectedChildren = this.classList.map((child) => ({ _id: child.childId }));
      } else {
        this.selectedChildren = [];
      }

      this.classList.forEach((classList) => {
        classList.isChecked = e.detail.checked;
      });

      this.dialogInsertChildEvent.data = this.selectedChildren.map((child) => child.childId);
    },
    // handleCheckboxChangeAll(e) {
    //   if (e.detail.checked === true) {
    //     this.selectedChildren = this.classList.map((child) => ({
    //     _id: child._id,
    //   }));
    //   } else {
    //     this.selectedChildren = []
    //   }
    //   this.selectedChildren.forEach((child) => {
    //     this.classList.forEach((classList, i) => {
    //       if (child._id === classList._id) {
    //         this.classList.forEach((teste) => {
    //           teste.isChecked = e.detail.checked
    //           if (teste.isChecked === false) {
    //             this.selectedChildren = []
    //             this.classList.forEach((classList) => {
    //               classList.isChecked = false
    //             })
    //           }
    //         }) 
    //       }
    //     })
    //   })
    //   this.dialogInsertChildEvent.data = this.selectedChildren
    // },
    // handleCheckboxChangeAll(e) {
    //   this.selectedChildren = [];
    //   this.classList.forEach((classList) => {
    //     classList.isChecked = e.detail.checked;
    //     if (e.detail.checked) {
    //       this.selectedChildren.push({ _id: classList._id });
    //     }
    //   });
    //   this.dialogInsertChildEvent.data = this.selectedChildren;
    // },
    closeDialogInserChildren() {
      this.dialogInsertChildEvent.open = false
      this.dialogInsertChildEvent.data = []
      this.dialogInsertChildEvent.obs = ''
      this.dialogInsertChildEvent.childEventId = ''
      this.pagination.page = 1
    },
    handleCheckboxChange(childId, e) {
      if (e.detail.checked === true) {
        this.selectedChildren.push({_id: childId})
        if (this.selectedChildren.length === this.classList.length) {
            this.selectAllChildren = true
          }
        return
      }
      if (e.detail.checked === false) {
        const initialLength = this.selectedChildren.length
        this.selectedChildren.forEach((child, childIndex) => {
          if (child._id === childId) {
            this.selectedChildren.splice(childIndex, 1)
          if (initialLength === this.classList.length && this.selectedChildren !== initialLength) {
            this.selectAllChildren = false
          }
            this.dialogInsertChildEvent.data = this.selectedChildren
          }
        })
      }
    },
    startDialogViewImage(e) {
      this.dialogViewImage.open = true
      this.dialogViewImage.image = e.childEventImage
      this.dialogViewImage.data = e
    },
    clearDialogViewImage() {
      this.dialogViewImage.open = false
      this.dialogViewImage.image = null
      this.dialogViewImage.data = null
    },
    getChildrenListByClassId() {
      const opt = {
        route: '/mobile/workers/getChildrenListByClassId',
        body: {
          classId: this.dialogInsertClassEvent.data.classId,
          page: 1,
          rowsPerPage: 100
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
    clearModalDataClass() {
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
      this.getLastActivityFromChild()
    },
    // getLastChildActivities () {
    //   const opt = {
    //     route: '/mobile/workers/getLastChildActivities',
    //     body: {
    //       childId: this.dialogInsertChildEvent.data.childId,
    //       page: this.pagination.page,
    //       rowsPerPage: this.pagination.rowsPerPage
    //     }
    //   }
    //   useFetch(opt).then((r) => {
    //     if (r.error) {
    //       utils.toast('Ocorreu um erro. Tente novamente.')
    //       return
    //     }
    //     this.childEventsHistory = r.data.list
    //   })
    // },
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
        this.formattedChildEventList = this.childEventsList.map((event) => ({
          type: 'radio',
          label: event.name,
          value: event._id
        }))
      })
    },
    clkOpenDialogClassEvent(c){
      this.dialogInsertClassEvent.data = c
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
    createUserChildEvents() {
      const file = [{ file: this.image.blob, name: 'newImage' }]
      if(this.dialogInsertChildEvent.obs === '' || this.dialogInsertChildEvent.childEventId === ''){
        utils.toast('Preencha o evento e insira uma observação para prosseguir')
        return
      }
      const opt = {
        route: '/mobile/workers/createUserChildEvents',
        body: {
          // childId: this.dialogInsertChildEvent.data,
          selectedChildren: this.selectedChildren,
          childEventId: this.dialogInsertChildEvent.childEventId,
          obs: this.dialogInsertChildEvent.obs
        },
        // file: this.image.blob ? [{ file: this.image.blob, name: 'userPhoto' }] : null
      }
      if(this.image.blob !== null){
        opt.file = file
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
          this.clearModalData()
          this.dialogInsertClassEvent.open = false
          this.getLastActivityFromChildrenOfClasses()
          this.getLastActivityFromChild()
          this.selectedEvent = null
          utils.toast('Evento inserido com sucesso!')
      })
    },
    
    getChildrenInClassList() {
      if (this.filterValue !== '') {
        this.show = false
      } else this.show = true
      const opt = {
        route: '/mobile/workers/getChildrenInClassList',
        body: {
          page: this.pagination.page,
          rowsPerPage: 100,
          searchString: this.filterValue
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
        this.childrenInClassList = r.data.list
        this.getChildEvents()
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
  ion-checkbox {
    --size: 32px;
    --checkbox-background-checked: #6815ec;
  }

  ion-checkbox::part(container) {
    border-radius: 6px;
    border: 2px solid #6815ec;
  }
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
  --border-radius: 36px;
  width: 56px;
  height: 56px
}
.centered-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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