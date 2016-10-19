const menubar = require('menubar')
const Config = require('electron-config')

const config = new Config()
const mb = menubar()
const applicationToken = config.get('gist-key')
const directory = config.get('gist-directory')
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
