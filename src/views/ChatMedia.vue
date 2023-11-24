<template>
  <ion-page>
    <ToolbarEscolas
      title="Mídias"
      :backButton="true"
    />
    <ion-content ref="elIonContent" color="light">
      <ion-card v-for="media in mediaData" :key="media">
        <div v-if="media.messageFile && Object.keys(media.messageFile).length > 0">
          <img
            v-if="media.messageFile.mimetype && media.messageFile.mimetype.includes('image')" style="border-radius:0.5rem;"
            :src="utils.attachmentsAddress() + media.messageFile.filename"
          >
          
          <span style="display:flex;align-items: center;" @click="clkAttachment(media)">
            <ion-icon size="large" :icon="attach"></ion-icon>
            <span class="q-pa-md"> {{ media.messageFile.originalname ? media.messageFile.originalname : 'Arquivo'}}</span>
          </span>
        </div>
        <div
          style="width: 300px;margin-bottom: -4px;display: flex; align-items: center;"
          id="voice-message"
          v-if="media.messageAudio"
        >
          <div style="padding-top: 4px; padding-left: 4px;">
            <ion-icon 
              v-if="currentAudioId !== media._id || audioIcon === 'play'" 
              @click="playAudio(media)" 
              size="large" 
              color="dark" 
              slot="start" 
              :icon="play"
            />
            <ion-icon 
              v-if="currentAudioId === media._id && audioIcon === 'pause'" 
              @click="pauseAudio(media)" 
              size="large" color="dark" 
              slot="start" 
              :icon="pause"
            />
          </div>
          <ion-range
            style="margin-bottom: -4px; padding-right: 20px; "
            :value="currentAudioId === media._id ? currentTime * 1000 : 0"
            :min="0" 
            :max="media.messageAudio.msDuration" 
            class="q-py-lg"
          />
          <ion-label 
            style="font-size: 13px;margin-bottom: -4px;margin-top: 4px;margin-left: 4px;"
          >
            {{ currentAudioId === media._id ? formatDuration(currentTime * 1000) : media.messageAudio.durationFormatted }}
          </ion-label>
        </div>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup>
import ToolbarEscolas from '../components/ToolbarEscolas.vue'
import utils from '../../src/composables/utils.js';
import { send, attach, close, mic, play, pause, chevronBack } from 'ionicons/icons';
import {
IonPage, IonContent,
IonCard,
IonRange,
IonLabel,
IonIcon,
} from '@ionic/vue'
</script>
<script>
import { useFetch } from '@/composables/fetch';
export default {
  name: 'chatMedia',
  data() {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      mediaData: null,
      openAudioRecorder: false,
      currentAudioRef: null,
      currentTime: 0,
      currentAudioId: null,
      audioIcon: 'play'
    };
  },
  watch: {
    $route (to) {
      if (to.path === '/chatMedia') {
        this.getClassAttachments()
      }
    }
  },
  mounted () {
    this.getClassAttachments()
  },
  methods: {
    async clkAttachment (item) {
      console.log(item)
      utils.loading.show()
      await utils.downloadFile({
        filename: item.messageFile.filename,
        originalname: item.messageFile.originalname
      })
      utils.loading.hide()
    },
    formatDuration (ms) {
      // Converte um tempo em milissegundos para uma string de formato 'mm:ss'
      const minutes = Math.floor(ms / 60000)
      const seconds = ((ms % 60000) / 1000).toFixed(0)
      return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`
    },
    pauseAudio() {
      this.audioIcon = 'play'
      if (this.currentAudioRef) {
        this.currentAudioRef.pause()
      }
      // this.currentAudioId = null
    },
    playAudio(media) {
      this.audioIcon = 'pause'
      if (this.currentAudioId !== media._id) {
        this.currentTime = 0
        if (this.currentAudioRef)this.currentAudioRef.pause()
        this.currentAudioRef = new Audio(`data:${media.messageAudio.mimeType};base64,${media.messageAudio.recordDataBase64}`)
        this.currentAudioId = media._id
        this.currentAudioRef.oncanplaythrough = () => {
          this.currentAudioRef.play()
        }
        this.currentAudioRef.load()
      } else{
        this.currentAudioRef.play()
      }
      const interval = setInterval(() => {
        const id = media._id
        if( this.currentTime * 1000 >= media.messageAudio.msDuration || id !== this.currentAudioId){
          if( this.currentTime * 1000 >= media.messageAudio.msDuration){
            this.currentAudioId = null
            this.currentTime = 0
          }
          clearInterval(interval)
        }
        this.currentTime = this.currentAudioRef.currentTime
      },50)
    },
    getClassAttachments() {
      const opt = {
        route: '/mobile/parents/chat/getClassAttachments',
        body: {
          classId: this.$route.query.classId,
          // page: this.pagination.page,
          // rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente mais tarde")
          return
        }
        this.mediaData = r.data
      })
    }
  }
}
</script>
<style scoped>
ion-list {
  --background: "transparent"
}
.chat-input {
  /* background-color: rgb(216, 216, 216) ; */
  border-radius: 0.5rem;
  --padding-start: 10px;
  --padding-end: 10px;
}
.chat-message {
  border-radius:0.5rem;
  max-width: 250px; 
  min-width: 70px;
}
/* .chat-message:active {
  background-color: var(--ion-color-light);
} */
.sent-message {
  background-color: lightgreen;
}
.sent-temp-message {
  border-width: 2px;
  border-style: solid;
  border-color: lightgreen
}

.received-message {
  margin-left: -10px;
  background-color: lightskyblue;
}
.blink-bg {
  animation: blinkingBackground 2s infinite;
}
@keyframes blinkingBackground{
  0%		{ background-color: #10c018;}
  25%		{ background-color: #1056c0;}
  50%		{ background-color: #ef0a1a;}
  75%		{ background-color: #254878;}
  100%	{ background-color: #04a1d5;}
}

ion-button[shape=circle] {
    --border-radius: 50%;
    width: 40px;
    height: 40px;
}
.text-caption {
  font-size: 12px;
  color: rgb(62, 62, 62);
}
.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
ion-item {
  --inner-padding-end: 0;
  --inner-padding-start: 0;
}
ion-item {
  --inner-padding-end: 0;
  --inner-padding-start: 0;
}
.ios ion-range::part(knob)  {
  scale: 0.5;
}
ion-range::part(knob)  {
  background-color: var(--ion-color-dark);
}


</style>