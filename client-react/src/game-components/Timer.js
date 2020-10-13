import React from 'react'
// import * as Tone from 'tone'

export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timer: 30,
      disabled: false
      // socket: io('/timer')
    }
  }

  // playTone () {
  //   Tone.start()
  //   // console.log('audio is ready')
  //   const synth = new Tone.Synth().toDestination()
  //   return synth.triggerAttackRelease('C4', '8n')
  // }

  render () {
    // if (this.props.timer <= 5) this.playTone()
    return (
      <div>
        <span id='timer'>00:{this.props.timer.toString().padStart(2, '0')}</span>
        {/* <div>
          <button onClick={this.handleTimesUp} style={{ backgroundColor: 'firebrick' }}>Test: End Round</button>
        </div> */}
      </div>
    )
  }
}
