<template>
  <ion-page>
    <ToolbarEscolas
      title="Meus Recados"
      :backButton="true"
    />
    <ion-content color="light">
      <MasonryWall
        :items="notesList"
        :column-width="180"
        :gap="10"
        :ssr-columns="100"
        #default="{ item }"
        class="q-pa-xs"
      >
        <ion-card @click="clkOpenNoteDetail(item)" class="my-card q-ma-none">
          <ion-card-content>
            <ion-label>
              <h2 class="text-capitalize">{{item.noteName}}</h2>
              <p class="q-py-sm">{{item.noteContent}}</p>
            </ion-label>
            <div class="text-caption">
              {{ item.createdAt.createdAtOnlyDate.split('/')[1] }}/
              {{ item.createdAt.createdAtOnlyDate.split('/')[0] }}/
              {{ item.createdAt.createdAtOnlyDate.split('/')[2] }}
              às
              {{ item.createdAt.createdAtLocale.split(' ')[1] }}
            </div>
          </ion-card-content>
        </ion-card>
      </MasonryWall>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonCard,
  IonText,
  IonLabel,
  IonCardContent,
  
} from '@ionic/vue';
import MasonryWall from '@yeger/vue-masonry-wall'
import { useFetch } from '@/composables/fetch';
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
</script>

<script>
export default {
  name: "UserNotesList",
  data() {
    return {
      notesList: [],
    }
  },
  mounted() {
    utils.loading.hide()
    this.getNotesList()
  },
  methods: {
    clkOpenNoteDetail(item){
      console.log(item)
    },
    getNotesList() {
      const opt = {
        route: '/mobile/parents/profile/getUserNotesList',
        body: {
          page: 1,
          rowsPerPage: 100,
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.notesList = r.data.list
        } else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde")
        }
      })
    }
  }
};
</script>
<style scoped>
.my-card {
  box-shadow: 0px 0px 5px -2px;
  border-radius: 13px
}
</style>
