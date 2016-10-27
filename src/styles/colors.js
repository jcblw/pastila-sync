
import {getStyle} from './utils'

export const white = '#ffffff'
export const concrete = '#F2F2F2'
export const mercury = '#e5e5e5'
export const grey = '#7F7F7F'
export const tundora = '#4E4E4E'
export const lima = '#7ED321'
export const monza = '#D0021B'

const getColor = getStyle('color')

export const colorWhite = getColor(white)
export const colorGrey = getColor(grey)
export const colorTundora = getColor(tundora)
