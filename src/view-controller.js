
import {ipcRenderer, clipboard} from 'electron'
import {bindActionCreators} from 'redux'
import React from 'react'
import {render} from 'react-dom'
import Config from 'electron-config'
import {App} from './components/app'
import * as actions from './actions'
import configStore from './store'
import {
  getConfigObject,
  camelCaseKeys
} from './helpers'

const config = new Config()
const getConfigObj = getConfigObject(config.get.bind(config))
const configKeys = [
  'gist-key',
  'gist-directory',
  'gist-syncing'
]
const store = configStore()
const onSubmit = (e, data) => {
  Object.keys(data)
    .forEach(key => {
      config.set(key, data[key])
    })
  // should update main process first then update
  ipcRenderer.send('asynchronous-message', 'config:changed', camelCaseKeys(data))
  update()
}

const downloadGist = gist => {
  console.log(gist)
  if (gist && gist.id) {
    store.dispatch(actions.download(gist))
    ipcRenderer.send('asynchronous-message', 'downloadFile', gist)
  }
}

const openFile = gist => {
  if (gist && gist.fileName) {
    ipcRenderer.send('asynchronous-message', 'openFile', gist)
  }
}

const openInBrowser = gist => {
  if (gist && gist.html_url) {
    ipcRenderer.send('asynchronous-message', 'openInBrowser', gist)
  }
}

const copyLink = gist => {
  clipboard.writeText(gist.html_url)
}

const closeApp = () => {
  ipcRenderer.send('asynchronous-message', 'closeApp')
}

const update = async () => {
  // possibly pass this from somewhere to make function pure
  const props = Object.assign(
    {onSubmit, downloadGist, openFile, copyLink, openInBrowser, closeApp},
    bindActionCreators(actions, store.dispatch),
    store.getState(),
    await getConfigObj(configKeys, config.get('gist-key'))
  )

  console.log(store.getState())
  if (
    !props.gistKey ||
    !props.gistDirectory
  ) {
    props.gistCurrentView = 'settings' // lock view
  }

  render(
    <App {...props} />,
    document.getElementById('app')
  )
}

update()
store.subscribe(update)
ipcRenderer.on('asynchronous-reply', (action) => {
  if (action && action.type) return store.dispatch(action)
  update()
})
