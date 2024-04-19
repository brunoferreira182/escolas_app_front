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
          class="image"
          :src="utils.makeFileUrl(menuData.filename)"
          @click="openImageModal(menuData.filename)"
        />
        <ModalPinchZoomImage
          :modalImageUrl="modalImageUrl"
          :showModal="showModal"
          @closeModal="showModal = false"
        />
      </div>
      
    </ion-content>
  </ion-page>
</template>

<script setup>
import { 
  IonPage, 
  IonContent, 
  IonImg, 
  IonSelect, IonSelectOption,
} from '@ionic/vue';
import { ref } from 'vue';
import ToolbarEscolas from '../components/ToolbarEscolas.vue'
import { Zoom } from 'swiper/modules';
import utils from '../composables/utils'

import { useFetch } from '@/composables/fetch';

import ModalPinchZoomImage from '../components/ModalPinchZoomImage.vue'

const showModal = ref(false);
const modalImageUrl = ref(null);

const openImageModal = (imageFilename) => {
  modalImageUrl.value = utils.makeFileUrl(imageFilename);
  showModal.value = true;
};
</script>

<script>
export default {
  name: 'MealMenu',
  data() {
    return {
      openModal: false,
      modules: [Zoom],
      showModal: false,
      modalImageUrl: null,
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
    openImageModal(imageFilename) {
      this.modalImageUrl = utils.makeFileUrl(imageFilename);
      this.showModal = true;
    },
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
