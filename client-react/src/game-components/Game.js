import React from 'react'
import Round from './Round'
import Chat from './Chat'
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
      socket: io('/game'),
      gameState: '',
      score: '',
      betweenRounds: false
    }
  }

  // componentDidCatch (error) {
  //   console.log(error)
  // }

  componentDidMount () {
    console.log('component did mount game')
    console.log(this.state.username, this.state.gameID)
    this.state.socket.emit('join game', {
      username: this.state.username,
      gameID: this.state.gameID,
      // isHost: this.state.isHost
    })

    // this.state.socket.on('game state', gameState => {
    //   this.setState({
    //     gameState,
    //     gameStateStr: JSON.stringify(gameState),
    //     isHost: this.props.username === gameState.host
    //   })
    // })

    this.state.socket.on('game state', gameState => {
      console.log('game state socket')
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
    this.state.socket.emit('time\'s up', gameID)
  }

  handleNextRound = () => {
    this.state.socket.emit('next round', this.state.gameID)
  }

  render () {
    console.log('game over: ', this.state.gameState.gameOver)
    return (
      this.state.gameState
        ? <div id="game-container">
          <div className="play-container-1" id='round-and-chat'>
          <div className="play-container-1-1">
          {!this.state.gameState.isReady
          ? <div>loading...</div>
          : <div>
            {this.state.gameState.gameOver
              ? (
                <div>
                  <div>Game Over</div>
                  <div>Score: {JSON.stringify(this.state.score)}</div>
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
                  />
                )}

          </div>}
          </div>        

          <div className="play-container-1-2">     
            <Chat
              gameState={this.state.gameState}
              username={this.props.username}
              socket={this.state.socket}
              betweenRounds={this.state.betweenRounds}
              // gameId={gameData._id}
              // roundData={roundData}
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
