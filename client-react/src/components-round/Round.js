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
    // I need to get this working with app.js
    if (this.props.drawing) {
      console.log(this.props.word)
      socket.emit('round ready')
      socket.on('round start', () => this.setState({ playing: true }))
      socket.on('win', (message, word) => {
        console.log(message, word)
        this.setState({ win: true, winner: message.user, word })
      })

    // I need to get this working with app.js
    } else {
      // socket.emit('round')
      socket.on('round start', () => this.setState({ playing: true }))
      socket.on('win', (message, word) => {
        console.log(message, word)
        this.setState({ win: true, winner: message.user, word })
      })
    }
  }


  handleRoundEnd = () => {
    console.log('round end')
  }

  render () {
    return (
      <div id='round'>
        {this.state.winner
          ? <div>Congrats, {this.state.winner.message.user} guessed {this.state.word} correctly!</div>
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
    )
  }
}
