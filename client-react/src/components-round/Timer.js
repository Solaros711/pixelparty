import React from 'react'

export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      timer: 30,
      disabled: false
    }
  }

  // componentDidMount () {
  //   if (!this.state.disabled) {
  //     setInterval(() => {
  //       this.setState({ timer: this.state.timer - 1})
  //     }, 1000)
  //   }
  // }

  render () {
    return <div id='timer'>00:{this.props.timer.toString().padStart(2, '0')}</div>
  }
}
