import menubar from 'menubar'
import Config from 'electron-config'
import {ipcMain} from 'electron'
import GistsSync from './gists-sync'
import {getConfigObject, toDashCase} from './helpers'

const configKeys = [
  'gist-key',
  'gist-directory',
  'gist-syncing'
]

export default function start (dir) {
  const mb = menubar()
  const config = new Config()
  const getConfigObj = getConfigObject(config.get.bind(config))
  const currentConfig = getConfigObj(configKeys)
  const sync = GistsSync.of(currentConfig.gistDirectory, {
    applicationToken: currentConfig.gistKey,
    isWatching: currentConfig.gistSyncing,
    setCache: (name, content) => {
      config.set(name, content)
      return Promise.resolve()
    },
    clearCache: () => {
      return Promise.resolve()
    },
    getCache: (name) => Promise.resolve(
      config.get(name)
    )
  })

  sync.on('error', (err) => {
    console.log('error', err)
  })

  process.on('unhandledRejection', (reason, p) => {
    console.log(
      'Possibly Unhandled Rejection at: Promise ',
      p,
      ' reason: ',
      reason
    )
  })

  mb.on('ready', () => {
    if (
      !currentConfig.gistDirectory ||
      !currentConfig.gistKey
    ) {
      mb.showWindow()
    }
  })

  mb.on('after-create-window', () => {
    mb.window.loadURL(`file://${dir}/index.html`)
  })

  ipcMain.on('asynchronous-message', (event, eventName, nextConfig) => {
    if (eventName !== 'config:changed') return

    if (nextConfig.gistKey !== currentConfig.gistKey) {
      sync.updateToken(nextConfig.gistKey)
      config.set(toDashCase('gistKey'), nextConfig.gistKey)
    }

    if (nextConfig.gistDirectory !== currentConfig.gistDirectory) {
      sync.setDirectory(nextConfig.gistDirectory)
      config.set(toDashCase('gistDirectory'), nextConfig.gistDirectory)
    }

    if (nextConfig.gistSyncing !== currentConfig.gistSyncing) {
      const method = nextConfig.gistSyncing ? 'resumeWatcher' : 'pauseWatcher'
      config.set(toDashCase('gistSyncing'), nextConfig.gistSyncing)
      sync[method]()
    }

    // set config to current
    Object.assign(currentConfig, nextConfig)
  })
}
