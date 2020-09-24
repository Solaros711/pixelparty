import React from 'react'

export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timer: 30,
      disabled: true
    }
  }

  componentDidMount () {
    if (!this.state.disabled) {
      setInterval(() => {
        this.setState({ timer: this.state.timer - 1})
      }, 1000)
    }
  }

  render () {
    return <div id='timer'>00:{this.state.timer}</div>
  }
}
