import React from 'react'
import Round from './Round'
import Chat from './Chat'
import Canvas from './Canvas'
import PostRound from './PostRound'
import GameOver from './GameOver'

export default class Game extends React.Component {
  constructor (props) {
    super(props)
    console.log('game', props)
    this.state = {
      consoleLogs: false,
      gameStart: false,
      debug: false,
      gameState: '',
      score: '',
      betweenRounds: false,
      gameState: {},
      timer: 0
    }
  }

  componentDidMount () {
    if (this.state.consoleLogs) console.log(this.props.username, this.props.gameID)
    this.props.gameSocket.emit('join game', {
      username: this.props.username,
      gameID: this.props.gameID,
    })

    this.props.gameSocket.on('game state', gameState => {
      const betweenRounds = gameState.rounds.length ? gameState.rounds[gameState.currentRound].roundOver || false : false
      const score = gameState.points.
        reduce((pointsObject, name) => {
          if (name in pointsObject) pointsObject[name]++
          else pointsObject[name] = 1
          return pointsObject
        }, {})
      this.setState({
        gameState,
        gameStateStr: JSON.stringify(gameState),
        betweenRounds,
        score,
        isHost: this.props.username === gameState.host
      })
    })

    this.props.gameSocket.on('timer', timer => this.setState({ timer }))
    
  }

  handleTimesUp = gameID => {
    this.props.gameSocket.emit('time\'s up', gameID)
  }

  handleNextRound = () => {
    this.props.gameSocket.emit('next round', this.props.gameID)
  }

  render () {
    console.log(this.state)
    let isArtist = false
    if (this.state.gameStart) {
      const gameState = this.props.gameState
      if (this.state.consoleLogs) console.log(gameState)
      const roundState = gameState.rounds[gameState.currentRound]
      isArtist = gameState.gameOver
        ? false
        : roundState.artist === this.props.username
    }
    return (
      this.state.gameState
        ? <div id="game-container">
          <div className="play-container-1" id='round-and-chat'>
          <div className="play-container-1-1">
          {!this.state.gameState.isReady
          ? <Canvas
              isArtist={false}
              gameID={this.props.gameID}
              canvasSocket={this.props.canvasSocket}
            />
          : <div>
            {this.state.gameState.gameOver
              ? <GameOver score={this.state.score} gameState={this.state.gameState} />
              : this.state.betweenRounds
                ? <PostRound
                  onNextRound={this.handleNextRound}
                  score={this.state.score}
                  gameState={this.state.gameState}
                  canvasSocket={this.props.canvasSocket}
                  timer={this.state.timer}
                />
                : (
                  <Round
                    gameState={this.state.gameState}
                    username={this.props.username}
                    isHost={this.state.isHost}
                    onTimesUp={this.handleTimesUp}
                    timerSocket={this.props.timerSocket}
                    canvasSocket={this.props.canvasSocket}
                    gameSocket={this.props.gameSocket}
                    isArtist={isArtist || false}
                    timer={this.state.timer}
                  />
                )}

          </div>}
          </div>        

          <div className="play-container-1-2">     
            <Chat
              gameState={this.state.gameState}
              username={this.props.username}
              gameSocket={this.props.gameSocket}
              betweenRounds={this.state.betweenRounds}
            />
          </div>
        
          {this.state.debug
          ? <div>{this.state.gameStateStr}</div>
          : null
        }
        </div>
        </div>
        : null
    )
  }
}

