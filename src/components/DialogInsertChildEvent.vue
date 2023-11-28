<template>
  <ion-modal 
    :is-open="dialogInsertChildEvent.open" 
    @ionModalDidPresent="getChildEvents() && getChildEventsByUserId()" 
    @willDismiss="clearModalData()"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeDialogInserChildren">Fechar</ion-button>
        </ion-buttons>
        <ion-title >Atividades</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="q-pa-md ion-text-capitalize ion-text-center">
        {{ dialogInsertChildEvent.data.childName }}
      </div>
      <div class="input-wrapper q-px-md q-mx-md">
        <ion-button 
          @click="openActivityAlert()" 
          expand="block" 
          fill="flat"
        >
          {{ dialogInsertChildEvent.childEventId !== '' ? selectedEvent[0].name : 'Selecionar Atividade'}}
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
      <ion-button
        expand="block"
        class="q-ma-md"
        fill="clear"
        @click="startPhotoHandler = true"
        v-if="!image.blob"
      >Inserir foto (opcional)
      </ion-button>
      <ion-row class="q-ma-md" v-if="image.blob">
        <ion-col size="2">
          <ion-avatar >
            <ion-img :src="image.url" ></ion-img>
          </ion-avatar>
        </ion-col>
        <ion-col size="4">
          <ion-button
            @click="startPhotoHandler = true"
            fill="outline"
          >Trocar foto</ion-button>
        </ion-col>
      </ion-row>
      
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
            <img :src="utils.makeFileUrl(e.childPhoto)"/>
          </ion-avatar>
          <ion-label>
            <ion-row class="ion-justify-content-between">
              <ion-col size="2">
                <ion-badge>{{ e.eventName }}</ion-badge>
                <p>{{ e.eventObs }}</p>
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
  IonList, IonLabel, IonBadge, IonCheckbox,
  IonItem, IonChip,IonRow, IonCol, IonAvatar,
  IonTextarea, IonImg, IonHeader, IonToolbar, IonTitle,
  IonButtons } from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../composables/variables';
import { defineComponent } from 'vue';
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
      startPhotoHandler: false
    }
  },
  props: {
    dialogInsertChildEvent: Object,
    selectedEvent: Array,
    childEventsHistory: Array,
    pagination: Object,
    dialogInsertActivity: Object,
  },
  emits: ['close', 'getLastActivityFromChildrenOfClasses'],
  methods: {
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
      const file = [{ file: this.image.blob, name: 'newImage' }]
      if(this.dialogInsertChildEvent.obs === '' || this.dialogInsertChildEvent.childEventId === ''){
        utils.toast('Preencha o evento e insira uma observação para prosseguir')
        return
      }
      const opt = {
        route: '/mobile/workers/createUserChildEvents',
        body: {
          selectedChildren: [{_id: this.dialogInsertChildEvent.data.childId}],
          childEventId: this.dialogInsertChildEvent.childEventId,
          obs: this.dialogInsertChildEvent.obs
        },
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
          this.$emit('getLastActivityFromChildrenOfClasses')
          utils.toast('Evento inserido com sucesso!')
      })
    },
    getChildEventsByUserId() {
      const opt = {
        route: '/mobile/workers/getChildEventsByUserId',
        body: {
          childId: this.dialogInsertChildEvent.data.childId,
          page: props.pagination.page,
          rowsPerPage: props.pagination.rowsPerPage
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
    openActivityAlert() {
      this.dialogInsertActivity.open = true
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
      this.dialogInsertChildEvent.childEventId = ''
    },
    closeDialogInserChildren() {
      this.dialogInsertChildEvent.open = false
      this.dialogInsertChildEvent.data = []
      this.dialogInsertChildEvent.obs = ''
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
      const opt = {
        route: '/mobile/workers/getChildEvents',
        body: {
          status: 'active',
          page: 1,
          rowsPerPage: 100
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