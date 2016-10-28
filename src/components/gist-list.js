
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

export const GistItem = ({
  localFiles,
  fileName,
  gist,
  downloadGist
}) => {
  const isActive = localFiles.indexOf(fileName) !== -1
  return (
    <div {...listSpacing} {...displayFlex}>
      <div {...subtitle} {...colorGrey} {...flex[1]}>{fileName}</div>
      <div {...flex[0]}>
        {isActive
          ? null
          : <button onClick={() => downloadGist(gist)}>download</button>
        }
        <CircleStatus isActive={isActive} />
      </div>
    </div>
  )
}

export const GistList = ({
  user,
  gists,
  localFiles,
  downloadGist
}) => (
  <div>
    {gists
      .map(gist => ({gist, fileName: getGistFileName(gist)}))
      .filter(g => g.fileName)
      .map(g => (
        <GistItem
          {...g}
          downloadGist={downloadGist}
          localFiles={localFiles}
        />
      ))
    }
  </div>
)
