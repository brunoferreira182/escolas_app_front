<template>
      <div style="position: relative;">
        <div class="q-mx-sm">
          <h2>Competências</h2>
          <ion-list>
            <ion-item
              lines="none"
              v-for="(skill,i) in skills"
              :key="i"
            >
              <ion-label>
                <h2 style="font-weight: 500;">{{ skill.skill.name }}</h2>
                <p>{{ skill.skill.description }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
          <ion-button
            fill="clear"
            style="--border-radius: 2rem;"
            id="skills"
          >
            Adicionar competências
            <ion-icon :icon="add" slot="start"></ion-icon>
          </ion-button>
          <h2>Anexos</h2>
          <div style="display: flex; gap: 20px;margin-left: 10px;">
            <div
              v-for="(image,i) in images"
              :key="i"
              style="position: relative;"
            >
              <ion-button 
                shape="rounded"
                class="img-remove-button"
                @click="removeImage(image._id)"
              >
                <ion-icon style="scale: 7;" slot="icon-only" :icon="close"/>
              </ion-button>
              <img 
                style="max-height: 130px;border-radius: 0.375rem;" 
                :src="utils.attachmentsAddress() + image.filename"
              >
            </div>
          </div>
          <ion-button
            fill="clear"
            style="--border-radius: 2rem;"
            id="photos"
            @click="openPhotoHandler"
          >
            Adicionar fotos
            <ion-icon :icon="add" slot="start"></ion-icon>
          </ion-button>
          <PhotoHandler
            v-show="startPhotoHandler"
            :start="startPhotoHandler"
            :allFiles="true"
            :noCrop="false"
            @captured="captured"
            @cancel="cancelPhotoHandler"
          />


          <ion-modal trigger="skills" ref="skills">
            <ion-content>
              <div style="padding-top: var(--ion-safe-area-top);">
                <ion-button
                  @click="$refs.skills.$el.dismiss()"
                  fill="clear"  
                >
                  <ion-icon color="primary" :icon="close" slot="icon-only"></ion-icon>
                </ion-button>
              </div>
              <div class="q-mx-lg">
                <h5>
                  Nova competência
                </h5>
                  <div class="input-wrapper">
                    <ion-input v-model="newSkill.name" placeholder="Nome"/>
                  </div>
                  <div class="input-wrapper">
                    <ion-input v-model="newSkill.description" placeholder="Descrição"/>
                  </div>
                <ion-button
                  expand="block"
                  @click="saveSkill"
                >
                  Adicionar
                  <ion-icon :icon="add" slot="start"></ion-icon>
                </ion-button>
              </div>
              <div v-if="skills.length > 0" class="q-ma-md text-h5" style="font-weight: 500;">
                Suas Competências
              </div>
              <div 
                v-if="skills.length > 0" 
                class="q-mx-lg" 
                style="
                  font-size: 14px;
                  color: var(--ion-color-medium);
                  margin-top: -10px;"
              >
                Arraste para apagar
              </div>
              <ion-list ref="skillsList" inset="true">
                <ion-reorder-group :disabled="skills.length < 2" @ionItemReorder="handleReorder($event)">
                  <ion-item-sliding
                    v-for="(skill,i) in skills"
                    :key="i"
                  >
                    <ion-item
                      lines="none"
                      style="--background: var(--ion-color-light);"
                    >
                      <ion-label> 
                        <h3 style="font-weight: 500;">{{ skill.skill.name }}</h3>
                        <p>{{ skill.skill.description }}</p>
                      </ion-label>
                      <ion-reorder slot="end"></ion-reorder>
                    </ion-item>
                    <ion-item-options>
                      <ion-item-option @click="deleteSkill(i)">Apagar</ion-item-option>
                    </ion-item-options>
                  </ion-item-sliding>
                </ion-reorder-group>
              </ion-list>
              <div style="height: 100px;"></div>
            </ion-content>
          </ion-modal>

          <div style="height: 100px;"></div>
        </div>
      </div>
</template>


<script setup>
import {
  IonPage,
  IonContent,
  IonButton,
  IonModal,IonInput,
  IonList,IonLabel,
  IonReorder,IonReorderGroup,
  IonItem,IonIcon,
  IonItemSliding,IonItemOption,IonItemOptions
} from '@ionic/vue';
import { add, close } from 'ionicons/icons'
import PhotoHandler from '../PhotoHandler.vue'
import { useFetch } from '../../composables/fetch'
import utils from '../../composables/utils'
</script>
<script>
export default {
  name: "UserSkills",
  data() {
    return {
      images: [],
      skills: [],
      newSkill: {
        name: '',
        description: '',
      },
      startPhotoHandler: false,
    };
  },
  mounted () {
    this.getImages()
    this.getSkills()
  },
  methods: {
    addSkill () {
      this.skills.push({...this.newSkill})
      this.$emit('skillsChanged',this.skills)
      this.newSkill.name = ''
      this.newSkill.description = ''
    },
    handleReorder (event) {
      this.skills = event.detail.complete(this.skills);
    },
    deleteSkill(i) {
      const opt = {
        route: '/mobile/profile/deleteSkills',
        body: {
        skillId
        }
      }
      
        this.$refs.skillsList.$el.closeSlidingItems()
      this.skills.splice(i,1)
    },
    openPhotoHandler () {
      this.startPhotoHandler = true
    },
    cancelPhotoHandler () {
      this.startPhotoHandler = false
    },
    captured(fileUrl, fileBlob, fileName) {
      this.saveImage(fileBlob)
      this.$emit('imagesChanged',fileBlob,fileUrl)
      this.startPhotoHandler = false
    },
    saveImage (fileBlob) {
      const opt = {
        route: '/mobile/profile/addAttachmentsToProfile',
        file: [fileBlob]
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        this.getImages()
        utils.loading.hide()
      })
    },
    getImages () {
      const opt = {
        route: '/mobile/profile/getAttachmentsByUserId',
      }
      useFetch(opt).then(r => {
        this.images = r.data
      })
    },
    removeImage (imageId) {
      const opt = {
        route: '/mobile/profile/deleteAttachmentsByUserId',
        body: {
          attachmentId: imageId
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.getImages()
      })
    },
    saveSkill () {
      const opt = {
        route: '/mobile/profile/insertUserSkills',
        body: {
          skill: this.newSkill
        }
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading.hide()
        this.getSkills()
      })
    },
    getSkills () {
      const opt = {
        route: '/mobile/profile/getUserSkills',
      }
      utils.loading.show()
      useFetch(opt).then(r => {
        utils.loading .hide()
        this.skills = r.data
      })
    },
  }
};
</script>
<style scoped>
.input-wrapper {
  border: 1px solid #ebebec;
  padding-left: 15px;
  border-radius: 0.5rem;
  margin-block: 10px;
}
.img-remove-button {
  position: absolute;
  top: -15px;
  left:-15px;
  --border-radius:3rem;
  height:35px;
  width: 35px;
}
</style>