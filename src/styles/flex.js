
import {style} from 'glamor'

export const displayFlex = style({display: 'flex'})
export const column = style({flexDirection: 'column'})
export const row = style({flexDirection: 'row'})

export const flex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  .map(num => style({flex: num}))
