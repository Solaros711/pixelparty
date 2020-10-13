import React from 'react'

export default function Timer (props) {
  return (
    <div>
      <span id='timer'>00:{props.timer.toString().padStart(2, '0')}</span>
    </div>
  )
}
