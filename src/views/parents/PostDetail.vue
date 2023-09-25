<template>
  <ion-page>
    <ToolbarEscolas
      title="Postagem"
      :backButton="true"
    />
    <ion-content>
      <div v-if="post" style="margin-inline:10px;margin-top: -10px;">
        <div v-for="(item,i) in post.postData.detail" :key="i" >
          <div v-if="item.type === 'text'" :style="'color:' + item.color" :class="item.class">{{ item.value }}</div>
          <div v-if="item.type === 'image'" :class="item.class">
            <img :class="item.class" :src="createImgURL(item)">
          </div>
          <hr :class="item.class" style="background-color: #eed5b4;color: #eed5b4;" v-if="item.type === 'separator'"/>
        </div>
        <div class="q-mt-md" style="margin:0px;margin-top: 30px;color:var(--ion-color-secondary);font-family: Montserrat;font-weight: 400;">

          <div style="display: flex;justify-content: center;margin-bottom: 10px;">

            <ion-button
              id="click-trigger"
              color="secondary"
              fill="outline"
              class="q-mb-md"
              mode="md"
              style="
                scale: 1.2;
                font-family: Montserrat;
                font-weight: 500;
                text-transform: none;
                margin-left: -10px;
                margin-bottom: 0px;
                --border-width: 1px;
                "
            >
              <!-- <ion-icon style="padding-bottom: 3px;" src="/assets/icons/heart.svg"></ion-icon> -->
              {{liked ? 'Você reagiu!' : 'Reagir!'}} 
            </ion-button>
            <ion-popover
              mode="md"
              class="popover-reactions"
              trigger="click-trigger"
              trigger-action="click"
              :dismiss-on-select="true"
              side="bottom"
              alignment="center"
            >
              <ion-content :scroll-y="false" style="--background: #fff">
                <div style="display: flex;padding: 5px">
                  <ion-button 
                    fill="clear"
                    color="secondary"
                    style="--width: 20px;"
                    dense
                    v-for="(icon,i) in reactions"
                    :key="i"
                    @click="clkReaction(icon)"
                  >
                    <ion-icon 
                      slot="icon-only"
                      size="large"
                      :src="icon"
                    >
                    </ion-icon>
                  </ion-button>
                </div>
              </ion-content>
            </ion-popover>
          </div>
          <div style="display: flex;align-items: center;">
              <ion-button
                @click="$router.push('/postReactions?postId=' + $route.query.postId)"
                color="secondary"
                fill="clear"
                mode="ios"
                style="
                  scale: 0.9;
                  font-family: Montserrat;
                  text-transform: none;
                  margin-right: auto;
                  display: flex;
                  align-items: center;
                  margin-left: -10px;
                  "
              >
              {{post.reactions}}x Reações 
              </ion-button>
              
            <div 
              style="font-size: 14px;
                padding-bottom: 3px;
                font-weight: 400;
                font-family: Montserrat;
                margin-right: 10px;"
              >
              {{ post.createdAt.createdAtInFullLong }}
            </div>
          </div>
          
          <h4 
            v-if="comments.length > 0" 
            style="
              font-family: Montserrat;
              font-weight: 400;
              margin-top: -10px;
              margin-bottom: 0px;
              margin-left: 10px;
              color: var(--ion-color-primary);"
          >
              Comentários
          </h4>


        </div>

        <ion-list v-if="comments.length > 0" class="q-mx-md">
          <ion-item 
            v-for="(comment,i) in comments"
            :key="i"
            lines="none"
          >
            <ion-label>
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
          <div v-if="!noMoreData">
            <ion-button
              fill="clear"
              color="secondary"
              @click="clkLoadMore"
            >Ver mais</ion-button>
          </div>
        </ion-list>

        <ion-item
        fill="outline"
        class="coment-box"
        lines="none"
        >
          <ion-textarea
            placeholder="Deixe um comentário..."
            v-model="newComment"
            :rows="1"
            :auto-grow="true"
            style="--placeholder-opacity: 1;--placeholder-color: var(--ion-color-secondary)"
            @keyup.enter="newPostComment"
          />
          <ion-button 
            shape="round"
            style="margin-right: -10px;align-self:self-end;height: 40px;width: 40px;" 
            color="secondary" 
            slot="end"
            @click="newPostComment"
          >
            <ion-icon color="tertiary" slot="icon-only" :icon="send"></ion-icon>
          </ion-button>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonRow, IonGrid,
  IonContent, IonAvatar, IonButton, IonItem, IonList, IonLabel,IonTextarea,
  IonIcon,
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
      liked: false,
      newComment: '',
      reactions: [heart, smile, like],
      comments: [],
      commentsPage: 0,
      noMoreData: false
    }
  },
  mounted () {
    this.getPostDataById()
    this.getPostComments()
  },

  methods: {
    getPostDataById () {
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
      return utils.attachmentsAddress() + item.image.filename
    },
    clkReaction (icon) {
      const opt = {
        route: '/mobile/social/newPostReaction',
        body: {
          postId: this.$route.query.postId,
          reaction: icon
        }
      }
      useFetch(opt).then(r => {
        this.getPostDataById()
        this.liked = true
        console.log(icon)
      })
    },
    clkLoadMore () {
      this.commentsPage++
      this.getPostComments()
    },
    newPostComment () {
      if (this.newComment.length > 0) {
        const opt = {
          route: '/mobile/social/newPostComment',
          body: {
            postId: this.$route.query.postId,
            text: this.newComment
          }
        }
        useFetch(opt).then(r => {
          this.newComment = ''
          this.commentsPage = 0
          this.getPostComments()
        })
      }
    },
    getPostComments () {
      const opt = {
        route: '/mobile/social/getPostComments',
        body: {
          postId: this.$route.query.postId,
          page: this.commentsPage
        }
      }
      useFetch(opt).then(r => {
        if (r.data.length < 4) {
          this.noMoreData = true
        }
        this.comments.push(...r.data)
        console.log(this.comments)
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
  /* border: 1px solid var(--ion-color-secondary); */
  --background: var(--ion-color-tertiary);
}

.popover-reactions {
  --offset-y: -50px;
  --box-shadow:none;
  --max-width: 210px;
  --backdrop-opacity: 0.01;
  --background: #fff
}

.post-title {
  color: #222222;
  font-size: 26px;
  margin-bottom: 20px;
  margin:10px
}
.post-subtitle-1 {
  color: #222222;
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
  color: #222222;
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