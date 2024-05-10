<template>
  <ion-page>
    <ToolbarEscolas
      title="Editar perfil"
      :backButton="true"
    />
    <ion-content color="light">
      <div v-if="userInfo" class="ion-padding">
        <div class="ion-text-center">
          <img
            :src="utils.makeFileUrl(userInfo.userImage)"
            :style="`border-radius: 50%; height: 250px; width: 250px; object-fit: cover; object-position: center;`"
          >
          <br/>
          <ion-button @click="startPhotoHandler = true" fill="clear">
            Editar
          </ion-button>
        </div>
        <div class="input-wrapper">
          <ion-input 
            v-model="userInfo.name"
            label="Nome completo"
            label-placement="floating" 
          >
          </ion-input>
        </div>
        <ion-button @click="updateUserProfileInfo" expand="block">Salvar alterações</ion-button>
      </div>
      <PhotoHandler
        v-show="startPhotoHandler"
        :start="startPhotoHandler"
        :allFiles="true"
        :noCrop="false"
        @captured="captured"
        @cancel="cancelPhotoHandler"
      />
    </ion-content>
  </ion-page>
</template>
<script setup>
import { IonPage, IonButton, IonContent, IonImg, IonInput } from '@ionic/vue';
import utils from '../../composables/utils'
import { useFetch } from '../../composables/fetch';
import PhotoHandler from '../../components/PhotoHandler.vue'
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
</script>
<script>
export default {
  data() {
    return {
      userInfo: null,
      startPhotoHandler: false,
      newName: '',
      profileImage: null
    };
  },
  name: "EditProfile",
  mounted () {
    this.startView()
  },
  methods: {
    async startView () {
      const userInfo = await this.getUserProfileById()
      this.userInfo = userInfo.data
    },
    async getUserProfileById() {
      const opt = {
        route: '/mobile/parents/profile/getUserProfileById'
      }
      return await useFetch(opt)
    },
    openPhotoHandler () {
      this.startPhotoHandler = true
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
    },
    captured(fileUrl, fileBlob, fileName) {
      this.updateProfileImg(fileBlob)
      this.startPhotoHandler = false
    },
    updateProfileImg(blob) {
      const opt = {
        route: '/mobile/parents/profile/updateUserImage',
        file: [ { file: blob, name: 'userPhoto' }]
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        if (r.error) return
        this.getUserProfileById()
      })
    },
    updateUserProfileInfo() {
      const opt = {
        route: '/mobile/parents/profile/updateUserProfileInfo',
        body: {
          name: this.userInfo.name
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        if(r.error){
          utils.toast(r.errorMessage)
        } 
        utils.toast('Dados atualizados com sucesso!')
        this.getUserProfileById()
        this.$router.back()
      })
    }
  },
};
</script>
<style scoped>
.profile-avatar {
  height: 100px;
  width: 100px;
  border-radius: 5rem;
}
.input-wrapper {
  border: 1px solid #ebebec;
  padding-left: 15px;
  border-radius: 0.5rem;
  margin-block: 10px;
}
</style>
