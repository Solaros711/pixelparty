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

  handleTimesUp = gameID => {
    this.props.gameSocket.emit('time\'s up', gameID)
  }

  render () {
    const gameState = this.props.gameState
    if (this.state.consoleLogs) console.log(gameState)
    const roundState = gameState.rounds[gameState.currentRound]
    const isArtist = gameState.gameOver
      ? false
      : roundState.artist === this.props.username
    return (
      <div className="round-container-1" id='round'>

          <div className="round-container-1-2" id='round-info'>

            <div className="round-container-1-2-1">
              {roundState.roundOver
                ? roundState.winner
                  ? <div>Congrats, {roundState.winner} guessed {roundState.word} correctly!</div>
                  : <div>Oof, the word was "{roundState.word}"</div>
                : isArtist
                  ? <div>Your word is: <span style={{fontSize: "25px", color:"rgb(179, 67, 2)", textTransform:"uppercase", textShadow:"2px 2px black"}}>{roundState.word}</span></div>
                  : <div><span style={{fontSize: "20px", color:"rgb(179, 67, 2)", textShadow:"2px 2px black" }}>{roundState.artist}</span> is drawing...</div>
              }
            </div>
            
            <div className="round-container-1-2-2">
              <Timer
                timer={this.props.timer}
                isHost={this.props.isHost}
                onTimesUp={this.handleTimesUp}
                gameID={gameState._id}
                timerSocket={this.props.timerSocket}
              />
            </div>

          </div>

          <div className="round-container-1-1">
            <Canvas
            isArtist={isArtist}
            gameID={gameState._id}
            canvasSocket={this.props.canvasSocket}
            />
          </div>
        
      </div>
    )
  }
}
