import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'

import Profile from './components/Profile'
import LogIn from './components/LogIn'
import SignUp from './components/SignUp'
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
    this.state = {
      messages: [],
      username: null,
      loggedIn: false,
      errorMessage: '',
      room: 'Pixel Party (Room 1)',
      userID: ''
    }
  }

  signUp = data => {
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
      .then(resData => {
        this.setState({
          errorMessage: resData.error,
          registered: !resData.error
        }, () => { if (!resData.error) this.loginFunc(data) })
      })
      .catch(err => console.log(err))
    // return response.json(); // parses JSON response into native JavaScript objects
  }

  logIn = data => {
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
          username: data.username,
          userID: data.token

        })
      })

      .catch(err => console.log(err))// when exception is thrown it will end up here - so error message ain't here
  }

  logOut = () => this.setState({ username: null, loggedIn: false, registered: false })

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
              <div className='container-0-3' />

              <div className='container-0-2' id='table'>
                <ul id='horizontal-list'>

                  <li>
                    <Link to='/'>Lobby</Link>
                  </li>

                  {this.state.loggedIn
                    ? [
                      <li key={0}><Link to='/logout' onClick={this.logOut}>Log Out</Link></li>,
                      <li key={1}><Link to='/profile'>Profile</Link></li>
                    ]
                    : [
                      <li key={0}><Link to='/login'>Log In</Link></li>,
                      <li key={1}><Link to='/signup'>Sign Up</Link></li>
                    ]
                  }

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
                  : [<SignUp key={0} signUp={this.signUp} />, <div key={1}>{this.state.errorMessage}</div>]}
            </Route>

            <Route path='/logout'>
              <Redirect to='/' />
            </Route>

            <Route path='/login'>
              {this.state.loggedIn
                ? <Redirect to='/' />
                : [<LogIn key={0} logIn={this.logIn} />, <div key={1}>{this.state.errorMessage}</div>]}
            </Route>

            <Route path='/profile'>
              <Profile username={this.state.username} profileSocket={profileSocket} />
            </Route>

            <Route path='/'>
              {this.state.loggedIn
                ? <Main username={this.state.username} loggedIn={this.state.loggedIn} userID={this.state.userID} />
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
