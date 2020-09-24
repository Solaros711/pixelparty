import React from 'react'
import io from 'socket.io-client'
import Canvas from './Canvas'
import Chat from './Chat'
const socket = io()

export default class Round extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timer: '',
      word: ''
    }
  }

  handleRoundEnd = () => {
    console.log('round end')
  }

  render () {
    return (
      <div id='round'>
        <Timer />
        <div id='chat-and-canvas'>
          <Canvas drawing={this.props.drawing} />
          <Chat word={this.props.word} onRoundEnd={this.handleRoundEnd} />
        </div>
      </div>
    )
  }
}
