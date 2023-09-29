<template>
  <ion-page>
    <ToolbarEscolas
      title="Postagem"
      :backButton="true"
    />
    <ion-content>
      <HeaderComponent
        title="Voltar"
      />
      <ion-list >
        <ion-item
          v-for="item in reactions"
          :key="item._id"
          lines="none"
          button
        >
          <!-- <ion-avatar slot="start">
            <img :src="utils.attachmentsAddress() + item.createdBy.profilePhoto" />
          </ion-avatar> -->
          <ion-label class="ion-no-margin">
            <h6>{{item.createdBy.name}}</h6>
          </ion-label>
          <ion-label slot="end">
            <ion-icon color="secondary" size="large" :src="item.reaction" />
          </ion-label>
        </ion-item>
        <div v-if="!noMoreData" style="display: flex;justify-content: center;">
          <ion-button
            fill="clear"
            color="secondary"
            @click="clkLoadMore"
          >
            Carregar mais
          </ion-button>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonRow, IonGrid,
  IonContent, IonAvatar, IonButton, IonItem, IonList, IonLabel,
  IonIcon
} from '@ionic/vue';
import { send } from 'ionicons/icons';
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'
import HeaderComponent from '../../components/HeaderComponent.vue'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
</script>

<script>

export default {
  name: "PostComments",
  beforeMount: async function () {
    this.getPostReactions()
  },
  data() {
    return {
      utils,
      send,
      reactions: [],
      page: 1,
      rowsPerPage: 10,
      noMoreData: false,
      loading: false
    };
  },
  methods: {
    clkLoadMore () {
      this.page++
      this.getPostReactions()
    },
    getPostReactions() {
      const opt = {
        route: '/mobile/social/getReactionsByPostId',
        body: {
          postId: this.$route.query.postId,
          page: this.page,
          rowsPerPage: this.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        this.loading = false
        if (!r.error) {
          if (r.data.list.length === 0) {
            this.noMoreData = true
            return
          }
          this.reactions = r.data.list
          return
        }
        utils.toast("Ocorreu um erro, tente novamente.")
      })
    },
  }
};
</script>

<style scoped>
ion-input.custom {
  border-radius: 20px;
}
ion-item.border {
  border-radius: 20px;
}
ion-list.border {
  border-radius: 20px;
}
.chat-input {
  background-color: rgb(129, 129, 129) ;
  border-radius: 0.5rem;
  --padding-start: 10px;
  --padding-end: 10px;
}
ion-button[shape=circle] {
    --border-radius: 50%;
    width: 40px;
    height: 40px;
}
.text-caption {
  font-size: 12px;
  color: rgb(141, 141, 141);
}
</style>