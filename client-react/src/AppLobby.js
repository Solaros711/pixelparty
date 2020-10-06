import React from 'react'
import io from 'socket.io-client'
import Game from './game-components/Game'

const lobbySocket = io('/lobby')
const gameSocket = io ('/game')
const timerSocket = io ('/timer')
const canvasSocket = io ('/canvas')

// const names = ['kermit', 'miss piggy', 'fozzy', 'gonzo', 'rizzo', 'animal', 'swedish chef', 'sam eagle', 'statler', 'waldorf']

export default class AppLobby extends React.Component {
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
      numOfPlayers: 3,
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
    // this.setState({ joinedGame: true })
    if(this.state.loggedIn){
      const data = { username: this.state.username, userID: this.state.userID, numOfPlayers: parseInt(this.state.numOfPlayers) }
      lobbySocket.emit('create game', data)
    }
  }

  handleJoinGame =  gameID => {
    if(this.state.loggedIn){
      // const { username } = this.state
      const data = {gameID: gameID, userID: this.state.userID, username: this.state.username}
      // lobbySocket.emit('join game', { gameID, username })
      lobbySocket.emit('join game', data)
    }
  }

  handleTimesUp = gameID => {
    lobbySocket.emit('time\'s up', gameID)
  }

  render () {
    return (
        <main>
          <link href='https://fonts.googleapis.com/css2?family=Righteous&display=swap' rel='stylesheet' />
          {/* <div>User: {this.state.username}</div> */}
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
          : <div id="wait-container">
              {this.state.loggedIn
              ? <h5>Welcome to the <span style={{fontStyle:"italic", textTransform:"uppercase"}}>game lobby, </span><span style={{fontSize: "30px", color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>{this.state.username}!</span></h5>
              : <h5>Welcome to the <span style={{fontStyle:"italic", textTransform:"uppercase"}}>game lobby</span></h5>}
              {/* <h5>Player: <span style={{color:"firebrick", textTransform:"uppercase"}}>{this.state.username}</span></h5> */}
              {this.state.loggedIn
              ? <button onClick={this.handleHostGame}>Host a game!</button>
              : <button onClick={this.handleHostGame}>Log in to host a game!</button>}
              <label htmlFor='num-of-players'>How Many?</label>
              <select value={this.state.numOfPlayers} onChange={evt => this.setState({ numOfPlayers: evt.target.value })}>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
              {this.state.loggedIn ? this.state.games.map(game =>
                  <button
                    key={game._id}
                    onClick={() => this.handleJoinGame(game._id)}
                  >
                    Join {game.host}'s game!  {game.players.length} of {game.numOfPlayers} joined!
                  </button>
                ) : this.state.games.map(game =>
                  <button
                    disabled={this.state.loggedIn}
                    key={game._id}
                    onClick={() => this.handleJoinGame(game._id)}
                  >
                    Log in to join {game.host}'s game!  {game.players.length} of {game.numOfPlayers} joined!
                  </button>
                )}
            </div>
          }
        </main>
    )
  }
}
