
import React from 'react'
import IconAction from './icon-action'
import {title} from '../styles/fonts'
import {colorTundora} from '../styles/colors'
import {flex, displayFlex, alignItems} from '../styles/flex'
import {Back, Settings} from './icons'

export default ({
  user,
  gistCurrentView,
  changeView
}) => {
  const nextView = gistCurrentView === 'settings' ? 'gists' : 'settings'
  return (
    <div {...displayFlex}>
      <h3 {...flex[1]} {...title} {...colorTundora}>{user.login}{'\'s'} {gistCurrentView}</h3>
      <div
        {...flex[0]}
        {...alignItems.center}
        onClick={() => changeView(nextView)}
      >
        {gistCurrentView === 'settings'
          ? (
            <IconAction
              key='back'
              Icon={Back}
              tip='Back to gists'
            />
          )
          : (
            <IconAction
              key='settings'
              Icon={Settings}
              tip='Settings'
            />
          )
        }
      </div>
    </div>
  )
}
