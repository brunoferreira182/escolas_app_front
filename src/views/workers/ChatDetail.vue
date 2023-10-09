<template>
  <ion-page>
    <ToolbarEscolas
      :title="classDetail ? classDetail.className : 'Carregando...'"
      :backButton="true"
      @titleClicked="goToChatInfo"
    />
    <ion-content ref="elIonContent" color="light">
      <PhotoHandler
        v-show="startPhotoHandler"
        :start="startPhotoHandler"
        :allFiles="true"
        :noCrop="false"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />
      <div >
        <ion-infinite-scroll
          position="top"
          style="position:absolute;pointer-events: none; "
          @ionInfinite="moreData"
          :disabled="disableInfiniteScroll"
        >
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
        <ion-list ref="listAnswerMsg">
          <div v-for="message in messages" :key="message._id" :id="message._id">
            <ion-item-sliding>
              <ion-item lines="none" >
                <ion-row :slot="message.createdBy.userId === userInfo.userId ? 'end' : 'start'" >
                  <div
                    :class="`chat-message ${message.tempId ? 'sent-temp-message' : message.createdBy.userId === userInfo.userId ? 'sent-message': 'received-message'} q-ma-xs q-pa-sm ${blinkMessageId === message._id ? 'blink-bg' : ''}`"
                  >
                    <ion-card v-if="message.answerMessage" style="margin: 0; padding: 3px;box-shadow:none" @click="clkAnswer(message)">
                      <div>{{ message.answerMessage.createdBy.name }}:</div>
                      <div v-if="message.answerMessage.message">{{ message.answerMessage.message }}</div>
                      <div v-else>Arquivo</div>
                    </ion-card>
                    <div v-if="message.messageFile">
                      <div v-if="message.messageFile.filename !== null && message.messageFile.mimetype !== null">
                        <img
                          v-if="message.messageFile.mimetype && message.messageFile.mimetype.includes('image')" style="border-radius:0.5rem;"
                          :src="utils.attachmentsAddress() + message.messageFile.filename"
                        >
                        <span v-else style="display:flex;align-items: center;">
                          <ion-icon size="small" :icon="attach"></ion-icon>
                          <span>Arquivo anexado</span>
                        </span>
                      </div>
                    </div>
                    <div
                      style="width: 300px;margin-bottom: -20px;display: flex; align-items: center;"
                      id="voice-message"
                      v-else-if="message.messageAudio"
                    >
                      <div style="padding-top: 5px; padding-left: 5px;">
                        <ion-icon 
                          v-if="currentAudioId !== message._id || audioIcon === 'play'" 
                          @click="playAudio(message.messageData.audio,message._id)" 
                          size="large" 
                          color="dark" 
                          slot="start" 
                          :icon="play"
                        />
                        <ion-icon 
                          v-if="currentAudioId === message._id && audioIcon === 'pause'" 
                          @click="pauseAudio(message.messageData.audio,message._id)" 
                          size="large" color="dark" 
                          slot="start" 
                          :icon="pause"
                        />
                      </div>
                      <div>
                        <ion-range
                          style="margin-bottom: -20px;width: 200px;padding-right: 20px;"
                          :value="currentAudioId === message._id ? currentTime * 1000 : 0"
                          :min="0" 
                          :max="message.messageData.audio.msDuration" 
                        />
                        <ion-label style="font-size: 13px;margin-bottom: -4px;margin-top: 5px;margin-left: 5px;">
                          {{ currentAudioId === message._id ? formatDuration(currentTime * 1000) : message.messageData.audio.durationFormatted }}
                        </ion-label>
                      </div>
                    </div>
                    <div v-else>
                      {{ message.messageText }}
                    </div>
                    <span
                      class="ion-float-right q-mt-xs text-caption q-ml-sm"
                      v-if="message.createdAt"
                    >{{ message.createdAt.createdAtLocale.split(' ')[1].substring(0,5) }}</span>
                  </div>
                </ion-row>
              </ion-item>
              <ion-item-options :side="message.createdBy.userId === userInfo.userId ? 'end' : 'start'">
                <ion-item-option style="text-transform: none" color="primary" @click="clkMessage(message)">Detalhes</ion-item-option>
                <ion-item-option style="text-transform: none" color="secondary" @click="answerMessage(message)">Responder</ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          </div>
        </ion-list>
      </div>
    </ion-content>
    <ion-footer>
      <form :style="footerColor">
        <ion-item v-if="isAnsweringMessage.isAnswering" lines="none" >
          <ion-avatar slot="start">
            <img />
          </ion-avatar>
          <ion-label class="ion-text-wrap">
            <p>Respondendo à mensagem de {{ isAnsweringMessage.message.createdBy.name }}</p>
          </ion-label>
          <ion-icon :icon="close" slot="end" @click="undoAnswerMessage"></ion-icon>
        </ion-item>
        
        <ion-row class="q-mx-xs ion-align-items-end" style="padding-bottom: var(--ion-safe-area-bottom)">
          <ion-col size="10">
            <ion-item lines="none" style="border-radius: 15px;align-items: center;">
              <ion-textarea @ionFocus="scrollToBottom"  v-model="chatMessage" auto-grow rows="1"  class="chat-input q-mb-xs">
              </ion-textarea>
              <ion-button mode="ios" class="q-mr-xs" fill="clear" size="small" style="scale: 1.3;" v-if="chatMessage === ''" shape="circle" @click="clkAddAttachment">
                <ion-icon slot="icon-only" :icon="attach"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-col>
          <ion-col size="2" style="display:flex;justify-content: center;">
            <ion-button
              @mousedown="$event.preventDefault()"
              @click="insertMessage"
              v-if="chatMessage !== ''"
              size="small"
              shape="circle"
            >
              <ion-icon slot="icon-only" :icon="send"></ion-icon>
            </ion-button>
            
            <ion-button v-else size="small" shape="circle" @click="clkRecord">
              <ion-icon style="scale: 1.3;" slot="icon-only" :icon="mic"></ion-icon>
            </ion-button>
          </ion-col>
        </ion-row>
      </form>
    </ion-footer>

    <AudioRecorder
      :open="openAudioRecorder"
      @done="doneAudioRecorder"
    />

  </ion-page>
</template>

<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import AudioRecorder from '../../components/AudioRecorder.vue'
import PhotoHandler from '../../components/PhotoHandler.vue'
import { send, attach, close, mic, play, pause, chevronBack } from 'ionicons/icons';
import utils from '../../../src/composables/utils.js';
import {
  IonPage, IonContent,
  IonInfiniteScroll, IonInfiniteScrollContent,
  IonCard, IonIcon, IonRange, IonLabel,
  IonRow, IonItem, IonItemOption, IonItemOptions,
  IonItemSliding, IonList, IonAvatar, IonTextarea,
  IonButton, IonCol, IonFooter, 
} from '@ionic/vue'
</script>

<script>
import { useFetch } from '@/composables/fetch';
export default {
  components: {
  },
  data() {
    return {
      classDetail: null,
      title: '',
      isAnsweringMessage: {
        isAnswering: false,
        message: {}
      },
      answerClickedId: null,
      blinkMessageId: null,
      startPhotoHandler: false,
      step: 'initial',
      firstTime: true,
      send,
      attach,
      utils,
      isLoading: true,
      dialogDetailMessage: {
        open: false,
        data: {}
      },
      dialogDeleteMessage: {
        open: false,
        data: {}
      },
      chatMessage: '',
      audioMessage: null,
      userInfo: '',
      statusConnection: '',
      messages: [],
      message: '',
      page: 0,
      pendingMessage: 'Você já tem uma solicitação de conexão para esta pessoa. Aguarde ela aprovar.',
      userNameAndPhoto: {},
      isLoadingMessages: false,
      disableInfiniteScroll: true,
      noMoreMessages: false,
      timeTouchMessageStart: 0,
      timeTouchMessageEnd: 0,
      socket: null,
      relationId: null,
      footerColor: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'background: #0d0d0d' : 'background: #f5f5f5',
      stillTouching: false,
      openAudioRecorder: false,
      currentAudioRef: null,
      currentTime: 0,
      currentAudioId: null,
      audioIcon: 'play'
    };
  },
  mounted () {
    this.startView()
  },
  methods: {
    startView() {
      this.getClassDetailById()
      this.getMessages()
      this.userInfo = utils.presentUserInfo()
    },
    goToChatInfo() {
      this.$router.push("/chatInfoWorker?classId=" + this.$route.query.classId)
    },
    playAudio(data, currentAudioId) {
      this.audioIcon = 'pause'
      if (this.currentAudioId !== currentAudioId) {
        this.currentTime = 0
        if (this.currentAudioRef)this.currentAudioRef.pause()
        this.currentAudioRef = new Audio(`data:${data.mimeType};base64,${data.recordDataBase64}`)
        this.currentAudioId = currentAudioId
        this.currentAudioRef.oncanplaythrough = () => {
          this.currentAudioRef.play()
        }
        this.currentAudioRef.load()
      } else{
        this.currentAudioRef.play()
      }
      const interval = setInterval(() => {
        const id = currentAudioId
        if( this.currentTime * 1000 >= data.msDuration || id !== this.currentAudioId){
          if( this.currentTime * 1000 >= data.msDuration){
            this.currentAudioId = null
            this.currentTime = 0
          }
          clearInterval(interval)
        }
        this.currentTime = this.currentAudioRef.currentTime
      },50)
    },
    pauseAudio() {
      this.audioIcon = 'play'
      if (this.currentAudioRef) {
        this.currentAudioRef.pause()
      }
      // this.currentAudioId = null
    },
    timeupdate() {
      this.currentTime = this.currentAudioRef.currentTime
    },
    formatDuration (ms) {
      // Converte um tempo em milissegundos para uma string de formato 'mm:ss'
      const minutes = Math.floor(ms / 60000)
      const seconds = ((ms % 60000) / 1000).toFixed(0)
      return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`
    },
    doneAudioRecorder (action, data) {
      if (action === 'cancel') this.openAudioRecorder = false
      if (action === 'ok') {
        this.audioMessage = data
        this.insertMessage({})
      }
    },
    clkRecord () {
      this.openAudioRecorder = true
    },
    clkAnswer (answer) {
      let foundMsg = false
      this.messages.forEach(msg => {
        if (msg._id === answer.answerMessage.messageId) foundMsg = true
      })
      this.answerClickedId = answer.answerMessage.messageId
      if (!foundMsg) {
        utils.loading.show()
        this.getMessages(null, answer.answerMessage.createdAt.createdAtPosix, true)
      } else {
        this.scrollToMessage()
      }
    },
    async scrollToMessage () {
      await utils.sleep(100)
      const el = document.getElementById(this.answerClickedId);
      this.$refs.elIonContent.$el.scrollToPoint(0, el.offsetTop, 1000);
      this.blinkMessageId = this.answerClickedId
      await utils.sleep(2000)
      this.answerClickedId = null
      this.blinkMessageId = null
    },
    undoAnswerMessage () {
      this.isAnsweringMessage.isAnswering = false
      this.isAnsweringMessage.message = {}
    },
    answerMessage (msg) {
      this.$refs.listAnswerMsg.$el.closeSlidingItems()
      this.isAnsweringMessage.isAnswering = true
      this.isAnsweringMessage.message = msg
    },
    async clkMessage (message) {
      this.$refs.listAnswerMsg.$el.closeSlidingItems()
      const d = `Data: ${message.createdAt.createdAtInFullLong} de  ${message.createdAt.createdAtYear}`
      const buttons = [{ text: 'Voltar', role: 'cancel' }]
      if (message.createdBy.userId === this.userInfo.userId) {
        buttons.push({
          text: 'Apagar mensagem',
          role: 'confirm',
          handler: () => {
            this.clkDeleteMessage(message._id)
          },
        })
      }
      const alert = await alertController.create({
        header: 'Detalhe',
        message: d,
        buttons
      });
      await alert.present();
    },
    clkDeleteMessage (messageId) {
      const opt = {
        method: 'POST',
        route: '/messenger/updateMessageStatus',
        body: {
					messageId,
          userId: this.userInfo.userId
        }
      }
			useFetch(opt).then(r => {
        this.findAndRemoveMessageFromArray(messageId)
        utils.toast("Mensagem apagada!")
      })
    },
    findAndRemoveMessageFromArray (id) {
      let ind
      this.messages.forEach((m, i) => {
        if (m._id === id) ind = i
      })
      if (ind) this.messages.splice(ind, 1)
    },
    clkAddAttachment () {
      this.step = 'addAttachment'
      this.startPhotoHandler = true
    },
    captured(img, imgBlob, fileName) {
      this.step = 'initial'
      this.startPhotoHandler = false
      console.log(img, 'img')
      console.log(imgBlob, 'imgBlob')
      console.log(fileName, 'fileName')
      this.insertMessage({
        file: imgBlob,
        fileName
      })
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
      this.step = 'initial'
    },
    createRelationId: async function () {
      let relationId
      if (this.userInfo.userId < this.$route.query.userId) relationId = this.userInfo.userId + '-' + this.$route.query.userId
      else relationId = this.$route.query.userId + '-' + this.userInfo.userId
      this.relationId = relationId
      this.startSocket()
      return
    },
    startSocket: async function () {
      const opt = {
        query: {
          type: 'messengerChat',
          connectionId: this.relationId,
        }
      }
      this.socket = io(masterServerRoute(), opt)
      this.socket.on('newMessage', msg => { this.pushMessage(msg) })
    },
    pushMessage (msg) {
      console.log('dentro do pushMessage')
      if (msg.length === 0 || msg[0].createdBy.userId === this.userInfo.userId) return
      this.messages.push(...msg)
      this.scrollToBottom()
    },
    clkAttachment (item) {
      const url = utils.attachmentsAddress() + item.messageData.file.filename
    },
    clkAttachFile () {
      ''
    },
    async scrollToBottom() {
      await utils.sleep(100)
      this.$refs.elIonContent.$el.scrollToBottom(300)
      await utils.sleep(300)
      this.disableInfiniteScroll = false
      this.$refs.elIonContent.$el.scrollToBottom(100)
      await utils.sleep(500)
      this.noMoreMessages = false
    },
    
    clkProfileUser(){
      const userId =  this.userNameAndPhoto.userId
      this.$router.push('/userProfile?userId=' + userId )
    },
  
    getUserNamePhotoById() {
			const opt = {
        method: 'POST',
        route: '/mobile/messenger/getUserInfoById',
        body: {
					userId: this.$route.query.userId,
        }
      }
			useFetch(opt).then(r => {
        this.title = r.data.name
        this.userNameAndPhoto = r.data
				
      })
		},
    async getStatusUserConnection() {
			const opt = {
        method: 'POST',
        route: '/mobile/messenger/getStatusUserConnection',
        body: {
					userId: this.$route.query.userId,
          // _id: this.$route.query._idRelation
        }
      }
			useFetch(opt).then(r => {
        this.statusConnection = r.data.statusConnection
        if (r.data.statusConnection === 'connected')  {
          console.log('dentro do getStatusUserConnection se statusConnection === connected', r.data )
          this.getMessages()
          this.createRelationId()
          return
        }
      })
		},
    moreData (ev) {
      this.getMessages(ev)
    },
    
    getMessages (ev, lPosix, fromAnswer) {
      if (this.noMoreMessages) return
      const opt = {
        method: 'POST',
        route: '/mobile/workers/chat/getClassMessages',
        body: {
          classId: this.$route.query.classId,
          firstPosix: this.messages[0] ? this.messages[0].createdAt.createdAtPosix : null,
          lastPosix: lPosix ? lPosix : null,
          fromAnswer: fromAnswer ? true : false,
          page: this.page
        }
      }
			useFetch(opt).then(async r => {
        utils.loading.hide()
        if (r.data.length === 0) {
          this.noMoreMessages = true
          this.disableInfiniteScroll = true
          return
        }
        
        if (!fromAnswer) r.data.push(...this.messages)
        this.messages = r.data
        this.page++
        if (ev) ev.target.complete()
        else {
          if (!fromAnswer) this.scrollToBottom()
          else this.scrollToMessage()
        }
      })
    },
    insertMessage (file) {
      if (this.chatMessage.length < 1 && !file && !this.audioMessage) return
      let optTemMsg
      if (file.file) optTemMsg = { file: file.file }
      else optTemMsg = { message: this.chatMessage }
      const tempId = this.insertTemporaryMessage(optTemMsg)
      const opt = {
        method: 'POST',
        route: '/mobile/workers/chat/insertClassMessage',
        body: {
          classId: this.$route.query.classId,
					message: this.chatMessage,
          audioMessage: this.audioMessage
        }
      }
      if (file) {
        opt.file = [ file ]
      }
      if (this.isAnsweringMessage.isAnswering) {
        opt.body.answerMessage = {
          messageId: this.isAnsweringMessage.message._id,
          createdBy: {
            userId: this.isAnsweringMessage.message.createdBy.userId,
            name: this.isAnsweringMessage.message.createdBy.name,
          },
          createdAt: this.isAnsweringMessage.message.createdAt
        }
        if (this.isAnsweringMessage.message.messageData.file) {
          opt.body.answerMessage.filename = this.isAnsweringMessage.message.messageData.file.filename
          opt.body.answerMessage.mimetype = this.isAnsweringMessage.message.messageData.file.mimetype
        }
        else opt.body.answerMessage.message = this.isAnsweringMessage.message.messageData.message
      }
      this.chatMessage = ''
			useFetch(opt).then(r => {
        this.chatMessage = ''
        this.audioMessage = null
        this.substituteTempMessage(tempId, r.data)
        this.noMoreMessages = false
        utils.loading.hide()
        this.scrollToBottom()
        this.undoAnswerMessage()
      })
    },
    insertTemporaryMessage (opt) {
      const now = new Date()
      const tempId = now.getTime()
      const objMsg = {
        createdBy: this.userInfo,
        messageData: {},
        tempId,
        createdAt: {
          createdAtLocale: `${now.getDate()} ${now.getHours()}:${now.getMinutes()}`
        }
      }
      if (opt.message) objMsg.messageData.message = opt.message
      else objMsg.messageData.message = 'Carregando...'
      this.messages.push(objMsg)
      this.scrollToBottom()
      return tempId
    },
    substituteTempMessage (id, msgData) {
      this.messages.forEach((m, i) => {
        if (m.tempId === id) this.messages[i] = msgData
      })
    },
    newSolicitationToConnect() {
      const opt = {
        method: 'POST',
        route: '/messenger/newSolicitationToConnect',
        body: {
          userId: this.$route.query.userId,
        }
      }
      utils.loading.show()
			useFetch(opt).then(r => {
        utils.loading.hide()
        utils.toast('Sua solicitação foi feita. Aguarde ser aprovada.')
        this.newConnection = r.data
        this.$router.go(-1)
      })
		},
    getClassDetailById() {
      const opt = {
        route: '/mobile/workers/getClassDetailById',
        body: {
          classId: this.$route.query.classId
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.classDetail = r.data
        }
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