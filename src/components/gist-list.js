
import React from 'react'
import {merge} from 'glamor'
import {decorateGistObj, sortByKeyPresence} from '../helpers'
import {marginRightMedium} from '../styles/spacing'
import {listSpacing} from '../styles/list'
import {subtitle, body} from '../styles/fonts'
import {Download, Edit, Copy, Browser} from './icons'
import {
  colorGrey,
  lima,
  grey
} from '../styles/colors'
import {
  flex,
  displayFlex,
  alignItems
} from '../styles/flex'

export const GistItem = (gist) => {
  const {
    fileName,
    downloadGist,
    isDownloading,
    isActive,
    openFile,
    copyLink,
    openInBrowser
  } = gist
  const downloadText = merge(
    flex[0],
    body,
    colorGrey
  )
  return (
    <div {...listSpacing} {...displayFlex}>
      <div {...subtitle} {...colorGrey} {...flex[1]} {...alignItems.center}>{fileName}</div>
      <div {...flex[0]} {...displayFlex} {...alignItems.center}>
        <div {...downloadText}>
          {isActive
            ? (
              <div {...displayFlex}>
                <Browser color={grey} onClick={() => openInBrowser(gist)} className={marginRightMedium} />
                <Copy color={grey} onClick={() => copyLink(gist)} className={marginRightMedium} />
                <Edit color={grey} onClick={() => openFile(gist)} />
              </div>
            )
            : isDownloading
              ? <Download color={lima} />
              : <Download color={grey} onClick={() => downloadGist(gist)} />
          }
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
  isDownloading,
  copyLink,
  openInBrowser
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
          copyLink={copyLink}
          openInBrowser={openInBrowser}
        />
      ))
    }
  </div>
)
