import React from 'react'
import io from 'socket.io-client'
import Canvas from './Canvas'
import Chat from './Chat'
import './App.css'
const socket = io()

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      word: '',
      words: ['dog', 'house', 'tree'],
      win: false,
      drawer: false
    }
  }

  componentDidMount (words = this.state.words) {
    this.setState({
      word: words[Math.floor(Math.random() * words.length)]
    })

    socket.on('test2', () => console.log('test2'))
  }

  handleWin = () => {
    this.setState({ win: true })
  }

  socketTest2 = () => {
    socket.emit('test2')
  }

  render () {
    return (
      <main>
        <link href='https://fonts.googleapis.com/css2?family=Righteous&display=swap' rel='stylesheet' />
        <div>
          <button onClick={this.socketTest2}>Test2</button>
          <button onClick={() => this.setState({ drawer: true })}>Drawer</button>
          <button onClick={() => this.setState({ drawer: false })}>Player</button>
        </div>
        <h2 style={{ marginBottom: '30px' }}>
          {this.state.win
            ? `Congrats, you guessed ${this.state.word}`
            : `Your word is ${this.state.word}`
          }
        </h2>
        <div id='chat-and-canvas'>
          <Canvas drawer={this.state.drawer} />
          <Chat word={this.state.word} onWin={this.handleWin} />
        </div>
      </main>
    )
  }
}
