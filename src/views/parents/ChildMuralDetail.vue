<template>
  <ion-page>
    <ToolbarEscolas
      title="Mural do aluno"
      :backButton="true"
    />
    <ion-content color="light">

      <div v-if="mural?.detail" class="ion-padding ion-text-center">
        <img
          :src="utils.makeFileUrl(mural.detail.userData.image)"
          :style="`border-radius: 50%; height: 250px; width: 250px; object-fit: cover; object-position: center;`"
        /><br>
        <ion-text>
          <h2>{{ mural.detail.userData.name }}</h2>
        </ion-text>
        
      </div>


      <ion-text class="ion-text-center">
        <ion-datetime-button
          datetime="datetimeChildMural"
          @click="isModalOpen = true"
        />
      </ion-text>


      <h2 class="q-px-md">Comparecimento</h2>
      <ion-list :inset="true" v-if="mural?.attendance.length">
        <ion-item 
          v-for="e in mural?.attendance"
          :key="e"
          class="q-ma-sm"
          detail="false"
        >
          <ion-label>
            {{ e.className }}
          </ion-label>
          <div slot="end">
            <ion-badge
              v-if="e.childAttendanceType === 'present'"
              color="success">Presença
            </ion-badge>
            <ion-badge
              v-else-if="e.childAttendanceType === 'absent'"
              color="danger">Ausência
            </ion-badge>
            <div class="text-caption">
              {{e.date.dateLocale}}
            </div>
          </div>
        </ion-item>
      </ion-list>
      <div v-else class="q-px-md text-caption">
        Não há dados de comparecimento
      </div>

      <h2 class="q-pt-lg q-px-md">Atividades</h2>
      <ion-list :inset="true" v-if="mural?.activities.length">
        <ion-item 
          v-for="e in mural?.activities"
          :key="e"
          detail="false"
        >
          <ion-label>
            {{ e.eventName }} {{ e.activitySubtype.toLowerCase() }}
            <!-- <ion-note color="medium" class="ion-text-wrap">
              {{ e.obs }}
            </ion-note> -->
          </ion-label>
          <div class="metadata-end-wrapper" slot="end">
            <ion-note color="medium">
              {{ e.createdAt.createdAtLocale.split(' ')[1] }}
            </ion-note>
          </div>
        </ion-item>
      </ion-list>
      <div v-else class="q-px-md text-caption">
        Não há dados de atividades
      </div>
    </ion-content>

    <ion-modal :is-open="isModalOpen" :keep-contents-mounted="true">
      <ion-datetime
        id="datetimeChildMural"
        presentation="date"
        :value="dateSelected"
        @ionChange="onChangeDate($event, c)"
      ></ion-datetime>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonContent, IonList,
  IonItem, IonButton, IonIcon,
  IonDatetime, IonModal, IonText, IonNote, IonDatetimeButton,
  IonLabel, IonBadge, 
} from '@ionic/vue';
import { trashOutline, checkmarkOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
</script>
<script>
export default {
  name: "ChildMuralDetail",
  data() {
    return {
      mural: null,
      dateSelected: null,
      isModalOpen: false
    };
  },
  beforeMount () {
    if(this.$route.query.date){
      const date = this.$route.query.date
      this.dateSelected = date
    }
    this.getChildMural()
  },
  methods: {
    onChangeDate($event, c) {
      this.dateSelected = $event.detail.value.split('T')[0];
      this.getChildMural();
      
      // Fechar o modal
      this.isModalOpen = false;
    },
    async getChildMural () { 
      const opt = {
        route: '/mobile/parents/childMural/getChildMural',
        body: {
          childId: this.$route.query.childId,
          dateSelected: this.dateSelected
        }
      }
      utils.loading.show()
      const r = await useFetch(opt)
      utils.loading.hide()
      if (r.error) return
      this.mural = r.data
    },
    
  }
}
</script>