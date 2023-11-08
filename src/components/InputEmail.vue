<template>
  <ion-input
    ref="input"
    rows="1"
    type="email"
    :label="label"
    autofocus
    label-placement="floating"
    fill="outline"
    error-text="Email inválido"
    :value="value"
    @keyup.enter="onChange($event)"
    @ionBlur="onChange($event)"
    @ionInput="onChange($event)"
    ></ion-input>
</template>

<script>
  import { IonInput, IonItem, IonLabel, IonNote } from '@ionic/vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    components: { IonInput, IonItem, IonLabel, IonNote },
    props: ['label', 'idField', 'modelValue'],
    data () {
      return {
        value: '',
        validated: true,
      }
    },
    methods: {
      onChange (ev) {
        const value = ev.target.value;
        this.$refs.input.$el.value = value
        this.validate(value)
        if (ev.keyCode === 13) this.$emit('keyupEnter')
        else this.$emit('update:modelValue', { email: value, validated: this.validated })
      },
      validateEmail(email) {
        return email.match(/^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
      },
      validate(ev) {
        this.$refs.input.$el.classList.remove('ion-valid');
        this.$refs.input.$el.classList.remove('ion-invalid');
        const emailValidated = this.validateEmail(ev)
        emailValidated ? this.$refs.input.$el.classList.add('ion-valid') : this.$refs.input.$el.classList.add('ion-invalid');
        emailValidated ? this.validated = true : this.validated = false
      },

      // markTouched() {
      //   this.$refs.item.$el.classList.add('ion-touched')
      // }
    },
  });
</script>