import { MODE_MASTER_SERVER, MODE_AUTH_SERVER, setIuguId, setIuguTestMode } from './variables'
import CryptoJS from 'crypto-js';
import { toastController, loadingController } from '@ionic/vue';
import { useFetch } from './fetch'
// import { Geolocation } from '@capacitor/geolocation';
// let coordinates = null
import { calculateMasterServerAttachmentsRoute } from "./masterServerRoutes";

let loadingVar = []
let updateUserInfoOnNextRoute = false



const useUtils = {
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
    console.log('data aqui', data)
    console.log('key aqui', key)
    window.localStorage.setItem("ul", data.userId);
    window.localStorage.setItem("$k", key);
    // const key = window.localStorage.getItem("$k");
    const d = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    window.localStorage.setItem("u" + data.userId, d);
    window.localStorage.setItem("au", data.userId);
  },
  getUSerProfilePhotoUrl () {
    const userInfo = this.presentUserInfo();
    return this.attachmentsAddress() + userInfo.profilePhoto + '?' + new Date().getTime()
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
      serverName: 'authentication',
      mode: MODE_AUTH_SERVER,
      route: '/getUserInfoByToken'
    }
    return useFetch(opt)
  },
  async updateUserInfoLocalStorage () {
    const opt = {
      serverName: 'authentication',
      mode: MODE_AUTH_SERVER,
      route: '/getUserInfoByToken'
    }
    const userInfo = await useFetch(opt)
    this.registerLogin(userInfo.data, userInfo.data.token)

  },

}

export default useUtils