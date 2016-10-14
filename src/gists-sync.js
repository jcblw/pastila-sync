import path from 'path'
import assert from 'assert'
import autoBind from 'auto-bind'
import { EventEmitter2 } from 'eventemitter2'
import GistsWatcher from './gists-watcher'
import GistsApi from './gists-api'
import {
  serializeSingleFileGist,
  getGistByFileName
} from './gist-serializer'

/*
  GistsSync - A module that stiches a watcher and api together
*/

class GistsSync extends EventEmitter2 {
  constructor (directory = '', options = {}) {
    super()
    autoBind(this)
    this.validateOptions(options)
    this.pattern = this.getPattern(directory)
    this.options = options
    this.updateToken(options.applicationToken)
    this.initialize()
    // TODO need to store last update times from api to be able to periodically poll
    // to see if a gist is updated
  }

  static of (...args) { return new GistsSync(...args) }

  async initialize () {
    const gists = await this.getAllGist()
    this.getGistByFileName = getGistByFileName(gists)
    this.createWatcher()
  }

  validateOptions ({
    setCache,
    clearCache,
    getCache,
    applicationToken
  }) {
    assert(typeof setCache === 'function', 'The GistSync class has a way to set cache')
    assert(typeof clearCache === 'function', 'The GistSync class has a way to clear cache')
    assert(typeof getCache === 'function', 'The GistSync class has a way to getCache')
    assert(typeof applicationToken === 'string', 'The GistSync class has a user token to access gists')
  }

  updateToken (token) { this.api = new GistsApi(token) }

  createWatcher () {
    const {
      onError,
      onFileChanged,
      onFileAdded,
      onFileRemoved
    } = this
    this.watcher = new GistsWatcher(this.pattern, {
      autostart: this.options.isWatching,
      onError,
      onFileChanged,
      onFileAdded,
      onFileRemoved
    })
  }

  getPattern (directory) {
    const dir = path.resolve(process.cwd(), directory)
    return `${dir}/*.md`
  }

  setDirectory (directory) {
    this.pattern = this.getPattern(directory)
    this.watcher.setPattern(this.pattern)
  }

  resumeWatcher () { this.watcher.resume() }

  pauseWatcher () { this.watcher.pause() }

  onError (err) { this.emit('error', err) }

  async onFileChanged (filename, content) {
    const gists = await this.getAllGist()
    const gist = serializeSingleFileGist(
      filename,
      content,
      this.getGistByFileName(filename)
    )
    const resp = await this.api.updateGist(gist)
    if (resp.statusCode > 400) {
      this.onError(new Error(`Unable to update gist: ${resp.body}`))
    }
  }

  async onFileAdded () {
    const gist = serializeSingleFileGist(
      filename,
      content
    )
    const resp = await this.api.createGist(gist)
    if (resp.statusCode > 400) {
      this.onError(new Error(`Unable to create gist: ${resp.body}`))
    }
    // this.api.addGist
  }

  async onFileRemoved () {
    // this.api.destroyGist?
  }

  async getUser () {
    const { getCache, applicationToken, setCache } = this.options
    let user = await getCache(applicationToken)
    if (!user) {
      const { body } = await this.api.getUser()
      user = body
      await setCache(applicationToken, user)
    }
    return user
  }

  async getAllGist () {
    const { applicationToken, setCache, getCache } = this.options
    const {login} = await this.getUser()
    let gists = await getCache(`${login}:gists`)
    if (!gists) {
      const { body } = await this.api.getAllGists({login})
      gists = body
      await setCache(`${login}:gists`, gists)
      this.getGistByFileName = getGistByFileName(gists)
    }
    return gists
  }
}

module.exports = GistsSync
