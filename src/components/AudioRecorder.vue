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
  console.log('tem permissao?', hasPermission.value)
  return hasPermission.value
}

async function askPermissionAndReturnResponse () {
  const resultAskPermission = VoiceRecorder.requestAudioRecordingPermission()
  console.log('resultado de perguntar a permissao', resultAskPermission.value)
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
  console.log('status atual', status)
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


// only 'VoiceRecorder' is mandatory, the rest is for typing
import { VoiceRecorder, VoiceRecorderPlugin, RecordingData, GenericResponse, CurrentRecordingStatus } from 'capacitor-voice-recorder';

// will print true / false based on the ability of the current device (or web browser) to record audio
VoiceRecorder.canDeviceVoiceRecord().then((result: GenericResponse) => console.log(result.value))

/**
* will prompt the user to give the required permission, after that
* the function will print true / false based on the user response
*/
VoiceRecorder.requestAudioRecordingPermission().then((result: GenericResponse) => console.log(result.value))

/**
* will print true / false based on the status of the recording permission.
* the promise will reject with "COULD_NOT_QUERY_PERMISSION_STATUS"
* if the current device cannot query the current status of the recording permission
*/
VoiceRecorder.hasAudioRecordingPermission.then((result: GenericResponse) => console.log(result.value))

/**
* In case of success the promise will resolve to { value: true }
* in case of an error the promise will reject with one of the following messages:
* "MISSING_PERMISSION", "ALREADY_RECORDING", "MICROPHONE_BEING_USED", "DEVICE_CANNOT_VOICE_RECORD", or "FAILED_TO_RECORD"
*/
VoiceRecorder.startRecording()
.then((result: GenericResponse) => console.log(result.value))
.catch(error => console.log(error))

/**
* In case of success the promise will resolve to:
* {"value": { recordDataBase64: string, msDuration: number, mimeType: string }},
* the file will be in one of several possible formats (more on that later).
* in case of an error the promise will reject with one of the following messages:
* "RECORDING_HAS_NOT_STARTED" or "FAILED_TO_FETCH_RECORDING"
*/
VoiceRecorder.stopRecording()
.then((result: RecordingData) => console.log(result.value))
.catch(error => console.log(error))

/**
* will pause an ongoing recording. note that if the recording has not started yet the promise
* will reject with `RECORDING_HAS_NOT_STARTED`. in case of success the promise will resolve to `{ value: true }` if the pause
* was successful or `{ value: false }` if the recording is already paused.
* if the current mobile os does not support this method the promise will reject with `NOT_SUPPORTED_OS_VERSION`
*/
VoiceRecorder.pauseRecording()
.then((result: GenericResponse) => console.log(result.value))
.catch(error => console.log(error))

/**
* will resume a paused recording. note that if the recording has not started yet the promise
* will reject with `RECORDING_HAS_NOT_STARTED`. in case of success the promise will resolve to `{ value: true }` if the resume
* was successful or `{ value: false }` if the recording is already running.
* if the current mobile os does not support this method the promise will reject with `NOT_SUPPORTED_OS_VERSION`
*/
VoiceRecorder.resumeRecording()
.then((result: GenericResponse) => console.log(result.value))
.catch(error => console.log(error))

/**
* Will return the current status of the plugin.
* in this example one of these possible values will be printed: "NONE" / "RECORDING" / "PAUSED"
*/
VoiceRecorder.getCurrentStatus()
.then((result: CurrentRecordingStatus) => console.log(result.status))
.catch(error => console.log(error))