import { Gaze } from 'gaze'

const eventMapping = {
  error: 'onError',
  changed: 'onFileChanged',
  added: 'onFileAdded',
  deleted: 'onFileRemoved'
}

class GistsWatcher {
  constructor (pattern, options) {
    this.pattern = options
    this.options = options
    if (options.autostart) {
      // auto create/watch files
      this.createWatcher()
    }
  }

  bindWatcherEvents () {
    const { options } = this
    Object.keys(eventMapping).forEach(eventName => {
      const method = eventMapping[eventName]
      if (typeof options[method] !== 'function') return
      this.watcher.on(eventName, options[method])
    })
  }

  createWatcher () {
    this.destroyWatcher()
    this.watcher = new Gaze(
      this.pattern,
      this.options
    )
  }

  setPattern (pattern) {
    this.pattern = pattern
    this.createWatcher() // recreate watcher
  }

  setOptions (options) {
    Object.assign(this.options, options)
    this.createWatcher() // recreate watcher
  }

  destroyWatcher () {
    if (this.watcher && this.watcher.close) {
      this.watcher.close()
      this.watcher = null
    }
  }

  pause () {
    this.destroyWatcher()
  }

  resume () {
    this.createWatcher()
  }
}

module.exports = GistsWatcher
