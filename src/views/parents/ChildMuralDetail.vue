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
        <!-- <h3>Mural do dia</h3> -->
        <!-- <ion-note>Escolha uma data para ver de outros dias</ion-note> -->
        <ion-datetime-button
          datetime="datetimeChildMural"
        />
      </ion-text>


      <h2 class="q-px-md">Comparecimento</h2>
      <ion-list :inset="true" v-if="mural?.attendance">
        <ion-item 
          v-for="e in mural?.attendance"
          :key="e"
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
          </div>
        </ion-item>
      </ion-list>
      <div v-else class="q-px-md text-caption">
        Não há dados de comparecimento
      </div>

      <h2 class="q-pt-lg q-px-md">Atividades</h2>
      <ion-list :inset="true" v-if="mural?.activities">
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

    <ion-modal :keep-contents-mounted="true">
      <ion-datetime
        id="datetimeChildMural"
        presentation="date"
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
      dateSelected: null
    };
  },
  beforeMount () {
    this.getChildMural()
  },
  methods: {
    onChangeDate($event, c) {
      this.dateSelected = $event.detail.value.split('T')[0]
      this.getChildMural()
    },
    async getChildMural () { 
      const opt = {
        route: '/mobile/parents/childMural/getChildMural',
        body: {
          childId: this.$route.query.childId,
          dateSelected: this.dateSelected
        }
      }
      const r = await useFetch(opt)
      if (r.error) return
      this.mural = r.data
    },
    
  }
}
</script>