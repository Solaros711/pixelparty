import React from 'react'
import io from 'socket.io-client'
import Game from './game-components/Game'
import Lobby from './game-components/Lobby'
import { withRouter } from 'react-router-dom' //allows routing to /login 

const lobbySocket = io('/lobby')
const gameSocket = io ('/game')
const timerSocket = io ('/timer')
const canvasSocket = io ('/canvas')

// const names = ['kermit', 'miss piggy', 'fozzy', 'gonzo', 'rizzo', 'animal', 'swedish chef', 'sam eagle', 'statler', 'waldorf']

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: props.nick || null,
      userID: props.userID,
      isHost: false,
      games: [],
      joinedGame: false,
      gameDataStr: '',
      debug: true, // shows stringified game data from db if true
      consoleLogs: false,
      gameID: '',
      numOfPlayers: 2,
      loggedIn: props.loggedIn || false
    }
  }

  componentDidMount () {
    lobbySocket.emit('get games', this.state.username)
    lobbySocket.on('games data', data => {
        this.setState({ games: data.games },)
    })
    lobbySocket.on('joined game', gameID => {
        console.log(gameID)
        this.setState({
            joinedGame: true,
            gameID
        })
    })
  }
  
  handleHostGame = () => { 
    {this.state.loggedIn
      ? lobbySocket.emit('create game', { username: this.state.username, userID: this.state.userID, numOfPlayers: parseInt(this.state.numOfPlayers) })
      : this.props.history.push('/login')
    }
  }
  
  handleJoinGame =  gameID => {
    {this.state.loggedIn
      ? lobbySocket.emit('join game', {gameID: gameID, userID: this.state.userID, username: this.state.username})
      : this.props.history.push('/login')
    }
  }

  handleTimesUp = gameID => {
    lobbySocket.emit('time\'s up', gameID)
  }

  render () {
    return (
        <main>
          {this.state.joinedGame
            ? <Game
                gameID={this.state.gameID}
                // gameData={this.state.gameData}
                isHost={this.state.isHost}
                username={this.state.username}
                // socket={socket}
                onTimesUp={this.handleTimesUp}
                gameSocket={gameSocket}
                timerSocket={timerSocket}
                canvasSocket={canvasSocket}
              />
            : <Lobby
                gameID={this.state.gameID}
                userID={this.state.userID}
                loggedIn={this.state.loggedIn}
                username={this.state.username}
                numOfPlayers={this.state.numOfPlayers}
                onHostGame={this.handleHostGame}
                onJoinGame={this.handleJoinGame.bind(this)}
                games={this.state.games}
              />
          }
        </main>
    )
  }
}

export default withRouter(Main)


