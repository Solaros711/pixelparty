const colors = require('colors')

class Timer {
  constructor (numOfRounds, room = null, roundLength = 10, postRoundLength = 5) {
    // room is timer.to(gameID), you can emit to the room w/ it
    this.numOfRounds = numOfRounds
    this.room = room
    this.roundLength = roundLength + 1
    this.postRoundLength = postRoundLength + 1
    this.fullRoundLength = this.roundLength + this.postRoundLength
    this.time = numOfRounds * this.fullRoundLength
    this.state = 'START ROUND'
    // this.fullTime = numOfRounds * (roundLength + postRoundLength)
    // this.roundTime = 0
    // this.postRoundTime = 0 
  }

  keepTime = (timesUp, nextRound, gameOver = null) => {
    if (this.state === 'START ROUND') {
      this.room.emit('timer', this.roundLength)
      console.log({
        state: this.state,
        time: this.time,
        round: this.roundLength
      })
      this.state = 'ROUND'
    }

    else if (this.state === 'ROUND') {
      const roundTime = this.time % this.fullRoundLength - this.postRoundLength
      this.room.emit('timer', roundTime)
      console.log({
        state: this.state,
        time: this.time,
        round: roundTime
      })
      if (roundTime === 0) {
        this.state = 'START POST ROUND'
        timesUp()
      }
    }

    else if (this.state === 'START POST ROUND') {
      this.room.emit('timer', this.postRoundLength)
      console.log({
        state: this.state,
        time: this.time,
        post: this.postRoundLength
      })
      this.state = 'POST ROUND'
    }
    
    else if (this.state === 'POST ROUND') {
      const postRoundTime = this.time % this.fullRoundLength
      this.room.emit('timer', postRoundTime)
      console.log({
        state: this.state,
        time: this.time,
        post: postRoundTime
      })
      if (postRoundTime === 0) {
        this.state = 'START ROUND'
        nextRound()
      }
    }
  }

  start = (timesUp, nextRound, gameOver = null) => {
    // timesUp: cb to end round
    // nextRound: cb to go to next round
    this.keepTime(timesUp, nextRound)
    const timerID = setInterval(() => {
      this.time--
      if (this.time === 0) return clearInterval(timerID)
      this.keepTime(timesUp, nextRound)
    }, 1000)
  }
}

module.exports = Timer
