/* globals fetch prompt */
import Chat from './Chat'
import Game from './Game'
import Lobby from './Lobby'
import GuestLobby from './GuestLobby'
import Rooms from './Rooms'
import Profile from './Profile'
import MessageForm from './MessageForm'
import LoginForm from './LoginForm'
import Signup from './Signup'
import React from 'react'
import io from 'socket.io-client'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom"
import './App.css'
import logo from './pix_logo_4.png'
const jwt = require('jsonwebtoken')

const socket = io()

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { messages: [], nick: null, loggedIn: false, errorMessage: '', room:'Pixel Party (Room 1)', userId: ''}
    this.register = this.register.bind(this)
  }

  register(data) {
    // const data={ username: "Johnny", password: "321" }
    // Default options are marked with *
    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .then (res => res.json()) 
    .then (data => this.setState({ errorMessage: data.error, registered: data.error ? false: true }))
    .catch (err => console.log(err))
    // return response.json(); // parses JSON response into native JavaScript objects
  }

  componentDidMount () {
    socket.on('chat message', msg => {
      console.log('Got a message:', msg)
      console.log(this.state.loggedIn, 'loggedIn state')
      this.setState({ messages: this.state.messages.concat(msg) })
    })

  }
  loginFunc(data) {
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .then (res => res.json()) 
    .then (data => {
      this.setState({
        errorMessage: data.error,
        loggedIn: data.error 
          ? false: true,  
        nick: data.username,
        userId: data.token
        
      })
          // Get initial list of messages
    fetch('/messages', {
      headers: {
        Authorization: `Bearer ${data.token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('fetched data from server')
          console.log(data)
          this.setState({ messages: data })
        })
    }) //this is where our custom error msg prints

    .catch (err => console.log(err))//when exception is thrown it will end up here - so error message ain't here
    
  }
  

  sendMessage (text, messageRoom) {
    const message = { text: text, nick: this.state.nick, room: messageRoom, userId: this.state.userId }
    socket.emit('chat message', message)
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

  logMeOut() {
    this.setState({loggedIn: false})
  }

  render () {
    return (
      <Router>
        {/* <button onClick={this.signUp}>Sign Up or Whatever</button> */}
        <div>
          <div className="logo">
            <img src={logo} alt="logo"/>
          </div>
        <div id="menu-outer"> 
          <div className="table">
            <ul id="horizontal-list">
              {this.state.loggedIn
                ?
              <li>
                <Link to="/"><button>Lobby</button></Link>
              </li>
                : ''}
              {this.state.loggedIn
                ?
                ''
                :
              <li>
                <Link to="/signup"><button>Sign Up</button></Link>
              </li>}
              {this.state.loggedIn 
                ?
              <li>
                <Link to="/logout" onClick={this.logMeOut.bind(this)}><button>Log <span style={{color:"firebrick"}}>'{this.state.nick}'</span> Out</button></Link>
              </li> 
                : ''}
              {this.state.loggedIn
                ?
              <li>
                <Link to="/profile/user"><button>Profile</button></Link>
              </li>
                : ''}
              {this.state.loggedIn
                ?
                ''
                : 
              <li>
                <Link to="/login"><button>Log In</button></Link>
              </li>}
              {this.state.loggedIn
                ?
              <li>
                <Link to="/chat/general"><button>Chat</button></Link>
              </li>
                : ''}
              {this.state.loggedIn
                ?
                ''
                : 
              <li>
                <Link to="/guest"><button>Guest</button></Link>
              </li>}
            </ul>
          </div>
        </div>
        <Switch>
          <Route path="/signup">
          {this.state.loggedIn 
            ? <Redirect to="/" />  
            : this.state.registered 
              ? <Redirect to="/login" /> 
              : [<Signup register={this.register.bind(this)}/>,  <div>{this.state.errorMessage}</div>]}
          </Route>

          <Route path="/logout" >
            <Redirect to='/login' />
          </Route>

          <Route path="/login">
          {this.state.loggedIn 
            ? <Redirect to="/" />
            : [<LoginForm loginFunc={this.loginFunc.bind(this)}/>, <div>{this.state.errorMessage}</div>]}

          </Route>

          <Route path="/rooms/:room">
          {this.state.loggedIn
            ? <Game sendMessage={this.sendMessage.bind(this)} messages={this.state.messages}/>
            // <Chat sendMessage={this.sendMessage.bind(this)} messages={this.state.messages}/>
            : <Redirect to="/login" />}
          </Route>

          <Route path="/chat/general">
          {this.state.loggedIn
            ? <Chat sendMessage={this.sendMessage.bind(this)} messages={this.state.messages}/>
            : <Redirect to="/login" />}
          </Route>

          <Route path="/profile/user" >
            <Profile formValue={this.state.nick}/>
          </Route>

          <Route path="/guest" >
            <GuestLobby/>
          </Route>

          <Route path="/">
          {this.state.loggedIn
            ? <Lobby
            rooms={this.getRooms()}
            handleAddRoom={this.handleAddRoom.bind(this)}
            />
            // <Rooms
            // rooms={this.getRooms()}
            // handleAddRoom={this.handleAddRoom.bind(this)}
            // />
            : <Redirect to="/login" />}
          </Route>
        </Switch>

    </div>
    </Router>
    )
  }
}

export default App
