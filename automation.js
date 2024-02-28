import executeSetVersion from './automations/functions/setVersion.js'

function init () {
  const project = process.argv[2]
  if (!project) {
    console.log('Projeto deve ser informado. Ex: node automation [project]')
    return
  }

  if (project === 'set_version') {
    setVersion()
    return
  } else {
    doInstructions(project)
  }
}

function setVersion () {
  // const setVersion = require('./automations/functions/setVersion.js')
  executeSetVersion()
  return
}

async function doInstructions (project) {
  
  let objInstructions
  try { objInstructions = await import('./automations/projects/' + project + '.cjs') }
  catch (e) {
    console.log('Erro: arquivo de projeto nao encontrado: ', project)
    console.log('Tipo do erro: ', e)
    return
  }
  const createObjInstructions = await import('./automations/functions/createObjInstructions.js')
  const executeInstructions = await import('./automations/functions/executeInstructions.js')

  const instructions = new createObjInstructions.default(objInstructions.default)
  executeInstructions.default(instructions)
}

init()