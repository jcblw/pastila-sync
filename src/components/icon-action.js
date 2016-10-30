
import React from 'react'
import {grey} from '../styles/colors'
import Tooltip from './tooltip'
import {flex} from '../styles/flex'

export default ({
  args = [],
  Icon,
  tip,
  action = x => x,
  size,
  color,
  className
}) => (
  <Tooltip text={tip} {...flex[0]}>
    <Icon
      color={color || grey}
      size={size}
      onClick={() => action(...args)}
      className={className}
    />
  </Tooltip>
)
