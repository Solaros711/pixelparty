import React from 'react'
import * as Tone from 'tone'
import io from 'socket.io-client'

// const socket = io('/timer')

export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timer: 60,
      disabled: false,
      // socket: io('/timer')
    }
  }

  playTone () {
    Tone.start()
    // console.log('audio is ready')
    const synth = new Tone.Synth().toDestination()
    return synth.triggerAttackRelease('C4', '8n')
  }

  componentDidMount () {
    this.props.timerSocket.emit('round join', this.props.gameID)
    if (this.props.isHost) {
      this.props.timerSocket.emit('round start', this.props.gameID)
    }
    this.props.timerSocket.on('time\'s up', gameID => {
      console.log('time\'s up')
      this.props.onTimesUp(gameID)
    })
    this.props.timerSocket.on('timer', timer => {
      this.setState({ timer }, () => {if (timer <= 5){this.playTone()}})
    })
  }

  handleTimesUp = () => this.props.onTimesUp(this.props.gameID)

  render () {
    return (
      <div>
        <span id='timer'>00:{this.state.timer.toString().padStart(2, '0')}</span>
        <div>
          <button onClick={this.handleTimesUp} style={{backgroundColor:"firebrick"}}>Test: End Round</button>
        </div>
      </div>
    )
  }
}
