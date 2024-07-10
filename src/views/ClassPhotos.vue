<template>
  <ion-page>
    <ToolbarEscolas
      title="Fotos da turma"
      :backButton="true"
    />
    <ion-content color="light" >
      <div v-for="item in classPhotos" >
        <ion-text>
          <h3 class="q-mx-md">{{ item._id }}</h3>
        </ion-text>
        <MasonryWall
          :items="item.images"
          :column-width="100"
          :gap="10"
          :ssr-columns="100"
          #default="{ item }"
          class="q-pa-xs q-mb-xl"
        >  
          <ion-card  class="card q-ma-none">
            <ion-img
              @click="openImageModal(item.img.filename)"
              class="img-style"
              :src="utils.attachmentsAddress() + item.img.filename"
            />
            <ion-button 
              expand="block"
              size="small"
              @click="download(item.img)"
            >
              <ion-icon :icon="cloudDownload" />
            </ion-button>
          </ion-card>
        </MasonryWall>
      </div>

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
      <ModalPinchZoomImage
        :modalImageUrl="modalImageUrl"
        :showModal="showModal"
        @closeModal="showModal = false"
      />
      <ion-footer class="load-more-footer">
        <ion-button 
          :disabled="animationLoading ? true : false"
          @click="clkLoadMore()" 
          expand="block"
        >
          <div style="width: 60px;display: flex;align-items: center;justify-content: center;">
            <div v-if="animationLoading" class="dot-pulse"></div>
            <div v-else>Carregar mais</div>
          </div>
        </ion-button>
      </ion-footer>
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
  IonFooter,
  IonNote,
  IonFab,
  IonLoading,
  IonProgressBar,
  IonFabButton,
  IonText,
  IonIcon,
} from '@ionic/vue';
import MasonryWall from '@yeger/vue-masonry-wall'
import { useFetch } from '../composables/fetch'
import PhotoHandler from '../components/PhotoHandler.vue'
import ToolbarEscolas from '../components/ToolbarEscolas.vue'
import utils from '../composables/utils.js';
import ModalPinchZoomImage from '../components/ModalPinchZoomImage.vue'
import { useCurrentView } from '@/stores/currentView'
import {
  add,
  cloudDownload,
} from 'ionicons/icons';
import { ref } from 'vue';
const showModal = ref(false);
const modalImageUrl = ref(null);
const openImageModal = (imageFilename) => {
  modalImageUrl.value = utils.makeFileUrl(imageFilename);
  showModal.value = true;
};
</script>
<script>

export default {
  name: "ClassPhotos",
  data() {
    return {
      noMoreData: false,
      showModal: false,
      animationLoading: false,
      modalImageUrl: null,
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
      isLoading: false,
    };
  },
  beforeMount () {
    this.currentRoute = this.$route.path
  },
  watch: {
    $route(to, from) {
      this.currentRoute = this.$route.path
      if (to.path === '/classPhotos') {
        this.verifyAndStartView()
      }
    }
  },
  mounted(){
    this.verifyAndStartView()
    utils.loading.hide()
  },
  methods: {
    clkAddAttachment () {
      this.step = 'addAttachment'
      this.startPhotoHandler = true
    },
    clkLoadMore () {
      this.animationLoading = true
      setTimeout(() => {
        this.animationLoading = false
      }, 200)
      this.pagination.page++
      this.getClassesPhotos()
    },
    async sendImages(file) {
      console.log("🚀 ~ sendImages ~ file:", file)
      if(!file && file.length === 0){
        utils.toast('Insira pelo menos 1 imagem')
        return
      }
      const opt = {
        route: '/mobile/workers/chat/insertClassesPhotos',
        body: {
          classId: this.$route.query.classId,
          className: this.$route.query.className
        },
        file: [file]
      }
        if (!this.isLoading) {
          this.isLoading = true
          utils.loading.show()
        }
        if (!this.pendingUploads) {
          this.pendingUploads = 0;
        }
        this.pendingUploads++;

      const r = await useFetch(opt)
      if (!this.uploadResults) {
        this.uploadResults = [];
      }
      this.uploadResults.push(r);
      this.pendingUploads--;
      if (this.pendingUploads === 0) {
        let allProcessed = this.uploadResults.every(result => !result.error);
        this.uploadResults = [];
        this.pendingUploads = null;
        if (allProcessed) {
          utils.toast('Imagens inseridas com sucesso!')
          await this.getClassesPhotos('dontShowLoading')
        } else {
          utils.loading.hide();
          this.isLoading = false;
        }
      }
    },
    async getClassesPhotos(loading){
      const opt = {
        route: '/mobile/workers/chat/getClassesPhotos',
        body: {
          classId: this.$route.query.classId,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      loading === 'dontShowLoading' ? utils.loading.hide() : utils.loading.show()
      const r = await useFetch(opt)
      utils.loading.hide()
      if(!r.error){
        // if (r.data.length === 0) {
        //   this.noMoreData = true
        //   return
        // }
        // this.classPhotos = r.data.list
        console.log("🚀 ~ getClassesPhotos ~ r.data.list:", r.data.list)
        this.classPhotos.push(...r.data.list)
        return
      }
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
    verifyAndStartView () {
      this.getClassesPhotos()
      const currentView = useCurrentView()
      if (currentView.currentView === 'worker') {
        this.showAddPhoto = true
      }
    },
    async download (item) {
      const retDownload = await utils.downloadFile({
        filename: item.filename,
        originalname: item.originalname
      })
    },
  }
};
</script>
<style scoped>
.card-button {
  position: fixed;
  top: -12px;  
  right: -16px;  
  z-index: 10;  
  color: rgb(0, 140, 255);
  /* --padding-start: 10px;
  --padding-end: 10px;
  --padding-top: 4px;
  --padding-bottom: 2px;
  --border-radius: 10rem; */
}
.img-style {
  width: 100%;
  object-fit: cover;
  overflow: hidden;
}
ion-avatar {
  --border-radius: 4px;
  width: 100px;
  height: 100px
}
.load-more-footer {
  position: fixed;
  bottom: -5px;
  width: 100%;
  z-index: 1;
  background: var(--ion-color-light);
  padding-bottom: var(--ion-safe-area-bottom);
}

.dot-pulse {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #ffffff;
  color: #ffffff;
  box-shadow: 9999px 0 0 -5px;
  animation: dot-pulse 1.5s infinite linear;
  animation-delay: 0.25s;
}
.dot-pulse::before, .dot-pulse::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #ffffff;
  color: #ffffff;
}
.dot-pulse::before {
  box-shadow: 9980px 0 0 -5px;
  animation: dot-pulse-before 1.5s infinite linear;
  animation-delay: 0s;
}
.dot-pulse::after {
  box-shadow: 10008px 0 0 -5px;
  animation: dot-pulse-after 1.5s infinite linear;
  animation-delay: 0.5s;
}

@keyframes dot-pulse-before {
  0% {
    box-shadow: 9980px 0 0 -5px;
  }
  30% {
    box-shadow: 9980px 0 0 2px;
  }
  60%, 100% {
    box-shadow: 9980px 0 0 -5px;
  }
}
@keyframes dot-pulse {
  0% {
    box-shadow: 9999px 0 0 -5px;
  }
  30% {
    box-shadow: 9999px 0 0 2px;
  }
  60%, 100% {
    box-shadow: 9999px 0 0 -5px;
  }
}
@keyframes dot-pulse-after {
  0% {
    box-shadow: 10008px 0 0 -5px;
  }
  30% {
    box-shadow: 10008px 0 0 2px;
  }
  60%, 100% {
    box-shadow: 10008px 0 0 -5px;
  }
}
</style>