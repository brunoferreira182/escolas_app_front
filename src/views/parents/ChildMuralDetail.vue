<template>
  <ion-page>
    <ToolbarEscolas
      title="Mural do aluno"
      :backButton="true"
    />
    <ion-content class="ion-padding" color="light">
      
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonContent, IonList,
  IonItem, IonButton, IonIcon,
  IonLabel, IonCard, IonCardContent,
  IonCardHeader, IonCardSubtitle,
  IonCardTitle
} from '@ionic/vue';
import { trashOutline, checkmarkOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
</script>
<script>
export default {
  name: "ChildMuralDetail",
  data() {
    return {
      mural: null
    };
  },
  beforeMount () {
    // this.getChildMural()
  },
  methods: {
    getChildMural() { 
      const opt = {
        route: '/mobile/parents/childMural/getChildMural',
        body: {
          childId: this.$route.query.childId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente mais tarde")
          return
        }
        this.mural = r.data
      })
    },
    
  }
}
</script>