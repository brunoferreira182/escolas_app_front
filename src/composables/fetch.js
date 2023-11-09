import { PROJECT_NAME, MODE_APP_SERVER, DEFAULT_SERVER_NAME, COMPANY_ID, CRYPTOYESORNO, MODE_SERVER } from './variables'
import { masterServerRoute } from './masterServerRoutes'
import CryptoJS from "crypto-js"
import axios from 'axios'
import { toastController } from '@ionic/vue';

import router from '../router/index.ts';

async function toast (msg) {
  const t = await toastController.create({
    message: msg,
    duration: 1500,
    position: 'bottom',
    buttons: [{ text: 'Fechar', role: 'cancel' }]
  })
  await t.present()
}

export async function useFetch ({
  project,
  serverName,
  mode,
  method,
  route,
  body,
  destinationroute,
  destinationserver,
  file,
  filename,
  destinationUrl
}) {
  if (!project) project = PROJECT_NAME
  if (!mode) mode = MODE_APP_SERVER
  // if (!serverName) serverName = DEFAULT_SERVER_NAME
  serverName = DEFAULT_SERVER_NAME
  if (!method) method = 'POST'
  const newBody = {
    project,
    serverName,
    mode,
    method,
    route,
    // body
  }
  let activeUser = localStorage.getItem('au')
  // caso especial quando for pegar multi users, pegar a conta pai
  if (
    route === '/getMultipleUsersByUserId' ||
    route === '/makeMultipleLogin' ||
    route === '/disconnectFromAccount'
  ) activeUser = localStorage.getItem('ul')
  else if (route === '/makeLogin') {
    const ul = localStorage.getItem('ul')
    if (ul) activeUser = localStorage.getItem('ul')
  }
  const udCr = localStorage.getItem('u' + activeUser)
  const key = localStorage.getItem('$k')
  let token
  if (!!udCr && udCr !== 'undefined' && !!key && key !== 'undefined') {
    let ud
    try { ud = JSON.parse(CryptoJS.AES.decrypt(udCr, key).toString(CryptoJS.enc.Utf8)) }
    catch (e) { ud = null }
    if (ud) token = ud.token + ':' + activeUser
  }
  if (token) {
    axios.defaults.headers.common['Authorization'] = token
    axios.defaults.headers.common['cryn'] = CRYPTOYESORNO
    // console.log('body aqui pra tentar,', body)
    // criptografa o body
    if (CRYPTOYESORNO === 1 && body) {
      newBody.body = CryptoJS.AES.encrypt(JSON.stringify(body), token).toString()
    } else if (CRYPTOYESORNO === 0 && body) {
      newBody.body = body
    }
    // console.log(newBody.body, 'aqui vai ser ubnd')
    // if (body) newBody.body = CryptoJS.AES.encrypt(JSON.stringify(body), token).toString()
  } else {
    if (body) newBody.body = body
  }
  axios.defaults.headers.common['cid'] = COMPANY_ID
  
  let routeMasterServer = masterServerRoute()
  let bodyToSend = newBody
  /// ANEXOS ///////////////////////////////////////
  let form
  if (file && file.length > 0) {
    newBody.destinationserver = destinationserver
    newBody.destinationroute = destinationroute
    form = new FormData();
    form.append('body', JSON.stringify(newBody))
    file.forEach(f => {
      const fileName = f.name ? f.name : 'userFile.png';
      // const blob = new Blob([f.file], { type: f.type });
      const blob = new Blob([f.file]);
      form.append('file', blob, fileName);
    });
    
    bodyToSend = form
  }
  //////////////////////////////////////////////////
  if (destinationUrl) routeMasterServer = destinationUrl

  /////// tirando do master server
  if (MODE_SERVER !== 'master') routeMasterServer += route

  let ret
  try {
    ret = await axios.post(routeMasterServer, bodyToSend)
  }
  catch (e) {
    console.log('AQUI ERRO CATCH', e)
  }
  console.log('retorno fetch ' + route, ret.data)

  if (ret.data.error) {
    if (
      (ret.data.errorType === 'tokenNonExistent' || ret.data.errorType === 'loginNonExistent') 
      && (route !== '/getKey')
    ) router.replace('/login')
    else if (ret.data.errorType === 'tokenExpired') {
      toast(ret.data.errorMessage)
      router.push('/login')
    } else {
      let message = 'Ocorreu um erro. Tente novamente.'
      if (ret.data.errorMessage) {
        message = ret.data.errorMessage
      }
      toast(message)
    }
    
  }
  return ret.data
}