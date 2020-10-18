import React from 'react'

class LogIn extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  handleSubmit = evt => {
    evt.preventDefault()
    const data = {
      username: this.state.username,
      password: this.state.password
    }
    this.props.logIn(data)
  }

  handleLoginChange = evt => {
    this.setState({ username: evt.target.value })
  }

  handlePasswordChange = evt => {
    this.setState({ password: evt.target.value })
  }

  render () {
    return (
      <div id='login-container'>
        <h5>Log In...</h5>
        <form id='send-message' onSubmit={this.handleSubmit}>
          <div>
            <input
              id='username'
              type='text'
              placeholder='Enter username...'
              value={this.state.username}
              onChange={this.handleLoginChange}
            />
          </div>
          <div>
            <input
              id='password'
              type='password'
              placeholder='Enter password...'
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <div>
            <button type='submit'>Log In</button>
          </div>
        </form>
      </div>
    )
  }
}

export default LogIn

// this.props means it is somewhere else

// onChange events change state

// actively re-rendering everytime

// if you need to pass data up, you do it through prop drilling

// CamelCase for React - classes and functional components

// nuggets of wisdom from Dustin
