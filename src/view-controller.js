
import React from 'react'
import path from 'path'
import {render} from 'react-dom'
import Config from 'electron-config'
import {App} from './components/app'

const config = new Config()

// need to debounce this
const onChange = (key) => (e) => {
  const {value} = e.target
  config.set(key, value)
  // need to message main process
  // to update sync settings
  update({
    onChange,
    gistDirectory: path.resolve(
      config.get('gist-directory')
    ),
    gistKey: config.get('gist-key')
  })
}

const update = (props) => {
  render(
    <App {...props} />,
    document.getElementById('app')
  )
}

update({
  onChange,
  gistDirectory: config.get('gist-directory'),
  gistKey: config.get('gist-key')
})
