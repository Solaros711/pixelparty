import React from 'react'

class Signup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      nick: '',
      password: '',
      // email: '',
      password2: '',
      errors: []
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit (evt) {
    evt.preventDefault()
    if (this.validate()) {
      const data = {
        username: this.state.nick,
        password: this.state.password
      }
      this.props.register(data)
    }
    // this.props.loginFunc(this.state.nick, this.state.password)
  }

  validate () {
    const nick = this.state.nick
    // const email = this.state.email
    const password = this.state.password
    const verifyPassword = this.state.password2
    const errors = []
    let isValid = true

    if (!nick) {
      isValid = false
      errors.push('Please enter your username.')
    }

    if (typeof nick !== 'undefined') {
      const nickVerification = /^\S*$/
      if (!nickVerification.test(nick)) {
        isValid = false
        errors.push('Please enter valid username.')
      }
    }

    // if (!email) {
    //   isValid = false
    //   errors.push('Please enter your email Address.')
    // }

    // if (typeof email !== 'undefined') {
    //   const emailVerification = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i)
    //   if (!emailVerification.test(email)) {
    //     isValid = false
    //     errors.push('Please enter a valid email address.')
    //   }
    // }

    if (!password) {
      isValid = false
      errors.push('Please enter your password.')
    }

    if (!verifyPassword) {
      isValid = false
      errors.push('Please enter your password verification.')
    }

    // if (typeof password !== 'undefined') {
    //   const passwordVerification = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,15}$/
    //   if (password.match(passwordVerification)) {
    //     isValid = false
    //     errors.push('passwords must be between 6-15 characters and contain at least one numeric digit and a special character')
    //   }
    // }

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

  handleChange (evt, key) {
    this.setState({ [key]: evt.target.value })
  }

  render () {
    const errors = this.state.errors
    return (
      <div id='login-container'>
        <h5>Register...</h5>
        <form id='signup' onSubmit={this.handleSubmit.bind(this)}>
          <div>
            {/* <div for='username'>username:</div> */}
            <input
              id='nickname'
              type='text'
              placeholder='Enter username...'
              value={this.state.nick}
              onChange={(evt) => { this.handleChange(evt, 'nick') }}
            />
          </div>
          {/* <div>
            <input
              id='email' type='text' placeholder='Enter e-mail...' value={this.state.email} onChange={(evt) => { this.handleChange(evt, 'email') }}
            />
          </div> */}
          <div>
            {/* <div for='password'>password:</div> */}
            <input
              id='password'
              type='password'
              placeholder='Enter password...'
              value={this.state.password}
              onChange={(evt) => { this.handleChange(evt, 'password') }}
            />
          </div>
          <div>
            {/* <div for='password2'>password again:</div> */}
            <input id='password2' type='password' placeholder='Verify password...' value={this.state.password2} onChange={(evt) => { this.handleChange(evt, 'password2') }} />
          </div>
          <div>
            <button type='submit'>Submit</button>
          </div>
        </form>
        <ul id='errors'>
          {errors
            ? errors.map((error, i) => <li key={i}>{error}</li>)
            : ''}
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
