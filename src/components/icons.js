import React from 'react'
import {style} from 'glamor'
import {tundora} from '../styles/colors'

const displayBlock = style({
  display: 'block'
})

const Svg = ({
  color = tundora,
  size = 18,
  onClick,
  children,
  className
}) => (
  <svg
    className={className}
    onClick={onClick}
    {...displayBlock}
    fill={color}
    height={size}
    width={size}
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    {children}
  </svg>
)

export const Back = (props) => (
  <Svg {...props} >
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' />
  </Svg>
)

export const Browser = (props) => (
  <Svg {...props}>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d=' M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 6l-4 4h3v6h2v-6h3l-4-4z' />
  </Svg>
)

export const Copy = (props) => (
  <Svg {...props} >
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z' />
  </Svg>
)

export const Download = (props) => (
  <Svg {...props} >
    <path d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z' />
    <path d='M0 0h24v24H0z' fill='none' />
  </Svg>
)

export const Edit = (props) => (
  <Svg {...props}>
    <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
    <path d='M0 0h24v24H0z' fill='none' />
  </Svg>
)

export const Settings = (props) => (
  <Svg {...props} >
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' />
  </Svg>
)

export const Sync = (props) => (
  <Svg {...props} >
    <path d='M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z' />
    <path d='M0 0h24v24H0z' fill='none' />
  </Svg>
)
