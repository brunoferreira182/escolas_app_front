<template>
  <ion-page  ref="page">
    
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Salas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content color="light" :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">Salas</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="q-px-md">
        <ion-text>
          <h3>Turmas</h3>
          <ion-note>Selecione uma turma entrar no detalhe</ion-note>
        </ion-text>
      </div>
      <div class="q-mt-md">
        <div v-if="classesInfo && classesInfo.length">
          <ion-list :inset="true">
            <ion-item 
              v-for="c in classesInfo"
              :key="c"
              :button="true"
              @click="goToChatInfo(c.classId)"
            >
              <ion-avatar aria-hidden="true" slot="start" v-if="c.classImage" style="height: 60px; width: 60px">
                <img :src="utils.makeFileUrl(c.classImage, 'thumbnail')" />
              </ion-avatar>
              <ion-avatar aria-hidden="true" slot="start" v-else style="height: 60px; width: 60px">
                <img :src="utils.makeFileUrl(c.image, 'thumbnail')"/>
              </ion-avatar>
              <ion-label>
                <h2>{{ c.className }}</h2>
                <ion-badge color="primary">Função: {{ c.functionName }}</ion-badge>
              </ion-label>
            </ion-item>
          </ion-list>
        </div>
      </div>
    </ion-content>
    
  </ion-page>
</template>
<script setup>
import { 
  IonPage,
  IonContent,
  IonList, IonBadge,
  IonItem, IonLabel, IonNote,
  IonAvatar,
  IonHeader, IonToolbar, IonTitle, IonText
} from '@ionic/vue';
import { APP_NAME, } from '../../composables/variables';
import utils from '../../composables/utils'
</script>

<script>
import { useFetch } from '@/composables/fetch';
export default {
  name: 'chatWorkers',
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
    };
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsLayout/chat') {
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
    startView () {
      this.getClassesByUserId()
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
    goToChatInfo(classId) {
      this.$router.push('/chatInfo?classId=' + classId)
    },
  }
}

</script>


<style scoped>
ion-avatar {
  width: 56px;
  height: 56px
}
</style>