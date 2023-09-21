let REFRESH_HOME = false
function getHomeRefreshStatus () { return REFRESH_HOME }
function setHomeRefreshStatus (status) { REFRESH_HOME = status }

export {
  getHomeRefreshStatus,
  setHomeRefreshStatus
}