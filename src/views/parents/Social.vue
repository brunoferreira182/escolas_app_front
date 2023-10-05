<template>
  <ion-page>
    <ToolbarEscolas
      title="Social"
      :backButton="false"
    />
    <ion-content color="light">
      <swiper 
        :modules="modules"
        :slides-per-view="1.1" 
        :loop="true"
        :autoplay="true"
        :pagination="true"
      >
        <swiper-slide  
          v-for="(event, i) in eventPosts"
          :key="event._id"
        >
          <PostLight
            :event="event"
            :i="i"
          />
        </swiper-slide>
      </swiper>
      <SocialPost
        v-for="(post, i) in posts"
        :key="post._id"
        :post="post"
        :i="i"
      />
    </ion-content>
  </ion-page>
</template>
<script setup>

import {
  IonPage,
  IonButton,
  IonContent,
  IonImg,
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../../composables/variables';
import { defineComponent } from 'vue';
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { useFetch } from '@/composables/fetch';
import PostLight from '../../components/PostLight.vue'
import SocialPost from '../../components/SocialPost.vue'
import 'swiper/css/pagination';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/vue';
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
      APP_NAME,
      page: 1,
      modules: [Pagination, Autoplay],
      rowsPerPage: 10,
      posts: [],
      eventPosts: [],
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
      await this.getEventPosts()
    },
    async getEventPosts (refreshPage) {
      if (refreshPage) this.page = 0
      const opt = {
        route: '/mobile/social/getEventPosts',
        body: {
          page: this.page,
          rowsPerPage: this.rowsPerPage
        }
      }
      const ret = await useFetch(opt)
      // this.page++
      if (!refreshPage) this.eventPosts = ret.data.list
      else this.eventPosts.push(...ret.data.list)
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
      if (!refreshPage) this.posts = ret.data.list
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