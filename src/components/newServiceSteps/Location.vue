<template>
  <div class="q-pa-md" style="position: relative;">
    <h1>
      Estado
    </h1>
    <ion-item 
      id="select-state"
      button
      lines="full"
    >
      {{stateSelected ? stateSelected.nome : 'Selecione seu estado'}}
    </ion-item>
    <h1>
      Cidade
    </h1>
    <ion-item 
      id="select-city"
      button
      lines="full"
    >
    {{citySelected ? citySelected.nome : 'Selecione a sua cidade'}}
    </ion-item>

    <ion-modal trigger="select-state" ref="statemodal">
      <ion-content>
        <div style="padding-top: var(--ion-safe-area-top);">
          <ion-button
            @click="$refs.statemodal.$el.dismiss()"
            fill="clear"  
          >
            <ion-icon color="primary" :icon="close" slot="icon-only"></ion-icon>
          </ion-button>
        </div>
        <ion-searchbar
          style="margin-top: -5px;"
          placeholder="Pesquisar estado"
          :debounce="400"
          @ionInput="filterStates($event)"
        />
        <p 
          v-if="statesFilter.length === 0"
          class="q-px-lg q-my-none" 
          style="color:var(--ion-color-medium)"
        >
          Pesquise seu estado e toque no item da lista para selecionar.
        </p>
        <ion-list inset="true" style="margin-top: 0px;">
          <ion-item
            button
            @click="selectState(state)"
            lines="full"
            style="--background: var(--ion-color-light);"
            v-for="(state,i) in statesFilter"
            :key="i"

          > {{ state.nome }} </ion-item>
        </ion-list>
      </ion-content>
    </ion-modal>
    <ion-modal trigger="select-city" ref="citymodal" @didDismiss="cities = []">
      <ion-content>
        <div style="padding-top: var(--ion-safe-area-top);">
          <ion-button
            @click="$refs.citymodal.$el.dismiss()"
            fill="clear"  
          >
            <ion-icon color="primary" :icon="close" slot="icon-only"></ion-icon>
          </ion-button>
        </div>
        <ion-searchbar
          style="margin-top: -5px;"
          placeholder="Pesquisar cidade"
          :debounce="400"
          @ionInput="getCitiesByStateId($event)"
        />
        <p 
          v-if="cities.length === 0"
          class="q-px-lg q-my-none"
          style="color:var(--ion-color-medium)"
        >
          Pesquise sua cidade e toque no item da lista para selecionar (digite pelo menos 3 letras).
        </p>
        <ion-list inset="true" style="margin-top: 0px;">
          <ion-item
            button
            @click="selectCity(city)"
            lines="full"
            style="--background: var(--ion-color-light);"
            v-for="(city,i) in cities"
            :key="i"
          > {{ city.nome }} </ion-item>
        </ion-list>
      </ion-content>
    </ion-modal>

  </div>
</template>


<script setup>
import {
  IonPage,
  IonContent,
  IonSelect,
  IonIcon,
  IonSelectOption,
  IonModal,
  IonItem,
  IonSearchbar,
  IonList,
  IonButton
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch';
import {close} from 'ionicons/icons'
</script>
<script>

export default {
  name: "LocationStep",
  data() {
    return {
      states: [],
      statesFilter: [],
      stateSelected: null,
      cities: [],
      citySearchString: '',
      citySelected: null,
      statesLoaded: false
    };
  },
  props: [
    'selected'
  ],
  mounted(){
    this.getStates()
    if (this.selected.city) {
      this.citySelected = this.selected.city
      this.stateSelected = this.selected.state
    }
  },
  methods: {
    getStates(){
      const opt = {
        route: '/mobile/profile/getStates',
      }
      useFetch(opt).then(r =>{
        this.states = r.data
        this.statesFilter = r.data
        this.statesLoaded = true
      })
    },
    filterStates(event) {
      const query = event.target.value.toLowerCase();
      this.statesFilter = this.states.filter((d) => d.nome.toLowerCase().indexOf(query) > -1);
    },
    selectState(state) {
      this.stateSelected = state
      this.citySelected = null
      this.$emit("stateSelected", state)
      this.$refs.statemodal.$el.dismiss()
    },
    getCitiesByStateId (event) {
      if (event.target.value.length >= 2) {
        const opt = {
          route: '/mobile/profile/getCitiesByStateId',
          body: {
            codigo_uf: this.stateSelected.codigo_uf,
            searchString: event.target.value.toLowerCase()
          }
        }
        useFetch(opt).then(r =>{
          this.cities = r.data
        })
      } else {
        this.cities = []
      }
    },
    selectCity(city) {
      this.citySelected = city
      this.$emit("citySelected", city)
      this.$refs.citymodal.$el.dismiss()
    }
  }
};
</script>
<style scoped>
  * {
    color: #2a2a2a;
  }
</style>