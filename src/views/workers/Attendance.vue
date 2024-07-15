<template>
  <ion-page ref="page">
    <ion-header class="ion-no-border" :translucent="true">
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


      <div class="button-wrapper">
        <div class="ion-content-center">
          <ion-text class="ion-text-center button-container">
            <ion-datetime-button
              datetime="datetimeChildMural2"
              class="highlight-button"
              @click="isModalOpen = true"
            />
          </ion-text>
        </div>
      </div>
      <ion-modal :is-open="isModalOpen" :keep-contents-mounted="true">
        <ion-datetime
          id="datetimeChildMural2"
          presentation="date"
          :value="dateSelected"
          @ionChange="onChangeDate($event, c)"
        ></ion-datetime>
      </ion-modal>
      <div class="q-px-md">
        <ion-text>
          <h3>Turmas</h3>
          <ion-note>Selecione uma turma para marcar presença em todos os alunos</ion-note>
        </ion-text>
      </div>
      <ion-list :inset="true">
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
      <ion-list :inset="true" lines="inset">
        <ion-item-sliding
          v-for="child in childrenInClassesList"
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
              <img :src="utils.makeFileUrl(child.childPhoto?.filename)"/>
            </ion-avatar>
            <ion-avatar
              aria-hidden="true"
              slot="start"
              v-else
              :style="!child.attendanceData ? '' : (child.attendanceData.childAttendanceType === 'present' ? 'border: 4px solid #40d648;' : 'border: 4px solid red;' )"
            >
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

        <div class="text-h6 q-pa-md">
          Selecione presença ou ausência
        </div>
        <ion-list :inset="true">
          <ion-item 
            v-for="opt in dialogAttendance.options"
            :key="opt"
            @click="clkAttendanceType(opt)"
          >
            <ion-label>
              {{ opt.label }}
            </ion-label>
            <ion-icon
              aria-hidden="true"
              :icon="checkmark"
              slot="end"
              :color="opt.color"
              v-if="opt.option === dialogAttendance.optionSelected?.option"
            ></ion-icon>
          </ion-item>
        </ion-list>

        <div class="text-h6 q-pa-md" v-if="dialogAttendance.optionSelected">
          Selecione as crianças
        </div>
        <ion-list :inset="true"  v-if="dialogAttendance.optionSelected">
          <ion-item @click="clkAllChildren">
            <ion-label>
              Todas crianças
            </ion-label>
            <ion-icon
              aria-hidden="true"
              :icon="checkmark"
              slot="end"
              color="primary"
              v-if="dialogAttendance.selectedChildren.selectAllChildren"
            ></ion-icon>
          </ion-item>
          <ion-item 
            v-for="child in dialogAttendance.childrenFromClass"
            :key="child"
            @click="clkChild(child)"
          >
            <ion-label>
              {{ child.childName }}
            </ion-label>
            <ion-icon
              aria-hidden="true"
              :icon="checkmark"
              slot="end"
              color="primary"
              v-if="dialogAttendance.selectedChildren.array.includes(child.childId)"
            ></ion-icon>
          </ion-item>
        </ion-list>

        <ion-button
          @click="createUserChildAttendance"
          class="q-pa-md"
          expand="block"
          :disabled="dialogAttendance.selectedChildren.data.length === 0"
        >Salvar</ion-button>
      </ion-content>
      
    </ion-modal>


    <!-- <ion-alert
      :isOpen="dialogConfirmPresence.open"
      :header="`Confirma ${dialogConfirmPresence.action} para ${dialogConfirmPresence.childName}?`"
      :buttons="dialogConfirmPresence.alertButtons"
      @didDismiss="dialogConfirmPresence.open = false"
      
    ></ion-alert> -->
    
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonAlert,
  IonModal,
  IonDatetime,
  IonDatetimeButton,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonBadge,
  IonText,
  IonIcon,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonButton,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonNote
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
      isModalOpen: false,
      showBadge: true,
      popoverEvent: null,
      dateSelected: null,
      presentingElement: null,
      dialogConfirmPresence: {
        open: false,
        action: '',
        childName: '',
        childId: '',
        alertButtons: null
      },
      dialogAttendance: {
        options: [
          { label: 'Presença', option: 'present', color: 'success' },
          { label: 'Ausência', option: 'absent', color: 'danger' },
        ],
        optionSelected: null,
        open: false,
        selectedChildren: {
          data: [],
          array: [],
          selectAllChildren: false
        },
        childrenFromClass: [],
        classData: null
      },
      classData: [],
      childrenInClassesList: [],
      dateAttendance: null
    };
  },
  mounted(){
    utils.loading.hide()
    this.presentingElement = this.$refs.page.$el;
    this.getClassesByUserId()
    this.getChildrenInClassesList()
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsLayout/attendance') {
        this.getClassesByUserId()
        this.getChildrenInClassesList()
      }
    }
  },
  methods: {
    clkOpenModalAttendance(c){
      this.dialogAttendance.classData = c
      this.dialogAttendance.open = true
      this.getChildrenListByClassId(c.classId)
    },
    getChildrenListByClassId(classId) {
      this.dialogAttendance.childrenFromClass = 
        this.childrenInClassesList.filter((child) => child.classId === classId)
    },
    clkAttendanceType (opt) {
      this.dialogAttendance.optionSelected = opt
    },
    clkAllChildren () {
      this.dialogAttendance.selectedChildren.selectAllChildren = !this.dialogAttendance.selectedChildren.selectAllChildren
      if (this.dialogAttendance.selectedChildren.selectAllChildren) {
        this.dialogAttendance.selectedChildren.data = [...this.dialogAttendance.childrenFromClass]
        this.dialogAttendance.selectedChildren.array = this.dialogAttendance.childrenFromClass.map((child) => child.childId)
      } else {
        this.dialogAttendance.selectedChildren.data = []
        this.dialogAttendance.selectedChildren.array = []
      }
    },
    clkChild (child) {
      if (this.dialogAttendance.selectedChildren.array.includes(child.childId)) {
        this.dialogAttendance.selectedChildren.array.forEach((c, i) => {
          if (c === child.childId) {
            this.dialogAttendance.selectedChildren.array.splice(i, 1)
          }
        })
        this.dialogAttendance.selectedChildren.data.forEach((c, i) => {
          if (c.childId === child.childId) {
            this.dialogAttendance.selectedChildren.data.splice(i, 1)
          }
        })
      } else {
        this.dialogAttendance.selectedChildren.array.push(child.childId)
        this.dialogAttendance.selectedChildren.data.push(child)
      }
    },

    onChangeDate($event, c) {
      this.dateSelected = $event.detail.value.split('T')[0];
      this.getChildrenInClassesList();
      this.isModalOpen = false;
    },
    async createUserChildAttendance() {
      const opt = {
        route: '/mobile/workers/createUserChildAttendance',
        body: {
          type: 'presence',
          selectedChildren: this.dialogAttendance.selectedChildren.data.map((child) => { return { childId: child.childId } } ),
          childAttendanceType: this.dialogAttendance.optionSelected.option,
          classId: this.dialogAttendance.classData.classId,
          dateAttendance: this.dateAttendance,
          resume: {
            title:  this.dialogAttendance.optionSelected.option,
            classData: this.dialogAttendance.classData,
            selectedChildren: this.dialogAttendance.selectedChildren.data
          }
        },
      }
      utils.loading.show()
      const r = await useFetch(opt)
      utils.loading.hide()
      if (r.error) {
        utils.toast('Ocorreu um erro. Tente novamente.')
        return
      }
      this.clearModalAttendanceData()
      this.dialogAttendance.open = false
      utils.toast('Comparecimento preenchido com sucesso!')
      this.getChildrenInClassesList()
    },
    clkAddPresenceToChild (child, action) {
      this.dialogAttendance.selectedChildren.data = [{...child}]
      this.dialogAttendance.optionSelected = action === 'presença' ? { option: 'present' } : { option: 'absent' }
      this.dialogAttendance.classData = { classId: child.classId }
      this.createUserChildAttendance()
    },
    clearModalAttendanceData () {
      this.dialogAttendance
      this.dialogAttendance.optionSelected = null
      this.dialogAttendance.open = false
      this.dialogAttendance.selectedChildren = {
        data: [],
        array: [],
        selectAllChildren: false
      },
      this.dialogAttendance.childrenFromClass = []
      this.dialogAttendance.classData = null
    },
    getChildrenInClassesList() {
      const opt = {
        route: '/mobile/workers/getChildrenInClassList',
        body: {
          page: 1,
          rowsPerPage: 100,
          searchString: this.filterValue,
          dateAttendance: this.dateAttendance
        }
      }
      utils.loading.show()
      useFetch(opt).then((r) => {
        utils.loading.hide()
        if (!r.error) {
          r.data && r.data.list ? this.childrenInClassesList = r.data.list : this.childrenInClassesList = []
          return
        }
        utils.toast('Ocorreu um erro. Tente novamente.')
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
.ion-content-center {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.button-wrapper {
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  margin-left: 12px;
  margin-top: 20px;
}

.button-container {
  position: relative;
  display: inline-block;
}

.highlight-button {
  background-color: var(--ion-color-primary);
  color: #fff;
  border-radius: 10px;
  padding: 2px;
  box-shadow: 0 0 12px var(--ion-color-primary);
  animation: pulse 1s infinite;
}

.badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #ff4081;
  color: white;
  border-radius: 50%;
  padding: 5px 10px;
  font-size: 0.8em;
  animation: fadeRotate 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeRotate {
  0% {
    opacity: 1;
    transform: rotate(0deg);
  }
  50% {
    opacity: 0.5;
    transform: rotate(180deg);
  }
  100% {
    opacity: 1;
    transform: rotate(360deg);
  }
}
ion-avatar {
  width: 56px;
  height: 56px
}

</style>