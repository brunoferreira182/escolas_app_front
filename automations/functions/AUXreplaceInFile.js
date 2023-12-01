import fs from 'fs'
import replace from 'replace-in-file'

async function replaceInFile ({ textVersion, textBuild, versionTo, buildTo, fileToReplace, endComma }) {
  let versionFrom
  let buildFrom
  let file = fs.readFileSync(fileToReplace, 'utf8').split(/\r?\n/)
  for (let i = 0; i < file.length; i++) {
    if (file[i].includes(textVersion)) {
      versionFrom = file[i].trim()
      console.log('dentro for ', i, versionFrom)
    } else if (file[i].includes(textBuild)) {
      buildFrom = file[i].trim()
      console.log('dentro for ', i, buildFrom)
    }
  }

  console.log('depois do for ', versionFrom, buildFrom)
  
  if (!endComma) {
    // se for android
    versionTo = '"' + versionTo + '"'
  }


  console.log('///////////////////', textVersion)


  let options = {
    files: fileToReplace,
    from: new RegExp(versionFrom, 'g'),
    to: endComma ? textVersion + versionTo + ';' : textVersion + versionTo + '',
    countMatches: true
  }
  let results = await replace(options)
  console.log('Resultado replace version ', results)

  options = {
    files: fileToReplace,
    from: new RegExp(buildFrom, 'g'),
    to: endComma ? textBuild + buildTo + ';' : textBuild + buildTo + '',
    countMatches: true
  }
  results = await replace(options)
  console.log('Resultado replace build ', results)

  console.log('///////////////////')
  return
}

export default replaceInFile