import React from 'react'
import io from 'socket.io-client'
import Canvas from './Canvas'
import Chat from './Chat'
import Timer from './Timer'
const socket = io()

export default class Round extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      word: ''
    }
  }
  
  // componentDidMount () {
  // }

  handleRoundEnd = () => {
    console.log('round end')
  }

  render () {
    return (
      <div id='round'>
        <Timer socket={socket} />
        <div id='chat-and-canvas'>
          <Canvas drawing={this.props.drawing} socket={socket} />
          <Chat word={this.props.word} onRoundEnd={this.handleRoundEnd} socket={socket} />
        </div>
      </div>
    )
  }
}
