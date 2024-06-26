<template>
  <ion-modal :isOpen="showModal" @willDismiss="closeModal">
    <ion-content>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Fechar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <swiper :zoom="true" :modules="modules" class="allow-image-overflow">
        <swiper-slide>
          <div class="swiper-zoom-container">
            <img :src="modalImageUrl" />
          </div>
        </swiper-slide>
      </swiper>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { Zoom } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import {
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
} from '@ionic/vue';

const props = defineProps(['modalImageUrl', 'showModal']);
const emits = defineEmits(['closeModal']);
const modules = [Zoom];

const closeModal = () => {
  emits('closeModal');
};

</script>

<style scoped lang="scss">
.swiper-zoom-container {
  width: 100%;
  height: 100%;
}

swiper-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.allow-image-overflow {
  overflow: visible;
}
</style>
