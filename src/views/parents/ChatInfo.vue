<template>
  <ion-page>
    <ToolbarEscolas
      title="Detalhes da turma"
      :backButton="true"
    />
    <ion-content class="ion-padding" color="light">
      <ion-list lines="none">
        <h2>Horários:</h2>
        <ion-item>
        </ion-item>
        <h2>Arquivos:</h2>
        <ion-item>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
import {
  IonPage, IonContent,
  IonList, IonItem
} from '@ionic/vue'
</script>

<script>
import { useFetch } from '@/composables/fetch';
export default {
  components: {
  },
  data() {
    return {
      
    };
  },
  mounted () {
  },
  methods: {
    

  }
}
</script>
