import React from 'react'

class NewMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      consoleLogs: true
    }
  }

  handleChange = evt => this.setState({ text: evt.target.value })

  handleSubmit = (evt, text = this.state.text) => {
    const message = { text, username: this.props.username, gameID: this.props.gameID }
    if (this.state.consoleLogs) console.log({ message })
    this.props.socket.emit('message', message)
    this.setState({ text: '' })
    evt.preventDefault()
  }

  render () {
    const disabled = this.props.betweenRounds ? false : this.props.isArtist ? true : false
    // const isArtist = this.props.isArtist
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          onChange={this.handleChange}
          value={this.state.text}
          disabled={disabled}
        />
        <button
        disabled={disabled}>
          Send
        </button>
      </form>
    )
  }
}

export default class Chat extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      consoleLogs: true
    }
  }

  // handleSubmit = message => {  // to delete?
  //   this.props.onSubmit(message)
  // }


  render () {
    const gameState = this.props.gameState
    if (this.state.consoleLogs) console.log({ gameState })
    let isArtist = false
    if (!gameState.gameOver) {
      const artist = gameState.rounds[gameState.currentRound].artist
      isArtist = artist === this.props.username
    }
    const socket = this.props.socket
    const messages = this.props.gameState.messages
    return (
      <div id='messages-container'>
        <div id='messages'>
          {messages.map((msg, i) => <div key={i}>{msg.username}: {msg.text}</div>)}
        </div>
        <NewMessage
          onSubmit={this.handleSubmit}
          socket={socket}
          isArtist={isArtist}
          username={this.props.username}
          gameID={gameState._id}
          betweenRounds={this.props.betweenRounds}
        />
      </div>
    )
  }
}
