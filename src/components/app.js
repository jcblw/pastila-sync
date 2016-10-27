import React from 'react'
import {style} from 'glamor'
import {Form} from './form'
import {GistList} from './gist-list'
import BottomBar from './bottom-bar'
import {flex, displayFlex, column} from '../styles/flex'
import {barSpacing} from '../styles/list'
import {white, tundora} from '../styles/colors'

const fullHeight = style({maxHeight: '100vh'})
const overflowScroll = style({overflow: 'scroll'})
const whiteBG = style({backgroundColor: white})
const boxShadow = style({boxShadow: `0px 0px 3px ${tundora}`})

export const App = (props) => (
  <div {...displayFlex} {...column} {...fullHeight}>
    <div {...flex[1]} {...overflowScroll}>
      <GistList {...props} />
      <Form {...props} />
    </div>
    <div {...flex[0]} {...barSpacing} {...whiteBG} {...boxShadow}>
      <BottomBar {...props} />
    </div>
  </div>
)
