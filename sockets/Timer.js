const colors = require('colors')

class Timer {
  constructor (numOfRounds, room = null, roundLength = 60, postRoundLength = 10) {
    // room is timer.to(gameID), you can emit to the room w/ it
    this.numOfRounds = numOfRounds
    this.room = room
    this.roundLength = roundLength + 1
    this.postRoundLength = postRoundLength + 1
    this.fullRoundLength = this.roundLength + this.postRoundLength
    this.time = numOfRounds * this.fullRoundLength
    this.state = 'START ROUND'
  }

  keepTime = (timesUp, nextRound, gameOver = null) => {
    if (this.state === 'START ROUND') {
      this.room.emit('timer', this.roundLength - 1)
      console.log({
        state: this.state,
        time: this.time,
        round: this.roundLength - 1
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
      this.room.emit('timer', this.postRoundLength - 1)
      console.log({
        state: this.state,
        time: this.time,
        post: this.postRoundLength - 1
      })
      this.state = 'POST ROUND'
    }
    
    else if (this.state === 'POST ROUND') {
      const postRoundTime = this.time % this.fullRoundLength
      this.room.emit('timer', postRoundTime )
      console.log({
        state: this.state,
        time: this.time,
        post: postRoundTime
      })
      if (postRoundTime === 0) {
        this.state = 'START ROUND'
        setTimeout(nextRound, 1000)
      }
    }
  }

  start = (timesUp, nextRound, gameOver) => {
    // timesUp: cb to end round
    // nextRound: cb to go to next round
    this.keepTime(timesUp, nextRound)
    const timerID = setInterval(() => {
      this.time--
      if (this.time === 0) {
        gameOver()
        return clearInterval(timerID)
      }
      this.keepTime(timesUp, nextRound)
    }, 1000)
  }
}

module.exports = Timer
