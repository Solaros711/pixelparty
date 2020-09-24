import React from 'react'

class NewMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: '',
      text: ''
    }
  }

  handleChange = evt => this.setState({ text: evt.target.value })

  handleSubmit = (evt, text = this.state.text) => {
    this.props.socket.emit('message')
    if (text.toLowerCase === this.props.word)
    // this.props.onSubmit(text)
    // this.setState({ text: '' })
    // if (text.toLowerCase() === this.props.word.toLowerCase()) this.props.onWin()
    // evt.preventDefault()
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input onChange={this.handleChange} value={this.state.text} />
        <button>Send</button>
      </form>
    )
  }
}

export default class Chat extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: []
    }
  }

  componentDidMount () {
    this.props.socket.on('message', messages => {
      this.setState({ messages })
    })
  }

  handleSubmit = text => {
    this.setState({
      messages: this.state.messages.concat({ text })
    })
  }

  handleWin = () => {
    this.props.onWin()
  }

  render () {
    return (
      <div id='messages-container'>
        <div id='messages'>
          {this.state.messages.map((msg, i) => <div key={i}>{msg.text}</div>)}
        </div>
        <NewMessage
          onSubmit={this.handleSubmit}
          word={this.props.word}
          onWin={this.handleWin}
          socket={this.props.socket}
        />
      </div>
    )
  }
}
