<template>
  <ion-page>
    <ToolbarEscolas
      title="Presença"
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
          <div class="q-px-md text-caption">
            Selecione uma turma para marcar presença
          </div>
          <ion-item 
            v-for="c in classData"
            :key="c"
            class="q-pa-sm"
          >
            <ion-avatar aria-hidden="true" slot="start" >
              <img :src="utils.makeFileUrl(c.classImage)" v-if="c.classImage"/>
              <img :src="utils.makeFileUrl(c.image)" v-else/>
            </ion-avatar>
            <ion-label>
              <div class="text-h6">{{ c.className }}</div>
              <ion-badge color="primary">Função: {{ c.functionName }}</ion-badge>
              <div>
                <ion-button 
                  color="success" 
                  slot="end"
                  @click="clkOpenModalAttendance(c)"
                > 
                  Marcar presença
                </ion-button>
              </div>
            </ion-label>
          </ion-item>
        </ion-list>
      </Transition>
      <ion-list :inset="true" color="light">
        <ion-accordion-group >
          <ion-accordion value="alunos">
            <div slot="header" class="ion-text-left text-h6 q-py-sm q-pl-md">Alunos</div>
            <div slot="content">
              <div class="q-px-md text-caption">
                Selecione um aluno para inserir uma presença individualmente
              </div>
              <ion-item 
                v-for="child in childrenInClassList"
                :key="child"
                :button="true"
                detail="false"
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
                <!-- <ion-label slot="end"> -->
                  <ion-button 
                    color="success"
                    shape="round"
                    slot="end"
                    @click="clkAddPresenceToChild(child)"
                  > 
                    <ion-icon slot="icon-only" :icon="checkmark"></ion-icon>
                  </ion-button>
                  <ion-button 
                    color="danger"
                    shape="round"
                    slot="end"
                  > 
                    <ion-icon slot="icon-only" :icon="close"></ion-icon>
                  </ion-button>
                <!-- </ion-label> -->
              </ion-item>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </ion-list>

    </ion-content>

    <ion-modal 
        :is-open="dialogAttendance.open" 
        @ionModalDidPresent="startModalAttendance()" 
        @didDismiss="clearModalAttendanceData()"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="clearModalAttendanceData">Fechar</ion-button>
            </ion-buttons>
            <ion-title >Comparecimento</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div class="ion-text-center q-pa-md">
            <ion-row>
              <ion-col>
                <div class="modal-attendance">
                  <div class="q-ma-sm text-h6">
                    Presença
                  </div>
                  <ion-checkbox 
                    v-model="dialogAttendance.isAttendanceChecked"
                    @ionChange="handleCheckboxAttendanceChange('attendance')"
                  />
                </div>
              </ion-col>
              <ion-col>
                <div class="modal-absent">
                  <div class="q-ma-sm text-h6">
                    Falta
                  </div>
                  <ion-checkbox 
                    v-model="dialogAttendance.isAbsentChecked"
                    @ionChange="handleCheckboxAttendanceChange('absent')"
                  />
                </div>
              </ion-col>
            </ion-row>
          </div>
          <div class="input-wrapper  q-px-md q-mx-md">
            <ion-textarea
              label="Descrição (opcional)"
              label-placement="floating"
              v-model="dialogAttendance.obs"
              placeholder="Descrição da sobre o comparecimento"
              :auto-grow="true"
            ></ion-textarea>
          </div>
          <ion-list :inset="true">
            <ion-item class="ion-text-left text-h6">
              <div
                :class="`${dialogAttendance.isAttendanceChecked ? 'modal-attendance' : 'modal-absent'}`"
              >
                <ion-checkbox 
                  v-model="selectAllChildren" 
                  @ionChange="handleCheckboxChangeAll($event)"
                />
              </div>
              <ion-label class="q-px-md ion-text-capitalize">
                Todas crianças
              </ion-label>
            </ion-item>
            <ion-item
              v-for="child in classList"
              :key="child"
            >
              <div :class="`${dialogAttendance.isAttendanceChecked ? 'modal-attendance' : 'modal-absent'}`">
                <ion-checkbox 
                  :checked="child.isChecked" 
                  @ionChange="handleCheckboxAttendance(child.childId, $event)" 
                />
              </div>
              <ion-label class="q-px-md ion-text-capitalize">
                {{ child.childName }}
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
        <ion-button @click="createUserChildAttendance" class="q-pa-md" expand="block">Salvar</ion-button>
      </ion-modal>
    
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
  IonAvatar,
  IonAccordion, IonAccordionGroup,
  IonNote,
  IonIcon
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import {
  caretDownSharp,
  checkmark,
  close
} from 'ionicons/icons';
import utils from '../../composables/utils'
import PhotoHandler from '../../components/PhotoHandler.vue'
// import DialogInsertChildEvent from '../../components/DialogInsertChildEvent.vue'
</script>
<script>

export default {
  name: "Attendance",
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
      dialogAttendance: {
        data:{},
        open: false,
        isAttendanceChecked: false,
        isAbsentChecked: false,
        obs: '',
        attendance: ''
      },
      dialogInsertClassEvent: {
        open: false,
        data: {},
        obs: '',
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
      classEventsHistory: [],
      show: true,
      selectedEvent: null,
      classList: [],
      selectedChildren: [],
      childrenFilter: [],
      filterValue: '',
      selectAllChildren: false,
      formattedChildEventList: null,
      childEventsHistory: []
    };
  },
  mounted(){
    utils.loading.hide()
    this.getClassesByUserId()
    this.getChildrenInClassList()
    // this.getLastAttendanceFromChildrenOfClasses()
    // this.getChildEventsByUserId()
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsWorkers/class') {
        this.getClassesByUserId()
        this.getChildrenInClassList()
        // this.getLastAttendanceFromChildrenOfClasses()
        // this.getChildEventsByUserId()
      }
    }
  },
  methods: {
    startModalAttendance(){
      this.getChildrenListByClassId()
      this.getChildrenInClassList()
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
    closeDialogInserChildren() {
      this.dialogInsertChildEvent.open = false
      this.dialogInsertChildEvent.data = []
      this.dialogInsertChildEvent.obs = ''
      this.dialogInsertChildEvent.childEventId = ''
      // this.pagination.page = 1
    },
    handleCheckboxAttendanceChange(type) {
      if (type === 'attendance' && this.dialogAttendance.isAttendanceChecked) {
        this.dialogAttendance.isAbsentChecked = false;
        this.dialogAttendance.attendance = 'presence'
      } else if (type === 'absent' && this.dialogAttendance.isAbsentChecked) {
        this.dialogAttendance.isAttendanceChecked = false;
        this.dialogAttendance.attendance = 'absent'
      }
    },
    handleCheckboxAttendance(childId, e) {
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
    createUserChildAttendance() {
      if(this.selectedChildren.length === 0 || this.dialogAttendance.attendance === ''){
        utils.toast('Preencha o comparecimento e selecione um aluno para prosseguir')
        return
      }
      const opt = {
        route: '/mobile/workers/createUserChildAttendance',
        body: {
          selectedChildren: this.selectedChildren,
          childAttendanceType: this.dialogAttendance.isAttendanceChecked ? 'present' : 'absent',
          obs: this.dialogAttendance.obs,
          classId: this.dialogAttendance.data.classId
        },
      }
      utils.loading.show()
      useFetch(opt).then((r) => {
        utils.loading.hide()
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
          this.clearModalAttendanceData()
          this.dialogAttendance.open = false
          utils.toast('Comparecimento preenchido com sucesso!')
      })
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
    clearModalAttendanceData(){
      this.dialogAttendance.open = false
      this.selectedChildren = []
      this.dialogAttendance.isAbsentChecked = false
      this.dialogAttendance.isAttendanceChecked = false
      this.dialogAttendance.data = {}
      this.dialogAttendance.obs = ''
      this.dialogAttendance.attendance = ''
    },
    clearModalDataClass() {
      this.dialogInsertClassEvent.open = false
      this.dialogInsertClassEvent.data = {}
      this.dialogInsertClassEvent.obs = ''
      this.getLastAttendanceFromChildrenOfClasses()
    },
    clearModalData(){
      this.dialogInsertChildEvent.open = false
      this.dialogInsertChildEvent.data = {}
      this.dialogInsertChildEvent.obs = ''
      this.dialogInsertChildEvent.childEventId = ''
    },
    // clkOpenDialogChildEvent(child){
    //   this.dialogInsertChildEvent.data = child
    //   this.dialogInsertChildEvent.open = true
    //   this.getLastActivityFromChild()
    // },
    getChildEvents() {
      const opt = {
        route: '/mobile/workers/getChildEvents',
        body: {
          status: 'active',
          page: 1,
          rowsPerPage: 100
        }
      }
      useFetch(opt).then((r) => {
    
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
    clkOpenModalAttendance(c){
      this.dialogAttendance.data = c
      this.dialogAttendance.open = true
    },
    getChildrenInClassList() {
      if (this.filterValue !== '') {
        this.show = false
      } else this.show = true
      const opt = {
        route: '/mobile/workers/getChildrenInClassList',
        body: {
          page: 1,
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
          page: 1,
          rowsPerPage: 100
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

.modal-absent ion-checkbox {
  --size: 32px;
  --checkbox-background-checked: #9b0d0d;
}

.modal-absent ion-checkbox::part(container) {
  border-radius: 6px;
  border: 2px solid #9b0d0d;
}
.modal-attendance ion-checkbox {
  --size: 32px;
  --checkbox-background-checked: #1d9b0d;
}

.modal-attendance ion-checkbox::part(container) {
  border-radius: 6px;
  border: 2px solid #1d9b0d;
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