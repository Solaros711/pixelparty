import React from 'react'
import io from 'socket.io-client'
import Game from './Game'
import './Game.css'

const socket = io('/game')
const names = ['kermit', 'miss piggy', 'fozzy', 'gonzo', 'rizzo', 'animal', 'swedish chef', 'sam eagle', 'statler', 'waldorf']

export default class AppGame extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: names[Math.floor(Math.random() * names.length)],
      isHost: false,
      games: [],
      joinedGame: false,
    }
  }

  componentDidMount () {
    socket.on('game created', (gameID, hostUsername) => {
      console.log('test')
      this.setState({
        games: this.state.games.concat({ gameID, hostUsername })
      }, () => console.log(this.state))
    })
    socket.on('game state', data => {
      console.log('game state', data)
      this.setState({ gameData: data, gameDataStr: JSON.stringify(data) })
    })
    socket.on('drawing', pixels => this.setState(pixels))
    socket.on('timer', timer => this.setState(timer))
    socket.on('join game', data => {
      this.setState({ gameDataStr: JSON.stringify(data), gameData: data, joinedGame: true })
    })
    socket.on('game ready', gameID => {
      if (this.state.isHost) socket.emit('game ready', gameID)
    })
    socket.on('game full', gameID => {
      const games = this.state.games.slice()
      games.splice(games.indexOf(gameID), 1)
      this.setState({ games })
    })
    socket.on('game start', () => this.setState({ gameStart: true }))
  }

  handleHostGame = () => {
    this.setState({ isHost: true })
    const data = { username: this.state.username, numOfPlayers: 2 }
    socket.emit('create game', data)
    socket.on('join created game', (gameID, username) => {
      const { isHost } = this.state
      socket.emit('join game', { gameID, username, isHost })
    })
    socket.on('game ready', gameID => {
      socket.emit('game start', gameID)
    })
  }

  handleJoinGame =  gameID => {
    const { username, isHost } = this.state
    socket.emit('join game', {gameID, username, isHost })
  }

  render () {
    return (
      <main>
        <link href='https://fonts.googleapis.com/css2?family=Righteous&display=swap' rel='stylesheet' />
        <div>User: {this.state.username}</div>
        {this.state.joinedGame
        ? this.state.gameStart
          ? <Game gameData={this.state.gameData} username={this.state.username} socket={socket} />
          : <div>
            <div>{this.state.gameData.host}'s game</div>
            <div>{this.state.gameData.players.length} of {this.state.gameData.numOfPlayers} joined</div>
          </div>
        : <div>
            <button onClick={this.handleHostGame}>Host a Game!</button>
            {this.state.games.map(game => <button key={game.gameID} onClick={() => this.handleJoinGame(game.gameID)}>Join {game.hostUsername}'s Game!</button>)}
          </div>
        }
        {this.state.gameDataStr
        ? [<div>Game Data:</div>,
          <div>{this.state.gameDataStr}</div>]
        : null
      }
      </main>
    )
  }
}
