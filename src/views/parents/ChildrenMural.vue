<template>
  <ion-page>
    <ion-header class="ion-no-border" :translucent="true">
      <ion-toolbar>
        <ion-title>Mural</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content color="light" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar color="light">
          <ion-title size="large">Mural</ion-title>
          
        </ion-toolbar>
        <ion-note class="q-mx-md">Selecione a criança para ver o mural dela</ion-note>
      </ion-header>
      <div v-if="children" class="ion-text-center q-mt-xl">
        <ion-row>
          <ion-col
            v-for="child in children"
            :key="child.childData.childId"
            @click="clkChild(child)"
          >
            <img
              :src="utils.makeFileUrl(child.childData.childImage)"
              :style="`border-radius: 50%; height: ${widthChildImage}px; width: ${widthChildImage}px; `"
            /><br/>
            <ion-text>{{ child.childData.childName.split(' ')[0] }}</ion-text>
          </ion-col>
        </ion-row>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup>
import { 
  IonPage, IonNote,
  IonContent,
  IonList, IonItem, IonLabel,
  IonAlert,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonText,
  IonRow, IonCol
} from '@ionic/vue';

</script>
<script>
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'

export default {
  name: 'ChildrenMural',
  data() {
    return {
      children: null,
      widthChildImage: null
    };
  },
  beforeMount () {
    this.widthChildImage = window.innerWidth / 2.5
  },
  mounted () {
    utils.loading.clear()
    this.startView()
  },
  watch: {
    $route (to, from) {
      if (to.path === '/tabsLayout/childrenMural') {
        this.startView()
      }
    }
  },
  methods: {
    startView(){
      this.getParentChildren()
    },
    clkChild (child) {
      this.$router.push('/childMuralDetail?childId=' + child.childData.childId)
    },
    async getParentChildren () {
      const opt = {
        route: '/mobile/parents/profile/getParentChildren'
      }
      const r = await useFetch(opt)
      if (r.error) return
      this.children = r.data
    }
  }
}

</script>

