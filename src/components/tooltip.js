import React, {Component} from 'react'
import {style, merge} from 'glamor'
import {tundora, colorWhite} from '../styles/colors'
import {body} from '../styles/fonts'
import {
  paddingLeftSmall,
  paddingRightSmall,
  paddingBottomSmall,
  paddingTopSmall,
  marginTopSmall
} from '../styles/spacing'

const position = {
  absolute: style({position: 'absolute'}),
  relative: style({position: 'relative'})
}

export default class Tooltip extends Component {
  constructor (...args) {
    super(...args)
    this.state = {}
  }
  delayFn (fn, ms) {
    return () => {
      clearTimeout(this._timer)
      this._timer = setTimeout(fn, ms)
    }
  }
  setEventState (key, val) {
    return () => this.setState({[key]: val})
  }
  render () {
    const {children, text} = this.props
    const {isHovered} = this.state
    const tooltipStyles = merge(
      position.absolute,
      body,
      colorWhite,
      paddingLeftSmall,
      paddingRightSmall,
      paddingBottomSmall,
      paddingTopSmall,
      marginTopSmall,
      style({
        right: 0,
        backgroundColor: tundora,
        borderRadius: '4px',
        wordWrap: 'none',
        whiteSpace: 'nowrap'
      })
    )
    return (
      <div
        {...position.relative}
        onMouseOver={this.delayFn(
          this.setEventState('isHovered', true),
          500
        )}
        onMouseLeave={this.delayFn(
          this.setEventState('isHovered', false),
          0
        )}
      >
        {children}
        {isHovered
          ? <div {...tooltipStyles}>{text}</div>
          : null
        }
      </div>
    )
  }
}
