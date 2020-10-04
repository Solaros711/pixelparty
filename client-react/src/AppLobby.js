import React from 'react'
import io from 'socket.io-client'
import Game from './game-components/Game'

const socket = io('/lobby')
const names = ['kermit', 'miss piggy', 'fozzy', 'gonzo', 'rizzo', 'animal', 'swedish chef', 'sam eagle', 'statler', 'waldorf']

export default class AppLobby extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: names[Math.floor(Math.random() * names.length)],
      isHost: false,
      games: [],
      joinedGame: false,
      gameDataStr: '',
      debug: true, // shows stringified game data from db if true
      consoleLogs: false,
      gameID: ''
    }
  }

  componentDidMount () {
    socket.emit('get games', this.state.username)
    socket.on('games data', data => {
      this.setState({ games: data.games },)
    })
    socket.on('joined game', gameID => {
      console.log(gameID)
      this.setState({
        joinedGame: true,
        gameID
      })
    })

  }
  
  handleHostGame = () => {
    // this.setState({ joinedGame: true })
    const data = { username: this.state.username, numOfPlayers: 3 }
    socket.emit('create game', data)
  }

  handleJoinGame =  gameID => {
    const { username } = this.state
    socket.emit('join game', { gameID, username })
  }

  handleTimesUp = gameID => {
    socket.emit('time\'s up', gameID)
  }

  render () {
    return (
      // <div id="wait-container">
        <main>
          <link href='https://fonts.googleapis.com/css2?family=Righteous&display=swap' rel='stylesheet' />
          {/* <div>User: {this.state.username}</div> */}
          {this.state.joinedGame
            ? <Game
                gameID={this.state.gameID}
                // gameData={this.state.gameData}
                isHost={this.state.isHost}
                username={this.state.username}
                socket={socket}
                onTimesUp={this.handleTimesUp}
              />
          : <div id="wait-container">
              <h5>Welcome to the <span style={{fontStyle:"italic", textTransform:"uppercase"}}>game lobby, </span><span style={{fontSize: "30px", color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>{this.state.username}!</span></h5>
              {/* <h5>Player: <span style={{color:"firebrick", textTransform:"uppercase"}}>{this.state.username}</span></h5> */}
              <button onClick={this.handleHostGame}>Host a game!</button>
              {this.state.games.map(game =>
                  <button
                    key={game._id}
                    onClick={() => this.handleJoinGame(game._id)}
                  >
                    Join {game.host}'s game!  {game.players.length} of {game.numOfPlayers} joined!
                  </button>
                )}
            </div>
          }
        </main>
      // </div>
    )
  }
}
