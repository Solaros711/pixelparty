import React from 'react'

export default function Timer2 (props) {
  return (
    <span id='timer'>00:{props.timer.toString().padStart(2, '0')}</span>
  )
}