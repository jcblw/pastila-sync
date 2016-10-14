const menubar = require('menubar')
const Config = require('electron-config')

const config = new Config()
const mb = menubar()
// point towards dist files

mb.on('ready', function ready () {
  console.log('app is ready')
  if (
    !config.get('gist-directory') ||
    !config.get('gist-key')
  ) {
    mb.showWindow()
  }
})
