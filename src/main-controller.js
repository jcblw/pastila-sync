import menubar from '@jcblw/menubar'
import path from 'path'
import userHome from 'user-home'
import fs from 'mz/fs'
import Config from 'electron-config'
import {ipcMain, Menu, app, shell} from 'electron'
import defaultMenu from 'electron-default-menu'
import {getConfigObject} from './helpers'
import {checkUpdates} from './auto-update'
import {createSync} from './create-sync'
import {getMethods} from 'ipc-methods'

checkUpdates()

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

  // TODO: figure out how to make a better solution for this
  const updateSync = (newSync) => {
    sync = newSync
  }

  mb.on('ready', () => {
    if (
      !currentConfig.gistDirectory ||
      !currentConfig.gistKey
    ) {
      mb.showWindow()
    }
    const menu = Menu.buildFromTemplate(
      defaultMenu(app, shell)
    )
    Menu.setApplicationMenu(menu)
  })

  mb.on('after-create-window', () => {
    mb.window.loadURL(`file://${dir}/index.html`)
  })

  ipcMain.on('asynchronous-message', (event, eventName, ...args) => {
    const publicMethods = getMethods({
      sync,
      config,
      currentConfig,
      mb,
      assets,
      updateSync
    })
    if (typeof publicMethods[eventName] === 'function') {
      return publicMethods[eventName](
        ...args,
        event.sender.send.bind(event.sender, 'asynchronous-reply')
      )
    }
  })
}
