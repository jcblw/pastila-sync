import React from 'react'
import {style, merge} from 'glamor'
import {barSpacing} from '../styles/list'
import {
  title,
  subtitle,
  body,
  bodyBold
} from '../styles/fonts'
import {
  mercury,
  colorTundora,
  colorGrey,
  lima,
  colorWhite
} from '../styles/colors'
import {
  marginBottomMedium,
  paddingBottomMedium,
  paddingTopMedium,
  paddingLeftMedium,
  paddingRightMedium
} from '../styles/spacing'

const fullWidth = style({width: '100%'})
const inlineBlock = style({display: 'inline-block'})
const inputStyles = merge(
  paddingBottomMedium,
  paddingTopMedium,
  paddingLeftMedium,
  paddingRightMedium,
  marginBottomMedium,
  subtitle,
  colorTundora,
  style({
    display: 'block',
    borderRadius: '4px',
    border: `1px solid ${mercury}`
  })
)
const buttonStyles = merge(
  paddingBottomMedium,
  paddingTopMedium,
  paddingLeftMedium,
  paddingRightMedium,
  marginBottomMedium,
  subtitle,
  colorWhite,
  style({
    backgroundColor: lima,
    display: 'inline-block',
    borderRadius: '4px',
    border: 'none'
  })
)

const serializeSubmit = handler => e => {
  e.preventDefault()
  const el = e.target
  const inputs = Array.from(el.getElementsByTagName('input'))
  handler(e, inputs.reduce((accum, input) => {
    accum[input.id] = input.type === 'checkbox'
      ? input.checked
      : input.value
    return accum
  }, {}))
}

export const Form = ({
  onSubmit,
  gistKey,
  gistSyncing,
  gistDirectory
}) => (
  <form onSubmit={serializeSubmit(onSubmit)} {...barSpacing}>
    <div {...fullWidth}>
      <label
        {...title}
        {...inlineBlock}
        {...marginBottomMedium}
        {...colorTundora}
        htmlFor='gist-key'
      >
        Personal Access Key
      </label>
      <input
        {...inputStyles}
        {...colorTundora}
        id='gist-key'
        defaultValue={gistKey}
      />
    </div>
    <div {...fullWidth}>
      <label
        {...title}
        {...inlineBlock}
        {...marginBottomMedium}
        {...colorTundora}
        htmlFor='gist-directory'
      >
        Directory to sync
      </label>
      <p
        {...body}
        {...marginBottomMedium}
        {...colorGrey}
      >
        Example: <code {...bodyBold}>/Users/foo/gists</code>
      </p>
      <input
        {...inputStyles}
        id='gist-directory'
        defaultValue={gistDirectory}
      />
    </div>
    <button {...buttonStyles}>Update</button>
  </form>
)
