function createObj (opt) {

  // function ConstObj (opt) {
    this.defaultDir = opt.defaultDir
    this.actions = []
    for (let i = 0; i < opt.actions.length; i++) {
      console.log(i)
      this.actions[i] = {
        type: opt.actions[i].type
      }
      if (opt.actions[i].file) this.actions[i].file = opt.defaultDir + opt.actions[i].file
      if (opt.actions[i].files) {
        this.actions[i].files = []
        for (let j = 0; j < opt.actions[i].files.length; j++) {
          this.actions[i].files.push(opt.defaultDir + opt.actions[i].files[j])
        }
      }
      if (opt.actions[i].textIn) this.actions[i].textIn = opt.actions[i].textIn
      if (opt.actions[i].textOut) this.actions[i].textOut = opt.actions[i].textOut
      if (opt.actions[i].to) this.actions[i].to = opt.defaultDir + opt.actions[i].to
      if (opt.actions[i].fileToCopy) this.actions[i].fileToCopy = opt.defaultDirFilesToCopy + opt.actions[i].fileToCopy
      if (opt.actions[i].commandToRun) this.actions[i].commandToRun = opt.actions[i].commandToRun
    }
  // }

  // return new ConstObj(param)
}

export default createObj