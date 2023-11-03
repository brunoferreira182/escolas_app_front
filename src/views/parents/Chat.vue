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
            :disabled="c.classData.name ? false : true"
            :button="true"
            class="q-pa-sm"
            @click="goToChatDetail(c.classData.id)"
          >
            <ion-avatar aria-hidden="true" slot="start" v-if="c.classImage">
              <img :src="utils.makeFileUrl(c.classData.classImage)" />
            </ion-avatar>
            <ion-avatar aria-hidden="true" slot="start" v-else>
              <img :src="utils.makeFileUrl(c.image)"/>
            </ion-avatar>
            <ion-label>
              <ion-badge 
                v-for="child in c.users"
                :key="child"
                class="ion-text-capitalize"
                color="success"
              >
                {{ child.userName }}
              </ion-badge>
              <h6 
                class="ion-text-caption" 
                v-if="!c.classData.name"> Nenhuma turma vinculada
              </h6>
              <h6 v-else> {{ c.classData.name }}</h6>
            </ion-label>
          </ion-item>
        </ion-list>
        <ion-list :inset="true" >
          <div class="ion-text-left text-h6 q-py-sm q-pl-md">Histórico de atividades</div>
          <ion-item 
            v-for="e in childEventsHistory"
            :key="e"
            detail="false"
          >
            <ion-label>
              <strong>{{ e.name }}</strong>
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