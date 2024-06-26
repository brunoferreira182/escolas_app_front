import { MODE_MASTER_SERVER, MODE_AUTH_SERVER, setIuguId, setIuguTestMode } from './variables'
import CryptoJS from 'crypto-js';
import { toastController, loadingController } from '@ionic/vue';
import { useFetch } from './fetch'
import { calculateMasterServerAttachmentsRoute } from "./masterServerRoutes";
import router from '../router/index.ts'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import write_blob from "capacitor-blob-writer";

let loadingVar = []
let updateUserInfoOnNextRoute = false

const useUtils = {
  getFilesystemAccess() {
    return new Promise(async (resolve) => {
      const status = await Filesystem.checkPermissions()
      const state = status.publicStorage

      if (state === 'granted') {
        return resolve(true)
      } else if (state === 'denied') {
      } else {
        Filesystem.requestPermissions()
      }
      return resolve(false)
    })
  },
  async writeFile (data, pathAndName) {
    console.log(data, 'data aqui')
    let writeFile
    let error = false
    try {
      writeFile = await Filesystem.writeFile({
        path: pathAndName,
        data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      })
    } catch (e) {
      console.log(e, 'erro criar arquivo')
      error = true
    }
    if (error) return { error: true }
    else return writeFile
  },
  async writeFile2 (data, pathAndName) {
    try {
      return write_blob({
        path: pathAndName,
        directory: Directory.Documents,
        blob: data,
        fast_mode: true
      })
    } catch (e) {
      this.toast(e)
      return { error: true }
    }
  },
  async openFile (file) {
    try {
      await FileOpener.openFile({
        path: file.path,
      })
    } catch (e) {
      console.log(e, 'erro abrir arquivo')
    }
  },
  makeFileName (originalname) {
    const originalnameSplit = originalname.split('.')
    const currentDate = new Date().toLocaleString().replace(/[,:\s\/]/g, '-')
    let nameToDownload
    if (originalnameSplit.length === 1) nameToDownload = obj.originalname + '_' + currentDate
    else nameToDownload = originalnameSplit[0] + '_' + currentDate + '.' + originalnameSplit[originalnameSplit.length - 1]
    return nameToDownload
  },
  async downloadFile2 (obj) {
    const perm = await this.getFilesystemAccess()
    const opt = {
      route: '/download/' + obj.filename,
      method: 'GET'
    }
    const httpResponse = await useFetch(opt)
    const resBlob = new Blob([httpResponse])
    // console.log("🚀 ~ downloadFile ~ httpResponse:", httpResponse)
    let nameToDownload = this.makeFileName(obj.originalname)
    const writeFile = await this.writeFile2(resBlob, nameToDownload)
    if (writeFile.error) {
      this.toast('Ocorreu um erro ao baixar o arquivo')
      return
    }
    this.toast('Arquivo baixado na pasta Documentos')
    // this.openFile(writeFile)
    return
  },
  async downloadFile (obj) {
    const filename = this.makeFileName(obj.originalname)
    const opt = {
      url: `${this.attachmentsAddress()}${obj.filename}`,
      method: 'GET',
      path: filename
    }
    const dl = await Filesystem.downloadFile(opt)
    if (dl.path) {
      this.toast('Arquivo baixado na pasta Documentos')
      this.openFile(dl)
    } else {
      this.toast('Ocorreu um erro ao baixar o arquivo')
    }
  },
  async verifyUserPermissions (data) {
    if (data.status === 'waitingApproval') {
      router.push("/waitingAproval")
      return
    }
    const r = await this.getUserPermissions()
    if (r.data.length === 0) {
      this.$router.push("/waitingPermission")
      return
    }
    const perms = []
    r.data.forEach((p) => { perms.push(p.role) })
    // const currentVision = localStorage.getItem('currentVision')
    if (perms.length === 1){
      if (perms[0] === 'IS_PARENT') router.push('/tabsParents/social')
      if (perms[0] === 'IS_WORKER') router.push('/tabsWorkers/class')
    } else router.push('/tabsParents/social') 

    // if (!currentVision && perms.includes('IS_PARENT')) router.push("/tabsParents/social")
    // else if (currentVision === 'worker' && perms.includes('IS_WORKER')) router.push("/tabsWorkers/class")
    // else if (currentVision === 'worker' && !perms.includes('IS_WORKER') && perms.includes('IS_PARENT')) {
    //   router.push("/tabsParents/social")
    //   localStorage.removeItem('currentVision')
    // }
  },
  async getUserPermissions(){
    const opt = {
      route:'/mobile/auth/getUserPermissions',
      body: {
        permissionType: 'mobile'
      }
    }
    return await useFetch(opt)
  },
  getIuguLib () {
    console.log('antes do iugu')
    const t = document.createElement("script");
    t.type = "text/javascript"
    t.src = "https://js.iugu.com/v2"
    document.body.appendChild(t);
    t.addEventListener('load', () => {
      window.Iugu = Iugu
      console.log(Iugu)
    })
  },
  async fetchIuguId () {
    const ret = await useFetch({ route: '/iugu/getIuguTokenByCid' })
    setIuguId(ret.data.iuguId)
    setIuguTestMode(ret.data.type)
  },
  updateNextRoute: {
    get () { return updateUserInfoOnNextRoute },
    set (val) {
      updateUserInfoOnNextRoute = val
      // const userInfo = this.getUserInfoByToken()
      return
    }
  },
  registerLogin (data, key) {
    window.localStorage.setItem("ul", data.userId);
    window.localStorage.setItem("$k", key);
    const d = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    window.localStorage.setItem("u" + data.userId, d);
    window.localStorage.setItem("au", data.userId);
  },
  getUSerProfilePhotoUrl () {
    const userInfo = this.presentUserInfo();
    return this.attachmentsAddress() + userInfo.profilePhoto + '?' + new Date().getTime()
  },
  makeFileUrl (filename, type) {
    if (!filename) return '/assets/default_avatar.svg'
    filename = type === 'thumbnail' ? filename + '_thumbnail' : filename;
    return this.attachmentsAddress() + filename + '?' + new Date().getTime()
  },
  localStorage: {
    set (key, value) {
      window.localStorage.setItem(key, JSON.stringify(value))
      return
    },
    get (key) {
      return JSON.parse(window.localStorage.getItem(key))
    }
  },
  loading: {
    async loadingMk (message) {
      loadingVar = await loadingController.create({
        message: message ? message : 'Aguarde',
      });
    },
    async loadingMkArr (message) {
      loadingVar.push(await loadingController.create({
        message: message ? message : 'Aguarde',
      }));
      return loadingVar.length - 1
    },
    async show (message) {
      await this.loadingMk(message)
      loadingVar.present()
    },
    async hide () {
      try { await loadingVar.dismiss() }
      catch (e) { return }
    },
    async clear () {
      try { await loadingVar.dismiss() }
      catch (e) { return }
    }
  },
  async toast (message, position) {
    const t = await toastController.create({
      message,
      duration: 2500,
      cssClass: 'custom-toast',
      position: position ? position : 'bottom',
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel',
          handler: () => { this.handlerMessage = 'Dismiss clicked'; }
        }
      ]
    })
    await t.present()
  },
  async sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  presentUserInfo () {
    const key = window.localStorage.getItem('$k')
    const activeUser = window.localStorage.getItem('au')
    const udCr = window.localStorage.getItem('u' + activeUser)
    if (!udCr || udCr === 'undefined' || !key || key === 'undefined') return false
    let ud
    let error = false
    try {
      ud = JSON.parse(CryptoJS.AES.decrypt(udCr, key).toString(CryptoJS.enc.Utf8))
    } catch (e) {
      error = true
    }
    if (!error) return ud
    // window.location.href = '/login'
  },
  presentOriginalUserInfo () {
    const key = window.localStorage.getItem('$k')
    const activeUser = window.localStorage.getItem('ul')
    const udCr = window.localStorage.getItem('u' + activeUser)
    if (!udCr || !key) return false
    let ud
    let error = false
    try {
      ud = JSON.parse(CryptoJS.AES.decrypt(udCr, key).toString(CryptoJS.enc.Utf8))
    } catch (e) {
      error = true
    }
    if (!error) return ud
    // window.location.href = '/login'
    return ud
  },
  setActiveUser (id) {
    window.localStorage.setItem('au', id)
  },
  attachmentsAddress () {
    return calculateMasterServerAttachmentsRoute();
  },
  getUserInfoByToken () {
    const opt = {
      route: '/mobile/auth/getUserInfoByToken'
    }
    return useFetch(opt)
  },
  async updateUserInfoLocalStorage () {
    const opt = {
      route: '/getUserInfoByToken'
    }
    const userInfo = await useFetch(opt)
    this.registerLogin(userInfo.data, userInfo.data.token)

  },

}

export default useUtils