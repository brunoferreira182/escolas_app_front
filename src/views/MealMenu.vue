<template>
  <ion-page>
    <ToolbarEscolas
      title="Cardápio"
      :backButton="true"
    />
    <ion-content color="light">
      
      <div class="q-ma-md"  style="display: flex;">
        <ion-select v-model="date.month"  justify="end" placeholder= "Mes">
          <ion-select-option 
            :value="month.value" 
            v-for="month in months" 
            :key="month.value"> {{ month.nome }}
          </ion-select-option>
        </ion-select>
        <ion-select v-model="date.year" class="q-pl-sm" placeholder= "Ano" hidden>
          <ion-select-option 
            :value="year" 
            v-for="year in years" 
            :key="year"> {{ year }}
          </ion-select-option>
        </ion-select>
      </div>
      <div class="q-ma-md" v-if="menuData">
        <ion-img 
          v-if="menuData"
          :src="utils.makeFileUrl(menuData.filename)"
        />
        <div v-else class="q-ma-sm "> Cardápio não encontrado</div>
      </div>
      
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
import PinchImage from '../components/PinchImage.vue'
</script>

<script>
export default {
  name: 'MealMenu',
  data() {
    return {
      openModal: false,
      dateSearch: '', 
      menuData: null,
      date: {
        month: '',
        year: '',
      },
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
      years:[],
      selectedMenu: {}
    };
  },
  beforeMount () {
    const date = new Date()
    let month = date.getMonth()
    console.log(this.months[month], 'month')
    this.date.month = this.months[month].value
    let year = date.getYear()
    year = year + 1900
    this.date.year = year.toString()
    this.years.push(this.date.year)
    // this.getMenuFile()
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
    makeDatefullSend(){
      return this.dateSearch = '0' + this.date.month + "/" + this.date.year
    },
    getMenuFile(){
      let year, month
      if (this.date.month ==='' && this.date.year ===''){
        const date = new Date()

        month = date.getMonth()
        month = '0' + (month + 1)
        month.toString()

        year = date.getYear()
        year = year + 1900
        year.toString()

        this.dateSearch = month + '/' + year  
      }
      const opt = {
        route: '/mobile/social/getMenuFile',
        body: {
          date: this.dateSearch,
        }
      }
      useFetch(opt).then(r => {
        if(r.error){
          utils.toast('Não foi possível obter o cardápio, tente novamente mais tarde.')
          return
        }
        this.menuData = r.data
      })
    },
  }
}
</script>
