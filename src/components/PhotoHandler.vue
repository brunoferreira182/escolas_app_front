<template>
  <ion-modal :isOpen="step === 'crop'" @didDismiss="step = 'initial'">
    <cropper
      :src="img.webPath"
      @change="crop"
      v-if="imgType === 'camera'"
      style="max-height: 75vh;"
    />
    <cropper
      :src="img"
      @change="crop"
      v-if="imgType === 'gallery'"
      style="max-height: 75vh;"
    />
    <div>
      <div class="input-wrapper  q-px-md q-mx-md"  v-if="props.acceptImageCaption">
        <ion-textarea
          label="Legenda"
          label-placement="floating"
          v-model="imageCaption"
          placeholder="Escreva uma legenda para a foto"
          :auto-grow="true"
        ></ion-textarea>
      </div>
      <div class="ion-padding">
        <ion-button
          expand="block"
          @click="sendPhoto"
          class="q-mb-md"
        >
          Continuar
        </ion-button>
        <ion-button
          expand="block"
          @click="clkBack"
          fill="outline"
        >
          Voltar
        </ion-button>
      </div>
    </div>
    <img hidden id="imgToReference" :src="imgType === 'camera' ? img.webviewPath : img"/>
  </ion-modal>
</template>

<script>
export default {
  name: 'PhotoHandler',
}
</script>

<script setup>
import {
  IonButton,
  actionSheetController,
  IonModal, 
  IonTextarea,
} from '@ionic/vue';
import { ref, onMounted, watch } from 'vue'
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Capacitor } from '@capacitor/core'
import { isPlatform, getPlatforms } from '@ionic/vue';
import utils from '../../src/composables/utils.js';

import { 
  Camera, 
  CameraResultType, 
  CameraSource, 
  // Photo 
} from '@capacitor/camera';

const props = defineProps(['square', 'multiple', 'allFiles', 'start', 'noCrop', 'acceptImageCaption'])
const emits = defineEmits([
  'captured',
  'cancel'
])
let imageCaption = ref('')
const img = ref(null)
const imgType = ref(null)
const step = ref('initial')
const stencilProps = {}
const imageCropped = ref(null)

let fileName = null
const buttons = [
  {
    text: 'Câmera',
    data: {
      action: 'camera',
    },
  },
  {
    text: 'Galeria de fotos',
    data: {
      action: 'gallery',
    },
  },
  {
    text: 'Documentos',
    data: {
      action: 'documents',
    },
  },
  {
    text: 'Cancelar',
    role: 'cancel',
    data: {
      action: 'cancel',
    },
  },
]

onMounted(() => {
  if (props.square) stencilProps.aspectRatio = 1
})

watch (props, (n, o) => {
  if (n.start) showBottomSheet()
})



async function showBottomSheet () {
  if (!props.allFiles) buttons.splice(2, 1)
  const actionSheet = await actionSheetController.create({
    header: 'Escolha uma opção',
    buttons
  });

  await actionSheet.present();

  const res = await actionSheet.onDidDismiss();
  if (!res.data) {
    step.value = 'initial'
    imageCaption = ''
    emits('cancel')
  } else if (res.data.action === 'camera') {
    openCamera()
  } else if (res.data.action === 'cancel') {
    step.value = 'initial'
    imageCaption = ''
    emits('cancel')
  } else {
    console.log(res,' REDSDSA')
    pickFile(res.data.action)
  }
}


async function openCamera () {
  imgType.value = 'camera'
  
  const tp = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera,
    quality: 50,
    width: 400
  });
  
  utils.loading.show()
  console.log('Foto tirada ', tp)
  fileName = 'Foto da câmera'
  img.value = tp
  console.log('numero 3 ')
  if (props.noCrop) {
    utils.loading.hide()
    sendPhoto(img.value)
  } else {
    step.value = 'crop'
  }
}

async function pickFile (type) {
  let types = ['image/*']
  if (type === 'documents') types = ['application/pdf', 'video/quicktime']
  let res
  try {
    if (type === 'gallery' && !isPlatform('desktop')) {
      console.log('media',getPlatforms())
      res = await FilePicker.pickMedia({ types, multiple: props.multiple });
    } else {
      res = await FilePicker.pickFiles({ types, multiple: props.multiple });
    }
  } catch (e) {
    emits('cancel')
    return
  }
  const file = props.multiple ? res.files : res.files[0];
  // if (file.path) {
  //   //codigo antigo
  //   const fileSrc = Capacitor.convertFileSrc(file.path);
  //   const fileTemp = await fetch(fileSrc)
  //   file.blob = await fileTemp.blob()
  // }
  //aqui pra baixo codigo adaptado para multiplos


  switch(file){
    case file.path:
      if(props.multiple){
        for (let i = 0; i < file.length; i++) {
          const fileSrc = Capacitor.convertFileSrc(file[i].path);
          const fileTemp = await fetch(fileSrc);
          file[i].blob = await fileTemp.blob();
        }
      }
    break;
    case !file.path:
      if(props.multiple){
        for (let i = 0; i < file.length; i++) {
          const fileSrc = Capacitor.convertFileSrc(file[i].path);
          const fileTemp = await fetch(fileSrc);
          file[i].blob = await fileTemp.blob();
        }
      }else{
        const fileSrc = Capacitor.convertFileSrc(file.path);
        const fileTemp = await fetch(fileSrc)
        file.blob = await fileTemp.blob()
      }
    break;
  }
  // if (file.path && props.multiple ) {
  //   for (let i = 0; i < file.length; i++) {
  //     const fileSrc = Capacitor.convertFileSrc(file[i].path);
  //     const fileTemp = await fetch(fileSrc);
  //     file[i].blob = await fileTemp.blob();
  //   }
  // }
  // if (!file.path && props.multiple) {
  //   for (let i = 0; i < file.length; i++) {
  //     const fileSrc = Capacitor.convertFileSrc(file[i].path);
  //     const fileTemp = await fetch(fileSrc);
  //     file[i].blob = await fileTemp.blob();
  //   }
  // }
  // else if(!props.multiple && file.path){
  //     const fileSrc = Capacitor.convertFileSrc(file.path);
  //     const fileTemp = await fetch(fileSrc)
  //     file.blob = await fileTemp.blob()
  // }

  if (type === 'gallery' && !props.noCrop) {
    console.log("🚀 ~ pickFile ~ type === 'gallery' && !props.noCro:")
    // img.value é base64
    if(props.multiple){
      for(let i = 0; i < file.length; i++){
        emits('captured', file[i], file[i].blob, file[i].name, imageCaption, '', type)
      }
      return
    }
    img.value = await convertBlobToBase64(file.blob)
    step.value = 'crop'
    imgType.value = 'gallery'
  } else if (type === 'documents' || (type === 'gallery' && props.noCrop)) {
    utils.loading.hide()
    emits('captured', file, file.blob, file.name, imageCaption, '', type)
  }
}

function crop({ coordinates, canvas }) {
  console.log('antes de terminar o crop')
  imageCropped.value = canvas.toDataURL();
  console.log('depois de terminar o desenho dentro do crop')
  utils.loading.hide()
}

async function sendPhoto (img) {
  const file = !props.noCrop ? await fetch(imageCropped.value) : await fetch(img.value)
  let fileBlob = await file.blob()
  fileBlob = new Blob([fileBlob], { type: 'image/png' })
  step.value = 'initial'
  utils.loading.hide()
  emits('captured', file.url, fileBlob, fileName, imageCaption, null, 'camera' )
}

function clkRestart() {
  step.value = 'initial'
  // openCamera()
  showBottomSheet()
}

function clkBack () {
  step.value = 'initial'
  emits('cancel')
}




const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
  console.log(blob, 'blobplboblbolb')
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
      resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});

</script>
<style scoped
>
.input-wrapper {
  border: 1px solid #ebebec;
  /* padding-left: 15px; */
  border-radius: 0.5rem;
  margin-block: 10px;
}
</style>