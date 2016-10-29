
import {createStore, combineReducers, applyMiddleware} from 'redux'

export const gistCurrentView = (state = 'gists', action) => {
  if (action.type === 'SET_CURRENT_VIEW') {
    return action.view
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
    combineReducers({gistCurrentView}),
    payload,
    applyMiddleware(promiseMiddleware)
  )
}
