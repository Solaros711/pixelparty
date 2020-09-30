import React from 'react'
import Canvas from './Canvas'
import Timer from './Timer'

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
    const gameState = this.props.gameState
    if (this.state.consoleLogs) console.log(gameState)
    const roundState = gameState.rounds[gameState.currentRound]
    const isArtist = gameState.gameOver
      ? false
      : roundState.artist === this.props.username
    return (
      <div id='round'>
          <div id='round-info'>
            <Timer
              timer={this.props.timer}
              isHost={this.props.isHost}
              onTimesUp={this.props.onTimesUp}
              gameID={gameState._id}
            />
            {roundState.roundOver
              ? roundState.winner
                ? <div>Congrats, {roundState.winner} guessed {roundState.word} correctly!</div>
                : <div>Oof, the word was "{roundState.word}"</div>
              : isArtist
                ? <div>Your word is "{roundState.word}"</div>
                : <div>{roundState.artist} is drawing...</div>
            }
          <Canvas
          //  drawing={this.props.drawing}
           socket={this.props.socket}
           isArtist={isArtist}
           gameID={gameState._id}
           />
        </div>
      </div>
    )
  }
}
