import GistsSync from 'gist-sync'

export function createSync (currentConfig, config) {
  const sync = GistsSync.of(currentConfig.gistDirectory, {
    applicationToken: currentConfig.gistKey,
    isWatching: currentConfig.gistSyncing,
    setCache: (name, content) => {
      config.set(name, content)
      return Promise.resolve()
    },
    clearCache: () => {
      return Promise.resolve()
    },
    getCache: (name) => Promise.resolve(
      config.get(name)
    )
  })

  sync.on('error', (err) => {
    console.log('error', err)
    // display something to the user here
  })

  return sync
}
