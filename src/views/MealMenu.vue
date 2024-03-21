<template>
  <ion-page>
    <ToolbarEscolas
      title="Cardápio"
      :backButton="true"
    />
    <ion-content color="light">
      
      <div class="q-ma-md"  style="display: flex;">
        <ion-select v-model="date.month"  justify="end" placeholder= "Mes">
          <ion-select-option :value="month.value" v-for="month in months" :key="month.value"> {{ month.nome }}</ion-select-option>
        </ion-select>
        <ion-select v-model="date.year" class="q-pl-sm" placeholder= "Ano">
          <ion-select-option :value="year" v-for="year in years" :key="year"> {{ year }}</ion-select-option>
        </ion-select>
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
  IonSelect, IonSelectOption,
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
      dateSend: null, 
      menuData: null,
      date: {
        month: '',
        year: '',
      },
      months: [
        { nome: "Janeiro", value: 0 },
        { nome: "Fevereiro", value: 1 },
        { nome: "Março", value: 2 },
        { nome: "Abril", value: 3 },
        { nome: "Maio", value: 4 },
        { nome: "Junho", value: 5 },
        { nome: "Julho", value: 6 },
        { nome: "Agosto", value: 7 },
        { nome: "Setembro", value: 8 },
        { nome: "Outubro", value: 9 },
        { nome: "Novembro", value: 10 },
        { nome: "Dezembro", value: 11 }
      ],
      years:['2024', '2025', '2026', '2027'],
      selectedMenu: {}
    };
  },
  mounted () {
    this.getMenuFile()
  },
  watch:{
    date:{
      handler: 'watcherDate',
      deep:true
    }
  },
  methods: {
    onChangeDate($event, c) {
      this.dateSelected = $event.detail.value.split('T')[0]
      this.getMenuByTodaysDate()
    },
    dismissModal(){
      this.openModal = false
    },
    watcherDate(){
      this.makeDatefullSend()
      this.getMenuFile()
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
    async makeDatefullSend(){
      this.dateSend = this.date.month + "/" + this.date.year
      console.log(this.dateSend, 'osndansljansdlka');
    },
    getMenuFile(){
      let year, month
      if (this.date.month ==='' && this.date.year ===''){
        const date = new Date()
        month = date.getMonth()
        year = date.getYear()
      }
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
