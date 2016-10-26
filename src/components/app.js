import React from 'react'
import {Form} from './form'

export const App = (props) => (
  <div className='app-container'>
    <div>
      <Form {...props} />
    </div>
  </div>
)
