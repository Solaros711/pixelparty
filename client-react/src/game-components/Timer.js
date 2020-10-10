import React from 'react'
import * as Tone from 'tone'

export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    // console.log(props)
    this.state = {
      timer: 30,
      disabled: false,
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
      if (this.props.postRound) this.props.timerSocket.emit('post round start', this.props.gameID)
      else if (this.props.inRound) this.props.timerSocket.emit('round start', this.props.gameID)
    }

    this.props.timerSocket.on('time\'s up round', gameID => {
      // console.log('time\'s up')
      this.props.onTimesUpRound(gameID)
    })

    this.props.timerSocket.on('time\'s up post round', gameID => {
      this.props.onTimesUpPostRound(gameID)
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
        {/* <div>
          <button onClick={this.handleTimesUp} style={{backgroundColor:"firebrick"}}>Test: End Round</button>
        </div> */}
      </div>
    )
  }
}
