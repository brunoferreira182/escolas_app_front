<template>
  <ion-page>
    <ToolbarEscolas
      title="Calendário"
      :backButton="true"
    />
    <ion-content color="light">
      <ion-grid class="ion-align-items-center ion-justify-content-center">
        <ion-row>
          <ion-col size="12">
            <ion-datetime style="background-color: white;border-radius: 5%;" 
            presentation="date" 
            value="2023-01-01" 
            :highlighted-dates="highlightedDates"
          />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script setup>
import { 
    IonDatetime, 
    IonPage, 
    IonContent, 
    IonGrid, 
    IonCol,
    IonRow 
  } from '@ionic/vue';
  import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
</script>

<script>
  export default {
    components: { IonDatetime },
    data() {
      return {
        highlightedDates: [
          {
            date: '2023-01-05',
            textColor: '#800080',
            backgroundColor: '#ffc0cb',
          },
          {
            date: '2023-01-10',
            textColor: '#09721b',
            backgroundColor: '#c8e5d0',
          },
          {
            date: '2023-01-20',
            textColor: 'var(--ion-color-secondary-contrast)',
            backgroundColor: 'var(--ion-color-secondary)',
          },
          {
            date: '2023-01-23',
            textColor: 'rgb(68, 10, 184)',
            backgroundColor: 'rgb(211, 200, 229)',
          },
        ]
      }
    },
  };
</script>