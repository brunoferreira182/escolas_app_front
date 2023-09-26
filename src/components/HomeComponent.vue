<template>
  <ion-content style="">
    
    <div 
      id="main-menu" 
      style="
      display: flex; 
      justify-content: space-between; 
      margin-inline: 14px; 
      margin-block: 16px; 
      margin-bottom: 0;
      align-items: center;"
    >
      <div
        v-show="!showSearchBox"
        :class="{ 'animation-title': hideTitle, 'slideInLeft': slideIn, 'slideOutLeft': slideOut }"
        class="gradient-text"
      >
        Bem Cuidar
      </div>

      <ion-searchbar
        ref="searchbar"
        :debounce="200"
        v-if="showSearchBox"
        v-model="filterValue"
        class="search-box"
        :class="{ 'animation-input': showSearchBox, 'slideInRight': slideIn, 'slideOutRight': slideOut }"
        @ionInput="filterAds"
        placeholder="Buscar anúncios"
      />

      <ion-button fill="clear" @click="toggleSearch">
        <ion-icon style="scale: 1.2;;" src="/assets/search.svg" />
      </ion-button>
    </div>
    <ion-row style="margin-top: -10px;">
      <ion-col>
        <ion-button
          class="q-mx-sm announce-button"
          expand="block"
          @click="clkNewAd"
        >Anunciar serviços?</ion-button>
      </ion-col>
    </ion-row>
    <hr class="separator">
    <ion-refresher slot="fixed" @ionRefresh="refreshAds($event, true)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
    

    <div v-if="selectedCategory">
      <ion-card>
        <ion-card-content>
          <ion-card-subtitle style="color: var(--ion-color-primary)">Você está na categoria {{ selectedCategory.category }}</ion-card-subtitle>
          <div class="category-description">{{ selectedCategory.categoryDescription }}</div>
        </ion-card-content>
      </ion-card>
    </div>
    <div class="ion-padding q-mt-lg" style="color: var(--ion-color-primary)">Anúncios</div>
    <div v-for="item in announcesArray" :key="item">
      <AdCard :adData="item" @click="clkOpenAnnounce(item)"/>
    </div>

    <ion-infinite-scroll @ionInfinite="getAds($event)">
      <ion-infinite-scroll-content></ion-infinite-scroll-content>
    </ion-infinite-scroll>

    <ion-alert
      :is-open="dialogGuestUser.open"
      header="Para criar anúncios, é necessário registrar-se."
      :backdropDismiss="false"
      animated
      :buttons="[
        {
          text: 'Depois',
          handler: () => {
            dialogGuestUser.open = false
          }
        },
        {
          text: 'Registrar',
          handler: () => {
            acceptToRegister()
          }
        }
      ]"
    ></ion-alert>

    <ion-alert
      :is-open="dialogNotSubscriber.open"
      header="Para criar anúncios, é necessário preencher alguns dados."
      :backdropDismiss="false"
      animated
      :buttons="[
        {
          text: 'Depois',
          handler: () => {
            dialogNotSubscriber.open = false
          }
        },
        {
          text: 'Sim, vamos lá',
          handler: () => {
            confirmFillPersonalData()
          }
        }
      ]"
    ></ion-alert>

    <ion-alert
      :is-open="dialogSubscriptionNotActive.open"
      header="Sua assinatura não está ativa. Verifique no seu PERFIL se há alguma fatura pendente e tente novamente."
      :backdropDismiss="false"
      animated
      :buttons="[
        {
          text: 'Ok',
          handler: () => {
            dialogSubscriptionNotActive.open = false
          }
        },
        {
          text: 'Verificar assinatura',
          handler: () => {
            clkVerifySubscription()
          }
        }
      ]"
    ></ion-alert>

    <ion-modal :is-open="dialogChooseCategories">
      <ion-toolbar >
        <ion-buttons slot="start">
          <ion-button @click="clkCloseDialogCategories">Fechar</ion-button>
        </ion-buttons>
        <ion-title color="primary">O que você procura?</ion-title>
      </ion-toolbar>
      <ion-content class="ion-padding">
        
        <!-- <ion-row class="ion-text-center">
          <ion-button fill="clear" @click="dialogChooseCategories = false">
            Fechar
          </ion-button>
          <ion-text color="primary" class="q-mx-xs text-h6" >O que você procura?</ion-text>
        </ion-row> -->
        
        <img src="/public/assets/stickerModalCategories.svg" class="profile-avatar">
        <ion-row class="ion-text-center">
          <ion-col 
            v-for="item in categories" 
            :key="item"
          >
            <ion-button
              size="medium"
              :class="`round-buttons ${selectedCategoryId[0] === item._id ? 'gradient' : ''}`"
              shape="rounded"
              :fill="selectedCategoryId[0] === item._id ? 'solid' : 'outline'"
              expand="block"
              @click="setCategoryFilter(item)"
            >
              {{ item.category }}
            </ion-button>
          </ion-col>
        </ion-row>
        
      </ion-content>
    </ion-modal>

    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button @click="dialogChooseCategories = true">
        <ion-icon :icon="heart"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-content>
</template>

<script setup>
import { useFetch } from '../composables/fetch.js';
import utils from '../composables/utils.js';
import {
  IonContent,
  IonInput,
  IonLabel,
  IonButton,
  IonSearchbar,
  IonMenu,IonMenuToggle,IonMenuButton,
  IonImg,
  IonModal,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonButtons,
  IonAlert,
  IonIcon,
  useIonRouter, createAnimation, useBackButton,
  IonRow,
  IonRefresher, IonRefresherContent,
  IonInfiniteScroll, IonInfiniteScrollContent,
  IonGrid,IonCheckbox,
  IonCol, IonText,
  IonFab, IonFabButton,
  IonCard, IonCardContent, IonCardSubtitle
} from '@ionic/vue'
import { 
  menu,
  add,
  arrowBack,
  location,
  close,
  pencilOutline,
  personOutline,
  closeOutline,
  logOutOutline,
  trashOutline,
  heart
} from 'ionicons/icons';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/vue';
import 'swiper/css';
import { Pagination, Autoplay } from 'swiper';
import AdCard from '../components/AdCard.vue'
import { getHomeRefreshStatus ,setHomeRefreshStatus } from '../composables/store'

</script>

<script>
import { useSubscriptionDataStore } from '../stores/subscriptionData'
const subscriptionDataStore = useSubscriptionDataStore()

export default {
  name: 'HomeComponent',

  data () {
    return {
      modules: [Pagination, Autoplay],
      dialogGuestUser: {
        open: false,
      },
      categories: [],
      selectedCategoryId: [],
      selectedCategory: null,
      dialogNotSubscriber: { open: false },
      announcesArray: [],
      showSearchBox: false,
      slideIn: false,
      slideOut: false,
      filterValue: '',
      hasDocument: false,
      hideTitle: false,
      hasAddress: false,
      dialogChooseCategories: false,
      page: 0,
      subscriptionData: null,
      dialogSubscriptionNotActive: { open: false }
    }
  },

  mounted () {
    this.checkUserDocumentExists()
    this.checkUserAddressExists()
    this.verifySubscription()
    this.getCategories()
    const selectedCategory = this.getCategoryLocalStorage()
    console.log(selectedCategory)
    if (selectedCategory) {
      this.selectedCategoryId = [ selectedCategory.categoryId ]
      this.selectedCategory = selectedCategory
      this.getAds()
    } else this.dialogChooseCategories = true
  },
  watch: {
    $route(to) {
      if (to.path === '/tabs/home') {
        if (this.$route.query.postAction === 'newAd') {
          this.clkNewAd()
        } else if (this.$route.query.postAction === 'createGuestUser') {
          this.$router.push("/newAccount?postAction=createGuestUser")
        }
        if (getHomeRefreshStatus()) {
          this.getAds(null, true)
          setHomeRefreshStatus(false)
        }
        this.subscriptionData = subscriptionDataStore.getData
      }
    }
  },
  methods: {
    clkCloseDialogCategories () {
      this.page = 0
      this.getAds()
    },
    verifySubscription () {
      const opt = {
        route: '/mobile/subscription/getActiveSubscriptionFromUser',
      }
      useFetch(opt).then(r => {
        subscriptionDataStore.setData(r.data)
        this.subscriptionData = r.data
      })
    },
    clkVerifySubscription () {
      this.$router.push('/subscriptionDetail')
    },
    createGuestUser(){
      const opt = {
        route: '/auth/createGuestUser',
      }
      return useFetch(opt)
    },
    confirmFillPersonalData () {
      this.dialogNotSubscriber.open = false
      this.$router.push('/userPersonalData')
    },
    async clkNewAd () {
      const userData = await utils.getUserInfoByToken()
      if (userData.error) {
        utils.toast('Ocorreu um erro. Faça login novamente.')
        this.$router.replace('/login')
        return
      }
      if (userData.data.isGuestUser) {
        this.dialogGuestUser.open = true
        return
      } else if (!userData.data.isSubscriber) {
        this.dialogNotSubscriber.open = true
        return
      }
      if (userData.data.isSubscriber) {
        const subscriptionData = await this.getSubscriptionData()
        this.subscriptionData = subscriptionData.data
        if (this.subscriptionData.iuguData.active) this.$router.push('/newAd')
        else {
          this.dialogSubscriptionNotActive.open = true
        }
      }
    },
    async getSubscriptionData () {
      const opt = {
        route: '/mobile/subscription/getActiveSubscriptionFromUser'
      }
      return useFetch(opt)
    },
    acceptToRegister(){
      this.dialogGuestUser.open = false
      this.$router.push('/register?postAction=newAd')
    },
    toggleSearch() {
      if (this.showSearchBox) {
        this.slideOut = true;
        setTimeout(() => {
          this.showSearchBox = false;
          this.slideOut = false;
          this.slideIn = false;
          this.hideTitle = false;
        }, 500);
      } else {
        
        this.showSearchBox = true;
        this.slideIn = true;
        this.hideTitle = true;
        setTimeout(() => {
          this.$refs.searchbar.$el.setFocus()
        }, 500);
      }
    },
    clkPersonalData () { this.$router.push('/profileAddressAndDocument') },
    clkOpenAnnounce(item){
      const _id = item._id
      this.$router.push('/adDetail?adId=' + _id)
    },
    filterAds () {
      this.page = 0
      this.getAds(null, true)
    },
    refreshAds ($event) {
      this.page = 0
      this.getAds($event, true)
    },
    getAds (event, fromFilter) {
      // if (event) this.page++
      const location = this.getLocationFromLocalStorage()
      const opt = {
        route: '/mobile/feed/getListOfAdsByFilter',
        body: {
          coordinates: location,
          page: this.page,
          filterValue: this.filterValue,
          arrayCategories: this.selectedCategoryId
        }
      }
      useFetch(opt).then(r => {
        if (r.error) return
        if (event) event.target.complete()
        if (fromFilter) {
          this.announcesArray = r.data
        } 
        else this.announcesArray.push(...r.data)
        this.dialogChooseCategories = false
        if (r.data.length > 0) this.page++
      })
    },
    getLocationFromLocalStorage () {
      const locationRaw = window.localStorage.getItem('location')
      console.log(locationRaw, 'nada?')
      // switch(locationRaw){
      //   case undefined:
      //     this.$router.push('/editUserLocation')
      //     return
      //   break;
      //   case !locationRaw:
      //     this.$router.push('/editUserLocation')
      //     return
      //   break;
      //   case locationRaw && locationRaw !== undefined:
      //     const location = JSON.parse(locationRaw)
      //     return location
      // }
      if(!locationRaw){
        this.$router.push('/editUserLocation')
        return
      }
        const location = JSON.parse(locationRaw)
        return location
    },
    checkUserDocumentExists(){
      const opt = {
        route: '/mobile/profile/checkUserDocumentExists'
      }
      useFetch(opt).then(r => {
        if (r.error) return
        this.hasDocument = r.data
      })
    },
    checkUserAddressExists(){
      const opt = {
        route: '/mobile/profile/checkUserAddressExists'
      }
      useFetch(opt).then(r => {
        if (r.error) return
        this.hasAddress = r.data
      })
    },
    clkCardOptions(cardData, isPostOwner) {
      this.cardActionsMenu.data = cardData
      this.cardActionsMenu.isPostOwner = isPostOwner
      this.cardActionsMenu.open = true
      console.log(cardData, isPostOwner)
    },
    backButtonManager () {
      useBackButton(9, () => {
        if (this.openStory) this.openStory = false
        if (this.dialogImagePost.open) this.dialogImagePost.open = false
      })
    },
    clkImagePost (obj) {
      if (obj.imageType === 'link') return
      this.dialogImagePost.image = obj.image
      this.dialogImagePost.type = obj.type
      this.dialogImagePost.open = true
    },
    clkAttachment (link) {
      this.dialogBrowser.link = link
      const url = this.attachmentsAddress() + link
      console.log(url)
      // openURL(link, this.errorOpenAttch)
    },
    refreshPage (event) {
      console.log('deu refresh?')
      this.getPosts({ fromRefresh: true, event })
    },
    getUserProfileById() {
      const opt = {
        route: '/mobile/parents/profile/getUserProfileById'
      }
      useFetch(opt).then((r) => {
        if(!r.error) {
          this.userProfile = r.data
        } else {
          utils.toast("Ocorreu um erro, tente novamente.")
        }
      })
    },
    getPosts () {
      const opt = {
        method: 'POST',
        route: '/mobile/social/getPosts',
      }
			useFetch(opt).then(r => {
        if (r.error) return
        this.posts = r.data
      })
    },
    getCategories () {
      const opt = {
        route: '/mobile/feed/getCategories',
      }
			useFetch(opt).then(r => {
        if (r.error) return
        this.categories = r.data
      })
    },

    setCategoryFilter(item) {
      this.setCategoryLocalStorage(item)
      this.page = 0
      setTimeout(() => {
        if(this.selectedCategoryId[0] !== item._id) {
          this.selectedCategory = item
          this.selectedCategoryId = []
          this.selectedCategoryId.push(item._id)
          // this.dialogChooseCategories = false
        } else {
          this.selectedCategoryId = []
          this.selectedCategory = null
        } 
        this.getAds(null, true)
      },1)
    },
    setCategoryLocalStorage(category) {
      localStorage.setItem('selectedCategory', JSON.stringify(category))
    },
    getCategoryLocalStorage() {
      return JSON.parse(localStorage.getItem('selectedCategory'))
    }
  },
}
</script>

<style scoped>
ion-toolbar {
  --background: transparent
}
ion-card {
  --background: #fbf5ff;
}

.separator-div {
  background-color: rgb(204, 204, 204);
  height: 1px;
}
.animation-title {
  /* Defina sua animação para o título aqui */
}

.animation-input {
  /* Defina sua animação para o input aqui */
}

.slideInRight {
  animation: slideInRight 0.5s forwards;
}

.slideOutRight {
  animation: slideOutRight 0.5s forwards;
}

.slideInLeft {
  animation: slideInLeft 0.5s forwards;
}

.slideOutLeft {
  animation: slideOutLeft 0.5s forwards;
}

@keyframes slideInRight {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  0% {
    transform: translateX(0%);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0%);
    opacity: 1;
  }
}

@keyframes slideOutLeft {
  0% {
    transform: translateX(0%);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}
/* .{
  text-transform: none;
  height: 20px;
  width: 50%;
  margin-left: 0px;
  padding-left: 0px;
} */
.input-wrapper {
  border: 1px solid #ebebec;
  background-color: #cccccc;
  padding-left: 15px;
  width: 90%;
  border-radius: 0.5rem;
  margin-block: 10px;
}
.img-style {
  display: block;
  margin: 0 auto;
  object-fit: cover;
  order: 1;
  max-width:100%;
  max-height:300px;
  min-height:358px; 
  min-width:300px;
  width: auto;
  height: auto;
}
.bounce-enter-active {
  animation: bounce-in 1s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.text {
  display: -webkit-box; /* Define um layout flexível */
  -webkit-box-orient: vertical; /* Define a orientação vertical */
  overflow: hidden; /* Esconde qualquer conteúdo que ultrapasse as duas linhas */
  text-overflow: ellipsis; /* Adiciona reticências (...) ao final do texto que ultrapassa as duas linhas */
  -webkit-line-clamp: 2; /* Limita o texto a duas linhas */
  max-height: 2.7em;
}
.swiper-card {
  max-height: 200px;
  object-fit: cover;
  /* background: var(--ion-color-tertiary); */
}
.gradient-text {
  transition: opacity 0.5s;
  /* Create the gradient. */
  background-image: linear-gradient(to right, #8F79A1, #c078fc, #DBB9CE);
  
  /* Set the background size and repeat properties. */
  background-size: 100%;
  background-repeat: repeat;
  font-family: BickleyScript;
  font-size: 46px; 
  font-weight: 600;
  /* Use the text as a mask for the background. */
  /* This will show the gradient as a text color rather than element bg. */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; 
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
}
.round-buttons {
  padding: 0;
  margin: 0;
  /* width: 96px; */
  height: 96px;
  white-space: pre-wrap;
  --border-radius: 1rem;
  --background-activated: linear-gradient(to right,#c078fc, #869bf6);
}
.gradient {
  --background: linear-gradient(to right,#8F79A1, #DBB9CE);
  color: white;
}

.announce-button {
  --border-radius: 5rem;
  --background: linear-gradient(to right,#8F79A1, #DBB9CE);
}
.separator {
  border-top:1px solid #f4f4f4;
  margin-inline: 16px;
}
.category-image {
  border-radius: 0.675rem;

}
.category-description {
  color: #a4a4a4;
  font-size: small;
}
</style>