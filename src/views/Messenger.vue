<template>
  <ion-page>
    <ToolbarEscolas
      title="Mensagens"
      :backButton="true"
    />
    <ion-content>
      <ion-list v-if="resumeMessages.length > 0 " lines="full">
        <ion-item 
          v-for="item in resumeMessages"
          :key="item._id.userId"
          button 
          detail="false"
          @click="clkConectedUser(item)"
        >
          <ion-avatar>
            <img :src="utils.generateProfileImage(item._id.userId)"/>
          </ion-avatar>
          <ion-label class="q-pl-md">
            <h4>{{ item._id.name }}</h4>
            <p>	
              <span v-if="item.messages.userId === userInfo.userId">Você: </span>
              {{ item.messages.message }} 
            </p>
          </ion-label>
          <ion-label slot="end" class="ion-text-end">
            <p>{{ item.messages.timestamps.createdAtInFullShort }}</p>
            <p>{{ item.messages.timestamps.createdAtLocale.split(' ')[1] }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <div
        style="color:var(--ion-color-medium);margin-top: 80px;"
        class="ion-padding ion-text-center q-mt-xl"
        v-if="resumeMessages.length === 0"
      >Você ainda não possui nenhuma mensagem.</div>


    </ion-content>
  </ion-page>
</template>
<script setup>
import {
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonPage, IonContent,
  IonItem, IonLabel, IonList, IonAvatar,
  IonSearchbar,
  alertController,
  IonHeader,
  IonToolbar,
  IonProgressBar
} from '@ionic/vue';
import { chatboxEllipsesOutline, peopleOutline, personAddOutline } from 'ionicons/icons'
import { defineComponent } from 'vue'
import { io } from "socket.io-client"
import ToolbarEscolas from '../components/ToolbarEscolas.vue'

import { useFetch } from '../../src/composables/fetch.js'
import utils from '../../src/composables/utils.js'
import { masterServerRoute } from '../composables/masterServerRoutes'
import { COMPANY_ID } from '../composables/variables'
</script>
<script>

export default defineComponent({
  name: 'Messenger',
  data () {
    return {
      utils,
      btnLoading: false,
      dialogDetailWaitingCnt: false,
      userInfo: '',
      filterValue: '',
      filterValueSolicitation: '',
      messagesLoaded: false,
      text:'',
      users: [],
      messages: [],
      message: '',
      resultSearch: [],
      usersConnected: [],
      showSolicitationsResult: false,
      showConnectedResult: false,
      newConnection: [],
      resultSearchSolicitation: {
        allUsers: [],
      },
      myConnectionsSolicitations: {
        toMe: [],
        fromMe: [],
        connected: []
      },
      resumeMessages: [],
      socket: null,
      progressBar: false
    }
  },
  mounted () {
    utils.loading.clear()
    this.userInfo = utils.presentUserInfo()
    this.getResumeMessages()
    this.startView()
    this.startSocket()
    // if (this.$route.query.tab) this.tab = this.$route.query.tab
  },
  beforeUnmount () {
    console.log('no before unouubnt')
    this.socket.disconnect()
  },
  watch: {
    $route(to,from) {
      if (to.path === '/messenger') {
        this.startView()
      }
    }
  },
  methods: {
    startView () {
      this.userInfo = utils.presentUserInfo()
      this.getResumeMessages()
    },
    startSocket: async function () {
      console.log('no tart socket')
      const opt = {
        query: {
          type: 'messengerResume',
          userId: this.userInfo.userId
        }
      }
      this.socket = io(masterServerRoute(), opt)
      this.socket.on('newMessage', msg => { this.getResumeMessages() })
    },
    clkConnectionSearchResult (item) {
      console.log(item)
      this.$router.push('/messengerChat?userId=' + item.arrayUsers.userId)
    },
    getResumeMessages () {
      const opt = {
        route: '/mobile/messenger/getResumeMessages'
      }
      useFetch(opt).then(r => {
        this.resumeMessages = r.data
      })
    },
    confirmApproveReproveConnectionSolicitation (type,id) {
      const opt = {
        route: '/messenger/changeStatusConnectionSolicitation',
        body: {
          newStatus: type,
          solicitationId: id
        }
      }
      utils.loading.show()
      useFetch(opt).then(() => {
        utils.loading.hide()
        this.getConnectionsSolicitations()
      })
    },
    clkApproveReproveConnection: async function (item) {
      console.log('aceito', item)
      const alert = await alertController.create({
          header: 'Permite que ' + item.messenger.connectionSolicitation.from.name + ' se conecte a você?',
          subHeader: 'Vocês poderão conversar após a aprovação',
          buttons: [
            {
              text: 'Negar',
              handler: () => {
                this.confirmApproveReproveConnectionSolicitation('declined',item._id)
              },
            },
            {
              text: 'Permitir',
              role: 'confirm',
              handler: () => {
                this.confirmApproveReproveConnectionSolicitation('accepted',item._id)
              },
            },
          ],
        });
        await alert.present();

    },
    // getStatusUserConnection() {
    // 	const opt = {
    //     method: 'POST',
    //     route: '/messenger/getStatusUserConnection',
    //     body: {
    // 			userId: this.messengerDetailDialog.details.arrayUsers.userId,
    //     }
    //   }
    // 	useFetch(opt).then(r => {
    //     this.newConnection = r.data
    //   })
    // },
    getConnectionsSolicitations() {
      const opt = {
        method: 'POST',
        route: '/messenger/getConnectionsSolicitations',
      }
      useFetch(opt).then(r => {
        // utils.loading.hide()
        this.myConnectionsSolicitations = r.data
      })
    },
    getUsersConnectedByString(event) {
      if (event.target.value.toLowerCase().length > 2) {
        const opt = {
          method: 'POST',
          route: '/messenger/findConnectionsByString',
          body: {
            filterValue: event.target.value.toLowerCase(),
          }
        }
        this.progressBar = true
        useFetch(opt).then(r => {
          this.progressBar = false
          this.resultSearch = r.data
          this.showConnectedResult = true
        })
      } else if (event.target.value.toLowerCase().length <= 2) {
        this.showConnectedResult = false
      }
    },
    getUsersByStringTotal(event) {
      if (event.target.value.toLowerCase().length > 2) {
        const opt = {
          route: '/messenger/findUsersByString',
          body: {
            searchString: event.target.value.toLowerCase(),
            searchProfiles: true
          }
        }
        this.progressBar = true
        useFetch(opt).then(r => {
          this.progressBar = false
          this.resultSearchSolicitation = r.data
          this.showSolicitationsResult = true
        })

      } else if (event.target.value.toLowerCase().length <= 2) {
        this.showSolicitationsResult = false
      }

    },
    // getUsersByStringSolicitation() {
    // 	const opt = {
    //     method: 'POST',
    //     route: '/messenger/findUsersByString',
    //     body: {
    // 			searchString: this.filterValueSolicitation,
    //     }
    //   }
    // 	this.btnLoading = true
    // 	useFetch(opt).then(r => {
    // 		this.btnLoading = false
    //     this.resultSearchSolicitation = r.data
    // 		this.showResult = true
    //   })
    // },
    // getUsersConnectedById () {
    // 	const opt = {
    //     method: 'POST',
    //     route: '/messenger/getUsersConnectedById',
    //     body: {
    //       userId: this.$route.query.userId
    //     }
    //   }
    // 	useFetch(opt).then(r => {
    //     this.usersConnected = r.data
    //   })
    // },
    clkConnectionSolicitation: async function () {
      const alert = await alertController.create({
          header: 'Atenção',
          message: 'Você deve aguardar essa pessoa aceitar o seu pedido de conexão.',
          buttons: ['OK'],
        })
        await alert.present();
      
    },
    clkConectedUser (item) {
      console.log(item)
      const userId = item.arrayUsers ? item.arrayUsers.userId : item._id.userId
      this.$router.push('/messengerChat?userId=' + userId)
    },
    clkSearchResult (item) {
      const userId = item.userId
      this.$router.push('/messengerChat?userId=' + userId)
    },
    changeSlideTo() {
      console.log(this.$el.querySelector("ion-segment").value)
      this.slide = this.$el.querySelector("ion-segment").value
    }
  }
});
</script>
