import { MODE_MASTER_SERVER } from './variables'

function masterServerRoute () {
  let ret
  if (MODE_MASTER_SERVER === 'local') ret = 'http://localhost:8000'
  else if (MODE_MASTER_SERVER === 'dev') ret = 'https://api6.b3dev.dev:8000'
  else if (MODE_MASTER_SERVER === 'tiago') ret = 'http://192.168.1.5:8000'
  else if (MODE_MASTER_SERVER === 'darta') ret = 'http://192.168.1.6:8000'
  else if (MODE_MASTER_SERVER === 'prod') ret = 'https://api2.b3dev.dev:8000'
  return ret
}
function calculateMasterServerAttachmentsRoute() {
  if (
    MODE_MASTER_SERVER === "dev" ||
    MODE_MASTER_SERVER === "dev_ext" ||
    MODE_MASTER_SERVER === "prod"
  ) {
    return masterServerRoute() + "/static/escolas_app/";
  } else return masterServerRoute("dev_ext") + "/static/escolas_app/";
}

export { masterServerRoute, calculateMasterServerAttachmentsRoute }