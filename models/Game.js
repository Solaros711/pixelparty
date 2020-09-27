const mongoose = require('mongoose')
const Round = require('./Round')

const { Schema } = mongoose
const { ObjectId } = mongoose.Schema.Types

const wordsArray = ['doctor', 'moon', 'bear', 'tornado', 'waterfall', 'casle', 'knight', 'king', 'queen', 'movie', 'fire', 'volcano', 'dog', 'cat', 'horse', 'ocean', 'mountain', 'television']

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
    required: true
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
    type: Array
  }
})

gameSchema.statics.create = async function (hostUsername, numOfPlayers) {
  const game = new this()
  game.players.push(hostUsername)
  // numOfPlayers = numOfRounds for now
  game.numOfPlayers = numOfPlayers
  game.numOfRounds = numOfPlayers
  await game.save()
  return game
}

gameSchema.statics.join = async function (username, gameID) {
  const game = await this.find({ _id: gameID })
  game.players.push(username)
  if (game.players.length === game.numOfPlayers) {

    game.isReady = true
  }
  await this.save()
  return game
}

gameSchema.methods.randomize = async function () {
  const players = this.players.slice()
  let artist
  const words = wordsArray.slice()
  let word
  while (players.length) {
    artist = players.sort((_a, _b) => Math.random() - 0.5).splice(0, 1)
    word = words.sort((_a, _b) => Math.random() - 0.5).splice(0, 1)
    this.rounds.push({ word, artist })
  }
  await this.save()
}

gameSchema.methods.logMessage = async function (message) {
  const round = this.rounds[this.currentRound]
  this.messages.push(message) // where do you need await
  if (message.text.toLowerCase() === round.word.toLowerCase()) {
    round.winner = message.username
    this.points.concat(round.winner, round.artist)
  }
  await this.save()
  return this
}

gameSchema.methods.start = async function (gameNameSpace, socket) {
  // I'm trying to get this working with line 36 in game-socket.js
}

module.exports = mongoose.model('Game', gameSchema)
