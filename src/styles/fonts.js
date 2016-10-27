
import {merge} from 'glamor'
import {getStyle} from './utils'

export const fontFamily = 'helvetica, sans-serif'
export const smallestSize = '10px'
export const smallSize = '14px'
export const mediumSize = '16px'
export const largeSize = '20px'

const getWeightStyle = getStyle('fontWeight')
const getSizeStyle = getStyle('fontSize')

export const weightLight = getWeightStyle('lighter')
export const weightLightOblique = merge(
  getWeightStyle('lighter'),
  {fontStyle: 'oblique'}
)
export const weightRegular = getWeightStyle('normal')
export const weightBold = getWeightStyle('bold')

export const fontSizeSmallest = getSizeStyle(smallestSize)
export const fontSizeSmall = getSizeStyle(smallSize)
export const fontSizeMedium = getSizeStyle(mediumSize)
export const fontSizeLarge = getSizeStyle(largeSize)

// groupings

export const title = merge(
  weightLight,
  fontSizeMedium
)

export const subtitle = merge(
  weightLight,
  fontSizeSmall
)

export const body = merge(
  weightLightOblique,
  fontSizeSmallest
)

export const bodyBold = merge(
  weightBold,
  fontSizeSmallest
)
