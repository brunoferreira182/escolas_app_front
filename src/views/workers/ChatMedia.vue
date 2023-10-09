<template>
  <ion-page>
    <ToolbarEscolas
      title="Mídia"
      :backButton="true"
    />
    <ion-content ref="elIonContent" color="light">
      <ion-card v-for="photo in mediaData" :key="photo">
        <img style="width: 378px; height: 378px;" :src="utils.makeFileUrl(photo.image)" class="profile-avatar">
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
import {
IonPage, IonContent,
IonCard
} from '@ionic/vue'
</script>
<script>
import { useFetch } from '@/composables/fetch';
export default {
  data() {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      mediaData: null
    };
  },
  mounted () {
    this.getChatMedia()
  },
  methods: {
    getChatMedia() {
      const opt = {
        route: '/mobile/workers/chat/getClassChatImages',
        body: {
          classId: this.$route.query.classId,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente mais tarde")
          return
        }
        this.mediaData = r.data.list
      })
    }
  }
}
</script>