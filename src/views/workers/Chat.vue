<template>
  <ion-page>
    <ToolbarEscolas
      title="Grupos de conversa"
      :backButton="false"
    />
    <ion-content >
      <div class="q-mt-md">
        <div class="slide" v-if="classesInfo && classesInfo.length">
          <ion-list 
            class="q-pa-md"
            lines="full" 
            >
            <ion-item
              v-for="_class in classesInfo"
              :key="_class"
              button
              detail="true"
              @click="goToChatDetail(_class.classId)"
            >
              <ion-avatar aria-hidden="true" slot="start" v-if="_class.classImage">
                <img :src="utils.makeFileUrl(_class.classImage)"/>
              </ion-avatar>
              <ion-avatar aria-hidden="true" slot="start" v-else>
                <img :src="utils.makeFileUrl(_class.image)"/>
              </ion-avatar>
              <ion-label class="q-pl-md">
                <h4>{{ _class.className }}</h4>
                <p>	
                  <span v-if="_class.functionName">Função:</span>
                  {{ _class.functionName }} 
                </p>
              </ion-label>
              <ion-chip
                v-for="child in _class.users"
                :key="child"
              >
                {{ child.userName }}
              </ion-chip>
            </ion-item>
          </ion-list>
        </div>
        <div v-else>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Você não está em nenhuma sala</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              Procure um responsável na escola para convefir de qual turma você participa.
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import { 
  IonPage, IonButton, IonCard,
  IonContent, IonImg, IonCardHeader,
  IonList, IonChip, IonCardTitle,
  IonItem, IonLabel, IonCardContent,
  IonAvatar } from '@ionic/vue';
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
      classesInfo: null,
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      userProfile: []
    };
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsWorkers/chat') {
        this.startView()
      }
    }
  },
  beforeMount () {
    this.startView()
  },
  methods: {
    startView () {
      this.getClassesByUserId()
    },
    getClassesByUserId() {
      const opt = {
        route: '/mobile/workers/getClassesByUserId',
        body: {
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.classesInfo = r.data.list
      })
    },
    goToChatDetail (classId) {
      this.$router.push('/chatDetailWorker?classId=' + classId)
    },
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