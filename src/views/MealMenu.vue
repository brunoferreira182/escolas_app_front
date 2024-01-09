<template>
  <ion-page>
    <ToolbarEscolas
      title="Cardápio"
      :backButton="true"
    />
    <ion-content color="light">
      
      <div class="q-mt-md">
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
      </div>
      <ion-modal :keep-contents-mounted="true">
        <ion-datetime
          id="datetime"
          presentation="date"
          @ionChange="onChangeDate($event, c)"
        ></ion-datetime>
      </ion-modal>

      <ion-list
        :inset="true"
        v-for="e in menuData"
        :key="e"
      >
        <ion-item detail="false">
          <ion-label>
            <div class="q-mb-md">
              <strong class="text-capitalize">{{ e.name }}</strong>
            </div>
            <div v-html="e.content"></div>
          </ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { 
  IonPage, 
  IonButton, 
  IonContent, 
  IonImg, 
  IonList, 
  IonRow,
  IonCol,
  IonBadge,
  IonChip, 
  IonAvatar,
  IonModal,
  IonItem, 
  IonLabel, 
  IonNote,
  IonIcon,
  IonDatetimeButton, IonDatetime
} from '@ionic/vue';
import { defineComponent } from 'vue';
import ToolbarEscolas from '../components/ToolbarEscolas.vue'
import utils from '../composables/utils'
import { useFetch } from '@/composables/fetch';
</script>

<script>
export default {
  name: 'More',
  data() {
    return {
      openModal: false,
      menuData: [],
      selecteDate: null,
      selectedMenu: {}
    };
  },
  mounted () {
    this.getMenuByTodaysDate()
  },
  methods: {
    onChangeDate($event, c) {
      this.dateSelected = $event.detail.value.split('T')[0]
      this.getMenuByTodaysDate()
    },
    dismissModal(){
      this.openModal = false
    },
    getMenuByTodaysDate(){
      const opt = {
        route: '/mobile/social/getMenuByTodaysDate',
        body: {
          dateSelected: this.dateSelected
        }
      }
      useFetch(opt).then(r => {
        if(r.error){
          utils.toast('Não foi possível obter o cardápio do dia, tente novamente mais tarde.')
          return
        }
        this.menuData = r.data
      })
    },
  }
}
</script>
