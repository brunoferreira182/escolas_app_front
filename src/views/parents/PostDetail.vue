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
          <ion-row>
            <ion-col>
              <div 
                @click.prevent="toggleReaction(post)" 
                :class="{ 'heart-animation': post.userReaction }" 
                :disabled="post.isButtonDisabled"
              >
                <input
                  class="animation-head"
                  type="checkbox"
                  id="toggle-heart"
                  :checked="post.userReaction"
                />
                <label
                  class="toggle-animation"
                  for="toggle-heart"
                >
                  <ion-icon
                    size="large"
                    :src="post.userReaction ? heart_filled : heart"
                  />
                </label>
              </div>
            </ion-col>
            <ion-col class="ion-text-end ion-align-self-center">
              {{ post.reactions }}
              reações
            </ion-col>
          </ion-row>
        </div>
        <ion-item
          style="border-radius: 0.5rem"
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
            shape="circle"
            @click="newPostComment"
          >
            <ion-icon slot="icon-only" :icon="send"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-list v-if="comments.length > 0">
          <ion-item 
            v-for="(comment,i) in comments"
            :key="i"
          >
            <ion-avatar aria-hidden="true" slot="start">
              <img :src="utils.makeFileUrl(comment.profileImage, 'thumbnail')"/>
            </ion-avatar>
            <ion-label >
              <ion-text>{{ comment.text }}</ion-text><br />
              <ion-note color="medium">{{ comment.createdBy.name }}</ion-note>
            </ion-label>
            <div class="metadata-end-wrapper" slot="end">
              <ion-note color="medium">{{ comment.createdAt.createdAtOnlyDate.substring(0,5) }}</ion-note>
            </div>
          </ion-item>
          <div v-if="noMoreData === false">
            <ion-button
              fill="clear"
              color="primary"
              @click="clkLoadMore"
              expand="block"
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
  IonCol,
  IonContent, IonAvatar, IonButton, IonItem, IonList, IonLabel,IonTextarea,
  IonIcon, IonChip,
  IonPopover,
  IonNote, IonText
} from '@ionic/vue';
import { send } from 'ionicons/icons';
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import heart from '/src/assets/icons/heart.svg'
import heart_filled from '/src/assets/icons/heart_filled.svg'
import smile from '/src/assets/icons/smile.svg'
import like from '/src/assets/icons/like.svg'
import bubblesound from '/src/assets/sounds/bubblesound.wav'

import { Haptics } from '@capacitor/haptics';
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
      commentsRowsPerPage: 10,
      noMoreData: false
    }
  },
  mounted () {
    this.getPostDetailById()
    this.getPostComments()
    this.getPostReactions()
  },

  methods: {
    async toggleReaction(post) {
      if (post.isButtonDisabled) {
        return;
      }

      post.isButtonDisabled = true;
      const audio = new Audio()
      audio.src = bubblesound
      const vibrate = async () => {
        await Haptics.vibrate({ duration: 100 });
      };

      try {
        if (post.userReaction) {
          await this.clkRemoveReaction(post);
        } else {
          await this.clkReaction(post);
        }

        vibrate();
        audio.play()
        setTimeout(() => {
          post.userReaction = !post.userReaction;
          post.isButtonDisabled = false;
        }, 1000);
      } catch (error) {
        post.isButtonDisabled = false;
      }
    },
    clkRemoveReaction() {
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
          // this.commentsPage++
          this.getPostComments(true)
        })
      }
    },
    getPostComments (fromStart) {
      // this.comments = []
      if (fromStart) {
        this.commentsPage = 1
      }
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
        this.comments = r.data.list
      })
    },
  }
};
</script>
<style lang="scss">
$bubble-d: 4.5rem; // bubble diameter
$bubble-r: .5*$bubble-d; // bubble-radius
$sparkle-d: .375rem;
$sparkle-r: .5*$sparkle-d;

@mixin sparkles($k) {
	$shadow-list: ();
	$n-groups: 7;
	$group-base-angle: 360deg/$n-groups;
	$group-distr-r: (1 + $k*.25)*$bubble-r;
	$n-sparkles: 2;
	$sparkle-base-angle: 360deg/$n-sparkles;
	$sparkle-off-angle: 60deg; // offset angle from radius
	$spread-r: -$k*$sparkle-r;
	
	@for $i from 0 to $n-groups {
		$group-curr-angle: $i*$group-base-angle - 90deg;
		$xg: $group-distr-r*cos($group-curr-angle);
		$yg: $group-distr-r*sin($group-curr-angle);
		
		@for $j from 0 to $n-sparkles {
			$sparkle-curr-angle: $group-curr-angle + 
				$sparkle-off-angle + $j*$sparkle-base-angle;
			$xs: $xg + $sparkle-d*cos($sparkle-curr-angle);
			$ys: $yg + $sparkle-d*sin($sparkle-curr-angle);
			
			$shadow-list: $shadow-list, $xs $ys 0 $spread-r 
				hsl(($i + $j)*$group-base-angle, 100%, 75%);
		}
	}
	
	box-shadow: $shadow-list;
}

@mixin bubble($ext) {
	transform: scale(1);
	border-color: #cc8ef5;
  transform: translateX(10px);
	border-width: $ext;
}

.animation-head {
  position: absolute;
  transform: translateX(10px);
  left: -100vw;
	
	&:checked + label {
		color: #e2264d;
		filter: none;
		will-change: font-size;
    transform: translateX(10px);
		animation: heart 1s cubic-bezier(.17, .89, .32, 1.49);
		
		&:before, &:after {
			animation: inherit;
			animation-timing-function: ease-out;
		}
		
		&:before {
			will-change: transform, border-width, border-color;
			animation-name: bubble;
		}
		
		&:after {
			will-change: opacity, box-shadow;
			animation-name: sparkles;
		}
	}
	
	&:focus + label {
		text-shadow: 0 0 3px white, 
			0 1px 1px white, 0 -1px 1px white, 
			1px 0 1px white, -1px 0 1px white;
	}
}

.toggle-animation {
	align-self: center;
	position: relative;
	color: #888;
	font-size: 2em;
  transform: translateX(10px);
	filter: grayscale(1);

	user-select: none;
	cursor: pointer;
	
	&:before, &:after {
		position: absolute;
		z-index: 1;
		top: 20%; left: 25%;
    transform: translateX(10px);
		border-radius: 50%;
		content: '';
	}
	
	&:before {
		box-sizing: border-box;
		margin: -$bubble-r;
		border: solid $bubble-r #e2264d;
		width: $bubble-d; height: $bubble-d;
		transform: scale(0);
	}
	
	&:after {
		margin: -$sparkle-r;
		width: $sparkle-d; height: $sparkle-d;
		@include sparkles(1);
	}
  &.heart-animation {
    animation: heart 1s cubic-bezier(.17, .89, .32, 1.49);
  }
}

// @keyframes heart {
// 	0%, 17.5% { font-size: 0; };
  
// }

@keyframes bubble {
	15% { @include bubble($bubble-r); }
	30%, 100% { @include bubble(0); }
}

@keyframes sparkles {
	0%, 20% { opacity: 0; }
	25% {
		opacity: 1;
		@include sparkles(0);
	}
}
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