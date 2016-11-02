import React from 'react'
import {listSpacing} from '../styles/list'
import {subtitle} from '../styles/fonts'
import {Download, Edit, Copy, Browser} from './icons'
import IconAction from './icon-action'
import {marginRightMedium} from '../styles/spacing'
import {
  colorGrey,
  lima
} from '../styles/colors'
import {
  flex,
  displayFlex,
  alignItems
} from '../styles/flex'

export default (gist) => {
  const {
    fileName,
    downloadGist,
    isDownloading,
    isActive,
    openFile,
    copyLink,
    openInBrowser
  } = gist

  return (
    <div {...listSpacing} {...displayFlex}>
      <div {...subtitle} {...colorGrey} {...flex[1]} {...alignItems.center}>{fileName}</div>
      <div {...flex[0]} {...displayFlex} {...alignItems.center}>
        <div {...flex[0]}>
          {isActive
            ? (
              <div {...displayFlex}>
                <IconAction
                  args={[gist]}
                  tip='Open in browser'
                  Icon={Browser}
                  action={openInBrowser}
                  size={20}
                  className={marginRightMedium}
                />
                <IconAction
                  args={[gist]}
                  tip='Copy link'
                  Icon={Copy}
                  action={copyLink}
                  className={marginRightMedium}
                />
                <IconAction
                  args={[gist]}
                  tip='Edit gist'
                  Icon={Edit}
                  action={openFile}
                />
              </div>
            )
            : isDownloading
              ? <Download color={lima} />
              : (
                <IconAction
                  args={[gist]}
                  tip='Download'
                  Icon={Download}
                  action={downloadGist}
                />
              )
          }
        </div>
      </div>
    </div>
  )
}
