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
      consoleLogs: false
    }
  }
  
  handleSubmitMessage = message => {
    this.props.onSubmitMessage(message)
  }

  render () {
    const gameData = this.props.gameData
    if (this.state.consoleLogs) console.log(gameData)
    const roundData = gameData.rounds[gameData.currentRound]
    const isArtist = gameData.gameOver
      ? false
      : roundData.artist === this.props.username
    return (
      <div id='round'>
          <div id='round-info'>
            <Timer
              timer={this.props.timer}
              isHost={this.props.isHost}
              onTimesUp={this.props.onTimesUp}
              gameID={gameData._id}
            />
            {roundData.roundOver
              ? roundData.winner
                ? <div>Congrats, {roundData.winner} guessed {roundData.word} correctly!</div>
                : <div>Oof, the word was "{roundData.word}"</div>
              : isArtist
                ? <div>Your word is "{roundData.word}"</div>
                : <div>{roundData.artist} is drawing...</div>
            }
          <Canvas
           drawing={this.props.drawing}
           socket={this.props.socket}
           isArtist={isArtist}
           gameID={gameData._id}
           />
        </div>
      </div>
    )
  }
}
