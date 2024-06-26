<template>
  <ion-page>
    <ToolbarEscolas
      title="Novo atendimento"
      :backButton="true"
    />
    <ion-content color="light" >
      <ion-text>
        <p class="q-mx-md">Selecione o departamento</p>
      </ion-text>
      <ion-list :inset="true">
        <ion-item
          v-for="department in departments"
          :key="department.departmentId"
          @click="clkDepartment(department)"
        >
          <ion-label>{{ department.name }}</ion-label>
          <ion-icon
            color="primary"
            slot="end"
            :icon="checkmark"
            v-if="department.departmentId === solicitationData.departmentId"
          />
        </ion-item>
      </ion-list>

      <div v-if="children" class="q-mt-lg">
        <ion-text>
          <p class="q-mx-md">O atendimento é para alguma criança em específico?</p>
        </ion-text>
        <ion-list :inset="true">
          <ion-item
            v-for="child in children"
            :key="child.childData?.childId"
            @click="solicitationData.childId = child.childData?.childId"
          >
            <ion-label>{{ child.childData?.childName }}</ion-label>
            <ion-icon
              color="primary"
              slot="end"
              :icon="checkmark"
              v-if="solicitationData.childId === child.childData?.childId"
            />
          </ion-item>
        </ion-list>
      </div>

      <div v-if="solicitationData.childId" class="q-mt-lg">
        <ion-text>
          <p class="q-mx-md">Descreva a solicitação</p>
        </ion-text>
        <ion-list :inset="true">
          <ion-item>
            <ion-textarea
              v-model="solicitationData.description"
              placeholder="Descreva o atendimento"
              auto-grow
            />
          </ion-item>
        </ion-list>
        <div class="ion-padding">
          <ion-button
            color="primary"
            expand="block"
            @click="openSolicitation"
          >Abrir atendimento</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonCard,
  IonText,
  IonLabel,
  IonCardContent,
  IonList, IonItem, IonNote,
  IonBadge,
  IonIcon,
  IonTextarea,
  IonButton
} from '@ionic/vue';
import { useFetch } from '@/composables/fetch';
import ToolbarEscolas from '../../components/ToolbarEscolas.vue'
import utils from '../../../src/composables/utils.js';
import {
  checkmark,
} from 'ionicons/icons';
</script>

<script>
export default {
  name: "NewParentSolicitation",
  data() {
    return {
      solicitationData: {
        departmentId: null,
        description: null,
        childId: null
      },
      file: null,
      departments: null,
      children: null
    }
  },
  beforeMount () {
    this.getDepartments()
  },
  mounted() {
    utils.loading.hide()
  },
  methods: {
    clkDepartment (department) {
      this.solicitationData.departmentId = department.departmentId
      this.getChildrenOfParent()
    },
    async openSolicitation () {
      if (!this.solicitationData.departmentId) {
        utils.toast('Selecione o departamento')
        return
      } else if (!this.solicitationData.description) {
        utils.toast('Descreva o atendimento')
        return
      }
      const opt = {
        route: '/mobile/solicitations/openSolicitation',
        body: {
          solicitationData: this.solicitationData
        }
      }
      utils.loading.show()
      const r = await useFetch(opt)
      utils.loading.hide()
      if (r.error) return
      utils.toast('Atendimento aberto com sucesso')
      this.$router.back()
    },
    async getDepartments () {
      const opt = {
        route: '/mobile/solicitations/getDepartments',
      }
      utils.loading.show()
      const r = await useFetch(opt)
      utils.loading.hide()
      if (r.error) return
      this.departments = r.data
    },
    async getChildrenOfParent () {
      const opt = {
        route: '/mobile/parents/profile/getParentChildren',
      }
      utils.loading.show()
      const r = await useFetch(opt)
      utils.loading.hide()
      if (r.error) return
      r.data.push({ childData: { childId: 'all', childName: 'Atendimento geral' } })
      this.children = r.data
    }
  }
};
</script>

