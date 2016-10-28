
import React from 'react'
import {title} from '../styles/fonts'
import {colorTundora} from '../styles/colors'

export default ({
  gistSyncing
}) => (
  <div>
    <h5
      {...title}
      {...colorTundora}
    >
      Syncing is {gistSyncing ? 'on' : 'off'}
    </h5>
  </div>
)
