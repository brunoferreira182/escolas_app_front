<template>
  <ion-page>
    <ToolbarEscolas
      title="Atividades"
      :backButton="false"
    />
    <ion-content color="light">
      <!-- <ion-searchbar 
        show-clear-button="always"
        animated="true" 
        placeholder="Pesquisar"
        :debounce="400"
        v-model="filterValue"
        @ionInput="getChildrenInClassList()"
      /> -->
      <div class="q-mt-md">
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
      </div>
      <ion-modal :keep-contents-mounted="true">
        <ion-datetime
          id="datetime"
          presentation="date"
          @ionChange="onChangeDate($event, c)"
        ></ion-datetime>
      </ion-modal>
      <Transition name="bounce">
        <ion-list :inset="true" v-if="show">
          <div class="ion-text-left text-h6 q-py-sm q-pl-md">Turmas</div>
          <div class="q-px-md text-caption">
            Selecione uma turma para inserir uma atividade para vários alunos
          </div>
          <ion-item 
            v-for="c in classData"
            :key="c"
            @click="clkOpenDialogClassEvent(c)"
            :button="true"
            class="q-pa-sm"
          >
            <ion-avatar aria-hidden="true" slot="start" >
              <img :src="utils.makeFileUrl(c.classImage)" v-if="c.classImage"/>
              <img :src="utils.makeFileUrl(c.image, 'thumbnail')" v-else/>
            </ion-avatar>
            <ion-label>
              <div class="text-h6">{{ c.className }}</div>
              <ion-badge color="success">Função: {{ c.functionName }}</ion-badge>
            </ion-label>
          </ion-item>
        </ion-list>
      </Transition>
      <ion-list :inset="true" color="light">
        <ion-accordion-group >
          <ion-accordion value="alunos">
            <div slot="header" class="ion-text-left text-h6 q-py-sm q-pl-md">
              Alunos
            </div>
            <div slot="content">
              <div class="q-px-md text-caption">
                Selecione um aluno para inserir uma atividade individualmente
              </div>
              <ion-item 
                v-for="child in childrenInClassList"
                :key="child"
                @click="clkOpenDialogChildEvent(child)"
                :button="true"
                detail="false"
              >
                <ion-avatar aria-hidden="true" slot="start" v-if="child.childPhoto">
                  <img :src="utils.makeFileUrl(child.childPhoto.filename, 'thumbnail')"/>
                </ion-avatar>
                <ion-avatar aria-hidden="true" slot="start" v-else>
                  <img :src="utils.makeFileUrl(child.image, 'thumbnail')"/>
                </ion-avatar>
                <ion-label>
                  <h6>{{ child.childName }}</h6>
                  <ion-badge  color="primary"> {{ child.className }}</ion-badge>
                </ion-label>
              </ion-item>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </ion-list>

      <ion-list :inset="true" color="light">
        <ion-accordion-group>
          <ion-accordion value="atividades">
            <div slot="header" class="ion-text-left text-h6 q-py-sm q-pl-md">Últimas atividades</div>
            <div slot="content">
              <ion-item 
                v-for="e in classEventsHistory"
                :key="e"
                detail="false"
                @click="clkOpenDialogChildEvent(e)"
              >
                <ion-avatar aria-hidden="true" slot="start" >
                  <img :src="utils.makeFileUrl(e.eventImage, 'thumbnail')" v-if="e.eventImage"/>
                  <img :src="utils.makeFileUrl(null)" v-else/>
                </ion-avatar>
                <ion-avatar
                  aria-hidden="true"
                  slot="start"
                  style="margin-left: -30px; margin-top: 30px; height: 36px; width: 36px; border: 2px solid white !important;"
                >
                  <img :src="utils.makeFileUrl(e.childPhoto, 'thumbnail')" v-if="e.childPhoto"/>
                  <img :src="utils.makeFileUrl(null)" v-else/>
                </ion-avatar>
                <ion-label>
                  <h6 class="text-capitalize">{{ e.childName }}</h6>
                  <ion-badge  color="primary">{{ e.eventName }}</ion-badge><br />
                  <ion-note color="medium" class="ion-text-wrap">
                    {{ e.eventObs }}
                  </ion-note>
                </ion-label>
                <div class="metadata-end-wrapper" slot="end">
                  <ion-note color="medium text-caption">
                    {{ e.createdAt.createdAtInFullShort }}<br>
                    {{ e.createdAt.createdAtLocale.split(' ')[1] }}
                  </ion-note>
                </div>
              </ion-item>
            </div>
          </ion-accordion>
        </ion-accordion-group>
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
          <ion-list :inset="true">
            <div class="text-h6 q-pa-md">
              Selecione a atividade
            </div>
            <ion-item 
              v-for="act in childEventsList"
              :key="act"
            >
              <!-- Checkbox para a atividade -->
              <ion-checkbox 
                :checked="act.isChecked" 
                @ionChange="handleActivityCheckboxChange(act)"
              />
              <!-- Label da atividade -->
              <ion-label class="q-px-md ion-text-capitalize">
                {{ act.name }}
              </ion-label>
            </ion-item>
            <!-- Lista de intensidades (subtipos de atividade) -->
            <div v-if="showSubtypesList && selectedActivity && selectedActivity.activitySubtypes">
              <div class="text-h6 q-pa-md">
                Selecione a intensidade
              </div>
              <ion-item
                v-for="sub in selectedActivity.activitySubtypes"
                :key="sub"
              >
                <!-- Checkbox para a intensidade -->
                <ion-checkbox 
                  :checked="sub.isChecked" 
                  @ionChange="handleSubtypeCheckboxChange(sub)"
                />
                <!-- Label da intensidade -->
                <ion-label class="q-px-md ion-text-capitalize">
                  {{ sub.name }}
                </ion-label>
              </ion-item>
            </div>
            <!-- <div   
              v-for="act in childEventsList"
              :key="act">
              <ion-item
              
              >
                <ion-checkbox 
                  :checked="act.isChecked" 
                  @ionChange="handleCheckboxChange(act._id, $event)" 
                />
                <ion-label class="q-px-md ion-text-capitalize">
                  {{ act.name }}
                </ion-label>
              </ion-item>
              <div v-if="act.activitySubtypes">
                <div class="text-caption q-pa-md">
                  Selecione a intensidade
                </div>
                <ion-item
                  v-for="sub in act.activitySubtypes"
                  :key="sub"
                >
                  <ion-checkbox 
                    :checked="act.isChecked" 
                    @ionChange="handleCheckboxChange(sub._id, $event)" 
                  />
                  <ion-label class="q-px-md ion-text-capitalize">
                    {{ sub }}
                  </ion-label>
                </ion-item>
              </div>
            </div> -->
          </ion-list>
          <!-- <div class="input-wrapper q-px-md q-mx-md">
            <ion-button 
              @click="dialogInsertActivity.open = true" 
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
          </div> -->
          <ion-list :inset="true">
            <ion-item class="ion-text-left text-h6">
              <ion-checkbox v-model="selectAllChildren" @ionChange="handleCheckboxChangeAll($event)"/>
              <ion-label class="q-px-md ion-text-capitalize">
                Todas crianças
              </ion-label>
            </ion-item>
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
          
          <ion-list :inset="true" v-if="classEventsHistory.length">
            
            <ion-item 
              v-for="e in classEventsHistory"
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
                    class="text-subtitle2 ion-text-end ion-text-wrap"
                  >
                    <ion-note color="medium text-caption">
                      {{ e.createdAt.createdAtInFullShort }}<br>
                      {{ e.createdAt.createdAtLocale.split(' ')[1] }}
                    </ion-note>
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
    <!-- <ion-alert v-if="formattedChildEventList"
      :is-open="dialogInsertActivity.open"
      header="Escolha uma atividade"
      :backdropDismiss="false"
      animated
      @willPresent="getChildEvents(dialogInsertClassEvent.data.classId)"
      @willDismiss="formattedChildEventList = null"
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
    /> -->
    <DialogInsertChildEvent
      :dialogInsertChildEvent="dialogInsertChildEvent"
      :childEventsHistory="childEventsHistory"
      :pagination="pagination"
      :dialogInsertActivity="dialogInsertActivity"
      @close="closeDialogInserChildrenActivity"
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
  IonAvatar,
  IonAccordion, IonAccordionGroup,
  IonNote,
  IonDatetimeButton, IonDatetime
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
      showSubtypesList: false,
      selectedActivity: null,
      selectedSubtype: null,
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
      dateSelected: null
    };
  },
  mounted(){
    utils.loading.hide()
    this.getClassesByUserId()
    this.getChildrenInClassList()
    this.verifyIfHasChildId()
    this.getLastActivityFromChildrenOfClasses()
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
  methods: {
    handleActivityCheckboxChange(act) {
      console.log(act, 'act');
      // Desmarca todas as outras atividades
      this.childEventsList.forEach((item) => {
        item.isChecked = item === act;
      });

      // Verifica se a atividade selecionada possui subtipos
      if (Array.isArray(act.activitySubtypes) && act.activitySubtypes.length > 0) {
        // Converte cada subtipo em um objeto com a propriedade isChecked
        this.selectedActivity = {
          ...act,
          activitySubtypes: act.activitySubtypes.map((sub) => ({ name: sub, isChecked: false }))
        };
        this.showSubtypesList = true; // Mostra automaticamente a lista de intensidades
      } else {
        // Adiciona a atividade selecionada ao selectedActivity
        this.selectedActivity = act;
        this.showSubtypesList = false;
      }

      // Limpa a seleção de subtipos ao mudar de atividade
      this.selectedSubtype = null;
    },

    handleSubtypeCheckboxChange(sub) {
      // Desmarca o subtipo anterior se outro subtipo for selecionado
      if (this.selectedSubtype !== sub.name) {
        this.selectedActivity.activitySubtypes.forEach((item) => {
          item.isChecked = item.name === sub.name;
        });
        this.selectedSubtype = sub.name; // Armazena o subtipo selecionado na variável selectedSubtype
      } else {
        // Limpa a variável selectedSubtype e define isChecked como false se o mesmo subtipo for clicado novamente
        this.selectedSubtype = null;
        this.selectedActivity.activitySubtypes.find(item => item.name === sub.name).isChecked = false;
      }
    },
    onChangeDate($event, c) {
      this.dateSelected = $event.detail.value.split('T')[0]
      this.getLastActivityFromChildrenOfClasses()
    },
    startModal(){
      this.getChildrenListByClassId()
      this.getLastActivityFromChildrenOfClasses(this.dialogInsertClassEvent.data.classId)
      this.getChildrenInClassList()
      this.getChildEvents(this.dialogInsertClassEvent.data.classId)
    },
    startModalAttendance(){
      this.getChildrenListByClassId()
      this.getChildrenInClassList()
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
        if (r.error) utils.toast("Ocorreu um erro, tente novamente.")
        else {
          this.classEventsHistory = r.data.list
        } 
      })
    },
    getLastActivityFromChild() {
      const opt = {
        route: '/mobile/workers/classes/getLastActivityFromChild',
        body: {
          page: 1,
          rowsPerPage: 100,
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
    filterChildren(event) {
      const query = event.target.value.toLowerCase();
      this.childrenFilter = this.states.filter((d) => d.nome.toLowerCase().indexOf(query) > -1);
    },
    handleCheckboxChangeAll(e) {
      this.selectAllChildren = false
      if (e.detail.checked === true) {
        this.selectedChildren = this.classList.map((child) => ({ childId: child.childId }));
      } else {
        this.selectedChildren = [];
      }

      this.classList.forEach((classList) => {
        classList.isChecked = e.detail.checked;
      });

      this.dialogInsertChildEvent.data = this.selectedChildren.map((child) => child.childId);
    },
    closeDialogInserChildrenActivity() {
      this.dialogInsertChildEvent.open = false
      this.dialogInsertChildEvent.data = []
      this.dialogInsertChildEvent.obs = ''
      this.dialogInsertActivity.open = false
      this.dialogInsertChildEvent.childEventId = ''
      // this.pagination.page = 1
    },
    handleCheckboxAttendance(childId, e) {
      if (e.detail.checked === true) {
        this.selectedChildren.push({childId: childId})
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
    handleCheckboxChange(childId, e) {
      if (this.selectAllChildren && e.detail.checked === false) {
        this.selectAllChildren = false;
      }

      if (e.detail.checked === true) {
        const isChildSelected = this.selectedChildren.some(child => child.childId === childId);
        if (!isChildSelected) {
          this.selectedChildren.push({ childId: childId });
        }

        if (this.selectedChildren.length === this.classList.length) {
          this.selectAllChildren = true;
        }
        return;
      }

      if (e.detail.checked === false) {
        this.selectedChildren = this.selectedChildren.filter(child => child.childId !== childId);

        if (this.selectedChildren.length !== this.classList.length) {
          this.selectAllChildren = false;
        }
        this.dialogInsertChildEvent.data = this.selectedChildren;
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
      this.dialogInsertActivity.open = false
      this.selectAllChildren = false
      this.selectedChildren = []
      this.selectedActivity = null
      this.getLastActivityFromChildrenOfClasses()
      // this.getChildrenInClassList()
    },
    clearModalData(){
      this.dialogInsertChildEvent.open = false
      this.dialogInsertChildEvent.data = {}
      this.dialogInsertChildEvent.obs = ''
      this.dialogInsertChildEvent.childEventId = ''
      this.selectAllChildren = false
      this.selectedChildren = []
    },
    clkOpenDialogChildEvent(child){
      this.dialogInsertChildEvent.data = child
      this.dialogInsertChildEvent.open = true
      this.getLastActivityFromChild()
    },
    getChildEvents(classId) {
      console.log('chmaou', classId)
      const opt = {
        route: '/mobile/workers/getChildEvents',
        body: {
          status: 'active',
          page: 1,
          rowsPerPage: 100
        }
      }
      if(classId){
        opt.body.classId = classId
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
        this.act
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
      if(this.selectedActivity._id === ''){
        utils.toast('Selecione a atividade para prosseguir')
        return
      }
      const opt = {
        route: '/mobile/workers/createUserChildEvents',
        body: {
          // childId: this.dialogInsertChildEvent.data,
          selectedChildren: this.selectedChildren,
          childEventId: this.selectedActivity._id,
        },
        // file: this.image.blob ? [{ file: this.image.blob, name: 'userPhoto' }] : null
      }
      if(this.selectedSubtype){
        opt.body.selectedSubtype = this.selectedSubtype
      }
      // if(this.image.blob !== null){
      //   opt.file = file
      // }
      utils.loading.show()
      useFetch(opt).then((r) => {
        utils.loading.hide()
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
          this.clearModalData()
          this.dialogInsertClassEvent.open = false
          this.getLastActivityFromChildrenOfClasses()
          this.getLastActivityFromChild()
          this.selectedEvent = null
          utils.toast('Atividade inserida com sucesso!')
      })
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