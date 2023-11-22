import { PushNotifications } from '@capacitor/push-notifications';
import {Capacitor} from '@capacitor/core';
import { useFetch } from '../composables/fetch'
let registered = false

const initPush = async () => {
  const activeUser = window.localStorage.getItem('au')
  console.log('active user', activeUser)
  console.log('registered', registered)
  if (Capacitor.getPlatform() !== 'web' && activeUser) {
    console.log('iniciou initPush')
    registerPush()
  }
}

const registerPush = async () => {
  console.log('iniciou registerPush')
  await registerNotifications()
  await addListeners()
}

const addListeners = async () => {
  console.log('iniciou addListeners')
  await PushNotifications.addListener('registration', async token => {
    console.log('Registration token: ', token.value)
    console.log('está registrado?', registered)
    // if (registered) return
    registered = true
    const reg = await useFetch({ route: '/notifications/registerFirebaseToken', body: { token: token.value } })
    console.log('retorno firebase token', reg)
    window.localStorage.setItem('fbToken', token.value)
  });

  await PushNotifications.addListener('registrationError', err => {
    console.log('Registration error: ', err.error);
  });

  await PushNotifications.addListener('pushNotificationReceived', notification => {
    console.log('Push notification received: ', notification);
  });

  await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    console.log('Push notification action performed', notification, notification.actionId, notification.inputValue);
  });
}

const registerNotifications = async () => {
  console.log('iniciou registerNotifications')
  let permStatus = await PushNotifications.checkPermissions();
  if (permStatus.receive === 'prompt') permStatus = await PushNotifications.requestPermissions();
  if (permStatus.receive !== 'granted') throw new Error('User denied permissions!');
  await PushNotifications.register();
}

// const getDeliveredNotifications = async () => {
//   const notificationList = await PushNotifications.getDeliveredNotifications();
//   console.log('delivered notifications', notificationList);
// }



const unregisterPushFromDevice = async (userId, type) => {
  const opt = {
    route: '/notifications/unregisterPushFromDevice',
    body: {
      token: window.localStorage.getItem('fbToken'),
      userId,
      type
    }
  }
  const unreg = await useFetch(opt)
  registered = false
  console.log('unregister push service')
  return
}



export default { initPush, unregisterPushFromDevice }