import React from 'react'
import {style} from 'glamor'
import {Form} from './form'
import {GistList} from './gist-list'
import BottomBar from './bottom-bar'
import TopBar from './top-bar'
import {flex, displayFlex, column, flexGrow, flexShrink} from '../styles/flex'
import {barSpacing} from '../styles/list'
import {white, tundora} from '../styles/colors'

const fullHeight = style({maxHeight: '100vh', height: '100vh'})
const whiteBG = style({backgroundColor: white})
const boxShadow = style({boxShadow: `0px 0px 3px ${tundora}`})
const overflowAuto = style({overflow: 'auto'})

// <Form {...props} /> // the config form
export const App = (props) => (
  <div {...displayFlex} {...column} {...fullHeight}>
    <div {...flex[0]} {...barSpacing} {...whiteBG} {...boxShadow}>
      <TopBar {...props} />
    </div>
    <div {...flex[1]} {...flexGrow[1]} {...flexShrink[1]} {...overflowAuto}>
      {props.gistCurrentView === 'settings'
        ? <Form {...props} />
        : <GistList {...props} />
      }
    </div>
    <div {...flex[0]} {...barSpacing} {...whiteBG} {...boxShadow}>
      <BottomBar {...props} />
    </div>
  </div>
)
