import menubar from 'menubar'
import path from 'path'
import userHome from 'user-home'
import fs from 'mz/fs'
import Config from 'electron-config'
import {ipcMain} from 'electron'
import GistsSync from 'gist-sync'
import open from 'open'
import {getConfigObject, toDashCase, isDiffAndPresent} from './helpers'

const configKeys = [
  'gist-key',
  'gist-directory',
  'gist-syncing'
]
const defaultDir = `${userHome}/gist-sync`
const configDefaults = {
  'gist-directory': {
    val: defaultDir,
    setup: async () => {
      try {
        await fs.mkdir(defaultDir) // this errors if it
      } catch (e) { }
    }
  }
}

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
    // display something to the user here
  })

  return sync
}

process.on('unhandledRejection', (reason, p) => {
  console.log(
    'Possibly Unhandled Rejection at: Promise ',
    p,
    ' reason: ',
    reason
  )
  process.exit(1)
})

const createDefaults = async (config, defaults) => {
  for (const key in defaults) {
    const existingVal = config.get(key)
    if (typeof existingVal === 'undefined') {
      const {val, setup} = defaults[key]
      if (typeof setup === 'function') {
        await setup()
      }
      config.set(key, val)
    }
  }
}

export default async function start (dir) {
  const config = new Config()

  await createDefaults(config, configDefaults)

  const authToken = config.get('gist-key')
  const getConfigObj = getConfigObject(config.get.bind(config), authToken)
  const currentConfig = await getConfigObj(configKeys)
  const assets = {
    active: path.resolve(dir, 'assets/active.png'),
    inactive: path.resolve(dir, 'assets/inactive.png')
  }
  const mb = menubar({
    dir,
    preloadWindow: true,
    tooltip: 'Pastila Sync',
    icon: currentConfig.gistSyncing
      ? assets.active
      : assets.inactive
  })
  let sync = currentConfig.gistKey && currentConfig.gistDirectory
    ? createSync(currentConfig, config)
    : null

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
    openFile ({fileName}) {
      const directory = config.get('gist-directory')
      const filePath = path.resolve(
        process.cwd(),
        directory,
        fileName
      )
      open(filePath)
    },
    openInBrowser ({html_url: htmlUrl}) {
      open(htmlUrl)
    },
    closeApp () {
      process.exit()
    },
    'config:changed' (nextConfig) {
      if (isDiffAndPresent(nextConfig.gistKey, currentConfig.gistKey)) {
        if (!sync && (currentConfig.gistDirectory || nextConfig.gistDirectory)) {
          sync = createSync(nextConfig, config)
        }
        sync.updateToken(nextConfig.gistKey)
        config.set(toDashCase('gistKey'), nextConfig.gistKey)
      }

      if (isDiffAndPresent(nextConfig.gistDirectory, currentConfig.gistDirectory)) {
        if (!sync && (currentConfig.gistKey || nextConfig.gistKey)) {
          sync = createSync(nextConfig, config)
        }
        if (sync) {
          sync.setDirectory(nextConfig.gistDirectory)
        }
        config.set(toDashCase('gistDirectory'), nextConfig.gistDirectory)
      }

      if (isDiffAndPresent(nextConfig.gistSyncing, currentConfig.gistSyncing)) {
        const method = nextConfig.gistSyncing ? 'resumeWatcher' : 'pauseWatcher'
        const icon = nextConfig.gistSyncing
          ? assets.active
          : assets.inactive
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
