<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>
          {{ APP_NAME }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">
            {{ APP_NAME }}
          </ion-title>
          
        </ion-toolbar>
        <Transition name="slide-fade">
          <div class="q-px-md" v-if="currentViewName === 'parent' ">
            Familiar
          </div>
          <div v-else class="q-px-md">
            Funcionário
          </div>
        </Transition>
      </ion-header>
      <div class="q-mx-sm q-mt-md">
        <ion-chip
          v-for="(filter, i) in filterTypes"
          :key="i"
          @click="clkFilterPosts(filter)"
          :outline="filter.type !== selectedFilter.type"
          :color="filter.type === selectedFilter.type ? 'success' : 'primary'"
        >{{ filter.label }}</ion-chip>
      </div>
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
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)" :pull-factor="0.5" :pull-min="100" :pull-max="200">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <SocialPost
        v-for="(post, i) in posts"
        :key="post._id"
        :post="post"
        @getPosts="getPosts"
        :i="i"
      />

      <ion-infinite-scroll @ionInfinite="bottomOfPage" v-if="showInfiniteScroll">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>

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
  IonRefresher, IonRefresherContent,
  IonChip,
  IonNote,
  IonInfiniteScroll, IonInfiniteScrollContent
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
import { useCurrentView } from '@/stores/currentView'
import 'swiper/css'
import utils from '../../composables/utils.js';
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
      filterTypes: [
        { label: 'Todos', type: 'all' },
        { label: 'Público', type: 'public' },
        { label: 'Meus posts', type: 'private' },
      ],
      selectedFilter: {
        label: 'Todos',
        type: 'all'
      },
      showInfiniteScroll: true
    };
  },
  computed: {
    currentViewName() {
      return useCurrentView().currentView;
    }
  },
  mounted() {
    this.startView();
  },
  watch: {
    $route(to, from) {
      if (to.path === '/tabsLayout/social') {
        this.startView();
      }
    }
  },
  methods: {
    clkFilterPosts(filter) {
      this.selectedFilter = filter;
      this.page = 1;
      this.posts = [];
      this.getPosts(true);
    },
    async verifyNewContent() {
      const opt = {
        route: '/mobile/social/verifyNewContent',
        body: {
          posixLastContent: this.posts[0].createdAt.createdAtPosix
        }
      }
      const ret = await useFetch(opt);
      if (ret.error) return;
      this.newContent = ret.data;
    },
    backLogin() {
      this.$router.push('/login');
    },
    async startView() {
      this.getPosts(null);
      this.getUserNotes();
      this.getStories();
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
        const response = await useFetch(opt);
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
          });
          await toast.present();
        }
      } catch (error) {
        console.error('Error fetching user notes:', error);
      }
    },
    async getStories(refreshPage) {
      if (refreshPage) this.page = 0;
      const opt = {
        route: '/mobile/social/getStories',
        body: {
          page: this.page,
          rowsPerPage: this.rowsPerPage
        }
      }
      const ret = await useFetch(opt);
      if (!refreshPage) this.storiesPosts = ret.data.list;
      else this.storiesPosts.push(...ret.data.list);
      return;
    },
    async refresh($event) {
      this.page = 1;
      await utils.sleep(500);
      this.getPosts($event);
    },
    async bottomOfPage() {
      this.page++;
      await this.getPosts(null);
    },
    async getPosts($event) {
      this.showInfiniteScroll = true;
      const opt = {
        route: '/mobile/social/getPosts',
        body: {
          page: this.page,
          rowsPerPage: this.rowsPerPage,
          scope: this.selectedFilter.type
        }
      }
      const ret = await useFetch(opt);
      if ($event) {
        if (ret.data.list) {
          this.posts = ret.data.list;
        }
        try { $event.target.complete(); }
        catch (e) { console.log('vindo do filtro'); }
      } else this.posts.push(...ret.data.list);
      if (ret.data.list.length < this.rowsPerPage) this.showInfiniteScroll = false;
      return;
    }
  }
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(50px);
  opacity: 0;
}


.q-carousel__slide {
  padding-right: 0%;
  padding-left: 0%;
}
.login-logo {
  height: 19em;
}
.login-logo-letters {
  font-weight: 600;
  color: var(--ion-color-primary);
  font-size: 35px;
  translate:0 20px;
}
</style>
