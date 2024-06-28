<template>
  <ion-page>
    <ToolbarEscolas
      title="Chat atendimento"
      :backButton="true"
    />

    <ion-content ref="elIonContent" color="light">
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
          <div
            v-for="(message, msgIndex) in messages"
            :key="message._id"
            :id="message._id"
          >
            <ion-item-sliding>
              <ion-item lines="none">
                <ion-row :slot="message.createdBy.userId === userInfo.userId ? 'end' : 'start'" >
                  <div
                    :class="`chat-message ${message.tempId ? 'sent-temp-message' : message.createdBy.userId === userInfo.userId ? 'sent-message': 'received-message'} q-ma-xs q-pa-sm ${blinkMessageId === message._id ? 'blink-bg' : ''}`"
                  >
                    <div
                      v-if="message.messageFile && message.messageFile.filename"
                      class="ion-flat-left q-mb-xs text-caption"
                    >
                      {{ message.name }}
                      <span
                        class="ion-float-right text-caption q-ml-sm"
                        @click="clkAttachment(message)"
                      >
                        Baixar
                      </span>
                    </div>
                    
                    <ion-card v-if="message.answerMessage" style="margin: 0; padding: 3px;box-shadow:none" @click="clkAnswer(message)">
                      <div>{{ message.answerMessage.createdBy.name }}:</div>
                      <div v-if="message.answerMessage.message">{{ message.answerMessage.message }}</div>
                      <div v-else>Arquivo</div>
                    </ion-card>
                    <div 
                      v-if="message.messageFile && 
                      Object.keys(message.messageFile).length > 0"
                    >
                      <img
                        v-if="message.messageFile.mimetype && message.messageFile.mimetype.includes('image')" style="border-radius:0.5rem;"
                        :src="utils.attachmentsAddress() + message.messageFile.filename"
                        @click="openImageModal(message)"
                      >
                      <span v-else style="display:flex;align-items: center;" @click="clkAttachment(message)">
                        <ion-icon size="small" :icon="attach"></ion-icon>
                        <span>{{ message.messageFile.originalname }}</span>
                      </span>
                      <div v-if="message.imageCaption">
                        {{ message.imageCaption }}
                      </div>
                    </div>
                    <div v-else>
                      <div class="ion-flat-left q-mb-xs text-caption">
                        {{ message.name }}
                      </div>
                      <div class="q-px-xs ion-text-wrap">{{ message.messageText }}</div>
                    </div>
                    <span
                      class="ion-float-right q-mt-xs text-caption q-ml-sm"
                      v-if="message.createdAt"
                    >{{ message.hour }}
                    </span>
                  </div>
                </ion-row>
              </ion-item>
              <!-- <ion-item-options 
                :side="message.createdBy.userId === userInfo.userId ? 'end' : 'start'" 
              >
                <ion-item-option 
                  style="text-transform: none; border-radius: .5rem;" 
                  color="danger" 
                  @click="clkMessage(message, msgIndex)" 
                  >Detalhes
                </ion-item-option>
              </ion-item-options> -->
            </ion-item-sliding>
            <!-- <ion-popover side="top" :is-open="popoverOpen" @didDismiss="popoverOpen = false">
              <ion-content class="ion-padding">
                <ion-icon :icon="play" @click="reactToMsg(message)"></ion-icon>
              </ion-content>
            </ion-popover> -->
          </div>
        </ion-list>
        
      </div>
    </ion-content>
    <ion-footer style="background-color: var(--ion-color-step-50, #f7f7f7);">
      <form >
        <ion-row
          class="q-mx-xs ion-align-items-end"
          style="padding-bottom: var(--ion-safe-area-bottom)"
        >
          <ion-col size="10">
            <ion-item lines="none" style="border-radius: 15px;align-items: center;">
              <ion-textarea
                @ionFocus="scrollToBottom"
                v-model="chatMessage"
                auto-grow rows="1"
                class="chat-input q-mb-xs"
              >
              </ion-textarea>
              <ion-button
                mode="ios"
                class="q-mr-xs"
                fill="clear"
                size="small"
                style="scale: 1.3;"
                v-if="chatMessage === ''"
                shape="circle"
                @click="clkAddAttachment"
              >
                <ion-icon slot="icon-only" :icon="attach"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-col>
          <ion-col size="2" style="display:flex;justify-content: center;">
            <ion-button
              @mousedown="$event.preventDefault()"
              @click="insertMessage({})"
              size="small"
              shape="circle"
              :disabled="chatMessage === ''"
            >
              <ion-icon slot="icon-only" :icon="send"></ion-icon>
            </ion-button>
            <!-- <ion-button v-else size="small" shape="circle" @click="clkRecord">
              <ion-icon style="scale: 1.3;" slot="icon-only" :icon="mic"></ion-icon>
            </ion-button> -->
          </ion-col>
        </ion-row>
      </form>
    </ion-footer>
    <PhotoHandler
      v-show="startPhotoHandler"
      :start="startPhotoHandler"
      :allFiles="true"
      :noCrop="false"
      :acceptImageCaption="true"
      @captured="captured"
      @cancel="cancelPhotoHandler"
    />
    <ModalPinchZoomImage
      :modalImageUrl="modalImageUrl"
      :showModal="showModal"
      @closeModal="showModal = false"
    />

  </ion-page>
</template>
<script setup>

import ToolbarEscolas from '../components/ToolbarEscolas.vue'
import PhotoHandler from '../components/PhotoHandler.vue'
import { send, attach, mic, play, pause, download} from 'ionicons/icons';
import { Browser } from '@capacitor/browser';
import utils from '../../src/composables/utils.js';
import {
  IonPage, IonContent,
  IonInfiniteScroll, IonInfiniteScrollContent,
  IonCard, IonIcon, IonRange, IonLabel,
  IonRow, IonItem, IonItemOption, IonItemOptions,
  IonItemSliding, IonList, IonTextarea,
  IonPopover,
  IonHeader,
  IonTitle,
  
  IonToolbar,
  IonModal,
  IonButtons,
  IonButton, IonCol, IonFooter, alertController,
} from '@ionic/vue'
import ModalPinchZoomImage from '../components/ModalPinchZoomImage.vue'
import { ref } from 'vue';
const showModal = ref(false);
const modalImageUrl = ref(null);

const openImageModal = (message) => {
  modalImageUrl.value = utils.makeFileUrl(message.messageFile.filename);
  showModal.value = true;
};
</script>

<script >
import { useFetch } from '@/composables/fetch';
export default {
  name:'SolicitationChat',

  data() {
    return {
      showModal: false,
      presentingElement: null,
      modalEditImageCaption:{
        open: false,
        messageData: '',
        newImageCaption: '',
        msgIndex: '',
      },
      modalImageUrl: null,
      classDetail: null,
      title: '',
      isAnsweringMessage: {
        isAnswering: false,
        message: {}
      },
      // popoverOpen: false,
      answerClickedId: null,
      blinkMessageId: null,
      startPhotoHandler: false,
      step: 'initial',
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
      canSendMessage: false,
      userInfo: '',
      statusConnection: '',
      messages: [],
      message: '',
      page: 0,
      usersReadersMsg: [],
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
      audioIcon: 'play',
      modalLastMessage: false,
    };
  },
  watch: {
    $route (to, from) {
      if (to.path === '/chatDetail') {
        this.startView()
      }
    }
  },
  mounted () {
    this.startView()
  },
  methods: {
    extrairURL(texto) {
      const regex = /(https?:\/\/[^\s]+)/g;
      const matches = texto.match(regex);
      if (matches && matches.length > 0) {
          return matches[0]; // Retorna a primeira URL encontrada na mensagem
      } else {
        return ''; // Retorna uma string vazia se nenhuma URL for encontrada
      }
    },
    abrirURL(msgUrl){
      const url = msgUrl
      Browser.open({ url: url })
    },
    
    async clkAttachment (message) {

      const retDownload = await utils.downloadFile({
        filename: message.messageFile.filename,
        originalname: message.messageFile.originalname
      })
    },
    startView() {
      this.getMessages()
      this.userInfo = utils.presentUserInfo()
    },

    clkAnswer (answer) {
      let foundMsg = false
      this.messages.forEach(msg => {
        if (msg._id === answer.answerMessage.messageId) foundMsg = true
      })
      this.answerClickedId = answer.answerMessage.messageId
      if (!foundMsg) {
        utils.loading.show()
        this.getClassMessages(null, answer.answerMessage.createdAt.createdAtPosix, true)
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
    // reactToMsg (msg) {
    //   this.$refs.listAnswerMsg.$el.closeSlidingItems()
    //   const opt = {
    //     route: '/mobile/messenger/insertReactionToChatMsg',
    //     body: {
		// 			messageId: msg._id,
    //     }
    //   }
		// 	useFetch(opt).then(r => {
    //     utils.toast("Mensagem curtida!")
    //   })
    // },
    // async clkMessage (message, msgIndex) {
    //   this.$refs.listAnswerMsg.$el.closeSlidingItems()
    //   const d = `Data: ${message.createdAt.createdAtInFullLong} de  ${message.createdAt.createdAtYear}`
    //   const buttons = [{ text: 'Voltar', role: 'cancel' }]
    //   if (message.createdBy.userId === this.userInfo.userId) {
    //     buttons.push({
    //       text: 'Apagar mensagem',
    //       role: 'confirm',
    //       handler: () => {
    //         this.clkDeleteMessage(message._id)
    //       },
    //     },
    //   )
    //   }
    //   const alert = await alertController.create({
    //     header: 'Detalhe',
    //     message: d,
    //     buttons
    //   });
    //   await alert.present();
    //   this.getClassChatMessageReadConf(message);
    // },
    clkDeleteMessage (messageId) {
      const opt = {
        route: '/mobile/messenger/deleteMessage',
        body: {
					messageId,
        }
      }
			useFetch(opt).then(() => {
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
    captured(img, imgBlob, fileName, imageCaption) {
      this.step = 'initial'
      this.startPhotoHandler = false
      this.insertMessage({
        file: imgBlob,
        name: fileName,
        imageCaption
      })
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
      this.step = 'initial'
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
      if (msg.length === 0 || msg[0].createdBy.userId === this.userInfo.userId) return
      this.messages.push(...msg)
      this.scrollToBottom()
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

    moreData (ev) {
      this.getMessages(ev, null, null, this.messages[0].createdAt.createdAtPosix)
    },
    async getMessages (ev, lPosix, fromAnswer, fPosix) {
      if (this.noMoreMessages) return
      const opt = {
        method: 'POST',
        route: '/mobile/solicitations/getMessages',
        body: {
          solicitationId: this.$route.query.solicitationId,
          firstPosix: fPosix,
          lastPosix: lPosix ? lPosix : null,
          fromAnswer: fromAnswer ? true : false,
          page: this.page
        }
      }
			const r = await useFetch(opt)
      utils.loading.hide()
      if (!r.data || r.data.length === 0) {
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
    },
    async insertMessage (file) {
      if (this.chatMessage.length < 1 && !file.file && !this.audioMessage) return
      let optTemMsg
      if (file.file) optTemMsg = { file: file.file }
      else optTemMsg = { message: this.chatMessage, _id: 'aaa' }
      const tempId = this.insertTemporaryMessage(optTemMsg)

      const routeSplit = this.$route.path.split('/')[1]
      const type = routeSplit === 'solicitationChatParent' ? 'parentMessage' : 'workerMessage'
      
      const opt = {
        route: '/mobile/solicitations/newMessage',
        body: {
          solicitationId: this.$route.query.solicitationId,
					message: this.chatMessage,
          audioMessage: this.audioMessage,
          type
        }
      }
      if (file.file) {
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
			const r = await useFetch(opt)
      this.chatMessage = ''
      this.audioMessage = null
      this.substituteTempMessage(tempId, r.data)
      this.noMoreMessages = false
      utils.loading.hide()
      this.scrollToBottom()
      this.undoAnswerMessage()
      // this.messages.push(r.data)
      // this.getMessages()
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
        },
        _id: tempId
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


  }
}
</script>
<style scoped>
.buttons-edit-image-caption{
  position: fixed;
  width: 90%;
  bottom: 10px;
}
.input-wrapper {
  border: 1px solid #ebebec;
  border-radius: 0.5rem;
  margin-block: 10px;
}
.container-img {
  max-width: 100%;
  max-height: 100%;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ion-modal-image {
  --height: 50%;
  --border-radius: 16px;
  --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
ion-modal::part(backdrop) {
  background: rgb(31, 32, 32);
  opacity: 1;
}
ion-modal ion-toolbar {
  --background: rgb(29, 29, 29);
  --color: white;
}

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
  background-color: rgb(197, 255, 197);
}
.sent-temp-message {
  border-width: 2px;
  border-style: solid;
  border-color: var(--ion-color-primary)
}

.received-message {
  margin-left: -10px;
  background-color: rgb(221, 221, 221);
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