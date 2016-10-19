import React from 'react'

export const Form = ({
  onChange,
  gistKey,
  gistDirectory
}) => (
  <div className='app-container'>
    <div>
      <label htmlFor='gist-key'>Personal Access Key</label>
      <input
        id='gist-key'
        value={gistKey}
        onChange={onChange('gist-key')}
      />
    </div>
    <div>
      <label htmlFor='gist-directory'>Directory to sync</label>
      <small>Example: <code>/Users/foo/gists</code></small>
      <input
        id='gist-directory'
        value={gistDirectory}
        onChange={onChange('gist-directory')}
      />
    </div>
  </div>
)
