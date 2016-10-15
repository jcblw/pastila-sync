import path from 'path'
import fs from 'fs'
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
    assert(typeof setCache === 'function', 'The GistSync class needs a way to set cache')
    assert(typeof clearCache === 'function', 'The GistSync class needs a way to clear cache')
    assert(typeof getCache === 'function', 'The GistSync class needs a way to getCache')
    assert(typeof applicationToken === 'string', 'The GistSync class needs a user token to access gists')
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
    return `${dir}/`
  }

  setDirectory (directory) {
    this.pattern = this.getPattern(directory)
    this.watcher.setPattern(this.pattern)
  }

  resumeWatcher () { this.watcher.resume() }

  pauseWatcher () { this.watcher.pause() }

  onError (err) { this.emit('error', err) }

  async getFileDataFromPath (path) {
    const filename = path.split(/\//).pop()
    const content = fs.readFileSync(path).toString('utf8') || '.'
    return { filename, content }
  }

  async hasExisting (filename) {
    const gists = await this.getAllGist()
    return !!this.getGistByFileName(filename)
  }

  async onFileChanged (path) {
    const { filename, content } = await this.getFileDataFromPath(path)
    const gists = await this.getAllGist()
    const gist = serializeSingleFileGist(
      filename,
      content,
      this.getGistByFileName(filename)
    )
    const resp = await this.api.updateGist(gist)
    if (resp.statusCode > 400) {
      return this.onError(new Error(`Unable to update gist: ${resp.body}`))
    }
    this.updateGistInCache(resp.body)
  }

  async onFileAdded (path, stat) {
    const { filename, content } = await this.getFileDataFromPath(path)
    const hasExisting = await this.hasExisting(filename)
    if (hasExisting) {
      return this.onFileChanged(path, stat)
    }
    const gist = serializeSingleFileGist(
      filename,
      content
    )
    const resp = await this.api.createGist(gist)
    if (resp.statusCode > 400) {
      return this.onError(new Error(`Unable to create gist: ${resp.body}`))
    }
    this.updateGistInCache(resp.body)
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

  async updateGistInCache (gist) {
    const { setCache } = this.options
    const cachedGists = await this.getAllGist()
    const {login} = await this.getUser()
    const gists = [...cachedGists]
    const gistIndex = gists
      .reduce((c, g, i) => g.id === gist.id ? i : c, -1)
    if (gistIndex === -1) {
      gists.push(gist)
    } else {
      gists.splice(gistIndex, 1, gist)
    }
    await setCache(`${login}:gists`, gists)
    const freshGists = await this.getAllGist()
    this.getGistByFileName = getGistByFileName(freshGists)
  }
}

module.exports = GistsSync
