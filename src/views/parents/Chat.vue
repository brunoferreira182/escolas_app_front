<template>
  <ion-page>
    <ToolbarEscolas
      title="Salas de aula"
      :backButton="false"
    />
    <ion-content color="light">
      <div v-if="childClassInfo">
        <ion-list :inset="true">
          <div class="ion-text-left text-h6 q-py-sm q-pl-md">Turmas</div>
          <ion-item 
            v-for="c in childClassInfo"
            :key="c"
            :disabled="c.className ? false : true"
            :button="true"
            class="q-pa-sm"
            @click="goToChatDetail(c.classId)"
          >
            <ion-avatar
              aria-hidden="true"
              slot="start"
              style="height: 60px; width: 60px;"
            >
              <img :src="utils.makeFileUrl(c.classImage)" v-if="c.classImage"/>
              <img :src="utils.makeFileUrl('default-avatar.svg')" v-else/>
            </ion-avatar>
            <ion-avatar
              aria-hidden="true"
              slot="start"
              style="margin-left: -40px; height: 60px; width: 60px; border: 2px solid white !important;"
            >
              <img :src="utils.makeFileUrl(c.userImage)" v-if="c.userImage"/>
              <img :src="utils.makeFileUrl('default-avatar.svg')" v-else/>
            </ion-avatar>
            <ion-label>
              <ion-badge 
                class="ion-text-capitalize"
                color="success"
              >
                {{ c.userName }}
              </ion-badge>
              <h6 
                class="ion-text-caption" 
                v-if="!c.className"> Nenhuma turma vinculada
              </h6>
              <h6 v-else> {{ c.className }}</h6>
            </ion-label>
          </ion-item>
        </ion-list>
        <ion-list :inset="true" >
          <div class="ion-text-left text-h6 q-py-sm q-pl-md">Histórico de atividades</div>
          <div v-if="childEventsHistory && childEventsHistory.length">
            <ion-item 
              v-for="e in childEventsHistory"
              :key="e"
              @click="openChildEventModal(e)"
              detail="false"
            >
              <ion-label>
                <strong class="text-capitalize">{{ e.name }}</strong>
                <ion-badge  color="primary">{{ e.eventName }}</ion-badge><br />
                <ion-note color="medium" class="ion-text-wrap">
                  {{ e.obs }}
                </ion-note>
              </ion-label>
              <div class="metadata-end-wrapper" slot="end">
                <ion-note color="medium">
                  {{ e.createdAt.createdAtLocale.split(' ')[0] }}<br>
                  {{ e.createdAt.createdAtLocale.split(' ')[1] }}
                </ion-note>
              </div>
            </ion-item>
            <ion-modal 
              class="modalTeste"
              :is-open="openImageModalProfile.open" 
              @didDismiss="dismissImageModalProfile()"
            >
              <ion-content v-if="openImageModalProfile.imageData && openImageModalProfile.imageData.filename">
                <img 
                  :src="utils.makeFileUrl(openImageModalProfile.imageData.filename)" 
                  style="width: 100%"
                >
                <div class="ion-text-center">
                  <div class="text-h4 text-capitalize">
                    {{ openImageModalProfile.data.name }}
                  </div>
                  <ion-chip color="primary" class="text-h5">
                    {{ openImageModalProfile.data.eventName }}
                  </ion-chip>
                </div>
              </ion-content>
            </ion-modal>
          </div>
          <div v-else>
            <ion-item>
              <ion-label>
                Nenhum Histórico recente.
              </ion-label>
            </ion-item>
          </div>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import { 
  IonPage, 
  IonButton, 
  IonContent, 
  IonImg, 
  IonList, 
  IonRow,
  IonCol,
  IonBadge,
  IonChip, 
  IonAvatar,
  IonModal,
  IonItem, 
  IonLabel, 
  IonNote,
  IonIcon
} from '@ionic/vue';
import { APP_NAME, COMPANY_ID } from '../../composables/variables';
import { defineComponent } from 'vue';
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
</script>

<script>
import { useFetch } from '@/composables/fetch';
export default {
  name: 'chatParents',
  components: {
    IonPage, IonButton,
    IonContent,
    IonImg,
    IonIcon
  },
  data() {
    return {
      APP_NAME,
      progressBar: false,
      childClassInfo: null,
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      childEventsHistory: [],
      userProfile: [],
      openImageModalProfile:{
        open: false,
        data: {},
        imageData: null,
      },
    };
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsParents/chat') {
        this.startView()
      }
    }
  },
  mounted() {
    utils.loading.hide()
    this.startView()
  },
  methods: {
    openChildEventModal(e){
      this.openImageModalProfile.open = true
      this.openImageModalProfile.data = e
      this.openImageModalProfile.imageData = e.image
    },
    dismissImageModalProfile(){
      this.openImageModalProfile.open = false
      this.openImageModalProfile.imageData = null
    },
    startView () {
      this.getChildClass()
      this.getLastActivitiesFromUserChildren()
    },
    getLastActivitiesFromUserChildren() {
      const opt = {
        route: '/mobile/parents/chat/getLastActivitiesFromUserChildren',
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.childEventsHistory = r.data
        } else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde.")
        }
      })
    },
    getChildClass() {
      const opt = {
        route: '/mobile/parents/chat/getClassesOfChildrenByUserId',
      }
      useFetch(opt).then(r => {
        this.childClassInfo = r.data
      })
    },
    goToChatDetail (classId) {
      this.$router.push('/chatDetail?classId=' + classId)
    },
  }
}

</script>

<style scoped>
  .modalTeste {
    --height: 61%;
    --border-radius: 16px;
    --box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  .modalTeste ion-modal::part(backdrop) {
    background: rgba(209, 213, 219);
    opacity: 1;
  }

  .modalTeste ion-toolbar {
    --background: rgb(14 116 144);
    --color: white;
  }
  .unread-indicator {
    background: var(--ion-color-primary);

    width: 10px;
    height: 10px;

    border-radius: 100%;

    position: absolute;

    inset-inline-start: 12px;
    top: 12px;
  }

  .metadata-end-wrapper {
    position: absolute;

    top: 10px;
    inset-inline-end: 10px;

    font-size: 0.8rem;

    display: flex;
    align-items: center;
  }

  ion-label strong {
    display: block;

    max-width: calc(100% - 60px);

    overflow: hidden;

    text-overflow: ellipsis;
  }

  ion-label ion-note {
    font-size: 0.9rem;
  }
</style>