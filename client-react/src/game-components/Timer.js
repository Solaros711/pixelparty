import React from 'react'
import io from 'socket.io-client'

// const socket = io('/timer')

export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timer: 30,
      disabled: false,
      // socket: io('/timer')
    }
  }

  componentDidMount () {
    this.props.timerSocket.emit('round join', this.props.gameID)
    if (this.props.isHost) {
      this.props.timerSocket.emit('round start', this.props.gameID)
      this.props.timerSocket.on('time\'s up', gameID => {
        console.log(gameID)
        this.props.onTimesUp(gameID)
      })
    }
    this.props.timerSocket.on('timer', timer => {
      this.setState({ timer })
    })
  }

  componentWillUnmount () {
    this.props.timerSocket.close()
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
