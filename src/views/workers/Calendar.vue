<template>
  <ion-page>
    <ToolbarEscolas
      title="Calendário"
      :backButton="true"
    />
    <ion-content color="light">
      <div class="ion-text-left text-h5 q-py-sm q-px-lg">Próximos eventos</div>
      <ion-list :inset="true" v-if="eventsList && eventsList.length">
        <ion-item 
          :button="true"
          v-for="event in eventsList"
          :key="event"
          class="q-pa-sm"
          @click="$router.push('/calendarEventDetail?schoolEventId=' + event._id)"
        >
          <div class="unread-indicator-wrapper" slot="start">
            <div class="unread-indicator"></div>
          </div>
          <ion-label>
            <div class="text-h6 ion-text-capitalize ">
              {{ event.eventName }}
            </div>
            <p>
              {{ event.eventDate.local.split('-')[2] }}/
              {{ event.eventDate.local.split('-')[1] }}/
              {{ event.eventDate.local.split('-')[0] }}
            </p>
            <p class="text ion-no-margin">
              {{ showFullDescription ? event.eventDescription : event.eventDescription.slice(0, 100) }}
              <button 
                class="more-button" 
                v-if="event.eventDescription.length > 100" 
                @click="showFullDescription = !showFullDescription"
              >
                <span v-if="!showFullDescription && event.eventDescription.length > 100">...</span>
                {{ showFullDescription ? 'Ver menos' : 'Ver mais' }}
              </button>
            </p>
            <!-- <p color="medium">{{ event.eventDescription }}</p> -->
          </ion-label>
        </ion-item>
      </ion-list>
      <div v-else class="q-px-lg">
        Não há eventos
      </div>
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
        showFullDescription: false,
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
<style scoped>
.more-button {
  background: none;
  border: none;
  color: #747474;
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