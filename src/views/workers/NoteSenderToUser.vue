<template>
  <ion-page>
    <ToolbarEscolas
      title="Recados"
      :backButton="true"
    />
    <ion-content color="light" >
      <ion-list :inset="true">
        <ion-item>
          <ion-input
            placeholder="Recado"
            v-model="note"
          >
          </ion-input>
          <ion-button
            @click="sendNoteToUser"
            slot="end"
            fill="clear"
          >
            <ion-icon class="q-ml-xs" :icon="send"> </ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <div v-if="notesList.length > 0" class="ion-padding"> 
        <h3>Recados</h3>
      </div>
      <div v-else class="ion-padding"> 
        <h3> Sem recados Diponíveis </h3>
      </div>
      
      <ion-list :inset="true" v-if="notesList.length > 0"> 
        <ion-item
          v-for="note in notesList"
          :key="note"
        >
          <ion-label>
            <!-- <strong>{{ note.noteName}}</strong><br> -->
            <ion-text>{{ note.noteContent }}</ion-text><br>
            <ion-note>{{ note.createdDate }}</ion-note>
          </ion-label>
          <ion-button
            @click="deleteNote(note)"
            fill="clear"
            color="danger"
          >
            <ion-icon slot="icon-only" :icon="trash"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
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
  IonLabel, IonCardTitle, IonText, IonInput,
  IonCardHeader, IonCardContent, IonCard, IonRow, 
  IonCol, IonBadge,
  IonNote
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
      noteName: '',
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
      if (this.note === '') return utils.toast("Insira uma mensagem de recado!")
      const opt = {
        route: '/mobile/workers/chat/insertNewUserNote',
        body : {
          userReceiver: this.$route.query.userId,
          noteContent: this.note
        }
      }
      useFetch(opt).then((r) => {
        this.note = ""
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
    deleteNote(note){
      const noteId = note._id
      console.log("🚀 ~ deleteNote ~ noteId:", noteId)
      const opt = {
        route: '/mobile/workers/chat/deleteNoteFromUser',
        body : {
          userId: this.$route.query.userId,
          noteId: noteId
        }
      }
      utils.loading.show()
      useFetch(opt).then((r) => {
        utils.loading.hide()
        this.getUserNotes()
        if(r.error){
          return console.log("Não deletou, retorno vazio")
        }
      })
    }
  } 
}
</script>
<style scoped>
.note-content{
  display: flex; 
  flex-direction: column; 
  width: 100%
}
.style-date {
  display: flex; 
  align-items: flex-start;
}
.hour{
  font-size: smaller; 
  margin-left: 10px;
}
.date-card{
  display: flex; 
  justify-content: space-between; 
  width: 100%;
}
</style>