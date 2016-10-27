
export const upperCase = word =>
  `${word[0].toUpperCase()}${word.substr(1)}`

export const toCamelCase = key => key.split('-')
  .map((word, index) => !index ? word : upperCase(word))
  .join('')

export const toDashCase = key => key.match(/([a-z]|[A-Z])[a-z]+/g)
  .map(word => word.toLowerCase())
  .join('-')

const transformObjKey = fn => obj => Object.keys(obj)
  .reduce((accum, key) => {
    accum[fn(key)] = obj[key]
    return accum
  }, {})

export const camelCaseKeys = transformObjKey(toCamelCase)

export const dashCaseKeys = transformObjKey(toDashCase)

export const accessObjKeys = fn => obj => Object.keys(obj)
  .reduce((accum, key) => {
    accum[key] = fn(key)
    return accum
  }, {})

export const getGistFileName = gist => Object.keys(gist.files)[0]

export const arrToObjKey = (arr) => arr.reduce((accum, key) => {
  accum[key] = key
  return accum
}, {})

export const getConfigObject = fn => (arr, authToken) => {
  const user = authToken ? fn(authToken) : {}
  return Object.assign(
    camelCaseKeys(accessObjKeys(fn)(arrToObjKey(arr))),
    {
      user,
      gists: fn(`${user.login}:gists`)
    }
  )
}
