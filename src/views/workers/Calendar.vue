<template>
  <ion-page>
    <ToolbarEscolas
      title="Calendário"
      :backButton="true"
    />
    <ion-content class="q-mt-lg ion-text-center" color="light">
      <ion-grid class="ion-align-items-center ion-justify-content-center">
        <ion-row>
          <ion-col size="12">
            <ion-datetime class="q-ml-sm"></ion-datetime>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>


<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import { IonDatetime } from '@ionic/vue';
</script>

<script>
  import { defineComponent } from 'vue';
  import { IonPage, IonContent, IonGrid, IonCol,
    IonRow } from '@ionic/vue';
  export default defineComponent({
    components: { IonDatetime },
  });
</script>