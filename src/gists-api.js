
import got from 'got'
const BASE_API = 'https://api.github.com'

function request (
  endpoint,
  { method, body, token, userAgent = 'Gist Sync' }
) {
  return got[method](`${BASE_API}${endpoint}`, {
    json: true,
    body,
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': userAgent
    }
  })
}

class GistsApi {
  constructor (token, ua) {
    this.token = token
    this.userAgent = ua
    // somehow get user?

    // figure out cleaner way to write async methods
  }

  request (endpoint, method, body) {
    const {token, userAgent} = this
    return request(
      endpoint,
      {body, token, userAgent, method}
    )
  }

  getAllGists ({login}) {
    // get user somehow
    // should probably attempt to page all results
    return this.request(
      `/users/${login}/gists`,
      'get'
    )
  }

  updateGist (id, content) {
    return this.request(
      `/gists/${id}`,
      'patch',
      {content}
    )
  }

  createGist (content) {
    return this.request(
      '/gists',
      'post',
      {content}
    )
  }

  getUser () {
    return this.request(
      '/user',
      'get'
    )
  }
}

module.exports = GistsApi
