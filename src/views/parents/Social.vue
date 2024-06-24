<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ APP_NAME }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">
            {{ APP_NAME }}
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <swiper 
        class="q-my-md"
        :modules="modules"
        :slides-per-view="notesList.length === 1 ? 1 : 2"
        :spaceBetween="0.5"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: false,
        }"
        :pagination="true"
      >
        <swiper-slide  
          v-for="(note, i) in notesList"
          :key="note._id"
        >
          <PostSchoolNotes
            :note="note"
            :i="i"
            
          />
        </swiper-slide>
      </swiper>
      <swiper 
        :modules="modules"
        :slides-per-view="storiesPosts.length === 1 ? 1 : 1.1"
        :spaceBetween="1"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: false,
        }"
        :pagination="true"
      >
        <swiper-slide  
          v-for="(story, i) in storiesPosts"
          :key="story._id"
        >
          <PostLite
            :story="story"
            :i="i"
          />
        </swiper-slide>
      </swiper>
      <SocialPost
        v-for="(post, i) in posts"
        :key="post._id"
        :post="post"
        @getPosts="getPosts"
        :i="i"
      />

    </ion-content>
  </ion-page>
</template>
<script setup>

import {
  IonPage,
  IonContent,
  IonTitle,
  IonToolbar,
  IonHeader,
} from '@ionic/vue';
import { APP_NAME } from '../../composables/variables';
import { toastController } from '@ionic/vue';
import { useFetch } from '@/composables/fetch';
import PostLite from '../../components/PostLite.vue'
import PostSchoolNotes from '../../components/PostSchoolNotes.vue'
import SocialPost from '../../components/SocialPost.vue'
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
</script>

<script>
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  name: 'Social',
  data() {
    return {
      page: 1,
      modules: [Pagination, Autoplay],
      rowsPerPage: 10,
      posts: [],
      notesList: [],
      userNotes: '',
      noteString: '',
      storiesPosts: [],
    };
  },
  mounted () {
    this.startView()
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsParents/social') {
        this.startView()
      }
    }
  },
  methods: {
    backLogin() {
      this.$router.push('/login')
    },
    async startView () {
      await this.getPosts()
      await this.getUserNotes()
      await this.getStories()
    },
    async getUserNotes() {
      const opt = {
        route: '/mobile/parents/profile/getUserNotesList',
        body: {
          onlyNotRead: true,
          doNotUpdate: true
        }
      }
      try {
        const response = await useFetch(opt)
        if (response.data.count.length > 0 && response.data.count) {
          this.userNotes = response.data.count[0].count;
          const toast = await toastController.create({
            message: `Você tem ${this.userNotes} recado${this.userNotes > 1 ? 's' : ''}`,
            duration: 3000,
            position: 'top',
            color: "primary",
            buttons: [
              {
                text: 'Ver Recados',
                handler: () => {
                  this.$router.push('/userNotesList'); 
                }
              }
            ] 
          })
          await toast.present();
        }
      } catch (error) {
        console.error('Error fetching user notes:', error);
      }
    },
    async getStories (refreshPage) {
      if (refreshPage) this.page = 0
      const opt = {
        route: '/mobile/social/getStories',
        body: {
          page: this.page,
          rowsPerPage: this.rowsPerPage
        }
      }
      const ret = await useFetch(opt)
      // this.page++
      if (!refreshPage) this.storiesPosts = ret.data.list
      else this.storiesPosts.push(...ret.data.list)
      return
    },
    async getPosts (refreshPage) {
      if (refreshPage) this.page = 0
      const opt = {
        route: '/mobile/social/getPosts',
        body: {
          page: this.page,
          rowsPerPage: this.rowsPerPage
        }
      }
      const ret = await useFetch(opt)
      // this.page++
      if (!refreshPage) {
        if(ret.data.list) {
          console.log("🚀 ~ getPosts ~ ret.data.list:", ret.data.list)
          this.posts = ret.data.list
        }
      }
        else this.posts.push(...ret.data.list)
      return
    },
  }
}

</script>

<style scoped>





.q-carousel__slide {
  padding-right: 0%;
  padding-left: 0%;
}
.login-logo {
  /* width: 12em; */
  height: 19em;
}
.login-logo-letters {
  font-weight: 600;
  color: var(--ion-color-primary);
  font-size: 35px;
  translate:0 20px;
}
</style>