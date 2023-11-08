<template>
  <div style="display: flex;justify-content: space-between;position: relative;align-items: center;">
    <ion-input
      rows="1"
      :type="passwordType"
      :label="label"
      labelPlacement="floating"
      fill="outline"
      helper-text="Sua senha"
      :value="value"
      ref="inputPassword"
      @keyup.enter="onChange($event)"
      @ionBlur="onChange($event)"
      @ionInput="onChange($event)"
      >
    </ion-input>
    <ion-button
      style="position: absolute; right: 0;z-index: 999; margin-top: -10px"
      @click="showHidePassword" fill="clear" color="dark"
    >
      <ion-icon v-if="showPassword" :icon="eyeOutline"/>
      <ion-icon v-else :icon="eyeOffOutline"/>
    </ion-button>
  </div>
</template>


<script setup>
import {
  IonInput,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  // IonNote
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { eyeOutline,eyeOffOutline } from 'ionicons/icons'
</script>

<script>

  export default defineComponent({
  components: { 
    IonInput,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    // IonNote
  },
  name: 'medInputPassword',
  data () {
    return {
      value: '',
      id: '',
      isPwd: true,
      passwordType: 'password',
      showPassword: false
    }
  },
  props: ['valueField', 'label', 'fieldHint', 'idField', 'modelValue'],
  methods: {
    onChange (ev) {
      const value = ev.target.value;
      this.$refs.inputPassword.$el.value = value
      if (ev.keyCode === 13) this.$emit('keyupEnter')
      else this.$emit('update:modelValue', value)
      // else this.$emit('onChange', { value, id: this.id })
    },
    showHidePassword () {
      this.showPassword = !this.showPassword
      if (this.showPassword) {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    }
  },
  mounted () {
    this.value = this.valueField
    this.id = this.idField
  }
})
</script>
