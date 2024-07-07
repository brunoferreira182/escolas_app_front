<template>
  <ion-page  ref="page">
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>Atividades</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">Atividades</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="q-ml-md q-mt-md">
        <ion-datetime-button
          datetime="datetime"
          style="justify-content: left;"
        />
      </div>
      <ion-modal :keep-contents-mounted="true">
        <ion-datetime
          id="datetime"
          presentation="date"
          @ionChange="onChangeDate($event, c)"
        ></ion-datetime>
      </ion-modal>

      <div class="q-px-md">
        <ion-text>
          <h3>Turmas</h3>
          <ion-note>Selecione uma turma para inserir uma atividade para vários alunos</ion-note>
        </ion-text>
      </div>
      <ion-list :inset="true">
        <ion-item 
          v-for="c in classesData"
          :key="c"
          @click="clkOpenDialogClassEvent(c)"
          :button="true"
        >
          <ion-avatar aria-hidden="true" slot="start" >
            <img :src="utils.makeFileUrl(c.classImage)" v-if="c.classImage"/>
            <img :src="utils.makeFileUrl(c.image, 'thumbnail')" v-else/>
          </ion-avatar>
          <ion-label>
            <h2>{{ c.className }}</h2>
            <ion-badge color="primary">Função: {{ c.functionName }}</ion-badge>
          </ion-label>
        </ion-item>
      </ion-list>

      <div class="q-px-md q-mt-lg">
        <ion-text>
          <h3>Atividades do dia</h3>
          <ion-note>Veja aqui as atividades já cadastrdas para os alunos das suas turmas</ion-note>
        </ion-text>
      </div>
      <ion-list :inset="true" color="light">
        <ion-item 
          v-for="e in classEventsHistory"
          :key="e"
          detail="false"
        >
          <ion-avatar
            aria-hidden="true"
            slot="start"
          >
            <img :src="utils.makeFileUrl(e.childPhoto, 'thumbnail')" v-if="e.childPhoto"/>
            <img :src="utils.makeFileUrl(null)" v-else/>
          </ion-avatar>
          <ion-label>
            <h2 class="text-capitalize">{{ e.childName }}</h2>
            <ion-note >{{ e.eventName }} {{ e.activitySubtype }}</ion-note><br />
          </ion-label>
          <ion-label slot="end">
            <ion-note color="medium text-caption">
              {{ e.createdAt.createdAtOnlyDate }}<br>
              {{ e.createdAt.createdAtLocale.split(' ')[1].substring(0, 5) }}
            </ion-note>
          </ion-label>
        </ion-item>
      </ion-list>
      
      <ion-modal 
        :is-open="dialogInsertClassActivity.open" 
        :presenting-element="presentingElement"
        @onDidDismiss="dialogInsertClassActivity.open = false"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button @click="closeDialogInsertClassActivity">Fechar</ion-button>
            </ion-buttons>
            <ion-title >Inserir atividades</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content color="light">
          <div class="text-h6 q-pa-md">
            Selecione a atividade
          </div>
          <ion-list :inset="true">
            <ion-item 
              v-for="act in dialogInsertClassActivity.activitiesList"
              :key="act"
              @click="clkActivity(act)"
            >
              <ion-label>
                {{ act.name }}
              </ion-label>
              <ion-icon
                aria-hidden="true"
                :icon="checkmark"
                slot="end"
                color="primary"
                v-if="act.name === dialogInsertClassActivity.activitySelected?.name"
              ></ion-icon>
            </ion-item>
          </ion-list>


          <!-- Lista de intensidades (subtipos de atividade) -->
          <div v-if="dialogInsertClassActivity.subactivityTypes">
            <div class="text-h6 q-pa-md">
              Selecione a intensidade
            </div>
            <ion-list :inset="true">
              <ion-item
                v-for="sub in dialogInsertClassActivity.subactivityTypes"
                :key="sub"
                @click="clkSubactivity(sub)"
              >
                <ion-label>
                  {{ sub.name }}
                </ion-label>
                <ion-icon
                  aria-hidden="true"
                  :icon="checkmark"
                  slot="end"
                  color="primary"
                  v-if="sub.name === dialogInsertClassActivity.subactivitySelected?.name"
                ></ion-icon>
              </ion-item>
            </ion-list>
          </div>

          <div v-if="dialogInsertClassActivity.showChildren">
            <div class="text-h6 q-pa-md">
              Selecione as crianças
            </div>
            <ion-list :inset="true">
              <ion-item @click="clkAllChildren">
                <ion-label>
                  Todas crianças
                </ion-label>
                <ion-icon
                  aria-hidden="true"
                  :icon="checkmark"
                  slot="end"
                  color="primary"
                  v-if="dialogInsertClassActivity.selectedChildren.selectAllChildren"
                ></ion-icon>
              </ion-item>
              <ion-item
                v-for="child in dialogInsertClassActivity.childrenFromClass"
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
                  v-if="dialogInsertClassActivity.selectedChildren.array.includes(child.childId)"
                ></ion-icon>
              </ion-item>
            </ion-list>
          </div>
          <ion-button 
            @click="createUserChildActivity" 
            class="q-pa-md" 
            expand="block"
            :disabled="dialogInsertClassActivity.selectedChildren.array.length === 0"
          >
            Salvar
          </ion-button>
        </ion-content>
        
      </ion-modal>

  
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
  IonLabel,
  IonContent,
  IonModal,
  IonList,
  IonAvatar,
  IonNote,
  IonDatetimeButton, IonDatetime,
  IonText,
  IonIcon
} from '@ionic/vue';
import {
  checkmark,
} from 'ionicons/icons';
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'

</script>
<script>

export default {
  name: "Class",
  data() {
    return {
      presentingElement: null,
      selectedActivity: null,
      dialogInsertClassActivity: {
        open: false,
        activitiesList: [],
        classData: {},
        obs: '',
        activitySelected: null,
        subactivitySelected: null,
        subactivityTypes: null,
        showChildren: false,
        selectedChildren: {
          data: [],
          array: [],
          selectAllChildren: false,
        },
        childrenFromClass: []
      },
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
        sortBy: "",
      },
      classesData: [],
      childrenInClassesList: [],
      childEventsHistory: [],
      classEventsHistory: [],
      show: true,
      selectedEvent: null,
      dateSelected: null
    };
  },
  mounted () {
    utils.loading.hide()
    this.presentingElement = this.$refs.page.$el;
    this.getClassesByUserId()
    this.getchildrenInClassesList()
    this.getLastActivityFromChildrenOfClasses()
    // this.verifyIfHasChildId()
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsLayout/class') {
        this.getClassesByUserId()
        this.getchildrenInClassesList()
        this.getLastActivityFromChildrenOfClasses()
        // this.verifyIfHasChildId()
      }
    }
  },
  methods: {
    clkOpenDialogClassEvent (c) {
      this.dialogInsertClassActivity.classData = c
      this.getChildEvents(this.dialogInsertClassActivity.classData.classId)
      this.dialogInsertClassActivity.childrenFromClass = this.childrenInClassesList.filter((child) => child.classId === c.classId)
      this.dialogInsertClassActivity.open = true
      console.log('chegou aqui')
    },
    clkActivity (act) {
      this.dialogInsertClassActivity.activitySelected = act
      if (!act.activitySubtypes) {
        this.dialogInsertClassActivity.showChildren = true
        this.dialogInsertClassActivity.subactivityTypes = null
        return
      }
      this.dialogInsertClassActivity.showChildren = false
      const temp = []
      act.activitySubtypes.forEach((sub) => {
        temp.push({ name: sub })
      })
      this.dialogInsertClassActivity.subactivityTypes = temp
    },
    clkSubactivity (sub) {
      this.dialogInsertClassActivity.subactivitySelected = sub
      this.dialogInsertClassActivity.showChildren = true
    },
    clkAllChildren () {
      this.dialogInsertClassActivity.selectedChildren.selectAllChildren = !this.dialogInsertClassActivity.selectedChildren.selectAllChildren
      if (this.dialogInsertClassActivity.selectedChildren.selectAllChildren) {
        this.dialogInsertClassActivity.selectedChildren.data = [...this.dialogInsertClassActivity.childrenFromClass]
        this.dialogInsertClassActivity.selectedChildren.array = this.dialogInsertClassActivity.childrenFromClass.map((child) => child.childId)
      } else {
        this.dialogInsertClassActivity.selectedChildren.data = []
        this.dialogInsertClassActivity.selectedChildren.array = []
      }
    },
    clkChild (child) {
      if (this.dialogInsertClassActivity.selectedChildren.array.includes(child.childId)) {
        this.dialogInsertClassActivity.selectedChildren.array.forEach((c, i) => {
          if (c === child.childId) {
            this.dialogInsertClassActivity.selectedChildren.array.splice(i, 1)
          }
        })
        this.dialogInsertClassActivity.selectedChildren.data.forEach((c, i) => {
          if (c.childId === child.childId) {
            this.dialogInsertClassActivity.selectedChildren.data.splice(i, 1)
          }
        })
      } else {
        this.dialogInsertClassActivity.selectedChildren.array.push(child.childId)
        this.dialogInsertClassActivity.selectedChildren.data.push(child)
      }
    },
    onChangeDate($event, c) {
      this.dateSelected = $event.detail.value.split('T')[0]
      this.getLastActivityFromChildrenOfClasses()
    },
    getLastActivityFromChildrenOfClasses(classId) {
      const opt = {
        route: '/mobile/workers/classes/getLastActivityFromChildrenOfClasses',
        body: {
          page: 1,
          rowsPerPage: 100,
          dateSelected: this.dateSelected
        }
      }
      if (classId) opt.body.classId = classId
      useFetch(opt).then((r) => {
        if (!r.error) {
          r.data && r.data.list ? this.classEventsHistory = r.data.list : 
          this.classEventsHistory = []
          return
        }
        else {
          utils.toast("Ocorreu um erro, tente novamente.")
        } 
      })
    },
    closeDialogInsertClassActivity() {
      this.dialogInsertClassActivity = {
        open: false,
        childEventsList: [],
        classData: {},
        obs: '',
        activitySelected: null,
        subactivitySelected: null,
        subactivityTypes: null,
        showChildren: false,
        selectedChildren: {
          data: [],
          array: [],
          selectAllChildren: false,
        },
        childrenFromClass: []
      }
    },
    getChildEvents(classId) {
      const opt = {
        route: '/mobile/workers/getChildEvents',
        body: {
          status: 'active',
          page: 1,
          rowsPerPage: 100
        }
      }
      if (classId) opt.body.classId = classId
      utils.loading.show()
      useFetch(opt).then((r) => {
        utils.loading.hide()
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
        r.data && r.data.list ? this.dialogInsertClassActivity.activitiesList = r.data.list : 
        this.dialogInsertClassActivity.activitiesList = []
      })
    },
    async createUserChildActivity() {
      const opt = {
        route: '/mobile/workers/createUserChildEvents',
        body: {
          type: 'activities',
          selectedChildren: this.dialogInsertClassActivity.selectedChildren.data,
          childEventId: this.dialogInsertClassActivity.activitySelected._id,
          selectedSubtype: this.dialogInsertClassActivity.subactivitySelected?.name,
          resume: {
            title: this.dialogInsertClassActivity.activitySelected.name,
            subactivitySelected: this.dialogInsertClassActivity.subactivitySelected.name,
            activityId: this.dialogInsertClassActivity.activitySelected._id,
            classData: this.dialogInsertClassActivity.classData,
            selectedChildren: this.dialogInsertClassActivity.selectedChildren.data
          },
        }
      }
      utils.loading.show()
      const r = await useFetch(opt)
      utils.loading.hide()
      if (r.error) {
        utils.toast('Ocorreu um erro. Tente novamente.')
        return
      }
      this.closeDialogInsertClassActivity()
      this.getLastActivityFromChildrenOfClasses()
      utils.toast('Atividade inserida com sucesso!')
    },
    getchildrenInClassesList() {
      if (this.filterValue !== '') {
        this.show = false
      } else this.show = true
      const opt = {
        route: '/mobile/workers/getchildrenInClassList',
        body: {
          page: 1,
          rowsPerPage: 100,
          searchString: this.filterValue
        }
      }
      useFetch(opt).then((r) => {
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
        if (!r.error) {
          r.data && r.data.list ? this.classesData = r.data.list : this.classesData = []
          return
        }
        utils.toast('Ocorreu um erro. Tente novamente.')
        
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
</style>