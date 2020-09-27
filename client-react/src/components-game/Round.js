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
      // socket: io('/round'),
      // win: false,
      // lose: false,
      // roundEnd: false,
      // winner: '',
      // word: '',
      // playing: false,
      // roundId: 0, // Math.random(), //different for testing purposes
      // messages: [],
      // pixels: [],
      // timer: 0
    }
  }
  
  // componentDidMount (socket = this.state.socket) {
    
  //   socket.emit('join', this.state.roundId, this.props.user, this.props.isHost)
  //   socket.on('start', (word, artist) => {
  //     console.log(word)
  //     console.log(artist, this.props.user)
      
  //     this.setState({
  //       artist,
  //       playing: true,
  //       word,
  //       drawing: (artist === this.props.user) ? true : false
  //     }, () => console.log(this.state))
  //   })
  //   socket.on('messages', messages => this.setState({ messages }))
  //   socket.on('win', (user, word) => {
  //     this.setState({ win: true, winner: user, word, roundEnd: true })
  //   })
  //   socket.on('timer', timer => this.setState({ timer }))
  //   socket.on('lose', () => this.setState({ timer: 0, lose: true, roundEnd: true }))
  // }

  handleSubmitMessage = message => {
    this.props.onSubmitMessage(message)
    // this.state.socket.emit('message', message)
  }

  // handleRoundEnd = () => {
  //   console.log('round end')
  // }

  render () {
    return (
      <div id='round'>
        <div>Player: {this.props.username}</div>
        {this.props.playing
          ? <div>
            {this.props.roundEnd
              ? this.props.win
                ? <div>Congrats, {this.props.winner} guessed {this.props.word} correctly!</div>
                : <div>Oof, the word was "{this.props.word}"</div>
              : this.props.drawing
                ? <div>Your word is "{this.props.word}"</div>
                : <div>{this.props.artist} is drawing...</div>
            }
        <Timer timer={this.props.timer} />
        <div id='chat-and-canvas'>
          <Canvas
           drawing={this.props.drawing}
           socket={this.props.socket}
           />
          <Chat
            // word={this.props.word}
            onRoundEnd={this.handleRoundEnd}
            drawing={this.props.drawing}
            messages={this.props.messages}
            onSubmit={this.handleSubmitMessage}
            username={this.props.username}
          />
        </div>
        </div>
        : <div>Waiting for game to start...</div>
          }
      </div>
    )
  }
}
