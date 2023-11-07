<template>
  <ion-page>
    <ToolbarEscolas
      title="Calendário"
      :backButton="true"
    />
    <ion-content color="light">
      <ion-list :inset="true">
        <div class="ion-text-left text-h6 q-py-sm q-pl-md">Eventos</div>
        <ion-item 
          v-for="event in eventsList"
          :key="event"
          class="q-pa-sm"
          style="border-radius: 1rem"
          @click="$router.push('/eventDetail?eventId=' + event._id)"
        >
          <div class="unread-indicator-wrapper" slot="start">
            <div class="unread-indicator"></div>
          </div>
          <ion-label>
            <ion-badge 
              class="ion-text-capitalize "
              color="success"
            >
              {{ event.eventName }}
            </ion-badge>
            <h6> {{ event.eventDate.local }}</h6>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>


<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { IonPage, 
  IonContent, 
  IonGrid, 
  IonCol,
  IonBadge,
  IonLabel,
  IonList,
  IonItem,
  IonRow  } from '@ionic/vue';
</script>

<script>
  import { defineComponent } from 'vue';
  import { useFetch } from '../../composables/fetch'
  import utils from '../../composables/utils'
  export default defineComponent({
    data() {
      return {
        eventsList:[],
      }
    },
    beforeMount(){
      this.getSchoolEvents()
    },
    methods: {
      getSchoolEvents(){
        const opt = {
          route: '/mobile/social/getSchoolEvents',
          body: {
            page: 1,
            rowsPerPage: 100
          }
        }
        useFetch(opt).then((r) => {
          if (r.error) {
            utils.toast("Ocorreu um erro, tente novamente mais tarde")
            return
          }
          this.eventsList = r.data.list
        })
      },
    }
  });
</script>