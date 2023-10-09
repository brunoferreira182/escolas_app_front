<template>
  <ion-page>
    <ToolbarEscolas
      title="Salas de aula"
      :backButton="false"
    />
    <ion-content color="light">
      <div v-if="childClassInfo">
        <ion-list 
          class="q-ma-md"
          style="border-radius: 1rem"
          lines="full" 
        >
          <div 
            v-for="_class in childClassInfo"
            :key="_class"
          >
            <h2 class="q-px-md">{{ _class.classData.name }}</h2>
            <ion-item
              button
              detail="true"
              @click="goToChatDetail(_class.classData.id)"
            >
              <ion-avatar style="width: 76px; height:74px;">
                <img :src="utils.makeFileUrl(_class.classData.classImage)" class="profile-avatar">
              </ion-avatar>
              <ion-label>
                <ion-note class="q-mt-md">
                  <div
                    class="q-ma-sm"
                    v-for="child in _class.users"
                    :key="child"
                  >
                    <ion-chip>
                      <ion-avatar>
                        <img :src="utils.makeFileUrl(child.userImage)" />
                      </ion-avatar>
                      <ion-label>{{ child.userName }}</ion-label>
                    </ion-chip>
                  </div><br/>
                </ion-note>
              </ion-label>
            </ion-item>
          </div>
        </ion-list>
        <h2 class="q-px-md">Histórico de atividades</h2>
        <ion-list :inset="true" >
          <ion-item 
            v-for="e in childEventsHistory"
            :key="e"
            detail="false"
          >
            <ion-label>
              <strong>{{ e.name }}</strong>
              <ion-badge  style="background-color: #eb445a;">{{ e.eventName }}</ion-badge><br />
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
      userProfile: []
    };
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsParents/chat') {
        this.startView()
      }
    }
  },
  beforeMount () {
    this.startView()
  },
  methods: {
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
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
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