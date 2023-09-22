<template>
  <div style="position: relative" class="ion-text-center">
    <ion-chip
      class="chip"
      color="primary"
      :outline="!item.selected"
      @click="setPreferencesToArray(item, i)"
      v-for="(item, i) in preferences"
      :key="i"
    >
      {{ item.label }}
    </ion-chip>
  </div> 
</template>

<script setup>
import {
  IonPage,
  IonGrid,
  IonButton,
  IonCol,
  IonRadio, IonRadioGroup,
  IonList,
  IonLabel,
  IonChip,
  IonItem,
  IonRow,
  IonContent
} from '@ionic/vue';
import { 
  closeCircle,
} from 'ionicons/icons';
import { useFetch } from '../../composables/fetch';
</script>
<script>

export default {
  name: "UserPreferences",
  data() {
    return {
      preferences: [],
      step: '1',
    };
  },
  props: [
    'userType',
    'selected'
  ],
  mounted(){
    this.selected ? 
    this.preferences = this.selected :
    this.getPreferences()
  },
  methods: {
    setPreferencesToArray(item, i){
      this.preferences[i].selected ?
      this.preferences[i].selected = false :
      this.preferences[i].selected = true
      this.$emit('setPreferences',this.preferences)
      // this.selectedPrefs.includes(item) ? 
      // this.selectedPrefs.splice(this.selectedPrefs.indexOf(item) ,1) : 
      // this.selectedPrefs.push(item)
    },
    getPreferences(){
      const opt = {
        route: '/mobile/profile/getPreferences',
      }
      useFetch(opt).then(r =>{
        this.preferences = r.data
      })
    },
  }
};
</script>
<style scoped>

.chip{
  padding: 16px;
  border-radius: 2rem;
  position: relative;
}

</style>