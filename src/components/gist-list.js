
import React from 'react'
import {getGistFileName} from '../helpers'
import {listSpacing} from '../styles/list'
import {title, subtitle} from '../styles/fonts'
import {colorGrey, colorTundora} from '../styles/colors'

export const GistItem = (gist) => (
  <div {...listSpacing}>
    <p {...subtitle} {...colorGrey}>{getGistFileName(gist)}</p>
  </div>
)

export const GistList = ({
  user,
  gists
}) => (
  <div>
    <div {...listSpacing}>
      <h3 {...title} {...colorTundora}>{user.login}{'\'s'} gist</h3>
    </div>
    {gists.map(gist => (<GistItem {...gist} />))}
  </div>
)
