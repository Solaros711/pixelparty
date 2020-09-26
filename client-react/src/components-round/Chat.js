import React from 'react'

class NewMessage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  handleChange = evt => this.setState({ text: evt.target.value })

  handleSubmit = (evt, text = this.state.text) => {
    const message = { text, user: this.props.user }
    this.props.onSubmit(message)
    this.setState({ text: '' })
    evt.preventDefault()
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          onChange={this.handleChange}
          value={this.state.text}
          disabled={this.props.drawing ? true : false}
        />
        <button disabled={this.props.drawing ? true : false}>Send</button>
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

  handleSubmit = message => {
    this.props.onSubmit(message)
  }


  render () {
    return (
      <div id='messages-container'>
        <div id='messages'>
          {this.props.messages.map((msg, i) => <div key={i}>{msg.user}: {msg.text}</div>)}
        </div>
        <NewMessage
          onSubmit={this.handleSubmit}
          socket={this.props.socket}
          drawing={this.props.drawing}
          user={this.props.user}
        />
      </div>
    )
  }
}
