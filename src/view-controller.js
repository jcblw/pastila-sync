
import {ipcRenderer} from 'electron'
import React from 'react'
import {render} from 'react-dom'
import Config from 'electron-config'
import {App} from './components/app'
import {getConfigObject, camelCaseKeys} from './helpers'

const config = new Config()
const getConfigObj = getConfigObject(config.get.bind(config))
const configKeys = [
  'gist-key',
  'gist-directory',
  'gist-syncing'
]

const onSubmit = (e, data) => {
  Object.keys(data)
    .forEach(key => {
      config.set(key, data[key])
    })
  // should update main process first then update
  ipcRenderer.send('asynchronous-message', 'config:changed', camelCaseKeys(data))
  update(Object.assign(
    {onSubmit},
    getConfigObj(configKeys, config.get('gist-key'))
  ))
}

const update = (props) => {
  render(
    <App {...props} />,
    document.getElementById('app')
  )
}

update(Object.assign(
  {onSubmit},
  getConfigObj(configKeys, config.get('gist-key'))
))
