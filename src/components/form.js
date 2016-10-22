import React from 'react'

const serializeSubmit = handler => e => {
  e.preventDefault()
  const el = e.target
  const inputs = Array.from(el.getElementsByTagName('input'))
  handler(e, inputs.reduce((accum, input) => {
    accum[input.id] = input.type === 'checkbox'
      ? input.checked
      : input.value
    return accum
  }, {}))
}

export const Form = ({
  onSubmit,
  gistKey,
  gistSyncing,
  gistDirectory
}) => (
  <form onSubmit={serializeSubmit(onSubmit)}>
    <div>
      <label htmlFor='gist-key'>Personal Access Key</label>
      <input
        id='gist-key'
        defaultValue={gistKey}
      />
    </div>
    <div>
      <label htmlFor='gist-directory'>Directory to sync</label>
      <small>Example: <code>/Users/foo/gists</code></small>
      <input
        id='gist-directory'
        defaultValue={gistDirectory}
      />
    </div>
    <div>
      <label htmlFor='gist-syncing'>Turn on/off syncing</label>
      <input
        id='gist-syncing'
        type='checkbox'
        defaultChecked={gistSyncing}
      />
    </div>
    <button>Change</button>
  </form>
)
