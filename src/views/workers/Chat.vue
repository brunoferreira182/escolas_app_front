<template>
  <ion-page>
    <ToolbarEscolas
      title="Grupos de conversa"
      :backButton="false"
    />
    <ion-content >
      <div class="q-mt-md">
        <ion-progress-bar type="indeterminate" v-if="progressBar"></ion-progress-bar>
        <div class="slide">
          <ion-list lines="full" v-if="userInfo">
            <ion-item
              v-for="item in userInfo.list"
              :key="item"
              button
              detail="false"
              @click="clkConectedUser(item)"
            >
              <!-- <ion-avatar>
                <img :src="item.messages.profileImage ? utils.attachmentsAddress() + item.messages.profileImage  + '_thumbnail' : '/assets/default_avatar.svg'" />
              </ion-avatar> -->
              <ion-label class="q-pl-md">
                <h4>{{ item.className }}</h4>
                <!-- <p>	
                  <span v-if="item.messages.userId === userInfo.userId">Você: </span>
                  {{ item.messages.message }} 
                </p> -->
              </ion-label>
              <!-- <ion-label slot="end" class="ion-text-end">
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
import { 
  IonPage, IonButton, 
  IonContent, IonImg, 
  IonProgressBar,  IonList,
  IonItem, IonLabel } from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../../composables/variables';
import { defineComponent } from 'vue';
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
</script>

<script>
import { useFetch } from '@/composables/fetch';
export default {
  components: {
    IonPage, IonButton,
    IonContent,
    IonImg
  },
  data() {
    return {
      APP_NAME,
      progressBar: false,
      userInfo: null,
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      userProfile: []
    };
  },
  beforeMount () {
    this.getUserProfile()
  },
  methods: {
    getClassesThatIWork(){
      const opt = {
        route: '/mobile/parents/profile/getClassesByUserId',
        body: {
          userId: this.userProfile._id,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.userInfo = r.data
      })
    },
    clkConectedUser (item) {
      console.log(item)
      const userId = item._id
      this.$router.push('/chatDetail?userId=' + userId)
    },
    getUserProfile() {
      const opt = {
        route: '/mobile/parents/profile/getUserProfileById'
      }
      useFetch(opt).then((r)=> {
        if(!r.error) {
          this.userProfile = r.data
          this.getClassesThatIWork()
        }
      })
    }
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