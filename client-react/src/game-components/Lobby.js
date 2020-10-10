import React from 'react'

export default class Lobby extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      numOfPlayers: props.numOfPlayers
    }
  }

  componentDidMount () {
      
  }

  render () {
    return (
      <div id='wait-container'>
        {this.props.loggedIn
          ? <h5>Welcome to the <span id='header-stress'>game lobby</span>, <span id='emphatic-text' style={{ fontSize: '30px' }}>{this.props.username}!</span></h5>
          : <h5>Welcome to the <span id='header-stress'>game lobby...</span></h5>}
        <div id='wait-container-flex'>
          <div id='wait-container-a'>
            <div id='wait-container-1'>
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
                      </select>
                    </div>
                    <div>
                      <button onClick={this.props.onHostGame} style={{ marginTop: '5px' }}>Host game!</button>
                    </div>
                  </div>
                  : <div>
                    <button onClick={this.props.onHostGame}>Log in to host a game!</button>
                  </div>}
              </div>
            </div>

            {/* <div style={{ display: "flex", flexDirection: "row", marginTop: "10px" }}> */}
            <div id='wait-container-1'>
              <text id='emphatic-text'>Join a Game</text>
              <div id='wait-sub-container-1'>
                {this.props.loggedIn
                  ? this.props.games.map(game =>
                    <div key={game._id}>
                      {/* <text id="emphatic-text">Join a game:  </text> */}
                      <button onClick={() => this.props.onJoinGame(game._id)}>
                         Join {game.host}'s game!  {game.players.length} of {game.numOfPlayers} joined!
                      </button>
                    </div>)
                  : this.props.games.map(game =>
                    <div key={game._id}>
                      {/* <text id="emphatic-text">Join a game:  </text> */}
                      <button onClick={() => this.props.onJoinGame(game._id)}>
                        Log in to join {game.host}'s game!  {game.players.length} of {game.numOfPlayers} joined!
                      </button>
                    </div>)}
              </div>
            </div>

          </div>

          <div id='wait-container-b'>
            <div id='wait-container-art'>
              <p id='emphatic-text'>Featured Masterpiece</p>
            </div>
          </div>

          <div id='wait-container-c'>
            <div id='wait-container-c-1'>
              <p id='emphatic-text'>Gameplay</p>
              <div id='game-text'>
                <p>Welcome to Pixel Party!</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

// old orange color:"rgb(179, 67, 2)"
