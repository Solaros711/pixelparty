import React from 'react'
import Round from './Round'
import Chat from './Chat'
import Canvas from './Canvas'
import PostRound from './PostRound'

export default class Game extends React.Component {
  constructor (props) {
    super(props)
    // console.log('game', props)
    this.state = {
      consoleLogs: false,
      gameStart: false,
      debug: false,
      gameState: '',
      score: '',
      betweenRounds: false,
      gameState: {}
    }
  }

  componentDidMount () {
    if (this.state.consoleLogs) console.log(this.props.username, this.props.gameID)
    this.props.gameSocket.emit('join game', {
      username: this.props.username,
      gameID: this.props.gameID,
    })

    this.props.gameSocket.on('game state', gameState => {
      // console.log(gameState)
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
    
  }

  // handleTimesUp = gameID => {
  //   this.props.gameSocket.emit('time\'s up', gameID)
  // }

  handleTimesUpPostRound = gameID => {
    if (this.state.isHost) {
      this.props.gameSocket.emit('next round', gameID)
      console.log('handleTimesUpPostRound')
    }
  }

  render () {
    // console.log(this.state)
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
              ? (
                <div>
                  <div>Game Over</div>
                  <div>Score: {JSON.stringify(this.state.score)}</div>
                  <div id='gallery' style={{ display: 'flex' }}>
              {this.state.gameState.rounds.map(round => {
                return <div>
                    <div>"{round.word}", by {round.artist}</div>
                    <Canvas displayMode={true} res={5} pixels={round.masterpiece} />
                  </div>
                }
              )}
                  </div>
                </div>
              )
              : this.state.betweenRounds
                ? <PostRound
                  onNextRound={this.handleNextRound}
                  score={this.state.score}
                  onTimesUpPostRound={gameID => this.handleTimesUpPostRound(gameID)}
                  timerSocket={this.props.timerSocket}
                  gameID={this.props.gameID}
                  isHost={this.state.isHost}
                />
                : <Round
                    gameState={this.state.gameState}
                    username={this.props.username}
                    isHost={this.state.isHost}
                    onTimesUp={this.handleTimesUp}
                    timerSocket={this.props.timerSocket}
                    canvasSocket={this.props.canvasSocket}
                    gameSocket={this.props.gameSocket}
                    isArtist={isArtist || false}
                  />
            }

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
