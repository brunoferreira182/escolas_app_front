<template>
  <div>
    <ion-input
      ref="inputPhone"
      rows="1"
      :label="label"
      labelPlacement="floating"
      fill="outline"
      inputmode="numeric"
      :helper-text="helperText"
      error-text="Telefone inválido"
      @ion-blur="cellphoneMask"
      @ion-input="cellphoneMask"
      v-model="value"
      maxlength="15"
    ></ion-input>
  </div>
</template>

<script>
  import { IonInput, IonItem, IonLabel, IonNote } from '@ionic/vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'InputTelephone',
    components: { IonInput, IonItem, IonLabel, IonNote },
    props: ['label', 'idField', 'helperText', 'modelValue'],
    data () {
      return {
        value: '',
        validated: true,
      }
    },
    methods: {
      cellphoneMask () {
        const formattedPhone = this.formatPhone(this.value)
        this.value = formattedPhone
        this.$refs.inputPhone.$el.value = formattedPhone
        this.validate()
        this.$emit('update:modelValue', this.value)
      },
      formatPhone (value) {
        const numbers = value.replace(/\D/g, "")
        const len = numbers.length
        if (value.length > 15) return value.slice(0, 15)
        if (len < 3) return `(${numbers})`
        const ddd = numbers.slice(0, 2)
        let numPre = ''
        let numPos = ''
        if (len <= 7) {
          numPre = ' ' + numbers.slice(2, len)
        } else if (len > 7) {
          numPre = ' ' + numbers.slice(2, 7)
          numPos = ' ' + numbers.slice(7, len)
        }
        return `(${ddd})${numPre}${numPos}`
      },
      validate () {
        const value = this.value;
        this.$refs.inputPhone.$el.classList.remove('ion-valid');
        this.$refs.inputPhone.$el.classList.remove('ion-invalid');
        if (value.length === 15) this.$refs.inputPhone.$el.classList.add('ion-valid')
        else this.$refs.inputPhone.$el.classList.add('ion-invalid'); 
      },
      
    },
  });
</script>