<template>
  <ion-page>
    <ToolbarEscolas
      title="Atendimentos"
      :backButton="true"
    />
    <ion-content color="light" :fullscreen="true">

      <ion-text>
        <h3 class="q-mx-md">Seus departamentos:</h3>
      </ion-text>
      <div class="q-mx-md">
        <ion-chip
          v-for="dept in openSolicitations?.userDepartments"
          :key="dept.departmentId"
        >{{ dept.name }}</ion-chip>
      </div>

      <ion-text>
        <h3 class="q-mx-md">Atendimentos abertos</h3>
      </ion-text>
      <div v-if="!openSolicitations || openSolicitations.list.length === 0" class="ion-padding">
        Não há atendimentos em aberto
      </div>
      <div v-else>
        <ion-list :inset="true">
          <ion-item
            :button="true"
            detail="false"
            v-for="solicitation in openSolicitations.list"
            :key="solicitation.solicitationId"
            @click="clkSolicitation(solicitation)"
          >
            <ion-label>
              <strong>{{ solicitation.departmentName }}</strong>
              <ion-text>Por: {{ solicitation.openedBy }}</ion-text><br>
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
  IonChip
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
  name: "SolicitationsHomeWorkers",
  data() {
    return {
      openSolicitations: null,
    }
  },
  mounted() {
    utils.loading.hide()
    this.startView()
  },
  methods: {
    startView () {
      this.getOpenSolicitations()
    },
    clkSolicitation (sol) {
      this.$router.push(`/solicitationChatParent?solicitationId=${sol.solicitationId}`)
    },
    async getOpenSolicitations() {
      const opt = {
        route: '/mobile/workers/getSolicitationsByStatus',
        body: {
          isActive: '1',
          status: ['notRead', 'inTreatment']
        }
      }
      const r = await useFetch(opt)
      if (r.error) return
      this.openSolicitations = r.data
    },
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