<template>
  <ion-page>
    <ToolbarEscolas
      title="Cardápio"
      :backButton="true"
    />
    <ion-content color="light">
      
      <div class="q-ma-md"  style="display: flex;">
        <ion-select placeholder-placement="floating" fill="outline" justify="end" placeholder= "Mes">
          <ion-select-option v-for="month in months" :key="month"> {{ month.value + 1 }}</ion-select-option>
        </ion-select>
        <ion-select placeholder-placement="floating" fill="outline" class="q-pl-sm" placeholder= "Ano">
          <ion-select-option v-for="year in years" :key="year"> {{ year }}</ion-select-option>
        </ion-select>
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
      </div>
      <div class="q-ma-md">
        <ion-img 
          :src="utils.makeFileUrl(menuData)"
          alt="Erro ao encontrar cardápio!"
        ></ion-img>
      </div>
      <!-- <ion-modal :keep-contents-mounted="true">
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
      </ion-list> -->

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
      menuData: null,
      selecteDate: null,
      date: null,
      months: [
        { nome: "Janeiro", value: 1 },
        { nome: "Fevereiro", value: 2 },
        { nome: "Março", value: 3 },
        { nome: "Abril", value: 4 },
        { nome: "Maio", value: 5 },
        { nome: "Junho", value: 6 },
        { nome: "Julho", value: 7 },
        { nome: "Agosto", value: 8 },
        { nome: "Setembro", value: 9 },
        { nome: "Outubro", value: 10 },
        { nome: "Novembro", value: 11 },
        { nome: "Dezembro", value: 12 }
      ],
      years:[2024, 2025, 2026, 2027],
      selectedMenu: {}
    };
  },
  mounted () {
    this.getMenuFile()
  },
  methods: {
    onChangeDate($event, c) {
      this.dateSelected = $event.detail.value.split('T')[0]
      this.getMenuByTodaysDate()
    },
    dismissModal(){
      this.openModal = false
    },
    // getMenuByTodaysDate(){
    //   const opt = {
    //     route: '/mobile/social/getMenuByTodaysDate',
    //     body: {
    //       dateSelected: this.dateSelected
    //     }
    //   }
    //   useFetch(opt).then(r => {
    //     if(r.error){
    //       utils.toast('Não foi possível obter o cardápio do dia, tente novamente mais tarde.')
    //       return
    //     }
    //     this.menuData = r.data
    //   })
    // },
    getMenuFile(){
      let year, month
      if (!this.date){
        const date = new Date()
        month = date.getMonth()
        year = date.getYear()
      }
      console.log(this.date, 'dkjnaksjdnkjasnkj')
      const opt = {
        route: '/mobile/social/getMenuFile',
        body: {
          month : month,
          year : year
        }
      }
      useFetch(opt).then(r => {
        if(r.error){
          utils.toast('Não foi possível obter o cardápio, tente novamente mais tarde.')
          return
        }
        // console.log(r.data, 'coisa');
        this.menuData = r.data
        // console.log(this.menuData)
      })
    },
  }
}
</script>
