
import {merge, style} from 'glamor'
import {
  paddingBottomMedium,
  paddingTopMedium,
  paddingLeftMedium,
  paddingRightMedium,
  marginTopMedium,
  marginLeftMedium,
  marginRightMedium
} from './spacing'
import {mercury} from './colors'

export const listSpacing = merge(
  marginTopMedium,
  paddingBottomMedium,
  marginLeftMedium,
  marginRightMedium,
  style({borderBottom: `1px solid ${mercury}`})
)

export const barSpacing = merge(
  paddingBottomMedium,
  paddingTopMedium,
  paddingLeftMedium,
  paddingRightMedium
)
