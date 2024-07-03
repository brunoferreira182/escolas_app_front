<template>
  <ion-page>
    <ToolbarEscolas
      title="Fotos da turma"
      :backButton="true"
    />
    <ion-content color="light">
      <div v-for="item in classPhotos">
        <ion-text>
          <h3 class="q-mx-md">{{ item.date }}</h3>
        </ion-text>
        <MasonryWall
          :items="item.img"
          :column-width="180"
          :gap="10"
          :ssr-columns="100"
          #default="{ item }"
          class="q-pa-xs"
        >  
          <ion-card @click="clkOpenImg(item)" class="my-card q-ma-none">
            <img
              :src="utils.attachmentsAddress() + item.img.filename"
            >
            <ion-button slot="icon-only" :icon="add" @click="download(item.img)"></ion-button>
          </ion-card>
        </MasonryWall>
      </div>
      <ion-button @click="clkLoadMore()" expand="block">
        Carregar mais
      </ion-button>
      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        style="margin-bottom: 50px; padding-bottom: var(ion-safe-area-bottom);"
        v-if="showAddPhoto && currentRoute.includes('classPhotos')"
        @click="clkAddAttachment"
      >
        <ion-fab-button size="medium">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
      <PhotoHandler
        v-show="startPhotoHandler"
        :start="startPhotoHandler"
        :allFiles="true"
        :noCrop="false"
        :acceptImageCaption="true"
        :multiple="true"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />
    </ion-content>
  </ion-page>
</template>


<script setup>
import {
  IonPage,
  IonButton,
  IonAlert,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonContent,
  onIonViewWillEnter,
  IonImg,
  IonAvatar,
  IonList,
  IonNote,
  IonFab,
  IonFabButton,
  IonText,
  IonIcon,
} from '@ionic/vue';
import MasonryWall from '@yeger/vue-masonry-wall'
import { useFetch } from '../composables/fetch'
import PhotoHandler from '../components/PhotoHandler.vue'
import ToolbarEscolas from '../components/ToolbarEscolas.vue'
import utils from '../composables/utils.js';
import { useCurrentView } from '@/stores/currentView'
import {
  add,
} from 'ionicons/icons';

</script>
<script>

export default {
  name: "ClassPhotos",
  data() {
    return {
      searchDocument: '',
      searchResult: null,
      showAddPhoto: false,
      classPhotos: [],
      startPhotoHandler: false,
      step: 'initial',
      currentRoute:'',
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      date: [],
    };
  },
  beforeMount () {
    this.currentRoute = this.$route.path
  },
  watch: {
    $route(to, from) {
      this.currentRoute = this.$route.path
      if (to.path === '/classPhotos') {
        this.verifyView()
      }
    }
  },
  mounted(){
    this.verifyView()
    utils.loading.hide()
  },
  methods: {
    clkAddAttachment () {
      this.step = 'addAttachment'
      this.startPhotoHandler = true
    },
    clkLoadMore () {
      this.pagination.page++
      this.getClassesPhotos()
    },
    sendImages (file) {
      const opt = {
        route: '/mobile/workers/chat/insertClassesPhotos',
        body: {
          classId: this.$route.query.classId
        },
        file: [ file ]
      }
			useFetch(opt).then(r => {
        this.getClassesPhotos()
      })
    },
    captured(img, imgBlob, fileName, imageCaption) {
    this.step = 'initial'
      this.startPhotoHandler = false
      this.sendImages({
        file: imgBlob,
        name: fileName,
        imageCaption
      })
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
      this.step = 'initial'
    },
    getClassesPhotos(){
      const opt = {
        route: '/mobile/workers/chat/getClassesPhotos',
        body: {
          classId: this.$route.query.classId,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then(r => {
        if(!r.error){
          r.data.list.forEach(item => {
            this.classPhotos.push({
              date: item._id,
              img: item.images
            })
          });
          return
        }
      })
    },
    verifyView () {
      this.getClassesPhotos()
      const currentView = useCurrentView()
      console.log("🚀 ~ verifyView ~ currentView:", currentView.currentView)
      if (currentView.currentView === 'worker') {
        this.showAddPhoto = true
      }
    },
    async download (item) {
      console.log("🚀 ~ clkDownloadAttachment ~ docccccccccc:", item)
      return
      const retDownload = await utils.downloadFile({
        filename: doc.file.filename,
        originalname: doc.file.originalname
      })
    },
  }
};
</script>
<style scoped>
ion-avatar {
  --border-radius: 4px;
  width: 100px;
  height: 100px
}

</style>