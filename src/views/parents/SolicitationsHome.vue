<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Atendimento</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">
            Atendimento
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-text>
        <h3 class="q-mx-md">Abertos</h3>
      </ion-text>
      <div v-if="!openSolicitations || openSolicitations.length === 0" class="ion-padding">
        Não há atendimentos em aberto
      </div>
      <div v-else>
        <ion-list :inset="true">
          <ion-item
            :button="true"
            detail="false"
            v-for="solicitation in openSolicitations"
            :key="solicitation.solicitationId"
            @click="clkSolicitation(solicitation)"
          >
            <ion-label>
              <strong>{{ solicitation.departmentName }}</strong>
              <ion-text v-if="solicitation.childName">{{ solicitation.childName }}</ion-text><br v-if="solicitation.childName"/>
              <ion-note color="medium" class="ion-text-wrap">
                {{ solicitation.description }}
              </ion-note>
            </ion-label>
            <div class="metadata-end-wrapper" slot="end">
              <ion-note color="medium">{{ solicitation.createdAt }}</ion-note>
            </div>
          </ion-item>
        </ion-list>
      </div>

      <div class="q-pt-lg">
        <ion-text>
          <h3 class="q-mx-md">Fechados</h3>
        </ion-text>
        <div v-if="!closedSolicitations || closedSolicitations.length === 0" class="ion-padding">
          Não há atendimentos no histórico
        </div>
        <div v-else>
          <ion-list :inset="true">
            <ion-item
              :button="true"
              detail="false"
              v-for="solicitation in closedSolicitations"
              :key="solicitation.solicitationId"
              @click="clkSolicitation(solicitation)"
            >
              <ion-label>
                <strong>{{ solicitation.departmentName }}</strong>
                <ion-text v-if="solicitation.childName">{{ solicitation.childName }}</ion-text><br v-if="solicitation.childName"/>
                <ion-note color="medium" class="ion-text-wrap">
                  {{ solicitation.description }}
                </ion-note>
              </ion-label>
              <div class="metadata-end-wrapper" slot="end">
                <ion-note color="medium">{{ solicitation.createdAt }}</ion-note>
              </div>
            </ion-item>
          </ion-list>
        </div>
      </div>

      <ion-fab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        @click="clkNewSolicitation"
      >
        <ion-fab-button>
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonHeader, IonToolbar, IonTitle,
  IonText,
  IonLabel,
  IonFab, IonFabButton, IonIcon,
  IonList, IonItem, IonNote,
} from '@ionic/vue';
import {
  add,
} from 'ionicons/icons';
import { useFetch } from '@/composables/fetch';
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
</script>

<script>
export default {
  name: "SolicitationsHome",
  data() {
    return {
      openSolicitations: null,
      departments: null,
      closedSolicitations: null,
    }
  },
  mounted() {
    utils.loading.hide()
    this.startView()
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsParents/solicitationsHome') {
        this.startView()
      }
    }
  },
  methods: {
    startView () {
      this.getOpenSolicitations()
      this.getClosedSolicitations()
    },
    clkSolicitation (sol) {
      this.$router.push(`/solicitationChatParent?solicitationId=${sol.solicitationId}`)
    },
    clkNewSolicitation () {
      this.$router.push('/newParentSolicitation')
    },
    async getOpenSolicitations() {
      const opt = {
        route: '/mobile/solicitations/getSolicitationsByStatus',
        body: {
          isActive: '1',
          status: ['notRead', 'inTreatment']
        }
      }
      const r = await useFetch(opt)
      if (r.error) return
      this.openSolicitations = r.data
    },
    async getClosedSolicitations() {
      const opt = {
        route: '/mobile/solicitations/getSolicitationsByStatus',
        body: {
          isActive: '1',
          status: ['closed']
        }
      }
      const r = await useFetch(opt)
      if (r.error) return
      this.closedSolicitations = r.data
    }
  }
};
</script>
<style scoped>


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