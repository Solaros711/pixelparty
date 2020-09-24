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

  render () {

  }
}
