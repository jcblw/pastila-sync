
import {createStore, combineReducers, applyMiddleware} from 'redux'

export const gistCurrentView = (state = 'gists', action) => {
  if (action.type === 'SET_CURRENT_VIEW') {
    return action.view
  }
  return state
}

export const isDownloading = (state = null, action) => {
  if (action.type === 'FILE_IS_DOWNLOADING') {
    return action.gist.id
  }
  if (action.type === 'DOWNLOAD_FILE_COMPLETED') {
    return null
  }
  return state
}

export const promiseMiddleware = ({dispatch}) => {
  return next => async action => {
    if (action && typeof action.then === 'function') {
      const resp = await action
      dispatch(resp)
      return
    }
    next(action)
  }
}

export default (payload = {}) => {
  return createStore(
    combineReducers({
      gistCurrentView,
      isDownloading
    }),
    payload,
    applyMiddleware(promiseMiddleware)
  )
}
