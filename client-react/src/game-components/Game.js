import React from 'react'
import * as Tone from 'tone'

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
      gameState: { players: [], messages: [] },
      score: '',
      betweenRounds: false,
      timer: 0
    }
  }

  componentDidMount () {
    if (this.state.consoleLogs) console.log(this.props.username, this.props.gameID)
    this.props.gameSocket.emit('join game', {
      username: this.props.username,
      gameID: this.props.gameID
    })

    this.props.gameSocket.on('game state', gameState => {
      const betweenRounds = gameState.rounds.length ? gameState.rounds[gameState.currentRound].roundOver || false : false
      const score = gameState.points
        .reduce((pointsObject, name) => {
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

    this.props.gameSocket.on('timer', timer => {
      this.setState({ timer })
      if (timer <= 5) this.playTone()
    })
  }

  playTone () {
    Tone.start()
    const synth = new Tone.Synth().toDestination()
    return synth.triggerAttackRelease('C4', '8n')
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
        ? <div id='game-container'>
          <div className='play-container-1'>
            {!this.state.gameState.isReady
              ? <div id='results-left-container'>

                <div className='round-container-1-2'>
                  <div id='emphatic-text' style={{ fontSize: '20px' }}>Enjoy our canvas while you wait for your game.</div>
                  <div>
                    <div class='lds-ellipsis'><div /><div /><div /><div /></div>
                  </div>
                  <div><b>{this.state.gameState.host}'s game: {this.state.gameState.players.length} of {this.state.gameState.numOfPlayers} joined!</b></div>
                </div>

                <div id='canvas-container-1-a'>
                  <Canvas
                    isArtist={false}
                    gameID={this.props.gameID}
                    canvasSocket={this.props.canvasSocket}
                  />
                </div>

              </div>
              : <div id='results-left-container'>
                {this.state.gameState.gameOver
                  ? <GameOver score={this.state.score} gameState={this.state.gameState} onLeaveGame={this.props.onLeaveGame} />
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

            <Chat
              gameState={this.state.gameState}
              username={this.props.username}
              gameSocket={this.props.gameSocket}
              betweenRounds={this.state.betweenRounds}
            />

            {this.state.debug
              ? <div>{this.state.gameStateStr}</div>
              : null}
          </div>
          </div>
        : null
    )
  }
}

// Status ellipsis. "spinrs" by Jay (https://codepen.io/jsamra/pen/MNmJWL).
