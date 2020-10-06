import React from 'react'
import io from 'socket.io-client'

// const socket = io('/timer')

export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // minutes: 1, 
      // seconds: 15,
      timer: 30,
      // disabled: false,
      // socket: io('/timer')
    }
  }

  componentDidMount () {
    this.props.timerSocket.emit('round join', this.props.gameID)
    if (this.props.isHost) {
      this.props.timerSocket.emit('round start', this.props.gameID)
      this.props.timerSocket.on('time\'s up', gameID => {
        console.log(gameID)
        this.props.onTimesUp(gameID)
      })
    }
    this.props.timerSocket.on('timer', timer => {
      this.setState({ timer })
    })


    // this.myInterval = setInterval(() => {
    //   const { seconds, minutes } = this.state
    //   if (seconds > 0) {
    //     this.setState(({ seconds }) => ({
    //       seconds: seconds - 1
    //     }))
    //   }
    //   if (seconds === 0) {
    //     if (minutes === 0) {
    //       clearInterval(this.myInterval)
    //     } else {
    //       this.setState(({ minutes }) => ({
    //         minutes: minutes - 1,
    //         seconds: 59
    //       }))
    //     }
    //   }
    // }, 1000)

  }

  componentWillUnmount() {
    clearInterval(this.myInterval)
  }

  handleTimesUp = () => this.props.onTimesUp(this.props.gameID)

  render () {
    // const { minutes, seconds } = this.state
    const { timer } = this.state
    
    return ( 
        <div>
            {/* { minutes === 0 && seconds === 0
            ? <span style={{fontSize: "30px", color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>TIME'S UP!</span>
            :
            minutes === 0 && seconds < 11
            ?<span id="timer" style={{color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
            :<span id="timer" style={{textShadow:"2px 2px black"}}>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
            } */}

            { timer === 0
            ? <span style={{fontSize: "30px", color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>TIME'S UP!</span>
            :
            timer < 11
            ?<span id="timer" style={{color:"rgb(179, 67, 2)", textShadow:"2px 2px black"}}>00:{this.state.timer.toString().padStart(2, '0')}</span>
            :<span id="timer" style={{textShadow:"2px 2px black"}}>00:{this.state.timer.toString().padStart(2, '0')}</span>
            }

            {/* <span id='timer'>00:{this.state.timer.toString().padStart(2, '0')}</span> */}
            <div>
                <button onClick={this.handleTimesUp} style={{backgroundColor:"firebrick"}}>Test: End Round</button>
            </div>
        </div>
    )
  }
}
