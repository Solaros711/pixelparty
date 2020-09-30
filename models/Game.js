const mongoose = require('mongoose')
const colors = require('colors')
const { Schema } = mongoose
// const { ObjectId } = mongoose.Schema.Types

if (colors) {}

// const wordsArray = ['doctor', 'moon', 'bear', 'tornado', 'waterfall', 'castle', 'knight', 'king', 'queen', 'movie', 'fire', 'volcano', 'dog', 'cat', 'horse', 'ocean', 'mountain', 'television']
const wordsArray = ['horse', 'horse']

const roundSchema = new Schema({
  word: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  winner: {
    type: String,
    required: false
  },
  roundOver: {
    type: Boolean,
    default: false
  }
})

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

const gameSchema = new Schema({
  rounds: [roundSchema],
  messages: [messageSchema],
  players: { // later, this can be a relation to the User model [userSchema] or virtual
    type: Array,
    required: true,
    default: []
  },
  numOfRounds: {
    type: Number,
    required: true
  },
  numOfPlayers: {
    type: Number,
    required: true
  },
  isReady: {
    type: Boolean,
    default: false
  },
  currentRound: {
    type: Number,
    default: 0
  },
  points: {
    type: Array,
    default: []
  },
  host: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: new Date()
  },
  joinable: { // maybe change to public later
    type: Boolean,
    required: true,
    default: true
  },
  gameOver: {
    type: Boolean,
    required: true,
    default: false
  }
})

gameSchema.statics.create = async function (hostUsername, numOfPlayers) {
  const game = new this()
  game.host = hostUsername
  game.players = [hostUsername]
  // numOfPlayers = numOfRounds for now
  game.numOfPlayers = numOfPlayers
  game.numOfRounds = numOfPlayers
  await game.save()
  return game
}

gameSchema.statics.join = async function (username, gameID) {
  const game = await this.findOne({ _id: gameID })
  game.players.push(username)
  if (game.players.length === game.numOfPlayers) {
    game.isReady = true
  }
  game.joinable = false
  await game.save()
  return game
}

gameSchema.statics.getJoinable = async function () {
  const games = await this.find({ joinable: true })
  console.log('rainbow'.rainbow)
  console.log({ games })
  return games
}

gameSchema.statics.clean = async function () {
  await this.deleteMany({})
  this.getGames()
}

gameSchema.methods.randomize = async function () {
  const players = this.players.slice()
  let artist
  const words = wordsArray.slice()
  let word
  while (players.length) {
    artist = players.sort((_a, _b) => Math.random() - 0.5).splice(0, 1)[0]
    word = words.sort((_a, _b) => Math.random() - 0.5).splice(0, 1)[0]
    this.rounds.push({ word, artist })
  }
  await this.save()
  return this
}

gameSchema.methods.logMessage = async function (message) {
  const round = this.rounds[this.currentRound]
  this.messages.push(message) // where do you need await
  if (message.text.toLowerCase() === round.word.toLowerCase()) {
    round.winner = message.username
    this.points.push(round.winner, round.artist)
    round.roundOver = true
    this.currentRound++
    if (this.currentRound >= this.rounds.length) this.gameOver = true
  }
  await this.save()
  return this
}

gameSchema.methods.timesUp = async function () {
  const round = this.rounds[this.currentRound]
  round.roundOver = true
  this.currentRound++
  if (this.currentRound >= this.rounds.length) this.gameOver = true
  await this.save()
  return this
}

module.exports = mongoose.model('Game', gameSchema)
