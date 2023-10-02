<template>
  <ion-page>
    <ToolbarEscolas
      title="Solicitações pendentes"
      :backButton="true"
    />
    <ion-content class="ion-padding" >
      <ion-list :inset="true">
        <ion-item 
          v-for="solicitation in familySolicitations"
          :key="solicitation"
        >
          <ion-label>
            <h6>{{ solicitation.sendTo }}</h6> 
            <ion-badge>{{ solicitation.status.label }}</ion-badge> 
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonBadge, IonLabel,
  IonItem,  IonList,
  IonContent, IonPage,
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch'
import InputDocument from '../../components/InputDocument.vue'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
</script>
<script>

export default {
  name: "UserPersonalData",
  data() {
    return {
      familySolicitations: []
    }
  },
  mounted () {
    this.getFamilySolicitationsStatusByFamily()
  },
  methods: {
    getFamilySolicitationsStatusByFamily() {
      const opt = {
        route: '/mobile/parents/profile/getFamiliesSolicitationsByFamilyId'
      }
      useFetch(opt).then((r) => {
        if(r.error) {
          utils.toast('Ocorreu um erro, tente novamente')
        }
        this.familySolicitations = r.data
      })
    }
  }
}
</script>
<style scoped>
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>