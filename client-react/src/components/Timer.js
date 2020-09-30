import React from 'react'
import io from 'socket.io-client'

const socket = io('/timer')

export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timer: 30,
      disabled: false
    }
  }

  componentDidMount () {
    socket.emit('round join', this.props.gameID)
    if (this.props.isHost) {
      socket.emit('round start', this.props.gameID)
      socket.on('time\'s up', gameID => {
        console.log(gameID)
        this.props.onTimesUp(gameID)
      })
    }
    socket.on('timer', timer => {
      this.setState({ timer })
    })
  }

  render () {
    return <div id='timer'>00:{this.state.timer.toString().padStart(2, '0')}</div>
  }
}
