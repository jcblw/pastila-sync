
import {style, merge} from 'glamor'

export const fontFamily = 'helvetica, sans-serif'
export const smallestSize = '10px'
export const smallSize = '12px'
export const mediumSize = '14px'
export const largeSize = '20px'

const getStyle = prop => val => style({[prop]: val})
const getWeightStyle = w => getStyle('fontWeight')
const getSizeStyle = s => getStyle('fontSize')

export const weightLight = getWeightStyle('light')
export const weightLightOblique = getWeightStyle('light oblique')
export const weightRegular = getWeightStyle('regular')
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
