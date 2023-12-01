import fs from 'fs'
import replaceInFile from './AUXreplaceInFile.js'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const variablesFile = path.join(__dirname, '../../src/composables/variables.js')
const iosFile = path.join(__dirname, '../../ios/App/App.xcodeproj/project.pbxproj')
const androidFile = path.join(__dirname, '../../android/app/build.gradle')
let versionTo = ''
let buildTo = ''

async function exec () {


  const variables = fs.readFileSync(variablesFile, 'utf8').split(/\r?\n/)

  let temp
  for (let i = 0; i < variables.length; i++) {
    if (variables[i].includes('const VERSION = ')) {
      temp = variables[i].split(' ')
      versionTo = temp[3]
    } else if (variables[i].includes('const BUILD = ')) {
      temp = variables[i].split(' ')
      buildTo = temp[3]
    } 
  }

  await replaceInFile({
    textVersion: 'MARKETING_VERSION = ',
    textBuild: 'CURRENT_PROJECT_VERSION = ',
    versionTo,
    buildTo,
    fileToReplace: iosFile,
    endComma: true
  })

  await replaceInFile({
    textVersion: 'versionName ',
    textBuild: 'versionCode ',
    versionTo,
    buildTo,
    fileToReplace: androidFile,
    endComma: false
  })

}

export default exec