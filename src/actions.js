
export const changeView = view => ({
  type: 'SET_CURRENT_VIEW',
  view
})

export const download = gist => ({
  type: 'FILE_IS_DOWNLOADING',
  gist
})
