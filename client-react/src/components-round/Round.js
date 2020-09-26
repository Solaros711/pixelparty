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
      lose: false,
      roundEnd: false,
      winner: '',
      word: '',
      playing: false,
      roundId: 1,
      messages: [],
      pixels: [],
      timer: 0,
    }
  }
  
  componentDidMount (socket = this.state.socket) {
    socket.emit('join', this.state.roundId, this.props.role)
    socket.on('start', (role, word) => {
      console.log(word)
      this.setState({ role, playing: true, word })
    })
    socket.on('messages', messages => this.setState({ messages }))
    socket.on('win', (user, word) => {
      this.setState({ win: true, winner: user, word, roundEnd: true })
    })
    socket.on('timer', timer => this.setState({ timer }))
    socket.on('lose', () => this.setState({ timer: 0, lose: true, roundEnd: true }))
  }

  handleSubmitMessage = message => {
    this.state.socket.emit('message', message)
  }

  handleRoundEnd = () => {
    console.log('round end')
  }

  render () {
    return (
      <div id='round'>
        {this.state.playing
          ? <div>
            {this.state.roundEnd
              ? this.state.win
                ? <div>Congrats, {this.state.winner} guessed {this.state.word} correctly!</div>
                : <div>Oof, the word was "{this.state.word}"</div>
              : this.props.drawing
                ? <div>Your word is "{this.state.word}"</div>
                : null
            }
        <Timer timer={this.state.timer} />
        <div id='chat-and-canvas'>
          <Canvas
           drawing={this.props.drawing}
           socket={this.state.socket}
           />
          <Chat
            word={this.props.word}
            onRoundEnd={this.handleRoundEnd}
            drawing={this.props.drawing}
            messages={this.state.messages}
            onSubmit={this.handleSubmitMessage}
          />
        </div>
        </div>
        : <div>Waiting for game to start...</div>
          }
      </div>
    )
  }
}
