<template>
  <ion-input 
    fill="outline"
    ref="input"
    label-placement="floating"
    :label="label" 
    :value="value"
    @ionInput="valueChanged($event)"
    @ionBlur="valueChanged($event)"
    error-text="Cartão inválido"
    :helper-text="fieldHint"
    :clear-input="true"
    inputmode="numeric"
    maxlength="19"
  />
</template>

<script>
import { IonInput } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputCreditCard',
  components: { IonInput },
  data () {
    return {
      value: '',
      id: '',
    }
  },
  props: ['valueField', 'label', 'fieldHint', 'idField', 'modelValue'],
  watch: {
    modelValue: function (nV, oV) {
      if (nV !== '') this.value = this.format(nV)
    }
  },
  methods: {
    valueChanged (ev) {
      const formatted = this.format(ev.target.value)
      this.value = formatted
      this.$refs.input.$el.value = formatted
      this.$emit('update:modelValue', formatted)
      // this.validate()
    },
    format (value) {
      const numbers = value.replace(/\D/g, "")
      const len = numbers.length
      let ret
      if (len < 5) ret = numbers
      else if (len < 9) {
        ret = `${numbers.slice(0, 4)} ${numbers.slice(4, len)}`
      } else if (len < 13) {
        ret = `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, len)}`
      } else {
        ret = `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)} ${numbers.slice(12, len)}`
      }
      return ret
    },
    markTouched() {
      this.$refs.item.$el.classList.add('ion-touched')
    }
  },
})
</script>