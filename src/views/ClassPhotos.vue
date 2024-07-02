<template>
  <ion-page>
    <ToolbarEscolas
      title="Fotos da turma"
      :backButton="true"
    />
    <ion-content color="light">
      <MasonryWall
        :items="parentFiles"
        :column-width="180"
        :gap="10"
        :ssr-columns="100"
        #default="{ item }"
        class="q-pa-xs"
      >
        <ion-card @click="clkOpenImg(item)" class="my-card q-ma-none">
          <ion-card-content>
            <ion-label>
              <h2>{{item.noteName}}</h2>
              <p>{{item.noteDescription}}</p>
            </ion-label>
          </ion-card-content>
        </ion-card>
      </MasonryWall>
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
  IonCardContent,
  IonCard,
  IonContent,
  onIonViewWillEnter,
  IonImg,
  IonAvatar,
  IonList,
  IonNote,
  IonText,
  IonIcon,
} from '@ionic/vue';
import MasonryWall from '@yeger/vue-masonry-wall'
// import { useFetch } from '../composables/fetch'
import ToolbarEscolas from '../components/ToolbarEscolas.vue'
import utils from '../../src/composables/utils.js';
import {
  cloudDownload,
  barcode,
} from 'ionicons/icons';

</script>
<script>

export default {
  name: "ClassPhotos",
  data() {
    return {
      searchDocument: '',
      searchResult: null,
      parentFiles: [],
    };
  },
  watch: {
    $route (to, from) {
      if (to.path === '/classPhotos') {
        this.getFilesByUserId()
      }
    }
  },
  mounted(){
    utils.loading.hide()
  },
  methods: {
    clkOpenImg(item){
      console.log("🚀 ~ clkOpenImg ~ item:", item)
      
    }
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