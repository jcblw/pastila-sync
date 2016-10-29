import menubar from 'menubar'
import Config from 'electron-config'
import {ipcMain} from 'electron'
import GistsSync from 'gist-sync'
import {getConfigObject, toDashCase, isDiffAndPresent} from './helpers'

const configKeys = [
  'gist-key',
  'gist-directory',
  'gist-syncing'
]

export function createSync (currentConfig, config) {
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

  return sync
}

export default async function start (dir) {
  const config = new Config()
  const authToken = config.get('gist-key')
  const getConfigObj = getConfigObject(config.get.bind(config), authToken)
  const currentConfig = await getConfigObj(configKeys)
  const mb = menubar({
    dir,
    icon: currentConfig.gistSyncing
      ? 'assets/active.png'
      : 'assets/inactive.png'
  })
  let sync = currentConfig.gistKey
    ? createSync(currentConfig, config)
    : null

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

  const publicMethods = {
    async downloadFile (gist, reply) {
      if (!sync) return
      await sync.downloadFile(gist)
      reply({
        type: 'DOWNLOAD_FILE_COMPLETED',
        gist
      })
    },
    'config:changed' (nextConfig) {
      if (isDiffAndPresent(nextConfig.gistKey, currentConfig.gistKey)) {
        if (!sync) {
          sync = createSync(nextConfig, config)
        }
        sync.updateToken(nextConfig.gistKey)
        config.set(toDashCase('gistKey'), nextConfig.gistKey)
      }

      if (isDiffAndPresent(nextConfig.gistDirectory, currentConfig.gistDirectory)) {
        if (sync) {
          sync.setDirectory(nextConfig.gistDirectory)
        }
        config.set(toDashCase('gistDirectory'), nextConfig.gistDirectory)
      }

      if (isDiffAndPresent(nextConfig.gistSyncing, currentConfig.gistSyncing)) {
        const method = nextConfig.gistSyncing ? 'resumeWatcher' : 'pauseWatcher'
        const icon = nextConfig.gistSyncing
          ? 'assets/active.png'
          : 'assets/inactive.png'
        config.set(toDashCase('gistSyncing'), nextConfig.gistSyncing)
        if (sync) {
          sync[method]()
        }
        mb.setOption('icon', icon)
      }

      // set config to current
      Object.assign(currentConfig, nextConfig)
    }
  }

  mb.on('after-create-window', () => {
    mb.window.loadURL(`file://${dir}/index.html`)
  })

  ipcMain.on('asynchronous-message', (event, eventName, ...args) => {
    if (typeof publicMethods[eventName] === 'function') {
      return publicMethods[eventName](
        ...args,
        event.sender.send.bind(event.sender, 'asynchronous-reply')
      )
    }
  })
}
