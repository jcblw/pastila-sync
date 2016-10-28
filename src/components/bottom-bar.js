
import React from 'react'
import {title} from '../styles/fonts'
import {colorTundora} from '../styles/colors'

export default ({
  gistSyncing,
  onSubmit
}) => (
  <div>
    <h5
      {...title}
      {...colorTundora}
      onClick={(e) => onSubmit(e, {
        'gist-syncing': !gistSyncing
      })}
    >
      Syncing is {gistSyncing ? 'on' : 'off'}
    </h5>
  </div>
)
