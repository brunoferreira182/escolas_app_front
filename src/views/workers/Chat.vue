<template>
  <ion-page>
    <ToolbarEscolas
      title="Grupos de conversa"
      :backButton="false"
    />
    <ion-content >
      <div class="q-mt-md">
        <div class="slide" v-if="classesInfo && classesInfo.length">
          <ion-list 
            class="q-ma-md"
            style="border-radius: 1rem"
            lines="full" 
          >
            <div 
              v-for="_class in classesInfo"
              :key="_class"
            >
              <h2 class="q-px-md">{{ _class.className }}</h2>
              <ion-item
                button
                detail="true"
                @click="goToChatDetail(_class.classId)"
              >
                <ion-avatar style="width: 76px; height:74px;" class="q-mb-sm">
                  <img :src="utils.makeFileUrl(_class.classImage)" class="profile-avatar">
                </ion-avatar>
              </ion-item>
            </div>
          </ion-list>
          <div v-if="childEventsHistory">
            <h2 class="q-px-md">Histórico de atividades</h2>
            <ion-list :inset="true" >
              <ion-item 
                v-for="e in childEventsHistory"
                :key="e"
                detail="false"
                @click="clkOpenDialogChildEvent(e)"
              >
                <ion-label>
                  <strong>{{ e.childName }}</strong>
                  <ion-badge  style="background-color: #eb445a;">{{ e.eventName }}</ion-badge><br/>
                  <ion-note color="medium" class="ion-text-wrap">
                    {{ e.eventObs }}
                  </ion-note>
                </ion-label>
                <div class="metadata-end-wrapper" slot="end">
                  <ion-note color="medium">
                    {{ e.createdAt.createdAtLocale.split(' ')[0] }}<br>
                    {{ e.createdAt.createdAtLocale.split(' ')[1] }}
                  </ion-note>
                </div>
              </ion-item>
            </ion-list>
          </div>
        </div>
        <div v-else>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Você não está em nenhuma sala</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Procure um responsável na escola para convefir de qual turma você participa.
            </ion-card-content>
          </ion-card>
        </div>
      </div>
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
            this.selectOptionActivity(e)
          },
        },
      ]"
    />
    <DialogInsertChildEvent 
      :dialogInsertChildEvent="dialogInsertChildEvent"
      :image="image"
      :selectedEvent="selectedEvent"
      :childEventsHistory="childEventsHistory"
      :pagination="pagination"
      :startPhotoHandler="startPhotoHandler"
      :dialogInsertActivity="dialogInsertActivity"
    />
    <PhotoHandler
      v-show="startPhotoHandler"
      :start="startPhotoHandler"
      :allFiles="true"
      :noCrop="false"
      @captured="captured"
      @cancel="cancelPhotoHandler"
    />
  </ion-page>
</template>
<script setup>
import { 
  IonPage, IonButton, IonCard,
  IonContent, IonImg, IonCardHeader,
  IonList, IonChip, IonCardTitle, IonBadge,
  IonItem, IonLabel, IonCardContent, IonNote,
  IonAvatar, IonAlert } from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../../composables/variables';
import { defineComponent } from 'vue';
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
import PhotoHandler from '../../components/PhotoHandler.vue'
import DialogInsertChildEvent from '../../components/DialogInsertChildEvent.vue'
</script>

<script>
import { useFetch } from '@/composables/fetch';
export default {
  components: {
    IonPage, IonButton,
    IonContent,
    IonImg
  },
  data() {
    return {
      APP_NAME,
      progressBar: false,
      classesInfo: null,
      childEventsHistory: null,
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      userProfile: [],
      dialogInsertChildEvent: {
        open: false,
        data: [],
        obs: '',
        childEventId: ''
      },
      selectedEvent: null,
      image: {
        url: null,
        blob: null,
        name: null
      },
      dialogInsertActivity: {
        open: false
      },
      formattedChildEventList: null,
      startPhotoHandler: false
    };
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsWorkers/chat') {
        this.startView()
      }
    }
  },
  beforeMount () {
    this.startView()
  },
  methods: {
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
        this.formattedChildEventList = this.childEventsList.map((event) => ({
          type: 'radio',
          label: event.name,
          value: event._id
        }))
      })
    },
    getChildEventsByUserId() {
      const opt = {
        route: '/mobile/workers/getChildEventsByUserId',
        body: {
          childId: this.dialogInsertChildEvent.data.childId,
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
    createUserChildEvents() {
      if(this.dialogInsertChildEvent.obs === '' || this.dialogInsertChildEvent.childEventId === ''){
        utils.toast('Preencha o evento e insira uma observação para prosseguir')
        return
      }
      const opt = {
        route: '/mobile/workers/createUserChildEvents',
        body: {
          childId: [this.dialogInsertChildEvent.data.childId],
          childEventId: this.dialogInsertChildEvent.childEventId,
          obs: this.dialogInsertChildEvent.obs
        },
        file: [{ file: this.image.blob, name: 'userPhoto' }]
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
    startView () {
      this.getClassesByUserId()
      this.getChildEventsHistory()
    },  
    clkOpenDialogChildEvent(child) {
      this.dialogInsertChildEvent.data = child
      this.dialogInsertChildEvent.open = true
    },
    getClassesByUserId() {
      const opt = {
        route: '/mobile/workers/getClassesByUserId',
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.classesInfo = r.data.list
      })
    },
    goToChatDetail (classId) {
      this.$router.push('/chatDetailWorker?classId=' + classId)
    },
    getChildEventsHistory() {
      const opt = {
        route: '/mobile/workers/classes/getLastActivityFromChildrenOfClasses',
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) utils.toast("Ocorreu um erro, tente novamente.")
        else this.childEventsHistory = r.data.list
      })
    },
  }
}

</script>

<style scoped>
.q-carousel__slide {
  padding-right: 0%;
  padding-left: 0%;
}
.login-logo {
  /* width: 12em; */
  height: 19em;
}
.login-logo-letters {
  font-weight: 600;
  color: var(--ion-color-primary);
  font-size: 35px;
  translate:0 20px;
}
</style>