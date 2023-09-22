<template>
  <ion-card 
    style="box-shadow: none;"
    class="q-my-md ad-card"
  >
    <swiper 
      style="border-radius: 0.375rem; overflow:hidden ;"
      :modules="modules"
      :slides-per-view="1" 
      :loop="true"
      :pagination="{ dynamicBullets: true }"
    >
      <swiper-slide v-for="image in adData.images" :key="image">
        <ion-img  class="img-style" :src="`${utils.attachmentsAddress()}${image.filename}`"/>
      </swiper-slide>
    </swiper>
    <ion-card-header >
      <ion-card-subtitle>Categoria {{ adData.adData.category.category }}</ion-card-subtitle>
      <ion-card-title class="q-mt-none">{{ adData.adData.title }}</ion-card-title>
    </ion-card-header>
    <ion-card-content >
      <p class="text">{{ adData.adData.description }}</p>
      <div class="q-my-md">
        <div class="ad-items q-my-xs">
          <ion-icon :icon="pricetag" size="small" class="q-mr-sm"></ion-icon>
          <ion-text>{{ adData.adData.price }} {{ adData.adData.priceType }}</ion-text>
        </div>
        <div class="ad-items q-my-xs">
          <ion-icon :icon="location" size="small" class="q-mr-sm"></ion-icon>
          <ion-text>{{ adData.addressInfo.address.city }}, a {{ Math.round(adData.distance / 1000) }} km de você</ion-text>
        </div>
        <div class="ad-items q-my-xs" v-if="adData.userExperience">
          <ion-icon :icon="speedometer" size="small" class="q-mr-sm"></ion-icon>
          <ion-text>Tempo de experiência: {{ adData.userExperience }}</ion-text>
        </div>
      </div>
      <div>
        <ion-chip
          v-for="item in adData.adData.preferences"
          :key="item.preferenceId"
          color="primary"
        >{{ item.preference }}</ion-chip>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import utils from '../composables/utils.js';
import {
  IonCard,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
  IonCardHeader,
  IonImg,
  IonIcon,
  IonChip, IonItem, IonText
} from '@ionic/vue'
import { 
  location,
  pricetag,
  speedometer
} from 'ionicons/icons';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/vue';
import 'swiper/css';
import { Pagination, Autoplay } from 'swiper';
import { ref, onMounted, watch } from 'vue'
const props = defineProps(['adData'])
const modules = ref([Pagination, Autoplay])
</script>

<style scoped>
.ad-items {
  font-size: 15px;
}
</style>