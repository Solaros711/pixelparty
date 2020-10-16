import React from 'react'
import Canvas from './Canvas'

export default class Lobby extends React.Component {
  constructor (props) {
    super(props)
    console.log('lobby', props)
    this.state = {
      numOfPlayers: 2,
      artist: '',
      word: '',
      pixels: '',
      games: [],
    }
  }

  componentDidMount () {
    this.props.lobbySocket.emit('get games', this.props.username)
    this.props.lobbySocket.on('games data', data => {
        this.setState({ games: data.games },)
    })
    this.props.lobbySocket.emit('random artwork')
    const intervalID = setInterval(() => this.props.lobbySocket.emit('random artwork'), 5000)
    this.setState({ intervalID })
    this.props.lobbySocket.on('random artwork', data => {
      this.setState({ artist: data.username, word: data.word, pixels: data.pixels })
    })
  }

  componentWillUnmount () {
    clearInterval(this.state.intervalID)
  }

  handleHostGame = _evt => {
    {this.props.loggedIn
      ? this.props.lobbySocket.emit('create game', { username: this.props.username, userID: this.props.userID, numOfPlayers: parseInt(this.state.numOfPlayers) })
      : this.props.history.push('/login')}
  }

  handleJoinGame =  gameID => {
    {this.props.loggedIn
      ? this.props.lobbySocket.emit('join game', {gameID: gameID, userID: this.props.userID, username: this.props.username})
      : this.props.history.push('/login')
    }
  }

  render () {
    return (
      <div id='wait-container'>
        {this.props.loggedIn
          ? <h5>Welcome to the <span id='header-stress'>game lobby</span>, <span id='emphatic-text' style={{ fontSize: '30px' }}>{this.props.username}!</span></h5>
          : <h5>Welcome to the <span id='header-stress'>game lobby...</span></h5>}
        <div id='wait-container-flex'>
          <div id='wait-container-a'>
            <div id='wait-container-1' style={{marginBottom:"20px"}}>
              <text id='emphatic-text'>Host a Game</text>
              <div id='wait-sub-container-1'>
                {this.props.loggedIn
                  ? <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                      <text id='tentative-text'><label htmlFor='num-of-players'>Number of players?</label></text>
                      <select value={this.state.numOfPlayers} onChange={evt => this.setState({ numOfPlayers: evt.target.value })}>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                      </select>
                    </div>
                    <div>
                      <button onClick={this.handleHostGame} style={{ marginTop: '5px' }}>Host game!</button>
                    </div>
                  </div>
                  : <div>
                    <button onClick={this.handleHostGame}>Log in to host a game!</button>
                  </div>}
              </div>
            </div>

            <div id='wait-container-1'>
              <text id='emphatic-text'>Join a Game</text>
              <div id='wait-sub-container-1'>
                {this.props.loggedIn
                  ? this.state.games.map(game =>
                    <div key={game._id}>
                      <button onClick={() => this.handleJoinGame(game._id)}>
                         Join {game.host}'s game!  {game.players.length} of {game.numOfPlayers} joined!
                      </button>
                    </div>)
                  : this.state.games.map(game =>
                    <div key={game._id}>
                      <button onClick={() => this.handleJoinGame(game._id)}>
                        Log in to join {game.host}'s game!  {game.players.length} of {game.numOfPlayers} joined!
                      </button>
                    </div>)}
              </div>
            </div>

          </div>

          <div id='wait-container-b'>
              <div id='wait-container-art'>
                <div id='emphatic-text' style={{fontSize: "20px", textShadow:"2px 2px black", position: "absolute", left: "32%", top:"0.5%"}}>
                  Featured Masterpiece
                </div>
                {this.state.word
                ? <div style={{position: "absolute", textShadow:"2px 2px black", textAlign: "center", color: "whitesmoke", right: "20%", bottom: "4%" }}>
                  <span style={{fontSize: "18px", fontWeight: "bold"}}><i>"{this.state.word}"</i></span> by {this.state.artist}
                </div>
                : null
              }
                <div>
                  {this.state.pixels
                    ? <Canvas displayMode dynamic pixels={this.state.pixels} res={8} />
                    : null}
                </div>
              </div>
          </div>

          <div id='wait-container-c'>
            <div id='wait-container-c-1'>
              <p id='emphatic-text'>Gameplay</p>
              <div id='game-text'>
                <p style={{textShadow: "2px 2px black", color: "whitesmoke"}}>Welcome to Pixel Party!</p>
                <div id="rules">
                  <p>You have 60 seconds to draw your masterpiece...as everyone else tries to guess what it is!</p>
                  <p>If someone guesses right, you both get a point!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

// old orange color:"rgb(179, 67, 2)" 
