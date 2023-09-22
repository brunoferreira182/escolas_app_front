<template>
  <div class="q-px-md " style="position: relative;">
    <div class="cardAlign">
      <img  src="/assets/oldgrannies.png" style="height: 60px;position: absolute;left: 50%;translate: -50% 0;top:-45px;filter: blur(0.5px);">
      <div 
        v-for="(item,i) in userTypes" 
        :key="i"
        :class="`card-types ${selectedCard ? selectedCard.name === item.name ? 'card-active' : '' : ''}`"
        @click="clkCard(item)"
      >
        <div class="card-title gradient-text q-pt-md ion-text-center">{{ item.label }}</div>
        <div class="card-description" v-if="item.name === 'serviceProvider'">{{ companyDescribleText }}</div>
        <div class="card-description" v-if="item.name === 'client'">{{ customerDescribleText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  IonPage,
  IonContent
} from '@ionic/vue';
import { useFetch } from '../../composables/fetch';
</script>
<script>

export default {
  name: "UserType",
  data() {
    return {
      selectedCard: null,
      userTypes: [],
      companyDescribleText: 'Desejo oferecer meus serviços como cuidador.',
      customerDescribleText: 'Busco serviços de cuidadores',
    };
  },
  props: [
    'selected'
  ],
  mounted(){
    this.getUserTypes()
    if (this.selected)this.selectedCard = this.selected
  },
  methods: {
    setUserType(){
      this.$emit('setUserType',this.selectedCard)
    },
    getUserTypes(){
      const opt = {
        route: '/mobile/profile/getUserTypes',
      }
      useFetch(opt).then(r =>{
        this.userTypes = r.data
      })
    },
    clkCard (item) {
      if (this.selectedCard === item)this.selectedCard = null
      else this.selectedCard = item
      this.setUserType()
    },
  }
};
</script>
<style scoped>
.cardAlign{
  margin-top: 50px;
  position: relative;
}
.card-types {
  margin: 10px;
  margin-inline: 30px;
  padding: 35px;
  padding-top: 1;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 0.1px solid #ebebec;
  box-shadow: 0px 0px 5px rgb(239, 239, 239);
}
.card-types:active{
  border: 1px solid var(--ion-color-primary);
  box-shadow: inset 0 0 10px -3px #3733b6;
}
.card-active {
  border: 1px solid var(--ion-color-primary);
  box-shadow: inset 0 0 10px -5px #3733b6;
}
.card-title {
  font-family: Ubuntu;
  font-weight: 500;
  font-size: 22px;
  color: #2a2a2a;
  margin-top: -20px;
  padding-bottom: 5px ;
}
.card-description {
  font-size: 16px;
  /* border-top: 0.1px solid #ebebec;
  padding-top: 20px; */
  text-align: center;
  margin: 0px;
  color: var(--ion-color-medium);
}
</style>