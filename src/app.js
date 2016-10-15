import GistsSync from './gists-sync'

/*
  this is an example script an will probably be completely
  removed
*/

const cache = {}
const applicationToken = process.env['APPLICATION_TOKEN']

process.on('unhandledRejection', (reason, p) => {
  console.log(
    'Possibly Unhandled Rejection at: Promise ',
    p,
    ' reason: ',
    reason
  )
})

const sync = GistsSync.of('./examples/', {
  applicationToken,
  isWatching: true,
  setCache: (name, content) => {
    cache[name] = content
    return Promise.resolve()
  },
  clearCache: () => {
     cache = {}
     return Promise.resolve()
   },
  getCache: (name) => Promise.resolve(cache[name])
})
