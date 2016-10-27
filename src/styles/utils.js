
import {style} from 'glamor'

export const getStyle = prop => val => style({[prop]: val})

const clear = {
  content: '""',
  display: 'block',
  float: 'none'
}
export const clearfix = style({
  '::before': clear,
  '::after': clear
})
