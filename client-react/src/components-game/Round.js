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
    }
  }
  
  handleSubmitMessage = message => {
    this.props.onSubmitMessage(message)
  }

  render () {
    const gameData = this.props.gameData
    const roundData = this.props.roundData
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
