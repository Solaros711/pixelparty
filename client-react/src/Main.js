import React from 'react'
import io from 'socket.io-client'
import Game from './game-components/Game'
import Lobby from './game-components/Lobby'
import { withRouter } from 'react-router-dom' // allows routing to /login
import { ErrorBoundary } from 'react-error-boundary'

const lobbySocket = io('/lobby')
const gameSocket = io('/game')
const timerSocket = io('/timer')
const canvasSocket = io('/canvas')

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: props.nick || null,
      userID: props.userID,
      isHost: false,
      joinedGame: false,
      gameID: '',
      loggedIn: props.loggedIn || false
    }
  }

  componentDidMount () {
    lobbySocket.on('joined game', gameID => {
      this.setState({
        joinedGame: true,
        gameID
      })
    })
    gameSocket.on('left game', () => this.setState({ joinedGame: false, gameID: '' }))
  }

  handleLeaveGame = () => this.setState({ joinedGame: false, gameID: '' })

  render () {
    console.log(this.state)
    return (
      <main>
        {this.state.joinedGame
          ? <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={this.handleLeaveGame}
            onError={err => console.log(err)}
          >
            <Game
              gameID={this.state.gameID}
              isHost={this.state.isHost}
              username={this.state.username}
              gameSocket={gameSocket}
              timerSocket={timerSocket}
              canvasSocket={canvasSocket}
              onLeaveGame={this.handleLeaveGame}
            />
          </ErrorBoundary>
          : <Lobby
            gameID={this.state.gameID}
            userID={this.state.userID}
            loggedIn={this.state.loggedIn}
            username={this.state.username}
            lobbySocket={lobbySocket}
            history={this.props.history}
          />}
      </main>
    )
  }
}

function ErrorFallback (props) {
  console.log(props.error)
  return (
    <div>
      <div>We're sorry something went wrong.</div>
      <button onClick={props.resetErrorBoundary}>Take me back to the Lobby</button>
    </div>
  )
}

export default withRouter(Main)
