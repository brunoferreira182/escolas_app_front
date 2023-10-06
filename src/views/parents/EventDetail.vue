<template>
  <ion-page>
    <ToolbarEscolas
      title="Informações"
      :backButton="true"
    />
    <ion-content class="ion-padding" color="light">
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonButton,
  IonAlert,
  IonGrid,
  IonText,
  IonInput,
  IonRow,
  IonItem,
  IonLabel,
  IonCol,
  IonList,
  IonAvatar,
  IonBadge,
  IonContent,
  onIonViewWillEnter,
  IonIcon
} from '@ionic/vue';
import { trashOutline } from 'ionicons/icons';
import { useFetch } from '../../composables/fetch'
import InputDocument from '../../components/InputDocument.vue'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../composables/utils'
import PhotoHandler from '../../components/PhotoHandler.vue'
</script>
<script>

export default {
  name: "EventDetail",
  data() {
    return {
      eventDetail: null,
      pagination: {
        page: 1,
        rowsPerPage: 10
      }
    };
  },
  methods: {
    //Pegar o detalhe do evento
    getEventDetailById() { 
      const opt = {
        route: '',
        body: {
          eventId: this.$route.query.eventId
        }
      }
      useFetch(opt).then((r) => {
        if (r.error) {
          utils.toast("Ocorreu um erro, tente novamente mais tarde")
          return
        }
        this.eventDetail = r.data
      })
    },
    //Pegar o número de filhos que eu tenho e colocar os eventos em todos
    getChildInClassByParentId() {
      const opt = {
        route: '/mobile/parents/chat/getChildInClassByParentId',
        body: {
          classId: this.$route.query.classId ,
          page: this.pagination.page,
          rowsPerPage: this.pagination.rowsPerPage
        }
      }
      useFetch(opt).then((r) => {
        if (!r.error) {
          this.userChildren = r.data.children
        }
          else { 
            utils.toast("Ocorreu um erro, tente novamente")
          }
      })
    },
    //Aceitar ou autorizar filho a participar do evento
    acceptAuthorization(au) { 
      // console.log(au)
      // const opt = {
      //   route: '/mobile/parents/chat/respondClassEventSolicitation',
      //   body: {
      //     eventClassId: au._id ,
      //     childId: ,
      //     requireParentsPermission: true
      //   }
      // }
    },
    //Recusar ou não autorizar filho a participar do evento
    refuseAuthorization(au) { 
      // console.log(au)
      // const opt = {
      //   route: '/mobile/parents/chat/respondClassEventSolicitation',
      //   body: {
      //     eventClassId: au._id ,
      //     childId: ,
      //     requireParentsPermission: false
      //   }
      // }
    },
  }
};
</script>