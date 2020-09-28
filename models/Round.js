const mongoose = require('mongoose')

const { Schema } = mongoose
const { ObjectId } = mongoose.Schema.Types

const words = ['dog', 'house', 'tree']

const messageSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})

const playerSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  isArtist: {
    type: Boolean,
    default: false
  },
  isWinner: {
    type: Boolean,
    default: false
  }
})

const roundSchema = new Schema({
  messages: [messageSchema],
  players: [playerSchema],
  frontendID: {
    type: String,
    required: true
  },
  word: {
    type: String,
    required: true,
    default: words[Math.floor(Math.random() * words.length)]
  },
  win: {
    type: Boolean,
    default: false
  },
  winners: {
    type: Array
  },
  inProgress: {
    type: Boolean,
    default: false
  }
})

roundSchema.methods.verifyReady = function () {
  return (this.players.length === 2)
}

roundSchema.methods.start = function (frontendRoundID, roundNameSpace, cb) {
  this.inProgress = true
  const artist = this.players[Math.floor(Math.random() * this.players.length)]
  artist.isArtist = true
  roundNameSpace.to(frontendRoundID).emit('start', this.word, artist.username)

  let timer = 30
  roundNameSpace.to(frontendRoundID).emit('timer', timer)
  const timerID = setInterval(() => {
    if (timer === 0) {
      clearInterval(timerID)
      roundNameSpace.to(frontendRoundID).emit('lose')
    }
    roundNameSpace.to(frontendRoundID).emit('timer', timer--)
  }, 1000)
  cb(timerID)
}

// roundSchema.methods.manage = function (roundNameSpace, frontendRoundID, timerID) {

// }

roundSchema.methods.logMessage = async function (roundNameSpace, frontentRoundID, message, cb) {
  await this.messages.push(message)
  await this.save()
  if (message.text.toLowerCase() === this.word.toLowerCase()) {
    const winner = this.players.filter(player => player.username === message.username)[0]
    const artist = this.players.filter(player => player.isArtist)
    winner.isWinner = true
    artist.isWinner = true
    this.winners = [winner, artist]
    this.win = true
    this.inProgress = false
    this.save()
    roundNameSpace.to(frontentRoundID).emit('win', this.winner, this.artist, this.word)
  }
  return this.messages
}

const gameSchema = new Schema({
  rounds: [roundSchema]
})

module.exports = mongoose.model('Round', roundSchema)
