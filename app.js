const menubar = require('menubar')
const Config = require('electron-config')
const {ipcMain} = require('electron')

const config = new Config()
const mb = menubar()
const applicationToken = config.get('gist-key')
const directory = config.get('gist-directory')
const isWatching = config.get('gist-syncing')
const GistsSync = require('./dist/gists-sync')
// point towards dist files
process.on('unhandledRejection', (reason, p) => {
  console.log(
    'Possibly Unhandled Rejection at: Promise ',
    p,
    ' reason: ',
    reason
  )
})

const sync = GistsSync.of(directory, {
  applicationToken,
  isWatching,
  setCache: (name, content) => {
    config.set(name, content)
    return Promise.resolve()
  },
  clearCache: () => {
    // need to lookup
    return Promise.resolve()
  },
  getCache: (name) => Promise.resolve(
    config.get(name)
  )
})

mb.on('ready', () => {
  if (
    !config.get('gist-directory') ||
    !config.get('gist-key')
  ) {
    mb.showWindow()
  }
})

mb.on('after-create-window', () => {
  mb.window.loadURL(`file://${__dirname}/index.html`)
})

const currentConfig = {
  gistDirectory: config.get('gist-directory'),
  gistKey: config.get('gist-key'),
  gistSync: config.get('gist-syncing')
}
ipcMain.on('asynchronous-message', (event, arg) => {
  const nextConfig = {
    gistDirectory: config.get('gist-directory'),
    gistKey: config.get('gist-key'),
    gistSync: config.get('gist-syncing')
  }

  if (nextConfig.gistKey !== currentConfig.gistKey) {
    console.log('updating user key')
    sync.updateToken(nextConfig.gistKey)
  }

  if (nextConfig.gistDirectory !== currentConfig.gistDirectory) {
    console.log('updating directory to sync')
    sync.setDirectory(nextConfig.gistDirectory)
  }

  if (nextConfig.gistSync !== currentConfig.gistSync) {
    const method = nextConfig.gistSync ? 'resumeWatcher' : 'pauseWatcher'
    sync[method]()
  }

  // set config to current
  Object.assign(currentConfig, nextConfig)
})
