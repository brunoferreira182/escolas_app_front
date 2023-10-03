<template>
  <ion-page>
    <ToolbarEscolas
      title="Detalhes da turma"
      :backButton="true"
    />
    <ion-content color="light">
      //Foto da turma
      <!-- <ion-list :inset="true">
        <ion-item
          lines="none"
          class="profile-item"
        >
          <ion-avatar style="width:60px; height:auto" >
            <img :src="utils.makeFileUrl(userInfo.userImage)" class="profile-avatar">
          </ion-avatar>
          <ion-label class="q-px-sm">
            <h2>{{ userInfo.name }}</h2>
          </ion-label>
        </ion-item>
      </ion-list> -->
      <ion-list :inset="true">
        <ion-item>
          <h2>Mídia</h2>
        </ion-item>
      </ion-list>
      <ion-list :inset="true" class="q-pl-sm">
        <ion-accordion-group expand="inset">
          <ion-accordion value="first">
            <ion-item slot="header">  
              <ion-label>Alunos da turma</ion-label>
            </ion-item>
            <div slot="content">
              <ion-item
                v-for="child in classData"
                :key="child"
              >
                <ion-avatar aria-hidden="true" slot="start" v-if="child.childPhoto">
                  <img :src="utils.makeFileUrl(child.childPhoto.filename)"/>
                </ion-avatar>
                <ion-avatar aria-hidden="true" slot="start" v-else>
                  <img :src="utils.makeFileUrl(child.image)"/>
                </ion-avatar>
                <p>{{ child.childName }}</p>
              </ion-item>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
import {
  IonPage, IonContent,
  IonList, IonItem,
  IonLabel, IonAccordion,
  IonAccordionGroup, IonAvatar
} from '@ionic/vue'
</script>

<script>
import { useFetch } from '@/composables/fetch';
export default {
  components: {
  },
  data() {
    return {
      classData: null
    };
  },
  mounted () {
    this.getChildrenInClassByClassId()
  },
  methods: {
    getChildrenInClassByClassId() {
      const opt = {
        route: '/mobile/parents/chat/getClassDetailById',
        body: {
          classId: this.$route.query.classId
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.classData = r.data.childrenInClass
        } else {
          utils.toast("Ocorreu um erro, tente novamente mais tarde")
        }
      })
    }
  }
}
</script>
