<template>
  <div class="card">
    <div class="even-card" color="secondary">
      <img 
        v-if="post.postData.resume.img"
        style="width: 100%; height: auto; object-fit: cover; object-position: center;"
        :src="utils.makeFileUrl(post.postData.resume.img.filename)" class="img-style"
      />
      <div >
        <p class="q-px-md text-caption" v-if="post.routeDestination.split('?')[0] === '/calendarEventDetail'">
          Evento para toda a escola
        </p>
        <h1 class="card-title">{{post.postData.resume.title}}</h1>
        <p class="q-px-md">
          {{ post.postData.resume.description.length > 50 ? post.postData.resume.description.slice(0, 50) + '...' : post.postData.resume.description }}
          <span v-if="post.postData.resume.description.length > 50"></span>
        </p>
        <ion-row>

          <ion-col class="q-ma-sm q-pt-md">
            <ion-row>
              <ion-col size="5">
                <div @click.prevent="toggleReaction(post)" :class="{ 'heart-animation': post.userReaction }" :disabled="post.isButtonDisabled">
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
                </div>
                <!-- <div v-if="post.userReaction">
                  <ion-icon size="large"  @click="clkRemoveReaction(post)" :src="heart_filled"/>{{ post.reactions }}
                </div>
                <div v-else-if="!post.userReaction" @click="clkReaction(heart, post)">
                  <ion-icon size="large" :src="heart"/>{{ post.reactions }}
                </div> -->
              </ion-col>
              <ion-col size="5">
                <div class="q-pa-xs" v-if="post.routeDestination === '/postDetail'">
                  <ion-icon
                    style="width: 28px;
                    color:rgb(165, 164, 164); 
                    height: 28px;" 
                    :src="comment"
                  />
                  {{ post.comments }}
                </div>
              </ion-col>
            </ion-row>
          </ion-col>
          <ion-col>
            <div class="ion-text-end">
              <ion-button 
                v-if="post.routeDestination !== '/postDetail'"
                @click="$router.push(post.routeDestination )"
                fill="clear"
              >
                <h6>Ler mais</h6>
              </ion-button>
              <ion-button 
                v-else-if="post.routeDestination === '/postDetail'"
                @click="$router.push('/postDetail?postId=' + post._id)"
                fill="clear"
              >
                <h6>Ler mais</h6>
              </ion-button>
            </div>
          </ion-col>
        </ion-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import utils from '../composables/utils'
import { useFetch } from '../composables/fetch'
import {
  IonPage,
  IonCol,
  IonRow,
  IonIcon,
  
  IonButton, 
} from '@ionic/vue'
import { 
  location,
  calendarOutline,
  chatboxOutline
} from 'ionicons/icons';

import heart from '/src/assets/icons/heart.svg'
import heart_filled from '/src/assets/icons/heart_filled.svg'
import smile from '/src/assets/icons/smile.svg'
import like from '/src/assets/icons/like.svg'
import bubblesound from '/src/assets/sounds/bubblesound.wav'
import comment from '/src/assets/icons/comment.svg'
import { Haptics } from '@capacitor/haptics';
import {Capacitor} from '@capacitor/core'
const props = defineProps(['post', 'i'])
</script>
<script>
export default {
  name: "SocialPost",
  data() {
    return {
    }
  },
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
  margin: 10px;
  border-radius: 0.4rem;
  overflow: hidden;
}
.even-card {
  background-color: var(--ion-card-background);
}

.card-title {
  margin: 14px;
  font-size: 24px;;
}
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