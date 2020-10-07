import React from 'react'
import io from 'socket.io-client'
import Game from './game-components/Game'

const lobbySocket = io('/lobby')
const gameSocket = io ('/game')
const timerSocket = io ('/timer')
const canvasSocket = io ('/canvas')

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
      gameID: '',
      numOfPlayers: 3
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
    const data = { username: this.state.username, numOfPlayers: parseInt(this.state.numOfPlayers) }
    lobbySocket.emit('create game', data)
  }

  handleJoinGame =  gameID => {
    const { username } = this.state
    lobbySocket.emit('join game', { gameID, username })
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
              <h5>Welcome to the <span style={{fontStyle:"italic", textTransform:"uppercase"}}>game lobby, </span><span style={{fontSize: "30px", color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>{this.state.username}!</span></h5>
              {/* <h5>Player: <span style={{color:"firebrick", textTransform:"uppercase"}}>{this.state.username}</span></h5> */}
              <div id="wait-host-container">
                <div style={{display:"flex", flexDirection:"row"}}>
                  <div>
                    <h9><span style={{color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>Host a game:  </span></h9>
                  </div>
                  {/* <div style={{display:"flex", flexDirection:"row"}}>
                    <h10><label htmlFor='num-of-players'>Number of players?</label></h10>
                    <select value={this.state.numOfPlayers} onChange={evt => this.setState({ numOfPlayers: evt.target.value })}>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div> */}
                  <div>
                      {this.state.loggedIn
                        ? <div style={{display:"flex", flexDirection:"row"}}>
                          
                            <h10><label htmlFor='num-of-players'>Number of players?</label></h10>
                            <select value={this.state.numOfPlayers} onChange={evt => this.setState({ numOfPlayers: evt.target.value })}>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                            </select>
                        
                            <div style={{marginLeft:"17px"}}>
                              <button onClick={this.handleHostGame}>Host game!</button>
                            </div>

                          </div>
                        : <div style={{marginLeft:"17px"}}>
                            <button onClick={this.handleHostGame}>Log in to host game!</button>
                          </div>}
                  </div>
                </div>
                <div style={{display:"flex", flexDirection:"row", marginTop:"10px"}}>
                  <div>
                    {/* {this.state.loggedIn 
                    ? <h9><span style={{color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>Join a game:  </span></h9>
                    : <h9><span style={{color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>Log in to join a game:  </span></h9>} */}
                    {this.state.loggedIn 
                      ? this.state.games.map(game =>
                        <div>
                          <h9><span style={{color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>Join a game:  </span></h9>
                          <button
                            key={game._id}
                            onClick={() => this.handleJoinGame(game._id)}
                          >
                            Join {game.host}'s game!  {game.players.length} of {game.numOfPlayers} joined!
                          </button> 
                        </div>)
                      : this.state.games.map(game =>
                        <div>
                          <h9><span style={{color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>Join a game:  </span></h9>
                          <button
                            disabled={this.state.loggedIn}
                            key={game._id}
                            onClick={() => this.handleJoinGame(game._id)}
                          >
                            Log in to join {game.host}'s game!  {game.players.length} of {game.numOfPlayers} joined!
                        </button>
                        </div>)
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </main>
        
    )
  }
}
