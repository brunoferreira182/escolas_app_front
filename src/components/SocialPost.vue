<template>
  <div class="card">
    <div class="even-card">
      <div >
        <ion-item lines="none">
          <ion-label class="ion-text-nowrap">
            <!-- <div v-if="post.type === 'activities' || post.type === 'presence'">
              <h2>{{ post.createdBy.name }}</h2>
              <p>{{ post.postData.resume.classData.functionName }} em {{ post.postData.resume.classData.className }}</p>
            </div> -->
            
            <h3 v-if="post.scope === 'private'">
              {{ post.createdBy.name }}
            </h3>
            <h3 class="text-capitalize" v-else>
              {{ APP_NAME }}
            </h3>
            <p>{{ post.createdAt.createdAtInFullLong }}</p>
            <h2>{{ post.postData.resume.title }}</h2>
          </ion-label>
          <ion-avatar 
            aria-hidden="true" 
            slot="start" 
          >
            <img class="ion-avatar" v-if="post.scope === 'private'" :src="proSaberLogo"/>
            <img class="ion-avatar" v-else :src="proSaberLogo"/>
          </ion-avatar>
        </ion-item>
      </div>
      <img 
        v-if="post.postData.resume.img"
        style="width: 100%; height: auto; object-fit: cover; object-position: center;"
        :src="utils.makeFileUrl(post.postData.resume.img.filename)" class="img-style"
        @click="openImageModal(post.postData.resume.img.filename)"
      />
      <div>
        <ion-item lines="none" >
          <ion-label>
            <div>{{ post.postData.resume.description }}</div>
          </ion-label>
        </ion-item>
        <ion-item lines="none" >
          <ion-label v-if="post.type === 'schoolEvent' ||  post.type === 'post'">
            <span
              @click.prevent="toggleReaction(post)"
              :class="{ 'heart-animation': post.userReaction }"
              :disabled="post.isButtonDisabled"
            >
              <input
                class="animation-head"
                type="checkbox"
                :id="'toggle-heart-' + i"
                :checked="post.userReaction"
              />
              <label
                class="toggle-animation"
                :for="'toggle-heart-' + i"
              >
                <ion-icon
                  size="large"
                  :src="post.userReaction ? heart_filled : heart"
                />
              </label>
              {{ post.reactions }}
            </span>
            <span class="q-ml-lg" v-if="post.type === 'post'">
              <ion-icon
                style="width: 28px; color:rgb(165, 164, 164); height: 28px;"
                :src="comment"
              />
              {{ post.comments }}
            </span>
          </ion-label>
          <ion-label slot="end" >
            <ion-button 
              v-if="post.routeDestination"
              @click="$router.push(post.routeDestination )"
              fill="clear"
            >
              Ler mais
            </ion-button>
          </ion-label>
        </ion-item>

      </div>
    </div>
    <ModalPinchZoomImage
      :modalImageUrl="modalImageUrl"
      :showModal="showModal"
      @closeModal="showModal = false"
    />
  </div>
  

</template>

<script setup>
import utils from '../composables/utils'
import { APP_NAME } from '../composables/variables'
import { useFetch } from '../composables/fetch'
import {
  IonIcon,
  IonButton, 
  IonAvatar,
  IonItem, IonLabel, IonBadge, IonNote
} from '@ionic/vue'

import heart from '/src/assets/icons/heart.svg'
import heart_filled from '/src/assets/icons/heart_filled.svg'
import { Clipboard } from '@capacitor/clipboard';
import bubblesound from '/src/assets/sounds/bubblesound.wav'
import comment from '/src/assets/icons/comment.svg'
import list from '/src/assets/icons/list.svg'
import { Haptics } from '@capacitor/haptics';
import ModalPinchZoomImage from '../components/ModalPinchZoomImage.vue'
import proSaberLogo from '/src/assets/logo_login_custom.png'
import { ref } from 'vue';
const showModal = ref(false);
const modalImageUrl = ref(null);

const openImageModal = (imageFilename) => {
  modalImageUrl.value = utils.makeFileUrl(imageFilename);
  showModal.value = true;
};
const props = defineProps(['post', 'i'])
// const emits = defineEmits('getPosts')
</script>
<script>
export default {
  name: "SocialPost",
  data() {
    
    return {
      utils,
      list,
      proSaberLogo,
      showModal: false,
      modalImageUrl: null,
    }
  },
  emits: ['getPosts'],
  methods: {
    async toggleReaction(post) {
      
      if (post.isButtonDisabled) {
        return;
      }

      post.isButtonDisabled = true;

      const vibrate = () => Haptics.vibrate({ duration: 100 });

      const audio = new Audio()
      audio.src = bubblesound
      try {
        if (post.userReaction) {
          await this.clkRemoveReaction(post);
        } else {
          await this.clkReaction(post);
        }

        vibrate();
        audio.play()

        post.userReaction = !post.userReaction;
        post.isButtonDisabled = false;
      } catch (error) {
        post.isButtonDisabled = false;
      }
    },
  
    clkRemoveReaction(post) {
      const opt = {
        route: '/mobile/social/removePostReaction',
        body: {
          postId: post._id,
        }
      }
      return useFetch(opt).then(() => {
        this.$emit('getPosts');
      });
    },
    clkReaction(post) {
      const opt = {
        route: '/mobile/social/addNewPostReaction',
        body: {
          postId: post._id,
          // reaction: icon
        }
      }
      return useFetch(opt).then(() => {
        this.$emit('getPosts');
      });
    },
  }
};
</script>



<style scoped lang="scss">
.bg-green{
  background-color: rgb(51, 138, 51)
}
.bg-red{
  background-color: rgb(138, 51, 51)
}
.bg-grey{
  background-color: #888;
}
.ion-avatar {
  width: 100%; 
}

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
.card {
  margin-top: 10px;
  border-radius: 0rem;
  overflow: hidden;
}
// .even-card {
//   background-color: var(--ion-card-background);
// }

// .card-title {
//   margin: 14px;
//   font-size: 24px;;
// }
.img-style {
  object-fit: cover;
  overflow: hidden;
}
.card-img {
  width: 100%; 
  height: 150px; 
  object-fit: contain;
  border-radius: 10px 0px 0px 0px
}

</style>