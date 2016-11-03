import {autoUpdater, app} from 'electron'
import os from 'os'

const platform = `${os.platform()}_${os.arch()}`
const version = app.getVersion()
const NUTS_SERVER = 'https://nuts-serve-hzscbhjcbc.now.sh'

export const checkUpdates = () => {
  try {
    autoUpdater.setFeedURL(
      `${NUTS_SERVER}/update/${platform}/${version}`
    )
  } catch (e) {
    console.log('Auto updater disabled:', e.message)
  }

  autoUpdater.on('update-downloaded', () => autoUpdater.quitAndInstall())
}
