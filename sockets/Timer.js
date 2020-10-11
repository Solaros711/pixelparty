class Timer {
  constructor (numOfRounds, room = null, roundLength = 10, postRoundLength = 6) {
    // room is timer.to(gameID), you can emit to the room w/ it
    this.numOfRounds = numOfRounds
    this.room = room
    this.roundLength = roundLength
    this.postRoundLength = postRoundLength
    this.fullRoundLength = roundLength + postRoundLength
    this.fullTime = numOfRounds * (roundLength + postRoundLength)
    this.time = this.fullTime
    this.roundTime = 0
    this.postRoundTime = 0 
  }

  keepTime = (timesUp, nextRound) => {
    const remainder = this.time % this.fullRoundLength
    if (!remainder) {
      console.log({
        time: this.time,
        round: this.roundLength
      })
      this.room.emit('timer', this.roundLength)
    } else if (remainder >= this.postRoundLength) {
      console.log({
        time: this.time,
        round: remainder - this.postRoundLength
      })
      this.room.emit('timer', remainder - this.postRoundLength)
      if (remainder - this.postRoundLength === 0) timesUp()
    } else {
      console.log({
        time: this.time,
        post: remainder
      })
      this.room.emit('timer', remainder)
      setTimeout(nextRound, 1000)
    }
  }

  start = (timesUp, nextRound) => {
    // timesUp: cb to end round
    // nextRound: cb to go to next round
    this.keepTime(timesUp, nextRound)
    const timerID = setInterval(() => {
      this.time--
      this.keepTime(timesUp, nextRound)
      if (this.time === 0) clearInterval(timerID)
    }, 1000)
  }
}

module.exports = Timer
