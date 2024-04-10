<template>
  <ion-page>
    <ToolbarEscolas
      title="Meus Recados"
      :backButton="true"
    />
    <ion-content color="light" >
      <ion-list :inset="true">
        <ion-item
          v-for="note in notesList"
          :key="note"
        >
          <ion-label>
            <ion-text>{{ note.noteContent }}</ion-text><br>
            <ion-note>{{ note.createdDate }}</ion-note>
          </ion-label>
          <ion-note slot="end" v-if="note.isRead !== 1">
            <ion-badge>Novo</ion-badge>
          </ion-note>
        </ion-item>
        
      </ion-list>
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
  IonList, IonItem, IonNote,
  IonBadge
  
} from '@ionic/vue';
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
      notesIds: []
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
    },

  }
};
</script>
<style scoped>
.my-card {
  box-shadow: 0px 0px 5px -2px;
  border-radius: 13px
}
</style>
