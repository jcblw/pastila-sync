
import React from 'react'
import {title} from '../styles/fonts'
import {colorTundora, lima, mercury} from '../styles/colors'
import {flex, displayFlex} from '../styles/flex'
import {marginRightSmall} from '../styles/spacing'
import {Sync} from './icons'

export default ({
  gistSyncing,
  onSubmit
}) => (
  <div {...displayFlex}>
    <h5
      {...title}
      {...colorTundora}
      {...displayFlex}
      {...flex[1]}
      onClick={(e) => onSubmit(e, {
        'gist-syncing': !gistSyncing
      })}
    >
      <div {...flex[0]} {...marginRightSmall}>
        <Sync color={gistSyncing ? lima : mercury} />
      </div>
      <div {...flex[1]}>
        Syncing is {gistSyncing ? 'on' : 'off'}
      </div>
    </h5>
  </div>
)
