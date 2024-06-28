<template>
  <ion-modal 
    :is-open="dialogInsertChildEvent.open" 
    @ionModalDidPresent="executeMethods"
    @willDismiss="clearModalData()"
    :presenting-element="presentingElement"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="closeDialogInserChildrenActivity">Fechar</ion-button>
        </ion-buttons>
        <ion-title >Atividades</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light">
      <div class="q-pa-md ion-text-capitalize ion-text-center">
        {{ dialogInsertChildEvent.data.childName }}
      </div>
      <ion-list :inset="true">
        <div class="text-h6 q-pa-md">
          Selecione a atividades
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
      </ion-list>
      <div class="ion-text-left text-h6 q-py-sm q-pl-md">Últimas atividades</div>
      
      <ion-list :inset="true" v-if="childEventsHistory.length">
        <ion-item 
          v-for="e in childEventsHistory"
          :key="e"
        >
          <ion-avatar aria-hidden="true" slot="start" v-if="e.eventImage">
            <img :src="utils.makeFileUrl(e.eventImage)" @click="startDialogViewImage(e)"/>
          </ion-avatar>
          <ion-avatar aria-hidden="true" slot="start" v-else>
            <img :src="utils.makeFileUrl(e.childPhoto, 'thumbnail')"/>
          </ion-avatar>
          <ion-label>
            <ion-row class="ion-justify-content-between ">
              <ion-col size="8">
                <div  class="ion-text-wrap">
                  <ion-badge>{{ e.eventName }}</ion-badge>
                  <div>
                    {{ e.className }}
                  </div>
                  <p>{{ e.eventObs }}</p>
                </div>
              </ion-col>
              <ion-col 
                size="4" 
                class="text-subtitle2 ion-text-end"
              >
                <div class="">
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
  
  <ion-alert v-if="formattedChildEventList"
    :is-open="dialogInsertActivity.open"
    header="Escolha uma atividade"
    @willPresent="getChildEvents()"
    @willDismiss="formattedChildEventList = null"
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
  <PhotoHandler
    v-show="startPhotoHandler"
    :start="startPhotoHandler"
    :allFiles="true"
    :noCrop="false"
    @captured="captured"
    @cancel="cancelPhotoHandler"
  />
</template>

<script setup>
import { 
  IonModal, IonButton, IonContent,
  IonList, IonLabel, IonBadge, IonCheckbox, IonAlert, IonHeader,
  IonItem, IonRow, IonCol, IonAvatar,
  IonToolbar, IonTitle,
  IonButtons } from '@ionic/vue';
import utils from '../composables/utils'
import PhotoHandler from '../components/PhotoHandler.vue'
</script>

<script>
import { useFetch } from '@/composables/fetch'
export default {
  data() {
    return{
      image: {
        url: null,
        blob: null,
        name: null
      },
      presentingElement: null,
      showSubtypesList: false,
      selectedActivity: null,
      selectedSubtype: null,
      selectedEvent: null,
      startPhotoHandler: false,
      formattedChildEventList: null,
      childEventsList: [],
    }
  },
  props: {
    dialogInsertChildEvent: Object,
    childEventsHistory: Array,
    pagination: Object,
    dialogInsertActivity: Object,
  },
  emits: ['close', 'getLastActivityFromChildrenOfClasses', ],
  methods: {
    executeMethods () {
      this.getChildEvents()
      this.clearCheckboxes()
    },
    clearCheckboxes () {
      this.selectedActivity.activitySubtypes = null
    },
    handleActivityCheckboxChange(act) {
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
    selectOptionActivity(e) {
      this.dialogInsertChildEvent.childEventId = e
      this.selectedEvent = this.childEventsList.filter(event => event._id === e)
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
    cancelPhotoHandler () {
      this.startPhotoHandler = false
    },
    createUserChildEvents() {
      // const file = [{ file: this.image.blob, name: 'newImage' }]
      if(this.selectedActivity._id === ''){
        utils.toast('Selecione a atividade para prosseguir')
        return
      }
      const opt = {
        route: '/mobile/workers/createUserChildEvents',
        body: {
          selectedChildren: [{childId: this.dialogInsertChildEvent.data.childId}],
          childEventId: this.selectedActivity._id,
          obs: this.dialogInsertChildEvent.obs
        },
      }
      if(this.selectedSubtype){
        opt.body.selectedSubtype = this.selectedSubtype
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast('Ocorreu um erro. Tente novamente.')
          return
        }
          this.clearModalData()
          this.$emit('getLastActivityFromChildrenOfClasses')
          utils.toast('Atividade inserido com sucesso!')
      })
    },
    startDialogViewImage(e) {
      this.dialogViewImage.open = true
      this.dialogViewImage.image = e.childEventImage
      this.dialogViewImage.data = e
    },
    clearModalData(){
      this.dialogInsertChildEvent.open = false
      this.dialogInsertChildEvent.data = {}
      this.dialogInsertChildEvent.obs = ''
      this.selectAllChildren = false
      this.selectedChildren = []
      this.dialogInsertChildEvent.childEventId = ''
    },
    closeDialogInserChildrenActivity() {
      this.dialogInsertChildEvent.open = false
      this.dialogInsertChildEvent.data = []
      this.dialogInsertChildEvent.obs = ''
      this.formattedChildEventList = null
      this.dialogInsertChildEvent.childEventId = ''
      this.image = {
        url: null,
        blob: null,
        name: null,
        type: null
      }
      this.$emit('close')
    },
    getChildEvents() {
      const classId = this.dialogInsertChildEvent.data.classId
      const opt = {
        route: '/mobile/workers/getChildEvents',
        body: {
          status: 'active',
          page: 1,
          rowsPerPage: 100
        }
      }
      if(classId) opt.body.classId = classId
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
  }
}
</script>
<style scoped>
.input-wrapper {
  border: 1px solid #ebebec;
  /* padding-left: 15px; */
  border-radius: 0.5rem;
  margin-block: 10px;
}
</style>