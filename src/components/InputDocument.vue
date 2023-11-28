<template>
    <ion-input 
      fill="outline"
      ref="input"
      label-placement="floating"
      :label="label" 
      :value="value"
      @ionInput="valueChanged($event)"
      @ionBlur="valueChanged($event)"
      error-text="Documento inválido"
      :helper-text="fieldHint"
      :clear-input="true"
      inputmode="numeric"
    />
</template>

<script>
import { cpf,cnpj } from 'cpf-cnpj-validator'
import { IonInput, IonItem, IonLabel, IonNote } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'InputDocument',
  components: { IonInput, IonItem, IonLabel, IonNote },
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
      const n = value.replace(/\D/g, "")
      const len = n.length
      let ret
      if (len < 4) ret = `${n}`
      else if (len < 7) ret = `${n.slice(0, 3)}.${n.slice(3, 6)}`
      else if (len < 10) ret = `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}`
      else if (len < 12) ret = `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9, 11)}`
      else ret = `${n.slice(0, 2)}.${n.slice(2, 5)}.${n.slice(5, 8)}/${n.slice(8, 12)}-${n.slice(12, 14)}`
      const lastChar = ret[ret.length - 1]
      if (lastChar === '.' || lastChar === '-' || lastChar === '/')
      ret = ret.slice(0, ret.length - 5)
      return ret
    },
    markTouched() {
      this.$refs.item.$el.classList.add('ion-touched')
    }
  },
})
</script>