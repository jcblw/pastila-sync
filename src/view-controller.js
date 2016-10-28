
import {ipcRenderer} from 'electron'
import React from 'react'
import {render} from 'react-dom'
import Config from 'electron-config'
import {App} from './components/app'
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
let gistCurrentView = 'gists'

const onSubmit = (e, data) => {
  Object.keys(data)
    .forEach(key => {
      config.set(key, data[key])
    })
  // should update main process first then update
  ipcRenderer.send('asynchronous-message', 'config:changed', camelCaseKeys(data))
  update()
}

const changeView = view => {
  gistCurrentView = view
  update()
}

const downloadGist = gist => {
  console.log(gist, 'downloadGist')
  if (gist && gist.id) {
    ipcRenderer.send('asynchronous-message', 'downloadFile', gist)
  }
}

const update = async () => {
  // possibly pass this from somewhere to make function pure
  const props = Object.assign(
    {onSubmit, gistCurrentView, changeView, downloadGist},
    await getConfigObj(configKeys, config.get('gist-key'))
  )
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
