import React from 'react'
import Round from './components-round/Round'
import io from 'socket.io-client'
import './App.css'

const names = ['kermit', 'miss piggy', 'fozzy', 'gonzo', 'rizzo', 'animal', 'swedish chef', 'sam eagle', 'statler', 'waldorf']

export default class AppRound extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      socket: io('/round'),
      word: '',
      // words: ['dog', 'house', 'tree'],
      win: false,
      // drawer: false,
      playing: false,
      role: '',
      username: names[Math.floor(Math.random() * names.length)],
      timer: 0,
      messages: []
    }
  }

  componentDidMount (socket = this.state.socket) {
    socket.emit('mounted')
    socket.on('test id', testID => {
      this.setState({ roundID: testID })
    })
  }

  roundReady = (socket = this.state.socket) => {
    socket.emit('join', this.state.roundID, this.state.username, this.state.isHost)
    socket.on('start', (word, artist) => {
      this.roundStart(word, artist)
    })
  }

  roundStart = (word, artist, socket = this.state.socket) => {
    this.setState({
      artist,
      word,
      playing: true,
      drawing: (artist === this.state.username) ? true : false
    }, () => {
      socket.on('messages', messages => this.setState({ messages }))
      socket.on('timer', timer => this.setState({ timer }))
      socket.on('win', username => this.setState({ win: true, winner: username, roundEnd: true }))
      socket.on('lose', () => this.setState({ timer: 0, lose: true, roundEnd: true }))
    })
  }

  joinAsGuest = () => this.setState({ isHost: false }, () => this.roundReady())
  
  joinAsHost = () => this.setState({ isHost: true }, () => this.roundReady())
  
  render () {
    return (
      <main>
        <link href='https://fonts.googleapis.com/css2?family=Righteous&display=swap' rel='stylesheet' />
        {this.state.playing
          ? <Round
              word={this.state.word}
              drawing={this.state.drawing}
              role={this.state.role}
              username={this.state.username}
              host={this.state.host}
              win={this.state.win}
              lose={this.state.lose}
              playing={this.state.playing}
              roundEnd={this.state.roundEnd}
              winner={this.state.winner}
              artist={this.state.artist}
              winner={this.state.winner}
              messages={this.state.messages}
              onSubmitMessage={this.handleSubmitMessage}
              socket={this.state.socket}
              timer={this.state.timer}
            />
          : <div>
              <button onClick={this.joinAsHost}>Join as Host</button>
              <button onClick={this.join}>Join!</button>
            </div>

// [
          //   <button key={1} onClick={this.handleDraw}>I want to Draw!</button>,
          //   <button key={2} onClick={this.handleGuess}>I want to Guess!</button>
          // ]
        }
      </main>
    )
  }
}

  
    // // hardcoded so the word is selected at this moment
    // handleDraw = () => {
    //   this.setState({ 
    //     drawing: true,
    //     playing: true,
    //     role: 'artist'
    //   })
  
    // }
  
    // // no word selected here
    // handleGuess = () => {
    //   this.setState({
    //     drawing: false,
    //     playing: true,
    //     role: 'guesser'
    //   })
    // }