<template>
  <ion-page>
    
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Presença</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content color="light" :fullscreen="true">

      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">Presença</ion-title>
        </ion-toolbar>
      </ion-header>

      <div>
        <div v-if="childAttendance.length">
          <div
            v-for="(c, i) in childAttendance"
            :key="i"
          >
            <ion-text>
              <h3 class="q-mx-md">{{ c.name }}</h3>
            </ion-text>
            <Calendar
              expanded
              transparent
              borderless
              title-position="left"
              :attributes="c.dates"
              v-if="c.dates"
              @did-move="updatePages"
            />
          </div>
        </div>
        <div v-else class="q-pa-md">
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
  IonText, IonHeader, IonToolbar, IonTitle
} from '@ionic/vue';
import { defineComponent } from 'vue'
import ToolbarEscolas from '../components/ToolbarEscolas.vue'
import { useFetch } from '../../src/composables/fetch.js'
import utils from '../../src/composables/utils.js'
import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
</script>
<script>

export default defineComponent({
  name: 'ChildrenAttendanceCalendar',
  data () {
    return {
      utils,
      childAttendance: [],
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
    updatePages (event) {
      this.getChildAttendanceByDate(event[0].id)
    },
    onChangeDate($event, c) {
      const splitDate = $event.detail.value.split('T')
      const monthYear = splitDate[0].substring(0, 7)
      this.getChildAttendanceByDate(monthYear)
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    getChildAttendanceByDate(monthYear){
      const opt = {
        route: '/mobile/workers/getChildAttendanceByDate',
      }
      if (monthYear) opt.body = { monthYear }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro ao exibir o calendário. Tente novamente mais tarde")
          return
        }
        r.data.forEach((child, i) => {
          r.data[i].dates = []
          child.highlightedDates.forEach((date, j) => {
            r.data[i].dates.push({
              highlight: date.childAttendanceType === 'present' ? 'green' : 'red',
              dates: new Date(date.date),
            })
          })
        })
        this.childAttendance = r.data
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
