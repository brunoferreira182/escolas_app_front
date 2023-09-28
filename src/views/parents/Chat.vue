<template>
  <ion-page>
    <ToolbarEscolas
      title="Chat"
      :backButton="false"
    />
    <ion-content >
      <div class="q-mt-md">
        <ion-progress-bar type="indeterminate" v-if="progressBar"></ion-progress-bar>
        <div class="slide">
          <ion-list lines="full">
            <ion-item
              button
              detail="false"
            >
              <!-- <ion-avatar>
                <img :src="item.messages.profileImage ? utils.attachmentsAddress() + item.messages.profileImage  + '_thumbnail' : '/assets/default_avatar.svg'" />
              </ion-avatar>
              <ion-label class="q-pl-md">
                <h4>{{ item._id.name }}</h4>
                <p>	
                  <span v-if="item.messages.userId === userInfo.userId">Você: </span>
                  {{ item.messages.message }} 
                </p>
              </ion-label>
              <ion-label slot="end" class="ion-text-end">
                <p>{{ item.messages.createdAt.createdAtInFullShort }}</p>
                <p>{{ item.messages.createdAt.createdAtLocale.split(' ')[1] }}</p>
              </ion-label> -->
            </ion-item>
          </ion-list>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import { IonPage, IonButton, IonContent, IonImg,IonProgressBar } from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../../composables/variables';
import { defineComponent } from 'vue';
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
</script>

<script>
export default {
  components: {
    IonPage, IonButton,
    IonContent,
    IonImg
  },
  data() {
    return {
      APP_NAME
    };
  },
  methods: {
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