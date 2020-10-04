import React from 'react'

class loginForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = { 
        nick: '',
        password: ''
    }
  }

  handleSubmit (evt) {
    evt.preventDefault()
    const data = {
      username: this.state.nick,
      password: this.state.password
    }
    this.props.loginFunc(data)
  }

  handleLoginChange (event) {
    this.setState({ nick: event.target.value })
  }

  handlePasswordChange (event) {
    this.setState({ password: event.target.value })
  }
  
  render () {
    return (
      <div id='login-container'>
        <h5>Log In...</h5>
        <form id='send-message' onSubmit={this.handleSubmit.bind(this)}>
          <div>
            <input id='nickname' type='text' placeholder='Enter nickname...' value={this.state.nick} onChange={this.handleLoginChange.bind(this)} />
          </div>
          <div>
            <input id='password' type='password' placeholder='Enter password...' value={this.state.password} onChange={this.handlePasswordChange.bind(this)} />
          </div>
          <div>
            <button type='submit'>Log In</button>
          </div>
        </form>
      </div>
    )
  }
}

export default loginForm

//this.props means it is somewhere else

//onChange events change state

//actively re-rendering everytime

//if you need to pass data up, you do it through prop drilling

//CamelCase for React - classes and functional components

//nuggets of wisdom from Dustin