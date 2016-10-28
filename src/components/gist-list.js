
import React from 'react'
import {style} from 'glamor'
import {getGistFileName} from '../helpers'
import {listSpacing} from '../styles/list'
import {subtitle} from '../styles/fonts'
import {
  colorGrey,
  lima,
  mercury
} from '../styles/colors'
import {flex, displayFlex} from '../styles/flex'

const activeCircle = style({backgroundColor: lima})
const inactiveCircle = style({backgroundColor: mercury})

export const CircleStatus = ({isActive = false, size = '12px'}) => {
  const circle = style({
    borderRadius: '50%',
    width: size,
    height: size
  })
  return (
    <div
      {...circle}
      {...(isActive ? activeCircle : inactiveCircle)}
    />
  )
}

export const GistItem = ({localFiles, fileName}) => {
  const isActive = localFiles.indexOf(fileName) !== -1
  return (
    <div {...listSpacing} {...displayFlex}>
      <div {...subtitle} {...colorGrey} {...flex[1]}>{fileName}</div>
      <div {...flex[0]}>
        <CircleStatus isActive={isActive} />
      </div>
    </div>
  )
}

export const GistList = ({
  user,
  gists,
  localFiles
}) => (
  <div>
    {gists
      .map(gist => getGistFileName(gist))
      .filter(x => x)
      .map(fileName => (<GistItem fileName={fileName} localFiles={localFiles} />))
    }
  </div>
)
