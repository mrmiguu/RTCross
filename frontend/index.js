import 'babel-polyfill'
import React from 'react'

import {
  render,
} from 'react-dom'

import './index.scss'
import Root from './Root'

render(<Root />, document.getElementById('root'))
