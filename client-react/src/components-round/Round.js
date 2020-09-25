import React from 'react'
import io from 'socket.io-client'
import Canvas from './Canvas'
import Chat from './Chat'
import Timer from './Timer'
// const socket = io()

export default class Round extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      socket: io(),
      win: false,
      winner: '',
      word: '',
      playing: false
    }
  }
  
  componentDidMount (socket = this.state.socket) {
    socket.emit('round ready')
    socket.on('round start', () => this.setState({ playing: true }))
    socket.on('win', (user, word) => {
      console.log(user, word)
      this.setState({ win: true, winner: user, word })
    })
  }


  handleRoundEnd = () => {
    console.log('round end')
  }

  render () {
    return (
      <div id='round'>
        {this.state.playing
          ? <div>
            {this.state.win
              ? <div>Congrats, {this.state.winner} guessed {this.state.word} correctly!</div>
              : this.props.drawing
              ? <div>Your word is "{this.props.word}"</div>
              : null
            }
        <Timer socket={this.state.socket} />
        <div id='chat-and-canvas'>
          <Canvas
           drawing={this.props.drawing}
           socket={this.state.socket}
           />
          <Chat
            word={this.props.word}
            onRoundEnd={this.handleRoundEnd}
            socket={this.state.socket}
            drawing={this.props.drawing}
            />
        </div>
        </div>
        : <div>Waiting for game to start...</div>
          }
      </div>
    )
  }
}
