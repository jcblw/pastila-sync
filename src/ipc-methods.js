import path from 'path'
import {isDiffAndPresent, toDashCase} from './helpers'
import open from 'open'
import {createSync} from './create-sync'

export const getMethods = ({
  sync,
  config,
  currentConfig,
  updateSync,
  mb,
  assets
}) => {
  return {
    async downloadFile (gist, reply) {
      if (!sync) return
      await sync.downloadFile(gist)
      reply({
        type: 'DOWNLOAD_FILE_COMPLETED',
        gist
      })
    },
    openFile ({fileName}) {
      const directory = config.get('gist-directory')
      const filePath = path.resolve(
        process.cwd(),
        directory,
        fileName
      )
      open(filePath)
    },
    openInBrowser ({html_url: htmlUrl}) {
      open(htmlUrl)
    },
    closeApp () {
      process.exit()
    },
    'config:changed' (nextConfig) {
      if (isDiffAndPresent(nextConfig.gistKey, currentConfig.gistKey)) {
        if (!sync && (currentConfig.gistDirectory || nextConfig.gistDirectory)) {
          sync = createSync(nextConfig, config)
          updateSync(sync)
        }
        sync.updateToken(nextConfig.gistKey)
        config.set(toDashCase('gistKey'), nextConfig.gistKey)
      }

      if (isDiffAndPresent(nextConfig.gistDirectory, currentConfig.gistDirectory)) {
        if (!sync && (currentConfig.gistKey || nextConfig.gistKey)) {
          sync = createSync(nextConfig, config)
          updateSync(sync)
        }
        if (sync) {
          sync.setDirectory(nextConfig.gistDirectory)
        }
        config.set(toDashCase('gistDirectory'), nextConfig.gistDirectory)
      }

      if (isDiffAndPresent(nextConfig.gistSyncing, currentConfig.gistSyncing)) {
        const icon = nextConfig.gistSyncing
          ? assets.active
          : assets.inactive
        config.set(toDashCase('gistSyncing'), nextConfig.gistSyncing)
        if (nextConfig.gistSyncing) {
          sync.getAllGist() // refresh cache
          sync.resumeWatcher()
        } else {
          sync.pauseWatcher()
        }
        mb.setOption('icon', icon)
      }

      // set config to current
      Object.assign(currentConfig, nextConfig)
    }
  }
}
