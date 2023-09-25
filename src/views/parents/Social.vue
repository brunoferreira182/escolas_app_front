<template>
  <ion-page>
    <ToolbarEscolas
      title="Social"
      :backButton="true"
    />

    <ion-content >
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
import SocialPost from '../../components/SocialPost.vue'
</script>

<script>
export default {
  data() {
    return {
      APP_NAME,
      page: 0,
      posts: []
    };
  },
  mounted () {
    this.startView()
  },
  methods: {
    backLogin() {
      this.$router.push('/login')
    },
    async startView () {
      await this.getPosts()
    },
    async getPosts (refreshPage) {
      if (refreshPage) this.page = 0
      const opt = {
        route: '/mobile/social/getPosts',
        body: {
          page: this.page
        }
      }
      const ret = await useFetch(opt)
      this.page++
      if (!refreshPage) this.posts = ret.data
      else this.posts.push(...ret.data)
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