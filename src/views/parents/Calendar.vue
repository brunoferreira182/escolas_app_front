<template>
  <ion-page>
    <ToolbarEscolas
      title="Agenda"
      :backButton="true"
    />
    <ion-content color="light">
      <ion-grid class="ion-align-items-center ion-justify-content-center">
        <ion-row>
          <ion-col size="12">
            <h2 class="q-px-md">Eventos:</h2>
            <ion-list :inset="true">
              <ion-item 
                v-for="event in eventsList"
                :key="event"
                @click="$router.push()"
              >
                <ion-label>
                  <div class="ion-text-capitalize text-h5">
                    {{ event.eventName }}
                  </div>{{ event.eventDate.local }}
                  <br/>
                  {{ event.eventDescription }}
                </ion-label> <br/>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script setup>
import { 
  IonDatetime, 
  IonPage, 
  IonContent, 
  IonGrid, 
  IonCol,
  IonLabel,
  IonList,
  IonItem,
  IonRow 
} from '@ionic/vue';
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'
</script>

<script>
  export default {
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
  };
</script>