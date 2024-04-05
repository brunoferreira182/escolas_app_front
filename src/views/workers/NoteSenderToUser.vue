<template>
  <ion-page>
    <ToolbarEscolas
      title="Recados"
      :backButton="true"
    />
    <ion-content color="light" >
        <ion-item lines="none">
          <ion-input placeholder="Título do recado"
            v-model="noteName" class="q-ma-sm"/>
        </ion-item>
        <ion-item lines="none">
          <ion-input  placeholder="Recado"
            v-model="note" class="q-ma-sm">
          </ion-input>
          <ion-button @click="sendNoteToUser" expand="block" slot="end" >
            <ion-icon class="q-ml-xs" :icon="send"> </ion-icon>
          </ion-button>
        </ion-item>
        <!-- <ion-item lines="none">
        </ion-item> -->
      <div v-if="notesList.length > 0" class="ion-padding"> 
        <h3>Recados</h3>
      </div>
      <div v-else class="ion-padding"> 
        <h3> Sem recados Diponíveis </h3>
      </div>
      <ion-card v-if="notesList.length > 0" class="text-h6"> 
        <ion-item class="q-pa-xs row" 
          v-for="note in notesList" :key="note" 
          style="min-height: auto;"
          >
          <div class="ion-align-items-start note-content">
            <ion-text><h6>Título: {{ note.noteName}} </h6></ion-text>
            <ion-label> {{ note.noteContent }} </ion-label>
            <div class="date-card ion-align-items-start" >
              <div class="style-date" >
                <ion-label size="smaller"> {{ note.createdDate }} </ion-label>
                <ion-label class="hour"> {{ note.hour }} </ion-label>
              </div>
            </div>
          </div>
          <ion-button @click="deleteNote" class="align-end ion-">
            <ion-icon slot="icon-only" :icon="trash"></ion-icon>
          </ion-button>
        </ion-item>
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
  IonLabel, IonCardTitle, IonText, IonInput,
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
      const opt = {
        route: '/mobile/workers/chat/insertNewUserNote',
        body : {
          userReceiver: this.$route.query.userId
        }
      }
    if(this.note !== '' && this.note) opt.body.noteContent = this.note
    else if(this.note === '') return utils.toast("Insira uma mensagem de recado!")

    if(this.noteName !== '' && this.noteName) opt.body.noteName = this.noteName
    else if(this.noteName === '') return utils.toast("Insira um título ao seu recado!")

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
<style>
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