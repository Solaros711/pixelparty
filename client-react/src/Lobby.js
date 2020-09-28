import React from 'react'
import io from 'socket.io-client'

const socket = io('/game')
const names = ['kermit', 'miss piggy', 'fozzy', 'gonzo', 'rizzo', 'animal', 'swedish chef', 'sam eagle', 'statler', 'waldorf']

export default class AppGame extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: names[Math.floor(Math.random() * names.length)],
      isHost: false,
      games: []
    }
  }

  componentDidMount () {
    socket.on('game created', (gameID, hostUsername) => {
      console.log('test')
      this.setState({
        games: this.state.games.concat({ gameID, hostUsername })
      }, () => console.log(this.state))
    })
    socket.on('game state', data => this.setState(data))
    socket.on('drawing', pixels => this.setState(pixels))
    socket.on('timer', timer => this.setState(timer))
    socket.on('game ready', gameID => {
      if (this.state.isHost) socket.emit('game ready', gameID)
    })
  }

  handleHostGame = () => {
    this.setState({ isHost: true })
    const data = { username: this.state.username, numOfPlayers: 2 }
    socket.emit('create game', data)
    socket.on('join created game', (gameID, username) => {
      const { isHost } = this.state
      socket.emit('join game', { gameID, username, isHost })
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
        <button onClick={this.handleHostGame}>Host a Game!</button>
        {this.state.games.map(game => <button key={game.gameID} onClick={() => this.handleJoinGame(game.gameID)}>Join {game.hostUsername}'s Game!</button>)}
      </main>
    )
  }
}
