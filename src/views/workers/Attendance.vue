<template>
  <ion-page ref="page">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Presença</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">Presença</ion-title>
        </ion-toolbar>
      </ion-header>


      <div class="q-ml-md q-mt-md">
        <ion-datetime-button
          datetime="datetime"
          style="justify-content: left;"
        />
      </div>

      <div class="q-px-md">
        <ion-text>
          <h3>Turmas</h3>
          <ion-note>Selecione uma turma para marcar presença em todos os alunos</ion-note>
        </ion-text>
      </div>
      <ion-list :inset="true" v-if="show" >
        <ion-item 
          v-for="c in classData"
          :key="c"
          @click="clkOpenModalAttendance(c)"
          :button="true"
        >
          <ion-avatar aria-hidden="true" slot="start" >
            <img :src="utils.makeFileUrl(c.classImage)" v-if="c.classImage"/>
            <img :src="utils.makeFileUrl(c.image)" v-else/>
          </ion-avatar>
          <ion-label>
            <h2>{{ c.className }}</h2>
            <ion-badge color="primary">Função: {{ c.functionName }}</ion-badge>
          </ion-label>
        </ion-item>
      </ion-list>

      <div class="q-px-md q-mt-lg">
        <ion-text>
          <h3>Alunos</h3>
          <ion-note>Arraste para a esquerda para opções</ion-note>
        </ion-text>
      </div>
      <ion-list :inset="true">
        <ion-item-sliding
          v-for="child in childrenInClassList"
          :key="child"
        >
          <ion-item 
            :button="true"
            detail="false"
          >
            <ion-avatar
              aria-hidden="true"
              slot="start"
              v-if="child.childPhoto"
              :style="!child.attendanceData ? '' : (child.attendanceData.childAttendanceType === 'present' ? 'border: 4px solid #40d648;' : 'border: 4px solid red;' )"
            >
              <img :src="utils.makeFileUrl(child.childPhoto.filename)"/>
            </ion-avatar>
            <ion-avatar aria-hidden="true" slot="start" v-else>
              <img :src="utils.makeFileUrl(child.image)"/>
            </ion-avatar>
            <ion-label>
              <h2>{{ child.childName }}</h2>
              <ion-note> {{ child.className }}</ion-note><br>
            </ion-label>
          </ion-item>
          
          <ion-item-options side="end">
            <ion-item-option color="success" @click="clkAddPresenceToChild(child, 'presença')">Presença</ion-item-option>
            <ion-item-option color="danger" @click="clkAddPresenceToChild(child, 'falta')">Ausência</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

    </ion-content>

    <ion-modal 
      :is-open="dialogAttendance.open" 
      @didDismiss="clearModalAttendanceData()"
      :presenting-element="presentingElement"
    >
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="end">
            <ion-button @click="clearModalAttendanceData">Fechar</ion-button>
          </ion-buttons>
          <ion-title >Comparecimento</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content color="light">
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
                  aria-label=""
                ></ion-checkbox>
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
                  aria-label=""
                ></ion-checkbox>
              </div>
            </ion-col>
          </ion-row>
        </div>
        <!-- <div class="input-wrapper  q-px-md q-mx-md">
          <ion-textarea
            label="Descrição (opcional)"
            label-placement="floating"
            v-model="dialogAttendance.obs"
            placeholder="Descrição da sobre o comparecimento"
            :auto-grow="true"
          ></ion-textarea>
        </div> -->
        <ion-list :inset="true">
          <ion-item color="light" :disabled="dialogAttendance.attendance === ''">
            <div
              :class="`${dialogAttendance.isAttendanceChecked ? 'modal-attendance' : 'modal-absent'}`"
            >
              <ion-checkbox 
                v-model="selectAllChildren" 
                @ionChange="handleCheckboxChangeAll($event)"
                aria-label=""
              ></ion-checkbox>
            </div>
            <ion-label class="q-px-md ion-text-capitalize">
              Todas crianças
            </ion-label>
          </ion-item>
        </ion-list>
        <ion-list :inset="true" v-if="dialogAttendance.attendance !== ''">
          <ion-item
            v-for="child in classList"
            :key="child"
          >
            <div :class="`${dialogAttendance.isAttendanceChecked ? 'modal-attendance' : 'modal-absent'}`">
              <ion-checkbox 
                :checked="child.isChecked" 
                @ionChange="handleCheckboxAttendance(child.childId, $event)"
                aria-label=""
              ></ion-checkbox>
            </div>
            <ion-label class="q-px-md ion-text-capitalize">
              {{ child.childName }}
            </ion-label>
          </ion-item>
        </ion-list>
        <ion-button
          @click="createUserChildAttendance"
          class="q-pa-md"
          expand="block"
          :disabled="selectedChildren.length === 0"
        >Salvar</ion-button>
      </ion-content>
      
    </ion-modal>

    <ion-modal 
      :keep-contents-mounted="true" 
    >
      <ion-datetime
        id="datetime"
        presentation="date"
        @ionChange="onChangeDate($event, c)"
      ></ion-datetime>
    </ion-modal>

    <ion-alert
      :isOpen="dialogConfirmPresence.open"
      :header="`Confirma ${dialogConfirmPresence.action} para ${dialogConfirmPresence.childName}?`"
      :buttons="dialogConfirmPresence.alertButtons"
      @didDismiss="dialogConfirmPresence.open = false"
      
    ></ion-alert>
    
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
  IonIcon,
  IonDatetime,
  IonGrid,
  IonDatetimeButton,
  IonText,
  IonItemSliding, IonItemOption, IonItemOptions
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import {
  caretDownSharp,
  checkmark,
  close
} from 'ionicons/icons';
import utils from '../../composables/utils'
</script>
<script>

export default {
  name: "Attendance",
  data() {
    return {
      presentingElement: null,
      modalChangeDate: {
        open: false,
        date: ''
      },
      dialogConfirmPresence: {
        open: false,
        action: '',
        childName: '',
        childId: '',
        alertButtons: null
      },
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
      childEventsHistory: [],
      dateAttendance: null
    };
  },
  mounted(){
    utils.loading.hide()
    this.presentingElement = this.$refs.page.$el;
    this.getClassesByUserId()
    this.getChildrenInClassList()
    this.dialogConfirmPresence.alertButtons = [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => { this.dialogConfirmPresence.open = false }
      },
      {
        text: 'Confirmar',
        handler: () => { this.createUserChildAttendanceOneChild() }
      }
    ]
    console.log(document.getElementById('time-button'), 'consoloooo')
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsWorkers/attendance') {
        this.getClassesByUserId()
        this.getChildrenInClassList()
      }
    }
  },
  methods: {
    onChangeDate($event, c) {
      this.dateAttendance = $event.detail.value.split('T')[0]
      this.getChildrenInClassList()
    },
    createUserChildAttendanceOneChild() {
      const opt = {
        route: '/mobile/workers/createUserChildAttendance',
        body: {
          selectedChildren: [{_id: this.dialogConfirmPresence.childId}],
          childAttendanceType: this.dialogConfirmPresence.action === 'presença' ? 'present' : 'absent',
          obs: '',
          classId: this.dialogConfirmPresence.classId,
          dateAttendance: this.dateAttendance
        },
      }
      utils.loading.show()
      useFetch(opt).then((r) => {
        utils.loading.hide()
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
        this.dialogConfirmPresence.open = false
        utils.toast('Comparecimento preenchido com sucesso!')
        this.getChildrenInClassList()
      })
    },
    clkAddPresenceToChild (child, action) {
      this.dialogConfirmPresence.action = action
      this.dialogConfirmPresence.childName = child.childName
      this.dialogConfirmPresence.childId = child.childId
      this.dialogConfirmPresence.classId = child.classId
      this.dialogConfirmPresence.open = true
    },
    clkOpenModalAttendance(c){
      this.dialogAttendance.data = c
      this.dialogAttendance.open = true
      this.getChildrenListByClassId(c.classId)
    },
    getChildrenListByClassId(classId) {
      const opt = {
        route: '/mobile/workers/getChildrenListByClassId',
        body: {
          classId,
          page: 1,
          rowsPerPage: 100,
          dateAttendance: this.dateAttendance
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
          classId: this.dialogAttendance.data.classId,
          dateAttendance: this.dateAttendance
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
          this.getChildrenInClassList()
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
    
    clearModalAttendanceData(){
      this.dialogAttendance.open = false
      this.selectedChildren = []
      this.dialogAttendance.isAbsentChecked = false
      this.dialogAttendance.isAttendanceChecked = false
      this.dialogAttendance.data = {}
      this.dialogAttendance.obs = ''
      this.dialogAttendance.attendance = ''
    },
    clearModalData(){
      this.dialogInsertChildEvent.open = false
      this.dialogInsertChildEvent.data = {}
      this.dialogInsertChildEvent.obs = ''
      this.dialogInsertChildEvent.childEventId = ''
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
          searchString: this.filterValue,
          dateAttendance: this.dateAttendance
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
ion-avatar {
  width: 56px;
  height: 56px
}
/* 
#time-button {
  display: none;
}
.modal-absent ion-checkbox {
  --size: 32px;
  --checkbox-background-checked: #9b0d0d;
}

.modal-absent ion-checkbox::part(container) {
  border: 2px solid #9b0d0d;
}
.modal-attendance ion-checkbox {
  --size: 32px;
  --checkbox-background-checked: #1d9b0d;
}

.modal-attendance ion-checkbox::part(container) {
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
} */
</style>