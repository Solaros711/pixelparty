import React from 'react'

class MessageForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = { formValue: '' }
  }

  handleSubmit (evt) {
    evt.preventDefault()
    this.props.sendMessage(this.state.formValue, this.props.room)
    this.setState({ formValue: '' })
  }

  handleChange (event) {
    this.setState({ formValue: event.target.value })
  }

  render () {
    return (
      <form id='send-message' onSubmit={this.handleSubmit.bind(this)}>
        <input id='message-text' type='text' placeholder='Enter your message...' value={this.state.formValue} onChange={this.handleChange.bind(this)} />
        <button id="message-btn" type='submit'>Send</button>
      </form>
    )
  }
}

export default MessageForm

//protect backend fetch route so that it does NOT send error if user has not logged in/sent JWT

//in the event someone uses Postman or CURL it will act differently based on authentication