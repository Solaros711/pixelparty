import React from 'react'
import Round from './Round'
import Chat from './Chat'

export default class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const gameData = this.props.gameData
    const socket = this.props.socket
    const roundData = gameData.rounds[gameData.currentRound]
    const username = this.props.username
    console.log({ gameData, roundData, username })
    return (
      <div id='round-and-chat'>
        <Round gameData={gameData} roundData={roundData} username={this.props.username} socket={this.props.socket} />
        <Chat gameData={gameData} username={this.props.username} socket={socket} gameId={gameData._id} roundData={roundData} />
      </div>
    )
  }
}
