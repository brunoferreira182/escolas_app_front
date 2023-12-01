// const replace = require('replace-in-file')
// const fs = require('fs');
// const { execSync } = require('node:child_process')

import replace from 'replace-in-file'
import fs from 'fs'
import { execSync } from 'node:child_process'

async function execute (param) {

  let results
  let options
  let from
  for (let i = 0; i < param.actions.length; i++) {
    if (param.actions[i].type === 'replaceTextInFile') {
      from = new RegExp(param.actions[i].textOut, 'g')
      options = {
        files: param.actions[i].files ? param.actions[i].files : param.actions[i].file,
        from,
        to: param.actions[i].textIn,
        countMatches: true
      }
      results = await replace(options)
      console.log(`resultado substituir de: ${param.actions[i].textOut} para: ${param.actions[i].textIn}`, results)
    }

    else if (param.actions[i].type === 'copyFile') {
      results = await fs.copyFileSync(param.actions[i].fileToCopy, param.actions[i].to)
      console.log(`Resultado do copiar arquivo: ${results} - ${i}`)
    }

    else if (param.actions[i].type === 'runCommand'){
      execSync(param.actions[i].commandToRun)
    }
  }
}

export default execute