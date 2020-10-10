import React from 'react'
import Round from './Round'
import Chat from './Chat'
import Canvas from './Canvas'
import io from 'socket.io-client'

// const socket = io('./game')

export default class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      consoleLogs: false,
      gameStart: false,
      // joined: false,
      // is this good practice
      // isHost: this.props.isHost,
      gameID: this.props.gameID,
      username: this.props.username, 
      debug: false,
      loading: true,
      gameSocket: this.props.gameSocket,
      gameState: '',
      score: '',
      betweenRounds: false
    }
  }

  componentDidMount () {
    if (this.state.consoleLogs) console.log(this.state.username, this.state.gameID)
    this.state.gameSocket.emit('join game', {
      username: this.state.username,
      gameID: this.state.gameID,
    })

    this.state.gameSocket.on('game state', gameState => {
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

  handleTimesUp = gameID => {
    this.state.gameSocket.emit('time\'s up', gameID)
  }

  handleNextRound = () => {
    this.state.gameSocket.emit('next round', this.state.gameID)
  }

  render () {
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
              gameID={this.state.gameID}
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
                ? <div>
                    <button onClick={this.handleNextRound} style={{backgroundColor:"firebrick"}}>Test: Next Round</button>
                    <div>Score: {JSON.stringify(this.state.score)}</div>
                  </div>
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
                  />
                )}

          </div>}
          </div>        

          <div className="play-container-1-2">     
            <Chat
              gameState={this.state.gameState}
              username={this.props.username}
              gameSocket={this.state.gameSocket}
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
