import React from 'react'
import Game from './game-components/Game'

function Lobby (props) {
  return <div>This is the Lobby.  I think essentially everything in "#wait-container" could go inside here, and that's the main thing that would make developing easier in the new Main.  This would probably be it's own module imported into this file.  Anything referred to by this.</div>
}

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

  componentDidMount = () => console.log('component does mount will go here as usual')

  handleHostGame = () => console.log('the methods would still go here,')

  handleJoinGame = () => console.log('here,')

  handleTimesUp = () => console.log('and here.')

  render () {
    return (
      <main>
        {this.state.joinedGame
          ? <Game
            gameID={this.state.gameID}
            isHost={this.state.isHost}
            username={this.state.username}
            onTimesUp={this.handleTimesUp}
            gameSocket='gameSocket'
            timerSocket='timerSocket'
            canvasSocket='canvasSocket'
          />
          : <Lobby
            props='all the props lobby will need'
            loggedIn={this.state.loggedIn}
            username={this.state.username}
            numOfPlayers={this.state.numOfPlayers}
            onHostGame={this.state.handleHostGame}
            onJoinGame={this.state.handleJoinGame}
            games={this.state.games}
            otherProps="i think this is everything"
          />}
      </main>
    )
  }
}

export default Main
