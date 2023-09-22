<template>
  <div>
    <div v-if="inputWrapper" class="input-wrapper">
      <ion-input
        ref="input"
        label-placement="floating"
        :label="label" 
        :value="value"
        @ionInput="valueChanged($event)"
        @ionBlur="valueChanged($event)"
        :clear-input="true"
        inputmode="numeric"
      />
    </div>
    <ion-item v-else>
      <ion-input
        ref="input"
        label-placement="floating"
        :label="label" 
        :value="value"
        @ionInput="valueChanged($event)"
        @ionBlur="valueChanged($event)"
        :clear-input="true"
        inputmode="numeric"
      />
    </ion-item>
  </div>
</template>

<script>
import { IonInput, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputMoney',
  components: { IonInput, IonItem, IonLabel, IonNote },
  data () {
    return {
      value: '',
      id: '',
    }
  },
  props: ['valueField', 'label', 'fieldHint', 'idField', 'modelValue','inputWrapper'],
  watch: {
    modelValue: function (nV, oV) {
      console.log('essa merda?')
      if (nV !== '') this.value = this.format(nV)
    }
  },
  mounted () {
    this.value = this.format(this.modelValue)
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
      const numbers = +value.replace(/\D/g, "")
      const numbersStirng = numbers.toString()
      const len = numbersStirng.length
      if (len === 0 || numbers === 0) return ''
      else if (len === 1) return `R$ 0,0${numbersStirng}`
      else if (len === 2) return `R$ 0,${numbersStirng}`
      let integer = numbersStirng.slice(0, len - 2)
      const decimal = numbersStirng.slice(len - 2, len)
      const lenInteger = integer.toString().length
      if (lenInteger > 3) {
        const integerPos = integer.slice(lenInteger - 3, lenInteger)
        const integerPre = integer.slice(0, lenInteger - 3)
        integer = `${integerPre}.${integerPos}`
      }
      return `R$ ${integer},${decimal}`
    },
  },
})
</script>
<style scoped>
.input-wrapper {
  border: 1px solid #ebebec;
  padding-left: 15px;
  border-radius: 0.5rem;
  margin-block: 10px;
}
</style>