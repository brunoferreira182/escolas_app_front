//////////// VARIAVEIS DA APLICACAO //////
const MODE_MASTER_SERVER = 'tiago'
const COMPANY_ID = 10
const VERSION = 3.0
const BUILD = 27
//////////// NAO MUDAR //////
const MODE_AUTH_SERVER = 'local'
const MODE_APP_SERVER = 'local'
const PROJECT_NAME = 'escolas_app'
const DEFAULT_SERVER_NAME = 'application'
const CRYPTOYESORNO = 0 // 1 para criptografar, 0 para nao criptografar
const APP_NAME = 'EduLink'
let IUGU_ID
let IUGU_TEST_MODE
const MODE_SERVER = 'app'
///////////////////////////////////////////

/*
fontes do logo:
Tangerine
Niconne
*/

const setIuguId = function (id) {
  IUGU_ID = id
}
const getIuguId = function () {
  return IUGU_ID
}
const setIuguTestMode = function (type) {
  
  IUGU_TEST_MODE = type === 'prod' ? false : true
}
const getIuguTestMode = function () {
  return IUGU_TEST_MODE
}

export {
  MODE_MASTER_SERVER,
  MODE_AUTH_SERVER,
  MODE_APP_SERVER,
  COMPANY_ID,
  PROJECT_NAME,
  DEFAULT_SERVER_NAME,
  CRYPTOYESORNO,
  APP_NAME,
  IUGU_ID,
  IUGU_TEST_MODE,
  getIuguId,
  setIuguId,
  setIuguTestMode,
  getIuguTestMode,
  VERSION,
  BUILD,
  MODE_SERVER
}