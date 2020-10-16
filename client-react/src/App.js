import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
// import * as Tone from 'tone'
import Profile from './components/Profile'
import LoginForm from './components/LoginForm'
import Signup from './components/Signup'
import ThemeUp from './components/ThemeUp'
import Main from './Main'

import './App.css'
// import logo from './pix_logo_50.png'
import Logo from './components/Logo'

/* globals fetch */

import io from 'socket.io-client'
const profileSocket = io('/profile')

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { messages: [], nick: null, loggedIn: false, errorMessage: '', room: 'Pixel Party (Room 1)', userId: '' }
    this.register = this.register.bind(this)
  }

  register (data) {
    // const data={ username: "Johnny", password: "321" }
    // Default options are marked with *
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
      .then(res => res.json())
      .then(data => this.setState({ errorMessage: data.error, registered: !data.error }))
      .catch(err => console.log(err))
    // return response.json(); // parses JSON response into native JavaScript objects
  }

  loginFunc (data) {
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          errorMessage: data.error,
          loggedIn: !data.error,
          nick: data.username,
          userId: data.token

        })
      })

      .catch(err => console.log(err))// when exception is thrown it will end up here - so error message ain't here
  }

  handleAddRoom () {
    const room = prompt('Enter a room name')
    this.setState({ room: room })
  }

  getRooms () {
    const rooms = this.state.messages.map(msg => msg.room)
    rooms.push(this.state.room) // we have to add the currentRoom to the list, otherwise it won't be an option if there isn't already a message with that room
    const filtered = rooms.filter(room => room) // filter out undefined or empty string
    return Array.from(new Set(filtered)) // filters out the duplicates
  }

  logMeOut () {
    this.setState({ nick: null, loggedIn: false })
  }

  // playTone () {
  //   Tone.start()
  //   // console.log('audio is ready')
  //   const synth = new Tone.Synth().toDestination()
  //   return synth.triggerAttackRelease('C4', '8n')
  // }

  render () {
    return (
      <Router>
        <div>
          <div className='navbar'>
            <div className='container-0' id='menu-outer'>
              <div className='container-0-1' id='logo-1'>
                <div>
                  {/* <img src={logo} alt='logo' /> */}
                  <Link to='/'>
                    <Logo />
                  </Link>
                </div>
              </div>
              <div className='container-0-3'>
              </div>
              
              <div className='container-0-2' id='table'>
                <ul id='horizontal-list'>
                  
                  <li>
                    <Link to='/'>Lobby</Link>
                  </li>

                  {this.state.loggedIn
                    ? ''
                    : <li>
                      <Link to='/login'>Log In</Link>
                      </li>}

                  {this.state.loggedIn
                    ? ''
                    : <li>
                      <Link to='/signup'>Sign Up</Link>
                      </li>}

                  {this.state.loggedIn
                    ? <li>
                      {/* <Link to="/logout" onClick={this.logMeOut.bind(this)}>Log <span style={{color:"firebrick"}}>'{this.state.nick}'</span> Out</Link> */}
                      <Link to='/logout' onClick={this.logMeOut.bind(this)}>Log Out</Link>
                    </li>
                    : ''}

                  {this.state.loggedIn
                    ? <li>
                      <Link to='/profile/user'>Profile</Link>
                      </li>
                    : ''}

                </ul>
              </div>
            </div>
          </div>

          <Switch>
            <Route path='/signup'>
              {this.state.loggedIn
                ? <Redirect to='/' />
                : this.state.registered
                  ? <Redirect to='/login' />
                  : [<Signup register={this.register.bind(this)} />, <div>{this.state.errorMessage}</div>]}
            </Route>

            <Route path='/logout'>
              <Redirect to='/' />
            </Route>

            <Route path='/login'>
              {this.state.loggedIn
                ? <Redirect to='/' />
                : [<LoginForm loginFunc={this.loginFunc.bind(this)} />, <div>{this.state.errorMessage}</div>]}
            </Route>

            <Route path='/profile/user'>
              <Profile username={this.state.nick} profileSocket={profileSocket} />
            </Route>

            <Route path='/'>
              {this.state.loggedIn
                ? <Main nick={this.state.nick} loggedIn={this.state.loggedIn} userID={this.state.userId} />
                : <Main />}
            </Route>
          </Switch>
          <ThemeUp />
        </div>
      </Router>
    )
  }
}

export default App


// assignment. make ternaries from rooms - sensei dustino
// theme toggle. https://css-tricks.com/a-dark-mode-toggle-with-react-and-themeprovider/ - maks akymenko
