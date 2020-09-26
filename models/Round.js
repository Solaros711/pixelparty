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

const playerScema = new Schema({
  username: {
    type: String,
    required: true
  },
  isArtist: {
    type: Boolean,
    default: false
  }
})

const roundSchema = new Schema({
  messages: [messageSchema],
  players: [playerScema],
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
  }
})

roundSchema.methods.verifyReady = function () {
  return (this.players.length === 2)
}

roundSchema.methods.start = function (frontendRoundID, roundNameSpace, cb) {
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

roundSchema.methods.logMessage = async function (message) {
  await this.messages.push(message)
  await this.save()
  return this.messages
}

const gameSchema = new Schema({
  rounds: [roundSchema]
})

module.exports = mongoose.model('Round', roundSchema)
