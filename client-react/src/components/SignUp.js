import React from 'react'

class Signup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      password2: '',
      errors: []
    }
  }
  
  handleChange = (evt, key) => {
    this.setState({ [key]: evt.target.value })
  }

  handleSubmit = evt => {
    evt.preventDefault()
    if (this.validate()) {
      const data = {
        username: this.state.username,
        password: this.state.password
      }
      this.props.signUp(data)
    }
  }

  validate = () => {
    const username = this.state.username
    const password = this.state.password
    const verifyPassword = this.state.password2
    const errors = []
    let isValid = true

    if (!username) {
      isValid = false
      errors.push('Please enter your username.')
    }

    if (typeof username !== 'undefined') {
      const usernameVerification = /^\S*$/
      if (!usernameVerification.test(username)) {
        isValid = false
        errors.push('Please enter valid username.')
      }
    }

    if (!password) {
      isValid = false
      errors.push('Please enter your password.')
    }

    if (!verifyPassword) {
      isValid = false
      errors.push('Please enter your password verification.')
    }

    if (typeof password !== 'undefined' && typeof verifyPassword !== 'undefined') {
      if (password !== verifyPassword) {
        isValid = false
        errors.push("Passwords don't match.")
      }
    }

    this.setState({
      errors: errors
    })

    return isValid
  }

  render () {
    const errors = this.state.errors
    return (
      <div id='login-container'>
        <h5>Register...</h5>
        <form id='signup' onSubmit={this.handleSubmit}>
          <div>
            <input
              id='username'
              type='text'
              placeholder='Enter username...'
              value={this.state.username}
              onChange={evt => { this.handleChange(evt, 'username') }}
            />
          </div>

          <div>
            <input
              id='password'
              type='password'
              placeholder='Enter password...'
              value={this.state.password}
              onChange={evt => { this.handleChange(evt, 'password') }}
            />
          </div>
          <div>
            <input
              id='password2'
              type='password'
              placeholder='Verify password...'
              value={this.state.password2}
              onChange={evt => { this.handleChange(evt, 'password2') }}
            />
          </div>

          <div>
            <button type='submit'>Submit</button>
          </div>
        </form>

        <ul id='errors'>
          {errors
            ? errors.map((error, i) => <li key={i}>{error}</li>)
            : null}
        </ul>

      </div>
    )
  }
}
export default Signup

// now) just be a component that redirects to the login page
// Meaning, when a user navigates to /logout, the result is simply that they are redirected to /login

// Evan, hide the password

// figure out how to set the key dynamically for 'field'

// Using dot notation:
// obj.key3 = "value3";
// Using square bracket notation:
// obj["key3"] = "value3";

// the reason we wanted to wrap handle change in an arrow function is b/c we wanted to pass the event as the 1st argument and pass in whatever val we wanted for the key to the 2nd arg

// the arrow func is only getting called with the event

// the key is something that comes into play as soon as we call handle change

// we could call it with the key as well

// mistake:'this' object scoping must be within constructor
