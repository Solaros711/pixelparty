import React from 'react'
import chroma from 'chroma-js'
const scale = chroma.scale([
  '8C00FC',
  '3500FF',
  '01FE01',
  'FFFE37',
  'FF8600',
  'ED0003'
])

class NewMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      consoleLogs: false
    }
  }

  handleChange = evt => this.setState({ text: evt.target.value })

  handleSubmit = (evt, text = this.state.text) => {
    evt.preventDefault()
    const message = { text, username: this.props.username, gameID: this.props.gameID }
    if (this.state.consoleLogs) console.log({ message })
    this.props.gameSocket.emit('message', message)
    this.setState({ text: '' })
  }

  render () {
    const disabled = this.props.betweenRounds ? false : this.props.isArtist ? true : false
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          onChange={this.handleChange}
          value={this.state.text}
          disabled={disabled}
          placeholder="Take a guess..."
        />
        <button
        disabled={disabled}>
          Send
        </button>
      </form>
    )
  }
}

function WinningMessage (props) {
  const message = `${props.msg.username}: ${props.msg.text}`
  return (
    <div>
      {message.split('').map((char, i) => {
        const color = scale(i / (message.length - 1))
        return <span key={i} style={{ color }}>{char}</span>
      })}
    </div>
  )
}

export default class Chat extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      consoleLogs: false
    }
  }

  render () {
    console.log(this.props)
    const gameState = this.props.gameState
    if (this.state.consoleLogs) console.log({ gameState })
    let isArtist = false
    if (!gameState.gameOver && gameState.isReady) {
      const artist = gameState.rounds[gameState.currentRound].artist
      isArtist = artist === this.props.username
    }
    const messages = this.props.gameState.messages || []
    return (
      <div id='messages-container'>
        <div id='messages'>
          {messages.map((msg, i) => msg.winner
            ? <WinningMessage msg={msg} />
            : <div key={i} style={{textAlign: this.props.username === msg.username ?"right": "left"}}>{msg.username}: {msg.text}</div>)}
        </div>
        <NewMessage
          onSubmit={this.handleSubmit}
          gameSocket={this.props.gameSocket}
          isArtist={isArtist}
          username={this.props.username}
          gameID={gameState._id}
          betweenRounds={this.props.betweenRounds}
        />
      </div>
    )
  }
}
