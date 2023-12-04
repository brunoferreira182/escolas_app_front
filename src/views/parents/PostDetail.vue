<template>
  <ion-page>
    <ToolbarEscolas
      title="Postagem"
      :backButton="true"
    />
    <ion-content >
      <div v-if="post" style="margin-inline:10px;">
        <img 
          v-if="post.postData.resume.img"
          style="width: 100%; height: auto; object-fit: cover; object-position: center;"
          :src="utils.attachmentsAddress() + post.postData.resume.img.filename"
        />
        <div class="ion-text-right q-pb-sm">{{ post.createdAt.createdAtInFullLong }}</div>
        <div v-for="(item,i) in post.postData.detail" :key="i" >
          <div v-if="item.type === 'text'"   :class="item.class">{{ item.value }}</div>
          <div v-if="item.type === 'image'" :class="item.class">
            <img :class="item.class" :src="createImgURL(item)"> 
          </div>
          <hr :class="item.class" style="background-color: #15aad8;color: #15aad8;" v-if="item.type === 'separator'"/>
        </div>
        <div class="q-px-xs">
          <div style="display: flex; align-items: center;" class="q-mb-md">
            <ion-icon v-if="post.userReaction" id="heartIcon" size="large" @click="clkRemoveReaction(post)" src="/assets/icons/heart_filled.svg"></ion-icon>
            <ion-icon v-if="!post.userReaction" @click="clkReaction(heart, post)" size="large" src="/assets/icons/heart.svg"/>
            <div style="margin-left: 70%;"  @click="$router.push('/postReactions?postId=' + $route.query.postId)">
              {{post.reactions}}  Reações
            </div>
          </div>
        </div>
        <ion-item
        class="q-mb-sm"
        >
          <ion-textarea
            placeholder="Deixe um comentário..."
            v-model="newComment"
            :rows="1"
            :auto-grow="true"
            @keyup.enter="newPostComment"
          />
          <ion-button 
            shape="round"
            slot="end"
            @click="newPostComment"
          >
            <ion-icon  slot="icon-only" :icon="send"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-list v-if="comments.length > 0">
          <ion-item 
            v-for="(comment,i) in comments"
            :key="i"
            lines="none"
          >
            <ion-label >
              <h4>{{ comment.createdBy.name }}</h4>
              <p>
                {{ comment.text }}
              </p>
            </ion-label>
            <ion-label slot="end">
              <p 
                style="
                  font-size: small; 
                  color: var(--ion-color-secondary);"
              >{{ comment.createdAt.createdAtOnlyDate.substring(0,5) }}</p>
            </ion-label>
          </ion-item>
          <div v-if="noMoreData === false">
            <ion-button
              fill="clear"
              color="secondary"
              @click="clkLoadMore"
            >Ver mais</ion-button>
          </div>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonRow, IonGrid,
  IonContent, IonAvatar, IonButton, IonItem, IonList, IonLabel,IonTextarea,
  IonIcon, IonChip,
  IonPopover
} from '@ionic/vue';
import { send } from 'ionicons/icons';
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import heart from '/assets/icons/heart.svg'
import smile from '/assets/icons/smile.svg'
import like from '/assets/icons/like.svg'
</script>

<script>
export default {
  name: "PostDetail",
  data() {
    return {
      // send,:
      post: null,
      newComment: '',
      reactions: [heart, smile, like],
      postReactions: [],
      comments: [],
      commentsPage: 1,
      commentsRowsPerPage: 4,
      noMoreData: false
    }
  },
  mounted () {
    this.getPostDetailById()
    this.getPostComments()
    this.getPostReactions()
  },

  methods: {
    clkRemoveReaction() {
      console.log('chamou remover reaction')
      const opt = {
        route: '/mobile/social/removePostReaction',
        body: {
          postId: this.$route.query.postId,
        }
      }
      useFetch(opt).then(r => {
        this.getPostDetailById()
      })
    },
    getPostDetailById () {
      const opt = {
        route: '/mobile/social/getPostDetailById',
        body: {
          postId: this.$route.query.postId
        }
      }
      useFetch(opt).then(r => {
        this.post = r.data
      })
    },
    createImgURL(item) {
      return utils.attachmentsAddress() + item.image
    },
    clkReaction (icon, post) {
      const opt = {
        route: '/mobile/social/addNewPostReaction',
        body: {
          postId: this.$route.query.postId,
          // reaction: icon
        }
      }
      useFetch(opt).then(r => {
        this.getPostDetailById()
      })
    },
    clkLoadMore () {
      this.commentsPage++
      this.getPostComments()
    },
    getPostReactions() {
      const opt = {
        route: '/mobile/social/getReactionsByPostId',
        body: {
          postId: this.$route.query.postId,
          page: this.commentsPage,
          rowsPerPage: this.commentsRowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          if (r.data.list === 0) {
            this.noMoreData === true
          }
          this.postReactions = r.data.list
          return
        }
        utils.toast("Ocorreu um erro, tente novamente.")
      })
    },
    newPostComment () {
      if (this.newComment.length > 0) {
        const opt = {
          route: '/mobile/social/addNewPostComment',
          body: {
            postId: this.$route.query.postId,
            text: this.newComment
          }
        }
        useFetch(opt).then(r => {
          this.newComment = ''
          this.commentsPage = 1
          this.getPostComments()
        })
      }
    },
    getPostComments () {
      this.comments = []
      const opt = {
        route: '/mobile/social/getCommentsByPostId',
        body: {
          postId: this.$route.query.postId,
          page: this.commentsPage,
          rowsPerPage: this.commentsRowsPerPage
        }
      }
      useFetch(opt).then(r => {
        if (r.data.list.length < 4) {
          this.noMoreData = true
        }
        this.comments.push(...r.data.list)
      })
    },
  }
};
</script>
<style>

.coment-box {
  margin: 10px;
  --border-color:  transparent;
  --border-radius: 0.4rem;
  border: 1px solid var(--ion-color-secondary);
}

.popover-reactions {
  --offset-y: -50px;
  --box-shadow:none;
  --max-width: 210px;
  --backdrop-opacity: 0.01;
  --background: #fff
}

.post-title {
  font-size: 26px;
  margin-bottom: 20px;
  margin:10px
}
.post-subtitle-1 {
  font-size: 24px;
  margin:10px

}
.post-subtitle-gold-2 {
  color: #c2955d;
  font-size: 22px;
  margin:10px
}
.post-subtitle-gold-1 {
  color: #c2955d;
  font-size: 24px;
  margin:10px

}
.post-subtitle-2 {
  font-size: 22px;
  margin:10px
}
.post-p {
  font-size: 16px;
  color: #6e6e6e;
  margin:10px

}
.post-image {
  width: 100%;
  border-radius: 0.4rem;
}

.post-separator {
  margin: 10px;
  background: #eed5b4;
  color: #eed5b4;
}
</style>