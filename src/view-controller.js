
import {ipcRenderer} from 'electron'
import React from 'react'
import path from 'path'
import {render} from 'react-dom'
import Config from 'electron-config'
import {App} from './components/app'

const config = new Config()

const onSubmit = (e, data) => {
  Object.keys(data)
    .forEach(key => {
      config.set(key, data[key])
    })
  // should update main process first then update
  ipcRenderer.send('asynchronous-message', 'config:changed')
  update({
    onSubmit,
    gistDirectory: config.get('gist-directory'),
    gistKey: config.get('gist-key'),
    gistSync: config.get('gist-sync')
  })
}

const update = (props) => {
  render(
    <App {...props} />,
    document.getElementById('app')
  )
}

update({
  onSubmit,
  gistDirectory: config.get('gist-directory'),
  gistKey: config.get('gist-key'),
  gistSync: config.get('gist-sync')
})
