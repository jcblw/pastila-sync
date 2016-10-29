
import React from 'react'
import {style, merge} from 'glamor'
import {decorateGistObj, sortByKeyPresence} from '../helpers'
import {marginRightSmall} from '../styles/spacing'
import {listSpacing} from '../styles/list'
import {subtitle, body} from '../styles/fonts'
import {
  colorGrey,
  lima,
  mercury
} from '../styles/colors'
import {
  flex,
  displayFlex,
  alignItems
} from '../styles/flex'

const activeCircle = style({backgroundColor: lima})
const inactiveCircle = style({backgroundColor: mercury})

export const CircleStatus = ({
  isActive = false,
  size = '12px',
  className = ''
}) => {
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

export const GistItem = (gist) => {
  const {
    fileName,
    downloadGist,
    isDownloading,
    isActive,
    openFile
  } = gist
  const downloadText = merge(
    flex[0],
    body,
    colorGrey,
    marginRightSmall
  )
  return (
    <div {...listSpacing} {...displayFlex}>
      <div {...subtitle} {...colorGrey} {...flex[1]}>{fileName}</div>
      <div {...flex[0]} {...displayFlex} {...alignItems.center}>
        <div {...downloadText}>
          {isActive
            ? <span onClick={() => openFile(gist)}>open</span>
            : isDownloading
              ? 'downloading...'
              : <span onClick={() => downloadGist(gist)}>download</span>
          }
        </div>
        <div {...flex[0]}>
          <CircleStatus isActive={isActive} />
        </div>
      </div>
    </div>
  )
}

export const GistList = ({
  user,
  gists,
  localFiles,
  downloadGist,
  openFile,
  isDownloading
}) => (
  <div>
    {gists
      .map(decorateGistObj({localFiles, isDownloading}))
      .filter(gist => gist.fileName)
      .sort(sortByKeyPresence('isActive'))
      .map(gist => (
        <GistItem
          {...gist}
          downloadGist={downloadGist}
          openFile={openFile}
        />
      ))
    }
  </div>
)
