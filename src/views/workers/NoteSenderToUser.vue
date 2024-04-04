<template>
  <ion-page>
    <ToolbarEscolas
      title="Recados"
      :backButton="true"
    />
    <ion-content color="light" >
      <ion-item class="q-pa-md"> 
        <ion-input  placeholder="Recado"
          v-model="note" class="q-ma-sm"/>

        <ion-button @click="sendNoteToUser" expand="block" >
          <ion-icon class="q-ml-xs" :icon="send"> </ion-icon>
        </ion-button>

      </ion-item>
        <ion-card v-if="notesList.length > 0" class="q-pa-sm q-ml-xs text-h6"> 
          Recados
          <ion-item  class="q-pa-xs row" v-for="note in notesList" :key="note" style="min-height: auto;">
            <div class="ion-align-items-start" style="display: flex; flex-direction: column; width: 100%;">
              <div>
                <ion-label> {{ note.noteContent }}</ion-label>
              </div>
              <div class="ion-align-items-start" style="display: flex; justify-content: space-between; width: 100%;">
                <div style="display: flex; align-items: flex-start;">
                  <ion-label style="font-size: smaller;"> {{ note.createdDate }}</ion-label>
                  <ion-label class="q-mx-sm" style="font-size: smaller;"> {{ note.hour }}</ion-label>
                </div>
              </div>
            </div>
            <ion-button @click="deleteNote()" class="align-end" :icon="trash"></ion-button>
          </ion-item>
      </ion-card>
      <ion-card v-else class="q-pa-sm q-ml-xs text-h6"> 
          Sem recados Diponíveis 
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
import {send, trash} from 'ionicons/icons'
import {
  IonPage, IonContent,
  IonList, IonItem, IonIcon, IonChip,
  IonButton, IonAvatar,
  IonAccordionGroup, IonAccordion,
  IonLabel, IonCardTitle, IonCardSubtitle, IonInput,
  IonCardHeader, IonCardContent, IonCard, IonRow, 
  IonCol, IonBadge
} from '@ionic/vue'
</script>

<script>
import { useFetch } from '@/composables/fetch';
export default {
  components: {
  },
  data() {
    return {
      notesList: [],
      note: '',
    };
  },
  mounted () {
    utils.loading.hide()
    this.startView()
  },
  methods: {
    startView () {
      this.getUserNotes()
    },  
    sendNoteToUser(){
      const opt = {
        route: '/mobile/workers/chat/insertNewUserNote',
        body : {
          userReceiver: this.$route.query.userId
        }
      }
    if(this.note !== '' && this.note) opt.body.noteContent = this.note

    useFetch(opt).then((r) => {
      this.getUserNotes()
    })
  },
    async getUserNotes(){
      const opt = {
        route: '/mobile/workers/chat/getUsersNotes',
        body : {
          userId: this.$route.query.userId
        }
      }
      useFetch(opt).then((r) => {
      this.notesList= r.data
      })
    },
    deleteNote(){
      const opt = {
        route: '/mobile/workers/chat/deleteNoteFromUser',
        body : {
          userId: this.$route.query.userId
        }
      }
      useFetch(opt).then((r) => {
        this.getUserNotes()
        if(r.error){
          return console.log("Não deletou, retorno vazio")
        }
      })
    }
  } 
}
</script>