
import React from 'react'
import {decorateGistObj, sortByKeyPresence} from '../helpers'
import GistItem from './gist-item'

export default ({
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
          key={`gist-${gist.id}`}
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
