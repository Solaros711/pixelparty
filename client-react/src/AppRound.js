import React from 'react'
import Round from './components-round/Round'
import './App.css'

export default class AppRound extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      word: '',
      words: ['dog', 'house', 'tree'],
      win: false,
      drawer: false,
      playing: false
    }
  }

  componentDidMount (words = this.state.words) {
    this.setState({
      word: words[Math.floor(Math.random() * words.length)]
    })
  }

  handleWin = () => {
    this.setState({ win: true })
  }

  handleWord = () => {

  }

  // hardcoded so the word is selected at this moment
  handleDraw = (words = this.state.words) => {
    this.setState({ 
      word: words[Math.floor(Math.random() * words.length)],
      drawing: true,
      playing: true
    })
  }

  // no word selected here
  handleGuess = () => {
    this.setState({ drawing: false, playing: true})
  }
  
  render () {
    return (
      <main>
        <link href='https://fonts.googleapis.com/css2?family=Righteous&display=swap' rel='stylesheet' />
        {this.state.playing
          ? <Round
            word={this.state.word}
            drawing={this.state.drawing}
          />
          : [
            <button key={1} onClick={this.handleDraw}>I want to Draw!</button>,
            <button key={2} onClick={this.handleGuess}>I want to Guess!</button>
          ]
        }
      </main>
    )
  }
}
