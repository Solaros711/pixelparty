import React from 'react'
import Round from './Round'
import Chat from './Chat'

export default class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      consoleLogs: false
    }
  }

  render () {
    // const gameData = this.props.gameData
    // const roundData = gameData.rounds[gameData.currentRound]
    // const username = this.props.username
    if (this.state.consoleLogs) console.log('gameData', this.props.gameData)
    return (
      <div id='round-and-chat'>
        {this.props.gameData.gameOver
          ? null
          : (
            <Round
              gameData={this.props.gameData}
              username={this.props.username}
              isHost={this.props.isHost}
              onTimesUp={this.props.onTimesUp}
            />
          )}

        <Chat
          gameData={this.props.gameData}
          username={this.props.username}
          socket={this.props.socket}
          // gameId={gameData._id}
          // roundData={roundData}
        />
      </div>
    )
  }
}
