import React from 'react'
import io from 'socket.io-client'
import { withRouter } from 'react-router-dom' //allows routing to /login 

const lobbySocket = io('/lobby')

class Lobby extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            numOfPlayers: 2,
        }
    }

    handleHostGame = () => { 
        {this.state.loggedIn
          ? lobbySocket.emit('create game', { username: this.props.username, userID: this.props.userID, numOfPlayers: parseInt(this.state.numOfPlayers) })
          : this.props.history.push('/login')
        }
    }
      
    handleJoinGame =  gameID => {
        {this.state.loggedIn
          ? lobbySocket.emit('join game', {gameID: gameID, userID: this.props.userID, username: this.props.username})
          : this.props.history.push('/login')
        }
    }

    render () {
        return (
            <div id="wait-container">
            {this.props.loggedIn
            ? <h5>Welcome to the <span style={{fontStyle:"italic", textTransform:"uppercase"}}>game lobby, </span><span style={{fontSize: "30px", color:"darkkhaki", textShadow:"2px 2px black"}}>{this.props.username}!</span></h5>
            : <h5>Welcome to the <span style={{fontStyle:"italic", textTransform:"uppercase"}}>game lobby</span></h5>}
            <div id="wait-host-container">
                <div style={{display:"flex", flexDirection:"row"}}>
                <div>
                    <h9><span style={{color:"darkkhaki", textShadow:"2px 2px black"}}>Host a game:  </span></h9>
                </div>
                <div>
                    {this.props.loggedIn
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
                            <button onClick={this.handleHostGame}>Log in to host a game!</button>
                          </div>}
                </div>
                </div>
                <div style={{display:"flex", flexDirection:"row", marginTop:"10px"}}>
                <div>
                    {this.props.loggedIn 
                    ? this.props.games.map(game =>
                        <div>
                            <h9><span style={{color:"darkkhaki", textShadow:"2px 2px black"}}>Join a game:  </span></h9>
                            <button key={game._id} onClick={() => this.handleonJoinGame(game._id)}>
                                Join {game.host}'s game!  {game.players.length} of {game.numOfPlayers} joined!
                            </button> 
                        </div>)
                    : this.props.games.map(game =>
                        <div>
                            <h9><span style={{color:"darkkhaki", textShadow:"2px 2px black"}}>Join a game:  </span></h9>
                            <button disabled={this.props.loggedIn} key={game._id} onClick={() => this.handleJoinGame(game._id)}>
                                Log in to join {game.host}'s game!  {game.players.length} of {game.numOfPlayers} joined!
                            </button>
                        </div>)
                    }
                </div>
                </div>
            </div>
        </div>
        )
    }    
  }
  
  export default withRouter(Lobby)