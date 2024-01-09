<template>
  <ion-page>
    <ToolbarEscolas
      title="Salas"
      :backButton="false"
    />
    <ion-content color="light">
      <div class="q-mt-md">
        <div v-if="classesInfo && classesInfo.length">
          <ion-list :inset="true">
            <div class="ion-text-left text-h6 q-py-sm q-pl-md">Turmas</div>
            <ion-item 
              v-for="c in classesInfo"
              :key="c"
              :button="true"
              class="q-pa-sm"
              @click="goToChatDetail(c.classId)"
            >
              <ion-avatar aria-hidden="true" slot="start" v-if="c.classImage" style="height: 60px; width: 60px">
                <img :src="utils.makeFileUrl(c.classImage, 'thumbnail')" />
              </ion-avatar>
              <ion-avatar aria-hidden="true" slot="start" v-else style="height: 60px; width: 60px">
                <img :src="utils.makeFileUrl(c.image, 'thumbnail')"/>
              </ion-avatar>
              <ion-label>
                <h6>{{ c.className }}</h6>
                <ion-badge color="success">Função: {{ c.functionName }}</ion-badge>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
        <div v-else>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Você não está em nenhuma sala</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Procure um responsável da escola para conferir qual turma você participa.
            </ion-card-content>
          </ion-card>
        </div>
        <!-- <div v-if="childEventsHistory">
          <ion-list :inset="true" >
            <div class="ion-text-left text-h6 q-py-sm q-pl-md">Histórico de atividades</div>
            <ion-item 
              v-for="e in childEventsHistory"
              :key="e"
              detail="false"
              @click="clkOpenDialogChildEvent(e)"
            >
              <ion-avatar aria-hidden="true" slot="start" style="height: 60px; width: 60px;">
                <img :src="utils.makeFileUrl(e.childEventPhoto.filename, 'thumbnail')" v-if="e.childEventPhoto"/>
                <img :src="utils.makeFileUrl(null)" v-else/>
              </ion-avatar>
              <ion-avatar
                aria-hidden="true"
                slot="start"
                style="margin-left: -30px; margin-top: 30px; height: 35px; width: 35px; border: 2px solid white !important;"
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
                <ion-note color="medium">
                  {{ e.createdAt.createdAtLocale.split(' ')[0] }}<br>
                  {{ e.createdAt.createdAtLocale.split(' ')[1] }}
                </ion-note>
              </div>
            </ion-item>
          </ion-list>
        </div> -->
        
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
      :selectedEvent="selectedEvent"
      :childEventsHistory="childEventsHistory"
      :pagination="pagination"
      :dialogInsertActivity="dialogInsertActivity"
      @getLastActivityFromChildrenOfClasses="getLastActivityFromChildrenOfClasses"
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
  name: 'chatWorkers',
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
  mounted() {
    utils.loading.hide()
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
    startView () {
      this.getClassesByUserId()
      // this.getLastActivityFromChildrenOfClasses()
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
    getLastActivityFromChildrenOfClasses() {
      const opt = {
        route: '/mobile/workers/classes/getLastActivityFromChildrenOfClasses',
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) utils.toast("Ocorreu um erro, tente novamente.")
        else {
          this.childEventsHistory = r.data.list
          this.getChildEvents()
        } 
        
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
.metadata-end-wrapper {
    position: absolute;

    top: 10px;
    inset-inline-end: 10px;

    font-size: 0.8rem;

    display: flex;
    align-items: center;
  }
</style>