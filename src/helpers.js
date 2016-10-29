
import fs from 'mz/fs'

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

export const getLocalCacheFiles = async (dir) =>
  await fs.readdir(dir)

export const isDiffAndPresent = (val1, val2) => val1 && val1 !== val2

export const sortByKeyPresence = key => (prev, curr) => {
  if (prev[key] && curr[key]) return 0
  if (prev[key] && !curr[key]) return -1
  return 1
}

export const decorateGistObj = ({localFiles, isDownloading}) => gist => {
  const fileName = getGistFileName(gist)
  return Object.assign({
    fileName,
    isDownloading: gist.id === isDownloading,
    isActive: localFiles.indexOf(fileName) !== -1
  }, gist)
}

export const getConfigObject = fn => async (arr) => {
  const configObj = camelCaseKeys(accessObjKeys(fn)(arrToObjKey(arr)))
  const user = fn(configObj.gistKey)
  let localFiles
  try {
    localFiles = await getLocalCacheFiles(configObj.gistDirectory)
  } catch (e) {
    localFiles = []
  }
  return Object.assign(configObj, {
    user,
    gists: fn(`${user.login}:gists`),
    localFiles
  })
}
