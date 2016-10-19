import React from 'react'
import {Form} from './form'
import cards from '../../styles/cards.css'

export const App = (props) => (
  <div className='app-container'>
    <h1>Pastila Sync</h1>
    <div className={cards.card}>
      <h3 className={cards.cardHeader}>Required Info</h3>
      <p>This is info needed from your account to for Pastila Sync to be able to function properly</p>
      <Form {...props} />
    </div>
  </div>
)
