<template>
  <ion-page>
    <ToolbarEscolas
      title="Comparecimento"
      :backButton="true"
    />
    <ion-content color="light" >
      <div class="ion-text-center q-px-md">
        <div class="q-ma-md " v-if="childAttendance.length">
          <ion-badge 
            class="text-subtitle1 q-mx-md" 
            style="background-color: #1d9b0d;" 
            color="primary"
          >
            Presença
          </ion-badge>
          <ion-badge 
            class="text-subtitle1" 
            style="background-color: #9b0d0d;" 
            color="primary"
          >
            Falta
          </ion-badge>
        </div>
        <div v-if="childAttendance.length">
          <ion-card
            v-for="c in childAttendance"
            :key="c"
          >
            <div class="">
              <ion-avatar aria-hidden="true" slot="center" style="width: 46px; height: 46px;">
                <img :src="utils.makeFileUrl(c.childPhoto ? c.childPhoto : null)"/>
              </ion-avatar>
            </div>
            <ion-label class="q-ma-md">
              <strong class="text-capitalize text-h5">{{ c.name }}</strong><br/>
            </ion-label>
            <ion-datetime 
              presentation="date" 
              class="q-ma-md"
              :preferWheel="false"
              style="border-radius: .5rem;"
              :highlighted-dates="highlightedDates"
            />
          </ion-card>
        </div>
        <div v-else>
          Nenhum dado de comparecimento
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>

import {
  IonPage, IonContent,
  IonBadge,
  IonCard,
  IonDatetime, 
  IonItem, IonLabel, IonList, IonAvatar,
} from '@ionic/vue';
import { defineComponent } from 'vue'
import ToolbarEscolas from '../components/ToolbarEscolas.vue'
import { useFetch } from '../../src/composables/fetch.js'
import utils from '../../src/composables/utils.js'
</script>
<script>

export default defineComponent({
  name: 'ChildrenAttendanceCalendar',
  data () {
    return {
      utils,
      childAttendance: [],
      highlightedDates: [],
    }
  },
  mounted () {
    utils.loading.clear()
    this.getChildAttendanceByDate()
  },
  watch: {
    $route (to, from) {
      if (to.path === '/childrenAttendanceCalendar') {
        this.getChildAttendanceByDate()
      }
    }
  },
  methods: {
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    getChildAttendanceByDate(){
      const opt = {
        route: '/mobile/workers/getChildAttendanceByDate',
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro ao exibir o calendário. Tente novamente mais tarde")
          return
        }
        console.log(r)
        this.childAttendance = r.data
        this.highlightedDates = r.data.map((item) => ({
          date: this.formatTimestamp(item.createdAt.createdAt),
          textColor: '#FFFFFF',
          backgroundColor: item.childAttendanceType === 'present' ? '#1d9b0d' : '#9b0d0d',
        }));
      })
    },
  }
});
</script>
<style scoped>
.present ion-badge {
  --background: #1d9b0d;
}
.absent ion-badge {
  --background: #9b0d0d;
  
}
</style>
