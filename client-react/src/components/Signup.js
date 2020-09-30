import React from 'react'
import { useHistory } from "react-router-dom"

class Signup extends React.Component {
    constructor (props) {
      super(props)
      this.state = { 
            nick: '',
            password: '',
            email: '',
            password2: '',
       }
    this.handleChange =this.handleChange.bind(this)
    }
  
    handleSubmit (evt) {
      evt.preventDefault()
      const data = {
        username: this.state.nick,
        password: this.state.password
      }
      this.props.register(data)
      // this.props.loginFunc(this.state.nick, this.state.password)
    }
  
    handleChange (evt, key) {
      this.setState({ [key]: evt.target.value })
    }

    render () {
        return (
          <div id='login-container'>
            <form id='signup' onSubmit={this.handleSubmit.bind(this)}>
              <div>
                <input id='nickname' type='text' placeholder='Enter nickname...' value={this.state.nick} onChange={(evt) => {this.handleChange(evt, 'nick')}
                } />
              </div>
              <div>
              <input id='email' type='text' placeholder='Enter e-mail...' value={this.state.email} onChange={(evt) => {this.handleChange(evt, 'email')}
              } />
              </div>
              <div>
                <input id='password' type='password' placeholder='Enter password...' value={this.state.password} onChange={(evt) => {this.handleChange(evt, 'password')}} />
              </div> 
              <div>
                <input id='password2' type='password' placeholder='Verify password...' value={this.state.password2} onChange={(evt) => {this.handleChange(evt, 'password2')}} />
              </div>
              <div>
                <button type='submit'>Submit</button>
              </div>
            </form>
          </div>
        )
      }
    }
  export default Signup
  
  // now) just be a component that redirects to the login page
// Meaning, when a user navigates to /logout, the result is simply that they are redirected to /login

//Evan, hide the password

//figure out how to set the key dynamically for 'field'

// Using dot notation:
// obj.key3 = "value3";
// Using square bracket notation:
// obj["key3"] = "value3";

//the reason we wanted to wrap handle change in an arrow function is b/c we wanted to pass the event as the 1st argument and pass in whatever val we wanted for the key to the 2nd arg

//the arrow func is only getting called with the event

//the key is something that comes into play as soon as we call handle change

//we could call it with the key as well

//mistake:'this' object scoping must be within constructor