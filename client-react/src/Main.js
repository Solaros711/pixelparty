import React from 'react'
import io from 'socket.io-client'
import Game from './game-components/Game'
import Lobby from './game-components/Lobby'
import { withRouter } from 'react-router-dom' // allows routing to /login

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

  render () {
    // console.log(this.state)
    return (
      <main>
        {this.state.joinedGame
          ? <Game
            gameID={this.state.gameID}
            isHost={this.state.isHost}
            username={this.state.username}
            gameSocket={gameSocket}
            timerSocket={timerSocket}
            canvasSocket={canvasSocket}
          />
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

export default withRouter(Main)
