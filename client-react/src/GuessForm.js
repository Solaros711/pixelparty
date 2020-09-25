import React from 'react'

class GuessForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = { formValue: '' }
  }

  handleSubmit (evt) {
    evt.preventDefault()
    // this.props.sendMessage(this.state.formValue, this.props.room)
    this.setState({ formValue: '' })
  }

  handleChange (event) {
    this.setState({ formValue: event.target.value })
  }

  render () {
    return (
      <form id='send-message' onSubmit={this.handleSubmit.bind(this)}>
        <input id='guess-text' type='text' placeholder='Enter your guess...' value={this.state.formValue} onChange={this.handleChange.bind(this)} />
        <button id="guess-btn" type='submit'>Guess!</button>
      </form>
    )
  }
}

export default GuessForm

//protect backend fetch route so that it does NOT send error if user has not logged in/sent JWT

//in the event someone uses Postman or CURL it will act differently based on authentication