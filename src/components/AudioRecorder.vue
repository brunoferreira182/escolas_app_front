<template>
  <ion-modal
    :isOpen="open"
    :initial-breakpoint="0.3"
    :breakpoints="[0, 0.3]"
    :handle="false"
  >
    <ion-content class="ion-padding ion-text-center">
      <h5>Seu áudio está sendo gravado</h5>
      <p>{{ counter.min }}:{{ counter.sec }}</p>
      <ion-button
        @click="clkStopRecording"
        expand="block"
        color="primary"
      >Terminar</ion-button>
      <ion-button
        @click="clkBack"
        expand="block"
        color="danger"
        fill="outline"
        class="q-mt-md"
      >Cancelar</ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { IonAlert, IonButton, IonModal, IonContent } from '@ionic/vue';
import { ref, watch } from 'vue'
import { VoiceRecorder } from 'capacitor-voice-recorder';
import utils from '../../src/composables/utils.js';

const buttons = ref(null)
const step = ref('initial') // initial, recording, recorded
const alertText = ref(null)
const props = defineProps({ open: Boolean })
const emits = defineEmits('done')


VoiceRecorder
.canDeviceVoiceRecord()
.then((result) => console.log('voice recorder', result.value))

watch(() => props.open, async () => {
  if (props.open) {
    // verifica se device tem permissao para gravar
    const hasPermission = await verifyPermission()
    if (hasPermission) {
      await startRecording()
      return
    } else {
      const perm = await askPermissionAndReturnResponse()
      if (!perm) {
        utils.toast('Você deve conceder permissão para poder gravar')
        clkBack()
      } else {
        await startRecording()
        return
      }
    }
  }
})

async function verifyPermission () {
  const hasPermission = await VoiceRecorder.hasAudioRecordingPermission()
  return hasPermission.value
}

async function askPermissionAndReturnResponse () {
  const resultAskPermission = VoiceRecorder.requestAudioRecordingPermission()
  return resultAskPermission.value
}

async function startRecording () {
  if (await alreadyRecording()) await VoiceRecorder.stopRecording()
  startCounter()
  const start = await VoiceRecorder.startRecording()
  return start.value
}

async function alreadyRecording() {
  const status = await VoiceRecorder.getCurrentStatus()
  if (status.status === 'RECORDING') {
    // utils.toast('O microfone está sendo usado no momento. Tente sair e entrar novamente no aplicativo')
    // clkBack()
    return true
  }
  return false
}

async function clkStopRecording () {
  const record = await VoiceRecorder.stopRecording()
  record.value.durationFormatted = counter.value.min + ':' + counter.value.sec
  stopCounter()
  clkBack()
  // playRecording(record.value)
  emits('done', 'ok', record.value)
  return
}

function playRecording (data) {
  const audioRef = new Audio(`data:${data.mimeType};base64,${data.recordDataBase64}`)
  audioRef.oncanplaythrough = () => audioRef.play()
  audioRef.load()
}

async function clkBack () {
  stopCounter()
  if (await alreadyRecording()) VoiceRecorder.stopRecording()
  step.value = 'initial'
  emits('done', 'cancel')
}

const counter = ref({
  min: '00',
  sec: '00',
  interval: null,
  maxMinutes: 2
})
function startCounter () {
  counter.value.interval = window.setInterval(updateCounter, 1000)
}
function stopCounter () {
  window.clearInterval(counter.value.interval)
  counter.value.min = '00'
  counter.value.sec = '00'
}
function updateCounter () {
  let min = +counter.value.min
  let sec = +counter.value.sec
  if (sec === 59) {
    if (min === 2) {
      clkStopRecording()
      stopCounter()
    } else {
      counter.value.min = min++ > 9 ? min++ : '0' + min++
      counter.value.sec = '00'
    }
  } else {
    counter.value.sec = sec++ > 9 ? sec++ : '0' + sec++
  }
}


</script>