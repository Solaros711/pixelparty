import React from 'react'
import Canvas from './Canvas'
import Timer from './Timer'

export default class Round extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      consoleLogs: false,
      pixels: ''
    }
  }

  // setPixels = pixels => this.setState({ pixels})

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
                  ? <div>Your word is: <span id="emphatic-text" style={{fontSize: "25px", textTransform:"uppercase", margin: "0px"}}>{roundState.word}</span></div>
                  : <div><span id="emphatic-text" style={{fontSize: "20px", margin: "0px"}}>{roundState.artist}</span> is drawing...</div>
              }
            </div>
            
            <div className="round-container-1-2-2">
              <Timer timer={this.props.timer} />
            </div>

          </div>

          <div className="round-container-1-1">
            <Canvas
            isArtist={isArtist}
            gameID={gameState._id}
            canvasSocket={this.props.canvasSocket}
            username={this.props.username}
            word={roundState.word}
            />
          </div>
        
      </div>
    )
  }
}

//old orange color:"rgb(179, 67, 2)"
